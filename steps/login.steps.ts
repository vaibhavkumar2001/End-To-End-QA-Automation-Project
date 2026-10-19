import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures';

const { Given, When, Then } = createBdd(test);

Given('I am on the login page', async ({ loginPage }) => {
  await loginPage.open();
});

When(
  'I log in as {string} with password {string}',
  async ({ loginPage }, username: string, password: string) => {
    await loginPage.login(username, password);
  }
);

Then('I should see the products page', async ({ inventoryPage }) => {
  await inventoryPage.expectLoaded();
});

Then('I should see the error {string}', async ({ loginPage }, message: string) => {
  await loginPage.expectError(message);
});