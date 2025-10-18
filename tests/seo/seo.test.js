const { test, expect } = require('@playwright/test');

test.describe('Tests SEO - Meta Tags', () => {
  test('Page devrait avoir les meta tags essentiels', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    console.log(`✓ Title: "${title}"`);
    
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    if (description) {
      expect(description.length).toBeGreaterThan(50);
      console.log(`✓ Description présente`);
    }
  });

  test('Open Graph tags pour réseaux sociaux', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    
    if (ogTitle) {
      console.log(`✓ Open Graph configuré`);
    }
  });
});

test.describe('Tests SEO - Structure HTML', () => {
  test('Structure HTML5 sémantique', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const mainCount = await page.locator('main').count();
    const h1Count = await page.locator('h1').count();
    
    expect(mainCount).toBeGreaterThan(0);
    expect(h1Count).toBe(1);
    console.log(`✓ Structure sémantique correcte`);
  });

  test('Images devraient avoir des attributs alt', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const images = await page.locator('img').all();
    let withAlt = 0;
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      if (alt !== null && alt !== '') withAlt++;
    }
    
    const ratio = withAlt / images.length;
    console.log(`📸 Images avec alt: ${withAlt}/${images.length}`);
    expect(ratio).toBeGreaterThan(0.8);
  });
});

test.describe('Tests SEO - Performance', () => {
  test('Temps de chargement < 3s', async ({ page }) => {
    const start = Date.now();
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    
    console.log(`⏱ Temps de chargement: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);
  });
});
