import { createBdd } from 'playwright-bdd';
import { faker } from '@faker-js/faker';
import { test } from '../fixtures'

const { Given, When, Then } = createBdd(test);

Given('I am logged in as a standard user', async ({ loginPage }) => {
  await loginPage.open();
  await loginPage.login(process.env.STANDARD_USER!, process.env.PASSWORD!);
});

When('I add {string} to the cart', async ({ inventoryPage }, productSlug: string) => {
  await inventoryPage.addToCart(productSlug);
  await inventoryPage.openCart();
});

When('I proceed to checkout with valid details', async ({ cartPage, checkoutPage }) => {
  await cartPage.proceedToCheckout();
  await checkoutPage.fillDetails(
    faker.person.firstName(),
    faker.person.lastName(),
    faker.location.zipCode()
  );
  await checkoutPage.finishOrder();
});

When('I proceed to checkout without a first name', async ({ cartPage, checkoutPage }) => {
  await cartPage.proceedToCheckout();
  await checkoutPage.fillDetails('', faker.person.lastName(), faker.location.zipCode());
});

Then('I should see the order confirmation', async ({ checkoutPage }) => {
  await checkoutPage.expectOrderConfirmed();
});

Then('I should see the checkout error {string}', async ({ checkoutPage }, message: string) => {
  await checkoutPage.expectError(message);
});