/**
 * Feature: Authentication
 * Scenario(s):
 * - Login Success
 * - Login Failed - Invalid Credentials
 * - Form Validation - Empty Fields
 *
 * Location: tests/features/auth/login.spec.ts
 *
 * Notes:
 *  - Sequential execution
 *  - Browser tetap terbuka jika mode headed aktif
 *  - Screenshot otomatis pada error
 */

import { test, expect, chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const IS_HEADED = process.env.HEADED === 'true';

test.describe.serial('Authentication - Login Tests', () => {
  let browser;
  let context;
  let page;

  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: !IS_HEADED });
    context = await browser.newContext({ baseURL: BASE_URL });
    page = await context.newPage();
  });

  test.afterAll(async () => {
    if (IS_HEADED) {
      await browser.close();
    } else {
      await browser.close();
    }
  });

  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const path = `test-results/failure-${testInfo.title}-${Date.now()}.png`;
      await page.screenshot({ path, fullPage: true });
      console.log(`📸 Screenshot saved: ${path}`);
    }
  });

  test('Login Success - Valid credentials', async () => {
    // Mock successful login API response
    await page.route('**/core/v1/login', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            token: 'mock-jwt-token-123456789',
            refresh_token: 'mock-refresh-token-123456789',
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              role: 'admin'
            }
          }
        })
      });
    });

    // Given: User berada di halaman login
    await page.goto('/auth/login');

    // Verify page elements
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByText('Your Admin Dashboard')).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();

    // When: User mengisi email dan password valid kemudian klik "Sign in"
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');

    // Click login button and wait for either success or navigation
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Wait for navigation or success indicators with timeout
    try {
      // Check for navigation to dashboard or success toast
      await Promise.race([
        page.waitForURL('**/dashboard', { timeout: 5000 }),
        page.waitForSelector('[role="alert"]:has-text("success")', { timeout: 5000 }),
        page.waitForSelector('[data-testid="toast-success"]', { timeout: 5000 })
      ]);
    } catch (error) {
      // If no navigation or success toast, check for stored token as fallback
      console.log('Navigation/Toast not detected, checking for token storage...');
    }

    // Then: Verify success through multiple indicators
    const currentUrl = page.url();
    const hasNavigated = currentUrl.includes('/dashboard');
    const hasSuccessToast = await page.getByRole('alert').filter({ hasText: /success/i }).isVisible().catch(() => false);

    // Check localStorage for token (ultimate success indicator)
    const hasToken = await page.evaluate(() => {
      return localStorage.getItem('token') !== null;
    });

    const isSuccess = hasNavigated || hasSuccessToast || hasToken;

    console.log(`Success indicators - Navigation: ${hasNavigated}, Toast: ${hasSuccessToast}, Token: ${hasToken}`);
    expect(isSuccess).toBeTruthy();
    console.log('✅ Login success - Test completed');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });

  test('Login Failed - Invalid credentials', async () => {
    // Mock failed login API response
    await page.route('**/core/v1/login', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Invalid email or password'
        })
      });
    });

    // Given: User berada di halaman login
    await page.goto('/auth/login');

    // When: User mengisi email/password salah kemudian klik "Sign in"
    await page.getByLabel('Email Address').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Then: Muncul error message dan tetap di halaman login
    await expect(page.locator('form').getByText('Invalid email or password')).toBeVisible();
    await expect(page).toHaveURL(/login/);
    console.log('✅ Login failed - Error message displayed');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });

  test('Form Validation - Empty required fields', async () => {
    // Given: User berada di halaman login
    await page.goto('/auth/login');

    // When: User klik submit tanpa mengisi required fields
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Then: Muncul error message pada field yang kosong
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    console.log('✅ Form validation - Empty fields error messages displayed');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });

  test('Form Validation - Invalid email format', async () => {
    // Given: User berada di halaman login
    await page.goto('/auth/login');

    // When: User mengisi email dengan format tidak valid
    await page.getByLabel('Email Address').fill('invalid-email');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Then: Muncul error message untuk email format
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
    console.log('✅ Form validation - Invalid email format error displayed');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });

  test('Form Validation - Password too short', async () => {
    // Given: User berada di halaman login
    await page.goto('/auth/login');

    // When: User mengisi password kurang dari 6 karakter
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Then: Muncul error message untuk password length
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    console.log('✅ Form validation - Password length error displayed');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });

  test('Remember Me checkbox functionality', async () => {
    // Given: User berada di halaman login
    await page.goto('/auth/login');

    // When: User ceklis "Remember this Device"
    const rememberCheckbox = page.getByLabel('Remember this Device');
    await expect(rememberCheckbox).toBeVisible();
    await rememberCheckbox.check();
    await expect(rememberCheckbox).toBeChecked();

    // Then: Checkbox harus dalam keadaan tercentang
    console.log('✅ Remember Me checkbox - Functionality verified');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });

  test('Forgot Password link navigation', async () => {
    // Given: User berada di halaman login
    await page.goto('/auth/login');

    // When: User klik "Forgot Password ?" link
    const forgotPasswordLink = page.getByText('Forgot Password ?');
    await expect(forgotPasswordLink).toBeVisible();

    await Promise.all([
      page.waitForURL('**/forgot-password'),
      forgotPasswordLink.click()
    ]);

    // Then: User di-redirect ke halaman forgot password
    await expect(page).toHaveURL(/forgot-password/);
    console.log('✅ Forgot Password link - Navigation verified');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });
});