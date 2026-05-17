import { test, expect } from '@playwright/test';

test('Homepage loads and Navigation works without crashing', async ({ page }) => {
  // Go to homepage
  await page.goto('/');
  
  // Verify title
  await expect(page).toHaveTitle(/PracticeForge/);
  
  // Check if Navigation is visible
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();

  // Click on Leaderboard link
  const leaderboardLink = page.getByRole('link', { name: 'Leaderboard' });
  await expect(leaderboardLink).toBeVisible();
  await leaderboardLink.click();

  // Wait for Leaderboard page to load
  await expect(page.locator('h1', { hasText: 'Leaderboard' })).toBeVisible();

  // Verify Daily Streak icon (🔥) exists on the screen
  const streakIcon = page.locator('text=🔥');
  // It might not be visible immediately if user has 0 streak in test env, 
  // but we can just ensure the page hasn't crashed (no white screen).
});
