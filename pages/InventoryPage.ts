import { BasePage } from './BasePage'


export class InventoryPage extends BasePage {
    readonly cartBadge = this.byTestId('shopping-cart-badge');
    private readonly title = this.byTestId('title');
    private readonly cartLink = this.byTestId('shopping-cart-link');

    async expectedLoaded() {
        await this.expectText(this.title, 'Products');
    }

    async addToCart() {
        await this.click(this.cartLink)
    }

    
}