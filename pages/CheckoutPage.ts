import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

// Converts text like "Item total: $39.98" to cents (3998) to avoid float errors
function toCents(text: string): number {
  const match = text.match(/\$(\d+(?:\.\d+)?)/);
  if (!match) {
    throw new Error(`No price found in "${text}"`);
  }
  return Math.round(parseFloat(match[1]) * 100);
}

export class CheckoutPage extends BasePage {
  private readonly firstName = this.byTestId('firstName');
  private readonly lastName = this.byTestId('lastName');
  private readonly postalCode = this.byTestId('postalCode');
  private readonly continueButton = this.byTestId('continue');
  private readonly cancelButton = this.byTestId('cancel');
  private readonly finishButton = this.byTestId('finish');
  private readonly errorMessage = this.byTestId('error');
  private readonly confirmationHeader = this.byTestId('complete-header');
  private readonly backToProductsButton = this.byTestId('back-to-products');
  private readonly subtotalLabel = this.byTestId('subtotal-label');
  private readonly itemPrices = this.byTestId('inventory-item-price');

  async fillDetails(first: string, last: string, zip: string) {
    await this.fill(this.firstName, first);
    await this.fill(this.lastName, last);
    await this.fill(this.postalCode, zip);
    await this.click(this.continueButton);
  }

  async cancel() {
    await this.click(this.cancelButton);
  }

  async finishOrder() {
    await this.click(this.finishButton);
  }

  async backToProducts() {
    await this.click(this.backToProductsButton);
  }

  async expectOnOverview() {
    await this.expectUrlContains('checkout-step-two');
  }

  async expectItemTotalMatchesItems() {
    await expect(this.subtotalLabel).toBeVisible();
    const prices = (await this.itemPrices.allTextContents()).map(toCents);
    const expected = prices.reduce((sum, p) => sum + p, 0);
    expect(toCents(await this.subtotalLabel.innerText())).toBe(expected);
  }

  async expectOrderConfirmed() {
    await this.expectText(this.confirmationHeader, 'Thank you for your order!');
  }

  async expectError(text: string) {
    await this.expectText(this.errorMessage, text);
  }
}