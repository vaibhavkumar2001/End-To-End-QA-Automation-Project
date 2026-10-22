import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.byTestId('username');
  private readonly passwordInput = this.byTestId('password');
  private readonly loginButton = this.byTestId('login-button');
  private readonly errorMessage = this.byTestId('error');

  async open() {
    await this.goto('/');
  }

  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async expectLoginFormVisible() {
    await this.expectVisible(this.loginButton);
  }

  async expectError(text: string) {
    await this.expectText(this.errorMessage, text);
  }
}