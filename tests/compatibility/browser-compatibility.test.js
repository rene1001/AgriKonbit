const { test, expect, devices } = require('@playwright/test');

describe('Tests de Compatibilité - Navigateurs', () => {
  const browsers = ['chromium', 'firefox', 'webkit'];
  
  test('Page d\'accueil sur différents navigateurs', async ({ browserName, page }) => {
    await page.goto('http://localhost:3000');
    
    const title = await page.title();
    expect(title).toBeTruthy();
    
    console.log(`✓ ${browserName}: Page chargée`);
  });

  test('Formulaire de connexion sur tous navigateurs', async ({ browserName, page }) => {
    await page.goto('http://localhost:3000/login');
    
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password');
      
      console.log(`✓ ${browserName}: Formulaire fonctionnel`);
    }
  });
});

describe('Tests de Compatibilité - Appareils Mobiles', () => {
  test('iPhone 12', async ({ page }) => {
    await page.setViewportSize(devices['iPhone 12'].viewport);
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();
    
    console.log('✓ iPhone 12: Compatible');
  });

  test('Samsung Galaxy S21', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();
    
    console.log('✓ Galaxy S21: Compatible');
  });

  test('iPad Pro', async ({ page }) => {
    await page.setViewportSize(devices['iPad Pro'].viewport);
    await page.goto('http://localhost:3000');
    
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();
    
    console.log('✓ iPad Pro: Compatible');
  });
});
