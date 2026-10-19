import { defineConfig, devices } from '@playwright/test';
import { defineBddProject } from 'playwright-bdd';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.UI_BASE_URL || 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Generates spec files from .feature files into .features-gen
      ...defineBddProject({
        name: 'bdd',
        features: 'features/**/*.feature',
        // Fixtures file must be listed so playwright-bdd can find the custom test instance
        steps: ['steps/**/*.ts', 'fixtures/index.ts'],
      }),
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        // API project overrides the global UI baseURL
        baseURL: process.env.API_BASE_URL || 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    },
  ],
});