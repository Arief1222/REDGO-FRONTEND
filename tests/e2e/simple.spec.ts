// my-first-test.spec.js
import { test, expect } from '@playwright/test';

test('check API link existence', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.waitForTimeout(2000);

  const apiLink = page.getByRole('link', { name: 'API' });
  await expect(apiLink).toBeVisible();
  await page.waitForTimeout(2000);
});

test('navigate to Docs and verify URL', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.waitForTimeout(2000);

  await page.getByRole('link', { name: 'Docs' }).click();
  await page.waitForTimeout(2000);

  await expect(page).toHaveURL(/docs/);
  await page.waitForTimeout(2000);
});

test('search for a term in docs', async ({ page }) => {
  await page.goto('https://playwright.dev/docs/intro');
  await page.waitForTimeout(2000);

  const searchBox = page.getByRole('textbox', { name: /search/i });
  await searchBox.click();
  await page.waitForTimeout(500);

  await searchBox.fill('browser');
  await page.waitForTimeout(2000);

  // check search result exists
  const result = page.getByText(/browser/i).first();
  await expect(result).toBeVisible();
  await page.waitForTimeout(2000);
});
