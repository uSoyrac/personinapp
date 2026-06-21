import { test, expect } from '@playwright/test';

// ==============================================
// 404 / Not Found
// ==============================================
test.describe('Not Found', () => {
  test('unknown route renders the custom 404 page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-123');

    await expect(page.getByRole('heading', { name: 'Lost in translation?' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Back to Home/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Go to Practice Lab/ })).toBeVisible();
  });
});

// ==============================================
// Library (premium gated)
// ==============================================
test.describe('Library Page', () => {
  test('shows premium wall for free users', async ({ page }) => {
    await page.goto('/library');

    await expect(page.getByRole('heading', { name: 'Premium Feature' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Simulate Premium (Dev)' })).toBeVisible();
  });

  test('unlocks library and creates a folder after simulating premium', async ({ page }) => {
    await page.goto('/library');

    await page.getByRole('button', { name: 'Simulate Premium (Dev)' }).click();

    // Library unlocked
    await expect(page.getByRole('heading', { name: 'My Library' })).toBeVisible();

    // Create a new folder
    const folderName = 'QA Test Folder';
    await page.getByPlaceholder('New folder name...').fill(folderName);
    await page.getByRole('button', { name: 'Create Folder' }).click();

    await expect(page.getByRole('heading', { name: folderName })).toBeVisible({ timeout: 5000 });
  });
});

// ==============================================
// Community (premium gated)
// ==============================================
test.describe('Community Page', () => {
  test('shows premium wall for free users', async ({ page }) => {
    await page.goto('/community');

    await expect(page.getByRole('heading', { name: 'Premium Feature' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Simulate Premium (Dev)' })).toBeVisible();
  });

  test('unlocks community content after simulating premium', async ({ page }) => {
    await page.goto('/community');

    await page.getByRole('button', { name: 'Simulate Premium (Dev)' }).click();

    await expect(page.getByRole('heading', { name: 'Premium Community' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Join Our Discord' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Create a Support Ticket' })).toBeVisible();
  });
});

// ==============================================
// Question Bank
// ==============================================
test.describe('Question Bank Page', () => {
  test('renders heading and empty state on fresh storage', async ({ page }) => {
    await page.goto('/question-bank');

    await expect(page.getByRole('heading', { name: 'Question Bank' })).toBeVisible();
    // Fresh localStorage => empty bank
    await expect(page.getByText('Bankanız boş.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go to Practice' })).toBeVisible();
  });
});

// ==============================================
// Writing Feedback
// ==============================================
test.describe('Writing Feedback Page', () => {
  test('renders the writing practice form', async ({ page }) => {
    await page.goto('/practice/writing-feedback');

    await expect(page.getByRole('heading', { name: /Writing Practice/ })).toBeVisible();
    await expect(page.locator('#user-answer')).toBeVisible();
    await expect(page.locator('#analyze-btn')).toBeVisible();
  });

  test('rejects responses shorter than 50 words', async ({ page }) => {
    await page.goto('/practice/writing-feedback');

    await page.locator('#user-answer').fill('This response is far too short to analyse.');
    await page.locator('#analyze-btn').click();

    await expect(page.getByText(/at least 50 words/)).toBeVisible({ timeout: 5000 });
  });

  test('generates feedback for a valid response', async ({ page }) => {
    await page.goto('/practice/writing-feedback');

    // A 60+ word response so the 50-word validation passes.
    const essay = Array.from({ length: 12 }, () =>
      'Urbanisation profoundly reshapes ecosystems as cities expand into natural habitats.'
    ).join(' ');

    await page.locator('#user-answer').fill(essay);
    await page.locator('#analyze-btn').click();

    // Offline mock resolves after ~1s; allow generous headroom.
    await expect(page.getByRole('heading', { name: 'Your Feedback' })).toBeVisible({ timeout: 15000 });
  });
});

// ==============================================
// Academy (SEO content pipeline)
// ==============================================
test.describe('Academy', () => {
  test('lists articles and renders a static article page with structured data', async ({ page }) => {
    await page.goto('/academy');
    await expect(page.locator('h1')).toContainText('Academy');

    // Article card links into the static article route.
    const card = page.getByRole('link', { name: /Score Band 8/ });
    await expect(card).toBeVisible();
    await card.click();

    await expect(page).toHaveURL(/\/academy\/how-to-score-band-8/);
    await expect(page.locator('h1')).toContainText('Band 8');
    // JSON-LD Article schema is present for SEO.
    await expect(page.locator('script[type="application/ld+json"]')).toBeAttached();
  });
});
