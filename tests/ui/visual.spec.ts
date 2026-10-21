import { test, expect } from '../../fixtures';

test.describe('Visual regression', () => {
    test.skip(process.platform !== 'linux','Visual baselines are Linux-only. Run via Docker.');

    test('login page looks the same', async ({ page, loginPage }) => {
        await loginPage.open();
        await expect(page).toHaveScreenshot('login-page.png', {
            maxDiffPixelRatio: 0.01,
        });
    });

    test('inventory page looks the same', async ({ page, loginPage, inventoryPage }) => {
        await loginPage.open();
        await loginPage.login(process.env.STANDARD_USER!, process.env.PASSWORD!);
        await inventoryPage.expectLoaded();
        await expect(page).toHaveScreenshot('inventory-page.png', {
            maxDiffPixelRatio: 0.01,
        });
    });
});