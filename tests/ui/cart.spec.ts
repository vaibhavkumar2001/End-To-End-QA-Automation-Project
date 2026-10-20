import { test, expect } from '../../fixtures';

test.describe('Cart', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(process.env.STANDARD_USER!, process.env.PASSWORD!);
  });

  test('adding a product updates cart badge @smoke', async ({ inventoryPage }) => {
    await expect(inventoryPage.cartBadge).toBeHidden();
    await inventoryPage.addToCart('sauce-labs-backpack');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('added product is visible in the cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.expectItemCount(1);
    await cartPage.expectItemPresent('Sauce Labs Backpack');
  });
});