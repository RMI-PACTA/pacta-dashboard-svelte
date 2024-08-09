import { expect, test } from '@playwright/test';

test('home page has expected appShell', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('#appShell')).toBeVisible();
});
