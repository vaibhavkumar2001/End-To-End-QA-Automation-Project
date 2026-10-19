import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartItems = this.byTestId('inventory-item');
  private readonly checkoutButton = this.byTestId('checkout');

  async expectItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectItemPresent(name: string) {
    await this.expectVisible(
      this.byTestId('inventory-item-name').filter({ hasText: name })
    );
  }

  async proceedToCheckout() {
    await this.click(this.checkoutButton);
  }
}