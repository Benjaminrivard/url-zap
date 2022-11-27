import { test, expect } from '@playwright/test';
const url = 'https://www.google.fr/';

test('Create a short link and navigate', async ({ page, context }) => {
    await page.goto('http://localhost:3000/');
    await page.getByLabel('Url').click();
    await page.getByLabel('Url').fill(url);
    await page.getByRole('button').click();
    // Get page after a specific action (e.g. clicking a link)
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.getByRole('link').click() // Opens a new tab
    ])
    await newPage.waitForLoadState();
    // we'll wait a bit longer because redirect can be long
    expect(newPage.url()).toEqual(url);
});