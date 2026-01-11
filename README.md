# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## E2E Testing with Playwright

This project uses [Playwright](https://playwright.dev/) for end-to-end testing. Playwright enables reliable end-to-end testing for modern web apps across all browsers.

### Prerequisites

Make sure your development server is running before executing E2E tests:

```bash
npm run dev
```

The tests are configured to run against `http://localhost:5174` (Vite default port).

### Running E2E Tests

#### Run all tests (headless mode)
```bash
npm run test:e2e
```

#### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```
This opens the Playwright Test Runner UI where you can:
- See all your tests
- Run tests individually or in groups
- See test results in real-time
- Debug failing tests

#### Run tests with visible browser (headed mode)
```bash
npm run test:e2e:headed
```
Watch the browser perform the tests in real-time.

#### Debug tests
```bash
npm run test:e2e:debug
```
Opens the Playwright Inspector for step-by-step debugging.

#### Show test report
```bash
npm run test:e2e:report
```
Opens the HTML test report in your browser.

#### Run specific test files
```bash
# Login tests only
npm run test:e2e:login

# Register tests only
npm run test:e2e:register
```

#### Generate tests with Codegen
```bash
npm run test:e2e:codegen
```
Opens Playwright's test generator - interact with your app and it will generate test code automatically.

### Test File Structure

E2E tests are located in the `tests/` directory:

```
tests/
├── login.spec.ts      # Login page E2E tests
├── register.spec.ts   # Registration page E2E tests
└── ...                # Other E2E test files
```

### Writing New Tests

Create a new test file in the `tests/` directory with the `.spec.ts` extension:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174/your-route');
  });

  test('should do something', async ({ page }) => {
    // Your test code here
    await page.getByRole('button', { name: 'Click me' }).click();
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

### Test Configuration

Playwright configuration is in `playwright.config.ts`. Key settings:

- **Test directory**: `./tests`
- **Browsers**: Chromium, Firefox, WebKit
- **Retries**: 2 on CI, 0 locally
- **Reporter**: HTML report

### Common Commands

```bash
# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests matching a pattern
npx playwright test -g "should login successfully"

# Run tests in a specific file
npx playwright test tests/login.spec.ts

# Update test snapshots
npx playwright test --update-snapshots
```

### Useful Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Playwright Assertions](https://playwright.dev/docs/test-assertions)

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
