import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
    private readonly cartItems = this.byTestId('inventory-item');
    private readonly checkoutButton = this.byTestId('checkout');
}