/**
 * Feature: auth
 * Scenario(s):
 * - User dapat mengisi form forgot password dengan email valid
 * - User melihat validasi error saat mengisi email tidak valid
 * - User dapat kembali ke halaman login
 *
 * Location: tests/features/auth/forgot-password.spec.ts
 *
 * Notes:
 *  - Sequential execution
 *  - Browser tetap terbuka jika mode headed aktif
 *  - Screenshot otomatis pada error
 */

import { test, expect, chromium, type Browser, type BrowserContext, type Page, type Route } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5174';
const IS_HEADED = process.env.HEADED === 'true';

test.describe.serial('auth - Forgot Password Flow', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: !IS_HEADED });
    context = await browser.newContext({ baseURL: BASE_URL });
    page = await context.newPage();
  });

  test.afterAll(async () => {
    if (IS_HEADED) {
      console.log('Mode headed aktif — browser tetap terbuka untuk debugging.');
    } else {
      await browser.close();
    }
  });

  test.afterEach(async ({ page: testPage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const path = `test-results/failure-${testInfo.title}-${Date.now()}.png`;
      await testPage.screenshot({ path, fullPage: true });
      console.log(`📸 Screenshot saved: ${path}`);
    }
  });

  test('User dapat mengisi form forgot password dengan email valid', async () => {
    // Given: User berada di halaman forgot password
    await page.goto('/auth/forgot-password');
    await page.waitForLoadState('networkidle');

    // Mock API success response - intercept all possible API endpoints
    await page.route('**/*', async (route: Route) => {
      const url = route.request().url();
      console.log('Intercepted request:', url);

      if (url.includes('/api/') && url.includes('forgot-password')) {
        console.log('Mocking forgot-password API');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Password reset instructions have been sent to your email.',
            success: true
          })
        });
        return;
      }

      // Continue with other requests
      await route.continue();
    });

    // When: User mengisi email yang valid dan klik tombol "Forgot Password"
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // Then: Sistem menampilkan pesan sukses
    // Wait for either loading state or success message
    const submitButton = page.locator('button[type="submit"]');

    try {
      // Check if button shows loading state
      await expect(submitButton).toHaveText('Sending...', { timeout: 3000 });
    } catch {
      // If no loading state, check for success message directly
      console.log('Loading state not detected, checking for success message');
    }

    // Wait for success message to appear (check for MUI Alert component)
    const successMessage = page.locator('.MuiAlert-root:has-text("Password reset instructions have been sent")').first();

    await expect(successMessage).toBeVisible({ timeout: 5000 });
  });

  test('User melihat validasi error saat mengisi email tidak valid', async () => {
    // Given: User berada di halaman forgot password
    await page.goto('/auth/forgot-password');
    await page.waitForLoadState('networkidle');

    // When: User mengisi email tidak valid dan mencoba submit form
    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button[type="submit"]');

    // Then: Sistem menampilkan pesan error validasi email
    // Look for validation message
    const validationMessage = page.locator(':has-text("Please enter a valid email address")');
    const emailField = page.locator('input[name="email"]');

    // Check for either inline validation or HTML5 validation
    try {
      await expect(validationMessage).toBeVisible({ timeout: 3000 });
    } catch {
      // Check if email field has validation attributes
      const isValid = await emailField.evaluate((el: HTMLInputElement) => el.checkValidity());
      expect(isValid).toBeFalsy();
    }
  });

  test('User dapat kembali ke halaman login', async () => {
    // Given: User berada di halaman forgot password
    await page.goto('/auth/forgot-password');
    await page.waitForLoadState('networkidle');

    // When: User klik tombol "Back to Login"
    const backButton = page.locator('a:has-text("Back to Login")');
    await expect(backButton).toBeVisible();
    await backButton.click();

    // Then: User diarahkan ke halaman login
    await page.waitForURL('**/auth/login**');
    expect(page.url()).toContain('/auth/login');
  });
});