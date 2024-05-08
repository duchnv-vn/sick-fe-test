import { test, expect } from '@playwright/test';

const appDomain = process.env.APP_DOMAIN || '';

test('should redirect to login page if not logged-in yet', async ({ page }) => {
  await page.goto(appDomain);

  await expect(page).toHaveURL(`${appDomain}/login`);
});

// test('should display general device number cards', async ({ page }) => {
//   const generalDeviceNumberCards = [
//     { title: 'TOTAL AVAILABLE DEVICE' },
//     { title: 'TOTAL ONLINE DEVICE' },
//     { title: 'TOTAL OFFLINE DEVICE' },
//   ];

//   await page.goto(appDomain);

//   for (const card of generalDeviceNumberCards) {
//     await expect(page).toHaveTitle(card.title);
//   }
// });
