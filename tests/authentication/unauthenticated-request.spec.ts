import { test, expect } from '@playwright/test';

const appDomain = `http://127.0.0.1:${process.env.PORT || 3000}`;
const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL || '';
const userCredential = {
  email: process.env.CI_TEST_USER_EMAIL || '',
  password: process.env.CI_TEST_USER_PASSWORD || '',
};

const loginButtonConfig = {
  name: 'Click to login with Auth0',
};

test('should redirect to login page if not logged-in yet', async ({ page }) => {
  await page.goto(appDomain);

  await expect(page).toHaveURL(`${appDomain}/login`);

  const loginButton = page.getByRole('button', loginButtonConfig);
  await expect(loginButton).not.toBeEmpty();
});

test('should access Auth0 universal login page', async ({ page }) => {
  await page.goto(`${appDomain}/login`);

  await page.getByRole('button', loginButtonConfig).click();

  await expect(page).toHaveURL(
    new RegExp(`^[${auth0Domain.replace('-', `*-`)}u/login?state=]+.`),
  );
});

test('should login succeed and redirect to device dasboard page', async ({
  page,
}) => {
  // Should create Auth0 testing only database & Store test user record
});