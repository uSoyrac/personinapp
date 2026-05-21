import { test, expect } from '@playwright/test';

// ==============================================
// Homepage Tests
// ==============================================
test.describe('Homepage', () => {
  test('loads with correct title and hero', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/PracticeForge/);
    
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Hero section loads
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('mode selector tabs exist and are clickable', async ({ page }) => {
    await page.goto('/');
    
    // All three tabs exist
    await expect(page.getByRole('button', { name: 'IELTS Academic' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'TOEFL iBT' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'General English' })).toBeVisible();
    
    // Click TOEFL tab
    await page.getByRole('button', { name: 'TOEFL iBT' }).click();
    
    // After clicking, the textarea placeholder should update
    // Allow time for React state update
    await page.waitForTimeout(500);
    const textarea = page.locator('textarea').first();
    const placeholder = await textarea.getAttribute('placeholder');
    expect(placeholder).toBeTruthy();
  });

  test('text input and explore button', async ({ page }) => {
    await page.goto('/');
    
    const textarea = page.locator('textarea').first();
    await textarea.fill('Urbanisation has profoundly transformed ecosystems across the globe. As cities expand, natural habitats are increasingly fragmented.');
    
    // Explore button should be enabled
    const exploreBtn = page.getByRole('button', { name: /EXPLORE/ });
    await expect(exploreBtn).toBeEnabled();
  });

  test('signup modal opens', async ({ page }) => {
    await page.goto('/');
    
    // Open modal via JavaScript event (reliable regardless of nav rendering)
    await page.evaluate(() => window.dispatchEvent(new Event('open-signup')));
    
    // Modal should appear
    const modalHeading = page.getByRole('heading', { name: 'Create Free Account' });
    await expect(modalHeading).toBeVisible({ timeout: 3000 });
  });

  test('testimonials section displays', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to testimonials
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);
    
    await expect(page.getByText('Wall of Love').first()).toBeVisible();
    await expect(page.getByText('Sarah L.').first()).toBeVisible();
  });
});

// ==============================================
// Navigation Tests
// ==============================================
test.describe('Navigation', () => {
  test('main nav links are visible', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('navigate to practice page', async ({ page }) => {
    await page.goto('/practice');
    await expect(page.locator('h1')).toContainText('Generate Your Practice');
  });

  test('navigate to vocabulary page', async ({ page }) => {
    await page.goto('/vocabulary');
    // Wait for client hydration
    await page.waitForTimeout(1000);
    await expect(page.getByText('Vocabulary Master').first()).toBeVisible({ timeout: 10000 });
  });

  test('navigate to leaderboard page', async ({ page }) => {
    await page.goto('/leaderboard');
    // Wait for client hydration
    await page.waitForTimeout(1000);
    await expect(page.locator('h1')).toContainText('Leaderboard', { timeout: 10000 });
  });

  test('navigate to pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('h1')).toContainText('Choose your path');
  });

  test('navigate to academy page', async ({ page }) => {
    await page.goto('/academy');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigate to affiliate page', async ({ page }) => {
    await page.goto('/affiliate');
    await expect(page.getByText('Commission').first()).toBeVisible();
  });

  test('navigate to general-english page', async ({ page }) => {
    await page.goto('/general-english');
    await expect(page.getByText('Personal Language Lab')).toBeVisible();
  });
});

// ==============================================
// Practice Generator Tests
// ==============================================
test.describe('Practice Generator', () => {
  test('form elements are functional', async ({ page }) => {
    await page.goto('/practice');
    
    // Exam type buttons
    const ieltsBtn = page.locator('#exam-IELTS_ACADEMIC');
    await expect(ieltsBtn).toBeVisible();
    
    // Skill tabs
    const readingTab = page.locator('#skill-Reading');
    await expect(readingTab).toBeVisible();
    
    // Input text
    const textarea = page.locator('#input-text');
    await expect(textarea).toBeVisible();
  });

  test('generates practice content via API', async ({ page }) => {
    await page.goto('/practice');
    
    // Fill text (needs >50 chars)
    const textarea = page.locator('#input-text');
    await textarea.fill('Urbanisation has profoundly transformed ecosystems across the globe. As cities expand, natural habitats are increasingly fragmented, reducing biodiversity and disrupting ecological corridors. The ongoing process of urbanisation necessitates a re-evaluation of how societies interact with and manage the natural world.');
    
    // Click generate
    const generateBtn = page.locator('#generate-btn');
    await generateBtn.click();
    
    // Wait for results
    const results = page.locator('#results-section');
    await expect(results).toBeVisible({ timeout: 15000 });
    
    // Results tabs should appear
    await expect(page.locator('#tab-reading')).toBeVisible({ timeout: 5000 });
  });
});

