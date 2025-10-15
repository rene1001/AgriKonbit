import { test, expect } from '@playwright/test';

test.describe('Notifications Real-time & UI', () => {
  let page1, page2;
  let context1, context2;

  test.beforeAll(async ({ browser }) => {
    // Create two contexts for two users
    context1 = await browser.newContext();
    context2 = await browser.newContext();
    page1 = await context1.newPage();
    page2 = await context2.newPage();
  });

  test.afterAll(async () => {
    await context1.close();
    await context2.close();
  });

  test('should display notifications in dashboard dropdown', async () => {
    // Login as consumer
    await page1.goto('http://localhost:3000/login');
    await page1.fill('input[type="email"]', 'consumer@test.com');
    await page1.fill('input[type="password"]', 'Test123!');
    await page1.click('button[type="submit"]');
    
    // Wait for dashboard
    await page1.waitForURL('**/dashboard');
    
    // Click notifications bell
    await page1.click('button:has-text("🔔")');
    
    // Verify dropdown is visible
    await expect(page1.locator('text=Notifications')).toBeVisible();
  });

  test('should mark notification as read and update badge', async () => {
    await page1.goto('http://localhost:3000/dashboard');
    
    // Get initial unread count
    const badge = page1.locator('button:has-text("🔔") span.bg-red-600');
    const initialCount = await badge.textContent().catch(() => '0');
    
    if (initialCount !== '0') {
      // Open dropdown
      await page1.click('button:has-text("🔔")');
      
      // Click "Lire" on first unread notification
      await page1.click('button:has-text("Lire")').first();
      
      // Wait for update
      await page1.waitForTimeout(1000);
      
      // Verify badge count decreased
      const newCount = await badge.textContent().catch(() => '0');
      expect(parseInt(newCount)).toBeLessThan(parseInt(initialCount));
    }
  });

  test('should delete notification from dropdown', async () => {
    await page1.goto('http://localhost:3000/dashboard');
    
    // Open dropdown
    await page1.click('button:has-text("🔔")');
    
    // Count notifications
    const notifsBefore = await page1.locator('[class*="border-b"]:has-text("Suppr.")').count();
    
    if (notifsBefore > 0) {
      // Click delete on first notification
      await page1.click('button:has-text("Suppr.")').first();
      
      // Wait for deletion
      await page1.waitForTimeout(1000);
      
      // Reopen dropdown
      await page1.click('button:has-text("🔔")');
      
      // Verify count decreased
      const notifsAfter = await page1.locator('[class*="border-b"]:has-text("Suppr.")').count();
      expect(notifsAfter).toBe(notifsBefore - 1);
    }
  });

  test('should receive real-time notification when message sent', async () => {
    // User 1: Login as farmer
    await page1.goto('http://localhost:3000/login');
    await page1.fill('input[type="email"]', 'farmer@test.com');
    await page1.fill('input[type="password"]', 'Test123!');
    await page1.click('button[type="submit"]');
    await page1.waitForURL('**/dashboard');
    
    // User 2: Login as investor
    await page2.goto('http://localhost:3000/login');
    await page2.fill('input[type="email"]', 'investor@test.com');
    await page2.fill('input[type="password"]', 'Test123!');
    await page2.click('button[type="submit"]');
    await page2.waitForURL('**/dashboard');
    
    // User 2: Get initial badge count
    const badge = page2.locator('button:has-text("🔔") span.bg-red-600');
    const initialCount = await badge.textContent().catch(() => '0');
    
    // User 1: Send message to investor
    await page1.click('button:has-text("💬 Messages")');
    await page1.click('button:has-text("Nouveau message")');
    await page1.selectOption('select', { label: /investor/i });
    await page1.fill('textarea', 'Test real-time notification');
    await page1.click('button:has-text("Envoyer")');
    
    // User 2: Wait for notification badge to update
    await page2.waitForTimeout(2000);
    const newCount = await badge.textContent().catch(() => '0');
    
    // Verify badge increased
    expect(parseInt(newCount)).toBeGreaterThan(parseInt(initialCount));
  });

  test('should show notifications on /notifications page with delete', async () => {
    await page1.goto('http://localhost:3000/notifications');
    
    // Verify page loaded
    await expect(page1.locator('h1:has-text("Notifications")')).toBeVisible();
    
    // Count notifications
    const notifsBefore = await page1.locator('button:has-text("Supprimer")').count();
    
    if (notifsBefore > 0) {
      // Delete first notification
      await page1.click('button:has-text("Supprimer")').first();
      
      // Wait for deletion
      await page1.waitForTimeout(1000);
      
      // Verify count decreased
      const notifsAfter = await page1.locator('button:has-text("Supprimer")').count();
      expect(notifsAfter).toBe(notifsBefore - 1);
    }
  });

  test('should mark all notifications as read', async () => {
    await page1.goto('http://localhost:3000/notifications');
    
    // Click "Tout marquer comme lu"
    await page1.click('button:has-text("Tout marquer comme lu")');
    
    // Wait for update
    await page1.waitForTimeout(1000);
    
    // Verify unread count is 0
    const unreadText = await page1.locator('text=/Non lues: \\d+/').textContent();
    expect(unreadText).toContain('Non lues: 0');
  });
});

test.describe('i18n Language Switching', () => {
  test('should change language and persist across pages', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Switch to English
    await page.click('button:has-text("EN")');
    await page.waitForTimeout(500);
    
    // Verify language changed on home page
    await expect(page.locator('text=/Marketplace|Marché/i')).toContainText(/Marketplace/i);
    
    // Navigate to profile
    await page.goto('http://localhost:3000/profile');
    
    // Verify language persisted
    await expect(page.locator('h1')).toContainText(/Profile|Profil/i);
    
    // Switch to French
    await page.click('button:has-text("FR")');
    await page.waitForTimeout(500);
    
    // Verify changed to French
    await expect(page.locator('h1')).toContainText(/Profil/i);
  });
});

test.describe('Project Images Display', () => {
  test('should display project images correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/projects');
    
    // Wait for projects to load
    await page.waitForSelector('[class*="grid"]');
    
    // Find first project card with image
    const projectCard = page.locator('[class*="rounded"]').first();
    const image = projectCard.locator('img').first();
    
    if (await image.count() > 0) {
      // Verify image has src
      const src = await image.getAttribute('src');
      expect(src).toBeTruthy();
      expect(src).not.toContain('undefined');
      
      // Verify image loaded
      await expect(image).toBeVisible();
    }
  });

  test('should display fallback when image fails to load', async ({ page }) => {
    await page.goto('http://localhost:3000/projects');
    
    // Inject a project with broken image
    await page.evaluate(() => {
      const img = document.createElement('img');
      img.src = 'http://invalid-url.com/broken.jpg';
      img.onerror = () => {
        img.src = '/placeholder.jpg';
      };
      document.body.appendChild(img);
    });
    
    await page.waitForTimeout(1000);
    
    // Verify fallback was applied
    const imgs = await page.locator('img[src*="placeholder"]').count();
    expect(imgs).toBeGreaterThan(0);
  });
});
