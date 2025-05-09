import {Locator, Page} from '@playwright/test'

export class HomePage{
    readonly page: Page
    readonly newsletterForm:Locator
    readonly emailInput:Locator
    readonly submitButton:Locator


constructor(page: Page) {
    this.page = page
    this.emailInput = page.locator('form.hs-form input[type="email"]').nth(0);
    this.submitButton = page.locator('form.hs-form input[type="submit"]').nth(0);

}
async visit (){
    await this.page.goto('https://www.netlify.com')
}

async typeOnNewsletterForm(email: string) {
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.emailInput.fill(email);
  }

  async submitNewsletterForm() {
    await this.submitButton.click();
  }

  
}