import { createBdd } from 'playwright-bdd';
import { faker } from '@faker-js/faker';
import { test } from '../fixtures';

const { When, Then } = createBdd(test);

Then('the cart should contain {int} item(s)', async ({ cartPage }, count: number) => {
  await cartPage.expectItemCount(count);
});

Then('the cart should list {string}', async ({ cartPage }, name: string) => {
  await cartPage.expectItemPresent(name);
});

Then('the cart should not list {string}', async ({ cartPage }, name: string) => {
  await cartPage.expectItemAbsent(name);
});

When('I remove {string} from the cart page', async ({ cartPage }, productSlug: string) => {
  await cartPage.removeItem(productSlug);
});

When('I continue shopping', async ({ cartPage }) => {
  await cartPage.continueShopping();
});

When('I start the checkout', async ({ cartPage }) => {
  await cartPage.proceedToCheckout();
});

When('I cancel the checkout', async ({ checkoutPage }) => {
  await checkoutPage.cancel();
});

Then('I should be back on the cart page', async ({ cartPage }) => {
  await cartPage.expectOnCartPage();
});

When('I continue to the order overview with valid details', async ({ cartPage, checkoutPage }) => {
  await cartPage.proceedToCheckout();
  await checkoutPage.fillDetails(
    faker.person.firstName(),
    faker.person.lastName(),
    faker.location.zipCode()
  );
  await checkoutPage.expectOnOverview();
});

Then('the item total should match the prices of the products', async ({ checkoutPage }) => {
  await checkoutPage.expectItemTotalMatchesItems();
});

When('I finish the order', async ({ checkoutPage }) => {
  await checkoutPage.finishOrder();
});

When('I go back to the products page', async ({ checkoutPage }) => {
  await checkoutPage.backToProducts();
});