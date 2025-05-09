import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/components/HomePage';

test.describe('Home page', () => {
  let homePage: HomePage;

  // Before each test, initialize the HomePage object and visit the homepage
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.visit();
  });

  test('TC_01: can open home page', async ({ page }) => {
    // Verifies that the page loads and has the expected title
    await expect(page).toHaveTitle(/Netlify/);
  });

  test('TC_02: the newsletter form is present', async ({}) => {
    // Checks that the newsletter form input is present on the homepage
    const count = await homePage.emailInput.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC_03: test form validation with invalid data', async ({ page }) => {
    // Submits an invalid email to test client-side validation behavior
    await homePage.typeOnNewsletterForm('invalid-email');
    await homePage.submitNewsletterForm();

    // Expects an error message to be visible on invalid submission
    const errorMessage = page.locator('form.hs-form .hs-error-msg');
    await expect(errorMessage).toBeVisible();
  });
test('TC_04: newsletter form submission with valid email', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.typeOnNewsletterForm('stanisic.milica7+playwright1@gmail.com');
  await homePage.submitNewsletterForm();

  // ✅ Wait for thank-you message on the same page or inside the iframe
  const thankYouMessage = page.locator('text=Thank you for signing up!');

  // Adjust timeout if needed
  await expect(thankYouMessage).toBeVisible({ timeout: 10000 });
});

});
