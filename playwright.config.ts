import { defineConfig, devices } from '@playwright/test';
import { defineBddProject } from 'playwright-bdd';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
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
        steps: 'steps/**/*.ts',
      }),
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});