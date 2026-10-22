import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

// Visible dropdown labels on SauceDemo mapped to the option values
const SORT_LABELS: Record<string, SortOption> = {
  'Name (A to Z)': 'az',
  'Name (Z to A)': 'za',
  'Price (low to high)': 'lohi',
  'Price (high to low)': 'hilo',
};

export class InventoryPage extends BasePage {
  readonly cartBadge = this.byTestId('shopping-cart-badge');
  private readonly title = this.byTestId('title');
  private readonly cartLink = this.byTestId('shopping-cart-link');
  private readonly sortDropdown = this.byTestId('product-sort-container');
  private readonly productNames = this.byTestId('inventory-item-name');
  private readonly productPrices = this.byTestId('inventory-item-price');
  private readonly menuButton = this.page.locator('#react-burger-menu-btn');
  private readonly logoutLink = this.byTestId('logout-sidebar-link');

  async expectLoaded() {
    await this.expectText(this.title, 'Products');
  }

  async addToCart(productSlug: string) {
    // Example slug: "sauce-labs-backpack"
    await this.click(this.byTestId(`add-to-cart-${productSlug}`));
  }

  async removeFromCart(productSlug: string) {
    await this.click(this.byTestId(`remove-${productSlug}`));
  }

  async openCart() {
    await this.click(this.cartLink);
  }

  async expectCartBadgeCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async expectCartBadgeHidden() {
    await expect(this.cartBadge).toBeHidden();
  }

  async sortByLabel(label: string) {
    const option = SORT_LABELS[label];
    if (!option) {
      throw new Error(`Unknown sort option "${label}". Use one of: ${Object.keys(SORT_LABELS).join(', ')}`);
    }
    await this.sortDropdown.selectOption(option);
  }

  async expectSortedBy(label: string) {
    const option = SORT_LABELS[label];
    if (!option) {
      throw new Error(`Unknown sort option "${label}".`);
    }

    // Poll so the check retries until the list has re-rendered
    if (option === 'lohi' || option === 'hilo') {
      await expect
        .poll(async () => isSorted(await this.getPrices(), option === 'lohi' ? 'asc' : 'desc'))
        .toBe(true);
    } else {
      await expect
        .poll(async () => isSorted(await this.getNames(), option === 'az' ? 'asc' : 'desc'))
        .toBe(true);
    }
  }

  async logout() {
    await this.click(this.menuButton);
    await this.click(this.logoutLink);
  }

  private async getPrices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    // Convert "$29.99" to 29.99
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  private async getNames(): Promise<string[]> {
    return this.productNames.allTextContents();
  }
}

function isSorted<T extends number | string>(values: T[], direction: 'asc' | 'desc'): boolean {
  return values.every((value, i) => {
    if (i === 0) return true;
    const previous = values[i - 1];
    const comparison =
      typeof value === 'number' && typeof previous === 'number'
        ? previous - value
        : String(previous).localeCompare(String(value));
    return direction === 'asc' ? comparison <= 0 : comparison >= 0;
  });
}