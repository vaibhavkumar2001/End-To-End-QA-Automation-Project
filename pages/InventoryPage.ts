import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly cartBadge = this.byTestId('shopping-cart-badge');
  private readonly title = this.byTestId('title');
  private readonly cartLink = this.byTestId('shopping-cart-link');

  async expectLoaded() {
    await this.expectText(this.title, 'Products');
  }

  async addToCart(productSlug: string) {
    // Example slug: "sauce-labs-backpack"
    await this.click(this.byTestId(`add-to-cart-${productSlug}`));
  }

  async openCart() {
    await this.click(this.cartLink);
  }
}