// ==============================================
// Vocabulary Quiz Tests
// ==============================================
test.describe('Vocabulary Page', () => {
  test('stats cards are visible after hydration', async ({ page }) => {
    await page.goto('/vocabulary');
    
    // Wait for full client-side rendering (mounted state)
    await page.waitForFunction(() => document.querySelector('h1')?.textContent?.includes('Vocabulary'));
    
    await expect(page.getByText('Total Vocabulary')).toBeVisible();
    await expect(page.getByText('Mastered Words')).toBeVisible();
    await expect(page.getByText('Quiz Accuracy')).toBeVisible();
  });

  test('quick add word form works', async ({ page }) => {
    await page.goto('/vocabulary');
    
    // Wait for full client-side rendering
    await page.waitForFunction(() => document.querySelector('h1')?.textContent?.includes('Vocabulary'));
    
    // The form uses placeholder="Abundant" for word input
    const wordInput = page.locator('input[placeholder="Abundant"]');
    await expect(wordInput).toBeVisible({ timeout: 10000 });
    
    await wordInput.fill('Eloquent');
    
    // Definition input placeholder contains "plentiful"
    const defInput = page.locator('input[placeholder*="plentiful"]');
    await defInput.fill('Fluent and persuasive in speaking');
    
    // Submit
    await page.getByRole('button', { name: 'Add Word' }).click();
    
    // Word should appear
    await expect(page.getByText('Eloquent', { exact: true })).toBeVisible({ timeout: 5000 });
  });
});

// ==============================================
// Pricing Page Tests
// ==============================================
test.describe('Pricing Page', () => {
  test('all plans and FAQ visible', async ({ page }) => {
    await page.goto('/pricing');
    
    // Plan headings - use exact match to avoid FAQ conflicts
    await expect(page.getByRole('heading', { name: 'Starter', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pro Study', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Elite Mastery', exact: true })).toBeVisible();
    
    // Prices
    await expect(page.getByText('$14.99').first()).toBeVisible();
    await expect(page.getByText('$29.99').first()).toBeVisible();
    
    // FAQ
    await expect(page.getByText('Frequently asked questions')).toBeVisible();
  });
});

// ==============================================
// Affiliate Page Tests
// ==============================================
test.describe('Affiliate Page', () => {
  test('form renders correctly', async ({ page }) => {
    await page.goto('/affiliate');
    
    // Check form elements exist
    await expect(page.locator('input[placeholder="Jane Doe"]')).toBeVisible();
    await expect(page.locator('input[placeholder="jane@example.com"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit Application' })).toBeVisible();
  });

  test('application form submits', async ({ page }) => {
    await page.goto('/affiliate');
    
    // Fill form
    await page.locator('input[placeholder="Jane Doe"]').fill('Test User');
    await page.locator('input[placeholder="jane@example.com"]').fill('test@example.com');
    await page.locator('input[placeholder*="youtube"]').fill('https://youtube.com/@test');
    
    // Select audience size
    const select = page.locator('select');
    await select.selectOption('under_10k');
    
    // Submit
    await page.getByRole('button', { name: 'Submit Application' }).click();
    
    // Success message (800ms delay in component)
    await expect(page.getByText('Application Received!')).toBeVisible({ timeout: 10000 });
  });
});

