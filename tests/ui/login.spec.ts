import { test } from '../../fixtures';

test.describe('Login (edge cases)', () => {
  test('wrong password shows error', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(process.env.STANDARD_USER!, 'wrong_password');
    await loginPage.expectError('Username and password do not match');
  });

  test('empty credentials show username required error', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('', '');
    await loginPage.expectError('Username is required');
  });
});