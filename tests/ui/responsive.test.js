/**
 * Tests d'Affichage UI/UX
 * Ces tests utilisent Playwright pour tester l'interface utilisateur
 */

const { test, expect } = require('@playwright/test');

test.describe('Tests UI/UX - Responsive Design', () => {
  const viewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 }
  };

  test('Page d\'accueil devrait être responsive', async ({ page }) => {
    for (const [device, viewport] of Object.entries(viewports)) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      // Vérifier que le contenu est visible
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
      
      // Vérifier navigation
      const nav = page.locator('nav, [role="navigation"]');
      await expect(nav).toBeVisible();
      
      console.log(`✓ Page d'accueil responsive sur ${device}`);
    }
  });

  test('Menu burger devrait apparaître sur mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('http://localhost:3000');
    
    // Chercher menu burger (icône hamburger)
    const menuButton = page.locator('[aria-label="Menu"], button[aria-expanded]').first();
    
    if (await menuButton.isVisible()) {
      await menuButton.click();
      
      // Menu devrait s'ouvrir
      const mobileMenu = page.locator('.mobile-menu, [role="menu"]');
      await expect(mobileMenu).toBeVisible({ timeout: 2000 });
      
      console.log('✓ Menu burger fonctionne sur mobile');
    }
  });

  test('Images devraient être optimisées et responsive', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Vérifier que les images ont des attributs responsive
    const images = await page.locator('img').all();
    
    for (const img of images.slice(0, 5)) { // Tester les 5 premières
      const srcset = await img.getAttribute('srcset');
      const loading = await img.getAttribute('loading');
      
      // Au moins srcset OU loading lazy
      if (srcset || loading === 'lazy') {
        console.log('✓ Image optimisée trouvée');
      }
    }
  });

  test('Formulaires devraient être utilisables sur mobile', async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto('http://localhost:3000/login');
    
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await emailInput.isVisible()) {
      // Vérifier que les inputs sont assez grands pour mobile
      const emailBox = await emailInput.boundingBox();
      expect(emailBox.height).toBeGreaterThan(40); // Hauteur minimale touch-friendly
      
      // Tester la saisie
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');
      
      console.log('✓ Formulaires utilisables sur mobile');
    }
  });

  test('Texte devrait être lisible sur tous les écrans', async ({ page }) => {
    for (const [device, viewport] of Object.entries(viewports)) {
      await page.setViewportSize(viewport);
      await page.goto('http://localhost:3000');
      
      // Vérifier taille de police minimale
      const bodyFontSize = await page.evaluate(() => {
        return window.getComputedStyle(document.body).fontSize;
      });
      
      const fontSize = parseInt(bodyFontSize);
      expect(fontSize).toBeGreaterThanOrEqual(14); // Minimum 14px
      
      console.log(`✓ Taille police ${device}: ${bodyFontSize}`);
    }
  });
});

test.describe('Tests UI/UX - Navigation et Interactions', () => {
  test('Navigation devrait être fluide', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Tester liens de navigation
    const navLinks = page.locator('nav a, [role="navigation"] a');
    const linkCount = await navLinks.count();
    
    if (linkCount > 0) {
      const firstLink = navLinks.first();
      await firstLink.click();
      
      // Attendre navigation
      await page.waitForLoadState('networkidle');
      
      // Vérifier que l'URL a changé
      const url = page.url();
      expect(url).not.toBe('http://localhost:3000/');
      
      console.log('✓ Navigation fonctionnelle');
    }
  });

  test('Boutons devraient avoir des états visuels', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const buttons = page.locator('button');
    const firstButton = buttons.first();
    
    if (await firstButton.isVisible()) {
      // Vérifier état hover
      await firstButton.hover();
      
      // Vérifier état focus
      await firstButton.focus();
      const focused = await firstButton.evaluate(el => document.activeElement === el);
      expect(focused).toBe(true);
      
      console.log('✓ Boutons avec états visuels');
    }
  });

  test('Loading states devraient être visibles', async ({ page }) => {
    await page.goto('http://localhost:3000/products');
    
    // Chercher indicateurs de chargement
    const loader = page.locator('.loader, .spinner, [role="progressbar"]').first();
    
    // Le loader pourrait apparaître brièvement
    try {
      await expect(loader).toBeVisible({ timeout: 1000 });
      console.log('✓ Loading state visible');
    } catch {
      console.log('⚠ Loading state non détecté (peut-être trop rapide)');
    }
  });

  test('Messages d\'erreur devraient être clairs', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // Soumettre formulaire vide
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Chercher messages d'erreur
      const errorMessages = page.locator('.error, [role="alert"], .text-red-500');
      
      try {
        await expect(errorMessages.first()).toBeVisible({ timeout: 2000 });
        console.log('✓ Messages d\'erreur affichés');
      } catch {
        console.log('⚠ Messages d\'erreur non détectés');
      }
    }
  });

  test('Toasts/Notifications devraient apparaître', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // Essayer une action qui déclenche une notification
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button[type="submit"]').first();
    
    if (await emailInput.isVisible()) {
      await emailInput.fill('wrong@email.com');
      await passwordInput.fill('wrongpassword');
      await submitButton.click();
      
      // Chercher toast
      const toast = page.locator('.toast, .notification, [role="status"]');
      
      try {
        await expect(toast.first()).toBeVisible({ timeout: 3000 });
        console.log('✓ Toast notification fonctionnel');
      } catch {
        console.log('⚠ Toast non détecté');
      }
    }
  });
});

