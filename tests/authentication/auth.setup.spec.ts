import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

const appDomain = process.env.APP_DOMAIN || '';
const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL || '';
const userCredential = {
  email: process.env.CI_TEST_USER_EMAIL || '',
  password: process.env.CI_TEST_USER_PASSWORD || '',
};

const loginButtonConfig = {
  name: 'Click to login with Auth0',
};

setup(
  'should login succeed and redirect to device dasboard page',
  async ({ page }) => {
    await page.goto(appDomain);

    await expect(page).toHaveURL(`${appDomain}/login`);

    const loginButton = page.getByRole('button', loginButtonConfig);
    await expect(loginButton).not.toBeEmpty();

    await loginButton.click();

    await expect(page).toHaveURL(
      new RegExp(`^[${auth0Domain.replace('-', `*-`)}u/login?state=]+.`),
    );

    await page.locator('input#username').fill(userCredential.email);
    await page.locator('input#password').fill(userCredential.password);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForURL(appDomain);

    await expect(page).toHaveURL(appDomain);

    await page.context().storageState({ path: authFile });
  },
);
