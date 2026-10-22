import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures';

const { Given, When, Then } = createBdd(test);

When('I sort products by {string}', async ({ inventoryPage }, label: string) => {
  await inventoryPage.sortByLabel(label);
});

Then('the products should be sorted by {string}', async ({ inventoryPage }, label: string) => {
  await inventoryPage.expectSortedBy(label);
});

When('I remove {string} from the products page', async ({ inventoryPage }, productSlug: string) => {
  await inventoryPage.removeFromCart(productSlug);
});

Then('the cart badge should show {int} item(s)', async ({ inventoryPage }, count: number) => {
  await inventoryPage.expectCartBadgeCount(count);
});

Then('the cart badge should not be visible', async ({ inventoryPage }) => {
  await inventoryPage.expectCartBadgeHidden();
});

When('I log out', async ({ inventoryPage }) => {
  await inventoryPage.logout();
});

Then('I should see the login page', async ({ loginPage }) => {
  await loginPage.expectLoginFormVisible();
});

Given('I open {string} without logging in', async ({ loginPage }, path: string) => {
  await loginPage.goto(path);
});