// ==============================================
// Signup Modal Tests  
// ==============================================
test.describe('Signup Modal', () => {
  test('social login and email form visible', async ({ page }) => {
    await page.goto('/');
    
    // Open modal
    await page.evaluate(() => window.dispatchEvent(new Event('open-signup')));
    await page.waitForTimeout(500);
    
    // Modal heading
    await expect(page.getByRole('heading', { name: 'Create Free Account' })).toBeVisible();
    
    // Social buttons
    await expect(page.getByText('Continue with Google')).toBeVisible();
    await expect(page.getByText('Continue with Apple')).toBeVisible();
    await expect(page.getByText('Continue with Facebook')).toBeVisible();
    
    // Email form
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test('invite code shows valid indicator', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => window.dispatchEvent(new Event('open-signup')));
    await page.waitForTimeout(500);
    
    // Type invite code (>=3 chars shows "Valid")
    const codeInput = page.locator('input[placeholder="e.g. PARTNER20"]');
    await codeInput.fill('TESTCODE');
    
    await expect(page.getByText('Valid')).toBeVisible({ timeout: 3000 });
  });

  test('modal closes on X', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => window.dispatchEvent(new Event('open-signup')));
    await page.waitForTimeout(500);
    
    const modalHeading = page.getByRole('heading', { name: 'Create Free Account' });
    await expect(modalHeading).toBeVisible();
    
    // Close - find the close button
    const closeBtn = page.locator('#close-signup-modal');
    await closeBtn.click({ force: true }).catch(async () => {
      // Fallback: direct browser click
      await page.evaluate(() => {
        document.getElementById('close-signup-modal')?.click();
      });
    });
    
    await expect(modalHeading).not.toBeVisible({ timeout: 3000 });
  });
});

// ==============================================
// Leaderboard Tests
// ==============================================
test.describe('Leaderboard', () => {
  test('filters and podium work', async ({ page }) => {
    await page.goto('/leaderboard');
    
    // Wait for client rendering (uses mounted state)
    await page.waitForFunction(() => document.querySelector('h1')?.textContent?.includes('Leaderboard'));
    
    // Timeframe filters - the button text is lowercase "weekly", "monthly"
    await expect(page.getByText('weekly', { exact: true })).toBeVisible();
    await expect(page.getByText('monthly', { exact: true })).toBeVisible();
    
    // XP values present
    await expect(page.getByText('XP').first()).toBeVisible();
  });

  test('profile editor opens', async ({ page }) => {
    await page.goto('/leaderboard');
    
    // Wait for client rendering
    await page.waitForFunction(() => document.querySelector('h1')?.textContent?.includes('Leaderboard'));
    
    const editBtn = page.getByRole('button', { name: /Edit Profile/ });
    await editBtn.click();
    
    await expect(page.getByText('Display Name')).toBeVisible();
  });
});

// ==============================================
// General English Lab Tests
// ==============================================
test.describe('General English Lab', () => {
  test('activity selector works', async ({ page }) => {
    await page.goto('/general-english');
    
    await expect(page.getByText('Study Hub').first()).toBeVisible();
    await expect(page.getByText('Interactive Cloze').first()).toBeVisible();
    await expect(page.getByText('Sentence Shadowing').first()).toBeVisible();
    await expect(page.getByText('Grammar Breakdown').first()).toBeVisible();
  });

  test('generates study hub results', async ({ page }) => {
    await page.goto('/general-english');
    
    // Fill text
    const textarea = page.locator('textarea');
    await textarea.fill('Urbanisation has profoundly transformed ecosystems across the globe. As cities expand, natural habitats are increasingly fragmented, reducing biodiversity. These things are very important for the environment and must be addressed urgently.');
    
    // Click create
    await page.getByRole('button', { name: 'Create Activity' }).click();
    
    // Wait for simulated generation (1200ms delay) + render
    await expect(page.getByText('Study Hub Dashboard')).toBeVisible({ timeout: 10000 });
    
    // Mock vocabulary words
    await expect(page.getByText('Profoundly').first()).toBeVisible();
  });
});

// ==============================================
// Footer Tests
// ==============================================
test.describe('Footer', () => {
  test('footer is rendered', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
  });
});

// ==============================================
// SEO Tests
// ==============================================
test.describe('SEO', () => {
  test('JSON-LD schema exists on homepage', async ({ page }) => {
    await page.goto('/');
    const schema = page.locator('script[type="application/ld+json"]');
    await expect(schema).toBeAttached();
  });

  test('meta description exists', async ({ page }) => {
    await page.goto('/');
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toBeAttached();
  });
});
