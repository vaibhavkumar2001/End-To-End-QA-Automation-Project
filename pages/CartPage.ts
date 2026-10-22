import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartItems = this.byTestId('inventory-item');
  private readonly checkoutButton = this.byTestId('checkout');
  private readonly continueShoppingButton = this.byTestId('continue-shopping');

  async expectOnCartPage() {
    await this.expectUrlContains('cart.html');
  }

  async expectItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  private itemName(name: string) {
    return this.byTestId('inventory-item-name').filter({ hasText: name });
  }

  async expectItemPresent(name: string) {
    await this.expectVisible(this.itemName(name));
  }

  async expectItemAbsent(name: string) {
    await expect(this.itemName(name)).toHaveCount(0);
  }

  async removeItem(productSlug: string) {
    await this.click(this.byTestId(`remove-${productSlug}`));
  }

  async continueShopping() {
    await this.click(this.continueShoppingButton);
  }

  async proceedToCheckout() {
    await this.click(this.checkoutButton);
  }
}