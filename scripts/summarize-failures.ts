import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'node:fs';

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const REPORT_PATH = process.env.PLAYWRIGHT_JSON_OUTPUT_NAME || 'results.json';

// Keep the prompt small and avoid sending large logs to a third party
const MAX_FAILURES = 10;
const MAX_ERROR_CHARS = 1200;
const MAX_SNIPPET_CHARS = 800;

interface JsonError {
  message?: string;
  // Code frame around the failing line, for example "> 4 | expect(...)"
  snippet?: string;
}
interface JsonResult {
  status: string;
  error?: JsonError;
  errors?: JsonError[];
}
interface JsonTest {
  projectName: string;
  status: string;
  results: JsonResult[];
}
interface JsonSpec {
  title: string;
  file: string;
  tests: JsonTest[];
}
interface JsonSuite {
  title: string;
  specs?: JsonSpec[];
  suites?: JsonSuite[];
}
interface JsonReport {
  suites?: JsonSuite[];
}

interface Failure {
  title: string;
  project: string;
  file: string;
  error: string;
  snippet: string;
}

// Playwright error messages contain ANSI color codes, remove them first
function stripAnsi(text: string): string {
  return text.replace(/\u001b\[[0-9;]*m/g, '');
}

function collect(suites: JsonSuite[], failures: Failure[], flaky: string[]): void {
  for (const suite of suites) {
    for (const spec of suite.specs ?? []) {
      for (const test of spec.tests) {
        if (test.status === 'unexpected') {
          const last = test.results[test.results.length - 1];
          const err = last?.error ?? last?.errors?.[0];
          failures.push({
            title: spec.title,
            project: test.projectName,
            file: spec.file,
            error: stripAnsi(err?.message ?? 'No error message').slice(0, MAX_ERROR_CHARS),
            snippet: stripAnsi(err?.snippet ?? '').slice(0, MAX_SNIPPET_CHARS),
          });
        } else if (test.status === 'flaky') {
          flaky.push(`${spec.title} [${test.projectName}]`);
        }
      }
    }
    collect(suite.suites ?? [], failures, flaky);
  }
}

// Writes to the GitHub Actions job summary when available, otherwise to the console
function writeSummary(markdown: string): void {
  const target = process.env.GITHUB_STEP_SUMMARY;
  if (target) {
    fs.appendFileSync(target, `${markdown}\n`);
  } else {
    console.log(markdown);
  }
}

function failureList(failures: Failure[], flaky: string[]): string {
  const lines: string[] = [];
  if (failures.length > 0) {
    lines.push('**Failed tests**', '');
    for (const f of failures) {
      lines.push(`- \`${f.title}\` [${f.project}] (${f.file})`);
    }
  }
  if (flaky.length > 0) {
    lines.push('', '**Passed only after a retry (flaky)**', '');
    for (const name of flaky) {
      lines.push(`- \`${name}\``);
    }
  }
  return lines.join('\n');
}

async function main() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.log(`No report found at ${REPORT_PATH}, nothing to summarize.`);
    return;
  }

  const report: JsonReport = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8'));
  const failures: Failure[] = [];
  const flaky: string[] = [];
  collect(report.suites ?? [], failures, flaky);

  if (failures.length === 0 && flaky.length === 0) {
    console.log('No failed or flaky tests found.');
    return;
  }

  const header = '## Test failure triage';
  const facts = failureList(failures, flaky);

  // Without a key we still publish the plain list of failures
  if (!process.env.OPENAI_API_KEY || failures.length === 0) {
    writeSummary(`${header}\n\n${facts}`);
    return;
  }

  const system = [
    'You help a QA team read failed Playwright test results.',
    'Write at most 120 words of markdown bullet points. For each distinct failure give:',
    '- What failed: restate the assertion using the exact expected and received values from the error text.',
    '- What to check first: one concrete next step, for example open the trace, check the locator, or call the endpoint manually.',
    'Rules:',
    '- Do not classify the cause and do not state a confidence level. You only see error text and a code excerpt, so you cannot know the cause.',
    '- Do not claim what the application or API did unless the error text shows it directly.',
    '- If the error text is short or unclear, say "the error text alone is not enough" and suggest what to open (trace, screenshot or test code).',
  ].join('\n');

  const shown = failures.slice(0, MAX_FAILURES);
  const userMessage = shown
    .map((f, i) => {
      const excerpt = f.snippet ? `\nCode excerpt:\n${f.snippet}` : '';
      return `Failure ${i + 1}: ${f.title} [${f.project}] in ${f.file}\nError:\n${f.error}${excerpt}`;
    })
    .join('\n\n---\n\n');

  // Shows exactly what would be sent to the LLM, without calling the API
  if (process.argv.includes('--dry-run')) {
    console.log('--- SYSTEM ---\n' + system + '\n\n--- USER ---\n' + userMessage);
    return;
  }

  try {
    const client = new OpenAI();
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userMessage },
      ],
    });
    const triage = (response.choices[0]?.message?.content ?? '').trim();

    const note =
      failures.length > shown.length
        ? `\n_Only the first ${shown.length} of ${failures.length} failures were analyzed._\n`
        : '';

    writeSummary(
      [
        header,
        '',
         '> Generated by an LLM from the error text and a short code excerpt. Treat it as a hint, not a diagnosis.',
        '',
        triage || '_The model returned an empty response._',
        note,
        '<details><summary>Failed tests (source of truth)</summary>',
        '',
        facts,
        '',
        '</details>',
      ].join('\n')
    );
  } catch (error) {
    // Never break the pipeline because the summary failed
    console.warn('LLM summary failed:', error instanceof Error ? error.message : error);
    writeSummary(`${header}\n\n_AI summary unavailable._\n\n${facts}`);
  }
}

main().catch((error) => {
  console.warn('Summary script failed:', error instanceof Error ? error.message : error);
});