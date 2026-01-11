/**
 * Feature: Authentication
 * Scenario(s):
 * - Register Success
 * - Register Failed - Validation Error
 * - Form Validation - Empty Fields
 *
 * Location: tests/features/auth/register.spec.ts
 *
 * Notes:
 *  - Sequential execution
 *  - Browser tetap terbuka jika mode headed aktif
 *  - Screenshot otomatis pada error
 */

import { test, expect, chromium } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const IS_HEADED = process.env.HEADED === 'true';

test.describe.serial('Authentication - Register Tests', () => {
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
      console.log('Mode headed aktif — browser tetap terbuka untuk debugging.');
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

  test('Register Success - Valid data', async () => {
    // Mock successful register API response
    await page.route('**/core/v1/register', (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Registration successful! Please verify your email.',
          data: {
            user: {
              id: '123',
              name: 'John Doe',
              email: 'john.doe@example.com'
            }
          }
        })
      });
    });

    // Given: User berada di halaman register
    await page.goto('/auth/register');

    // Verify page elements
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
    await expect(page.getByText('Your Admin Dashboard')).toBeVisible();
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();

    // When: User mengisi name, email, password valid kemudian klik "Sign Up"
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email Address').fill('john.doe@example.com');
    await page.getByLabel('Password').fill('password123');

    // Click register button and wait for response
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Wait for navigation or success indicators with timeout
    try {
      // Check for navigation to two-steps or success toast
      await Promise.race([
        page.waitForURL('**/two-steps', { timeout: 5000 }),
        page.waitForSelector('[role="alert"]:has-text("successful")', { timeout: 5000 }),
        page.waitForSelector('[data-testid="toast-success"]', { timeout: 5000 })
      ]);
    } catch (error) {
      // If no navigation or success toast, check for other success indicators
      console.log('Navigation/Toast not detected, checking for other success indicators...');
    }

    // Then: Verify success through multiple indicators
    const currentUrl = page.url();
    const hasNavigated = currentUrl.includes('/two-steps');
    const hasSuccessToast = await page.getByRole('alert').filter({ hasText: /successful/i }).isVisible().catch(() => false);
    const hasSuccessMessage = await page.getByText('Registration successful').isVisible().catch(() => false);

    // Check for URL changes or form reset as success indicators
    const hasUrlChanged = currentUrl !== `${BASE_URL}/auth/register`;

    const isSuccess = hasNavigated || hasSuccessToast || hasSuccessMessage || hasUrlChanged;

    console.log(`Success indicators - Navigation: ${hasNavigated}, Toast: ${hasSuccessToast}, Message: ${hasSuccessMessage}, URL Changed: ${hasUrlChanged}`);
    expect(isSuccess).toBeTruthy();
    console.log('✅ Register success - Test completed');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });

  test('Register Failed - Email already exists', async () => {
    // Mock failed register API response (email already exists)
    await page.route('**/core/v1/register', (route) => {
      route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Email already exists'
        })
      });
    });

    // Given: User berada di halaman register
    await page.goto('/auth/register');

    // When: User mengisi email yang sudah terdaftar
    await page.getByLabel('Name').fill('Existing User');
    await page.getByLabel('Email Address').fill('existing@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Then: Muncul error message dan tetap di halaman register
    await expect(page.locator('form').getByText('Email already exists')).toBeVisible();
    await expect(page).toHaveURL(/register/);
    console.log('✅ Register failed - Email already exists error displayed');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });

  test('Form Validation - Empty required fields', async () => {
    // Given: User berada di halaman register
    await page.goto('/auth/register');

    // When: User klik submit tanpa mengisi required fields
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Then: Muncul error message pada field yang kosong
    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    console.log('✅ Form validation - Empty fields error messages displayed');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });

  test('Form Validation - Invalid email format', async () => {
    // Given: User berada di halaman register
    await page.goto('/auth/register');

    // When: User mengisi email dengan format tidak valid
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email Address').fill('invalid-email');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Then: Muncul error message untuk email format
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
    console.log('✅ Form validation - Invalid email format error displayed');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });

  test('Form Validation - Name too short', async () => {
    // Given: User berada di halaman register
    await page.goto('/auth/register');

    // When: User mengisi name kurang dari 2 karakter
    await page.getByLabel('Name').fill('A');
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Then: Muncul error message untuk name length
    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
    console.log('✅ Form validation - Name length error displayed');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });

  test('Form Validation - Password too short', async () => {
    // Given: User berada di halaman register
    await page.goto('/auth/register');

    // When: User mengisi password kurang dari 6 karakter
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('123');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Then: Muncul error message untuk password length
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    console.log('✅ Form validation - Password length error displayed');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });

  test('Form Validation - Multiple field errors', async () => {
    // Given: User berada di halaman register
    await page.goto('/auth/register');

    // When: User mengisi semua field dengan data tidak valid
    await page.getByLabel('Name').fill('A'); // Too short
    await page.getByLabel('Email Address').fill('invalid-email'); // Invalid format
    await page.getByLabel('Password').fill('123'); // Too short
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Then: Muncul semua error message yang relevan
    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
    await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();
    console.log('✅ Form validation - Multiple field errors displayed');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });

  test('Sign in link navigation', async () => {
    // Given: User berada di halaman register
    await page.goto('/auth/register');

    // When: User klik "Sign in" link
    const signInLink = page.getByText('Sign in');
    await expect(signInLink).toBeVisible();

    await Promise.all([
      page.waitForURL('**/login'),
      signInLink.click()
    ]);

    // Then: User di-redirect ke halaman login
    await expect(page).toHaveURL(/login/);
    console.log('✅ Sign in link - Navigation verified');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });

  test('Form submission loading state', async () => {
    // Mock slow API response to test loading state
    await page.route('**/core/v1/register', (route) => {
      setTimeout(() => {
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Registration successful!'
          })
        });
      }, 2000); // 2 second delay
    });

    // Given: User berada di halaman register
    await page.goto('/auth/register');

    // When: User submit form
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');

    // Click submit and check for loading state
    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Then: Button should show loading state
    await expect(page.getByRole('button', { name: 'Signing up...' })).toBeVisible();

    // Wait for completion
    await page.waitForTimeout(2500);

    console.log('✅ Form submission - Loading state verified');

    // Delay 300ms as per QA heuristics
    await page.waitForTimeout(300);
  });
});