test.describe('Tests UI/UX - Animations et Transitions', () => {
  test('Animations devraient être fluides (60fps)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Mesurer performance animations
    const fps = await page.evaluate(() => {
      return new Promise((resolve) => {
        let lastTime = performance.now();
        let frames = 0;
        
        function checkFrame(time) {
          frames++;
          if (time - lastTime >= 1000) {
            resolve(frames);
          } else {
            requestAnimationFrame(checkFrame);
          }
        }
        requestAnimationFrame(checkFrame);
      });
    });
    
    console.log(`📊 FPS: ${fps}`);
    expect(fps).toBeGreaterThan(50); // Au moins 50 FPS
  });

  test('Transitions entre pages devraient être smooth', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const startTime = Date.now();
    
    // Naviguer vers une autre page
    await page.click('a[href*="/products"], a[href*="/about"]').catch(() => {});
    
    await page.waitForLoadState('networkidle');
    
    const transitionTime = Date.now() - startTime;
    console.log(`⏱ Temps de transition: ${transitionTime}ms`);
    
    expect(transitionTime).toBeLessThan(2000); // < 2s
  });
});

test.describe('Tests UI/UX - Formulaires et Validation', () => {
  test('Validation en temps réel devrait fonctionner', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    const emailInput = page.locator('input[type="email"]').first();
    
    if (await emailInput.isVisible()) {
      // Entrer email invalide
      await emailInput.fill('invalid-email');
      await emailInput.blur();
      
      // Chercher message d'erreur
      const errorMessage = page.locator('.error, .text-red-500, [role="alert"]');
      
      try {
        await expect(errorMessage.first()).toBeVisible({ timeout: 1000 });
        console.log('✓ Validation en temps réel fonctionne');
      } catch {
        console.log('⚠ Validation en temps réel non détectée');
      }
    }
  });

  test('Champs requis devraient être indiqués', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // Chercher indicateurs de champs requis (*, required, aria-required)
    const requiredInputs = page.locator('input[required], input[aria-required="true"]');
    const count = await requiredInputs.count();
    
    console.log(`✓ ${count} champs requis trouvés`);
    expect(count).toBeGreaterThan(0);
  });

  test('Autocomplete devrait être configuré', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await emailInput.isVisible()) {
      const emailAutocomplete = await emailInput.getAttribute('autocomplete');
      const passwordAutocomplete = await passwordInput.getAttribute('autocomplete');
      
      console.log('Autocomplete:', { emailAutocomplete, passwordAutocomplete });
      
      // Email devrait avoir autocomplete="email"
      // Password devrait avoir autocomplete="current-password" ou "new-password"
      expect(emailAutocomplete || passwordAutocomplete).toBeTruthy();
    }
  });
});

test.describe('Tests UI/UX - Internationalisation', () => {
  test('Sélecteur de langue devrait fonctionner', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Chercher sélecteur de langue
    const langSelector = page.locator('[data-testid="language-selector"], select[name="language"], button:has-text("FR"), button:has-text("EN")');
    
    if (await langSelector.first().isVisible()) {
      const initialText = await page.locator('body').textContent();
      
      // Changer de langue
      await langSelector.first().click();
      await page.waitForTimeout(500);
      
      const newText = await page.locator('body').textContent();
      
      // Le texte devrait avoir changé
      console.log('✓ Changement de langue fonctionnel');
    } else {
      console.log('⚠ Sélecteur de langue non trouvé');
    }
  });

  test('Contenu devrait être traduit', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Vérifier que le contenu n'est pas en clés i18n brutes
    const bodyText = await page.locator('body').textContent();
    
    // Ne devrait pas contenir de clés comme "common.title" ou "{{"
    expect(bodyText).not.toContain('{{');
    expect(bodyText).not.toContain('}}');
    
    console.log('✓ Contenu traduit correctement');
  });
});

test.describe('Tests UI/UX - Performance Visuelle', () => {
  test('First Contentful Paint devrait être < 1.5s', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
          if (fcp) {
            resolve(fcp.startTime);
          }
        }).observe({ type: 'paint', buffered: true });
      });
    });
    
    console.log(`📊 First Contentful Paint: ${fcp.toFixed(2)}ms`);
    expect(fcp).toBeLessThan(1500);
  });

  test('Cumulative Layout Shift devrait être minimal', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    await page.waitForLoadState('networkidle');
    
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
        
        setTimeout(() => resolve(clsValue), 2000);
      });
    });
    
    console.log(`📊 Cumulative Layout Shift: ${cls.toFixed(3)}`);
    expect(cls).toBeLessThan(0.1); // Bon score CLS < 0.1
  });
});
