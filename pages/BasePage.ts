import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
    constructor(protected readonly page: Page) {}

    async goto(path: string = '/') {
        await this.page.goto(path);
    }

    async click(locator: Locator) {
        await locator.click()
    }

    async fill(locator: Locator, value: string) {
        await locator.fill(value);
    }

    async expectVisible(locator: Locator) {
        await expect(locator).toBeVisible();
    }

    async expectText(locator: Locator, text: string) {
        await expect(locator).toContainText(text);
    }

    async expectUrlContains(fragment: string) {
        await expect(this.page).toHaveURL(new RegExp(fragment));
    }

    // Shortcut for the data-set for the attribute used across the Saucedemo
    protected byTestId(id: string): Locator {
        return this.page.locator(`[data-test="${id}"]`);
    }
    //byTestId ka yeh use h ki page.locator('[data-test="..."]') hr jagah nhi likhna padega

    
}