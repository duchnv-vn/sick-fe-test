import { test, expect } from '@playwright/test';

const appDomain = process.env.APP_DOMAIN || '';
const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL || '';

test('should redirect to login page if not logged-in yet', async ({ page }) => {
  await page.goto(appDomain);
  await expect(page).toHaveURL(`${appDomain}/login`);
});

test('should access Auth0 universal login page', async ({ page }) => {
  await page.goto(`${appDomain}/login`);

  const loginButton = page.getByRole('button', {
    name: 'Click to login with Auth0',
  });
  await expect(loginButton).not.toBeEmpty();

  await loginButton.click();

  await expect(page).toHaveURL(
    new RegExp(`^[${auth0Domain.replace('-', `*-`)}u/login?state=]+.`),
  );
});
