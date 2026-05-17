# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Homepage loads and Navigation works without crashing
- Location: tests/e2e.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').filter({ hasText: 'Leaderboard' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1').filter({ hasText: 'Leaderboard' })

```

```yaml
- navigation:
  - link "P PracticeForge IELTS & TOEFL Expert":
    - /url: /
  - link "Practice":
    - /url: /practice
  - link "Dictionary":
    - /url: /vocabulary
  - link "Library":
    - /url: /library
  - link "Academy":
    - /url: /academy
  - link "Leaderboard":
    - /url: /leaderboard
  - link "Pricing":
    - /url: /pricing
  - button "Log in"
  - button "Sign up for Free"
- main
- contentinfo:
  - text: PracticeForge
  - paragraph: PracticeForge is an AI-powered language tutor designed to help students achieve Band 8+ in IELTS Academic and 100+ in TOEFL iBT through instantly generated, personalized exam-style practice.
  - text: IELTS TOEFL General English
  - paragraph: Product
  - list:
    - listitem:
      - link "IELTS & TOEFL Practice":
        - /url: /practice
    - listitem:
      - link "General English Lab":
        - /url: /general-english
    - listitem:
      - link "My Dictionary":
        - /url: /vocabulary
    - listitem:
      - link "Question Bank":
        - /url: /question-bank
  - paragraph: Resources & Legal
  - list:
    - listitem:
      - link "PracticeForge Academy":
        - /url: /academy
    - listitem:
      - link "Pricing & Plans":
        - /url: /pricing
    - listitem:
      - link "Partner Program":
        - /url: /affiliate
    - listitem:
      - link "Privacy Policy":
        - /url: "#"
  - text: Partner Program
  - heading "Partner ol affiliate ile" [level=3]
  - paragraph: Refer your audience to PracticeForge and earn generous recurring commissions. Join our exclusive affiliate network today and grow with us.
  - link "Become a Partner →":
    - /url: /affiliate
  - separator
  - paragraph:
    - strong: "Disclaimer:"
    - text: PracticeForge is an independent study tool and is not affiliated with, endorsed by, or associated with IELTS (IDP Education, British Council, or Cambridge Assessment English) or TOEFL (Educational Testing Service / ETS). All content is AI-generated for self-study purposes.
  - paragraph: © 2026 PracticeForge. Accelerate your fluency.
  - text: Beta Release
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Homepage loads and Navigation works without crashing', async ({ page }) => {
  4  |   // Go to homepage
  5  |   await page.goto('/');
  6  |   
  7  |   // Verify title
  8  |   await expect(page).toHaveTitle(/PracticeForge/);
  9  |   
  10 |   // Check if Navigation is visible
  11 |   const nav = page.locator('nav');
  12 |   await expect(nav).toBeVisible();
  13 | 
  14 |   // Click on Leaderboard link
  15 |   const leaderboardLink = page.getByRole('link', { name: 'Leaderboard' });
  16 |   await expect(leaderboardLink).toBeVisible();
  17 |   await leaderboardLink.click();
  18 | 
  19 |   // Wait for Leaderboard page to load
> 20 |   await expect(page.locator('h1', { hasText: 'Leaderboard' })).toBeVisible();
     |                                                                ^ Error: expect(locator).toBeVisible() failed
  21 | 
  22 |   // Verify Daily Streak icon (🔥) exists on the screen
  23 |   const streakIcon = page.locator('text=🔥');
  24 |   // It might not be visible immediately if user has 0 streak in test env, 
  25 |   // but we can just ensure the page hasn't crashed (no white screen).
  26 | });
  27 | 
```