import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private readonly firstName = this.byTestId('firstName');
  private readonly lastName = this.byTestId('lastName');
  private readonly postalCode = this.byTestId('postalCode');
  private readonly continueButton = this.byTestId('continue');
  private readonly finishButton = this.byTestId('finish');
  private readonly errorMessage = this.byTestId('error');
  private readonly confirmationHeader = this.byTestId('complete-header');

  async fillDetails(first: string, last: string, zip: string) {
    await this.fill(this.firstName, first);
    await this.fill(this.lastName, last);
    await this.fill(this.postalCode, zip);
    await this.click(this.continueButton);
  }

  async finishOrder() {
    await this.click(this.finishButton);
  }

  async expectOrderConfirmed() {
    await this.expectText(this.confirmationHeader, 'Thank you for your order!');
  }

  async expectError(text: string) {
    await this.expectText(this.errorMessage, text);
  }
}