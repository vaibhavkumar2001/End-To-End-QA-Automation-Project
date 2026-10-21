//Yeh PR mein Nhi chalega yeh Nightly mein chalega
//Yeh sirf critical aur serious violations pe fail hoga  minor aur moderate report mein attach krte h pe test ko nhi fail nhi krte
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { test, expect } from '../../fixtures';

// Runs axe on the current page and fails only on critical/serious violations
async function expectNoSeriousViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  // Attach the full result so it shows up in the report for debugging
  await test.info().attach('axe-results', {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });

  const serious = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious'
  );

  expect(
    serious.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} element(s)`),
    'Critical/serious accessibility violations found'
  ).toEqual([]);
}

test.describe('Accessibility', () => {
  test('login page has no critical or serious violations', async ({ page, loginPage }) => {
    await loginPage.open();
    await expectNoSeriousViolations(page);
  });

  test('inventory page has no critical or serious violations', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.open();
    await loginPage.login(process.env.STANDARD_USER!, process.env.PASSWORD!);
    await inventoryPage.expectLoaded();
    await expectNoSeriousViolations(page);
  });
});