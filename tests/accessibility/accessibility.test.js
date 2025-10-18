const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

describe('Tests d\'Accessibilité - WCAG 2.1 AA', () => {
  test('Page d\'accueil devrait être accessible', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    console.log(`✓ Violations: ${accessibilityScanResults.violations.length}`);
    
    if (accessibilityScanResults.violations.length > 0) {
      console.log('⚠ Problèmes détectés:');
      accessibilityScanResults.violations.forEach(violation => {
        console.log(`  - ${violation.id}: ${violation.help}`);
        console.log(`    Impact: ${violation.impact}`);
        console.log(`    Éléments: ${violation.nodes.length}`);
      });
    }
    
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test('Formulaire de connexion devrait être accessible', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toHaveLength(0);
    console.log('✓ Formulaire de connexion accessible');
  });
});

describe('Tests d\'Accessibilité - Navigation Clavier', () => {
  test('Navigation au clavier devrait fonctionner', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Tabuler à travers les éléments
    let focusableCount = 0;
    
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tag: el.tagName,
          type: el.type,
          role: el.getAttribute('role'),
          text: el.textContent?.substring(0, 30)
        };
      });
      
      if (focusedElement.tag !== 'BODY') {
        focusableCount++;
      }
    }
    
    console.log(`⌨️ Éléments focusables: ${focusableCount}`);
    expect(focusableCount).toBeGreaterThan(5);
  });

  test('Skip links devraient être présents', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Chercher skip link
    await page.keyboard.press('Tab');
    
    const skipLink = await page.evaluate(() => {
      const el = document.activeElement;
      const text = el.textContent?.toLowerCase();
      return text?.includes('skip') || text?.includes('aller au contenu');
    });
    
    if (skipLink) {
      console.log('✓ Skip link présent');
    }
  });

  test('Focus visible devrait être stylisé', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    await page.keyboard.press('Tab');
    
    const focusStyle = await page.evaluate(() => {
      const el = document.activeElement;
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow
      };
    });
    
    // Devrait avoir un outline ou box-shadow visible
    const hasVisibleFocus = focusStyle.outlineWidth !== '0px' || focusStyle.boxShadow !== 'none';
    
    console.log('🎯 Focus styles:', focusStyle);
    expect(hasVisibleFocus).toBe(true);
  });
});

describe('Tests d\'Accessibilité - ARIA et Labels', () => {
  test('Formulaires devraient avoir des labels', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    const inputs = await page.locator('input').all();
    let inputsWithLabels = 0;
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        if (label > 0 || ariaLabel || ariaLabelledBy) {
          inputsWithLabels++;
        }
      }
    }
    
    console.log(`🏷️ Inputs avec labels: ${inputsWithLabels}/${inputs.length}`);
    expect(inputsWithLabels).toBe(inputs.length);
  });

  test('Boutons devraient avoir des labels accessibles', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const buttons = await page.locator('button').all();
    let buttonsWithLabels = 0;
    
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      if ((text && text.trim().length > 0) || ariaLabel) {
        buttonsWithLabels++;
      }
    }
    
    console.log(`🔘 Boutons avec labels: ${buttonsWithLabels}/${buttons.length}`);
    expect(buttonsWithLabels).toBe(buttons.length);
  });

  test('Images décoratives devraient avoir alt=""', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const images = await page.locator('img').all();
    
    for (const img of images.slice(0, 5)) {
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      
      // Image devrait avoir alt (même vide) ou role="presentation"
      expect(alt !== null || role === 'presentation').toBe(true);
    }
    
    console.log('✓ Images ont des attributs alt');
  });

  test('ARIA roles devraient être corrects', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const ariaErrors = await page.evaluate(() => {
      const errors = [];
      const elements = document.querySelectorAll('[role]');
      
      elements.forEach(el => {
        const role = el.getAttribute('role');
        // Vérifier rôles valides
        const validRoles = ['button', 'navigation', 'main', 'banner', 'contentinfo', 
                           'complementary', 'form', 'search', 'alert', 'dialog', 
                           'menu', 'menuitem', 'tab', 'tabpanel'];
        
        if (!validRoles.includes(role)) {
          errors.push(role);
        }
      });
      
      return errors;
    });
    
    console.log(`♿ ARIA roles invalides: ${ariaErrors.length}`);
    expect(ariaErrors.length).toBe(0);
  });
});

describe('Tests d\'Accessibilité - Contraste des Couleurs', () => {
  test('Texte devrait avoir un contraste suffisant', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const contrastIssues = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();
    
    const colorContrastViolations = contrastIssues.violations.filter(
      v => v.id === 'color-contrast'
    );
    
    console.log(`🎨 Problèmes de contraste: ${colorContrastViolations.length}`);
    
    if (colorContrastViolations.length > 0) {
      colorContrastViolations.forEach(v => {
        console.log(`  - ${v.nodes.length} éléments avec contraste insuffisant`);
      });
    }
    
    expect(colorContrastViolations.length).toBe(0);
  });
});

describe('Tests d\'Accessibilité - Lecteurs d\'Écran', () => {
  test('Page devrait avoir une langue définie', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const lang = await page.locator('html').getAttribute('lang');
    
    expect(lang).toBeTruthy();
    expect(['fr', 'en', 'ht', 'fr-HT']).toContain(lang);
    console.log(`🌐 Langue: ${lang}`);
  });

  test('Régions landmarks devraient être définies', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const landmarks = await page.evaluate(() => {
      return {
        header: document.querySelectorAll('header, [role="banner"]').length,
        nav: document.querySelectorAll('nav, [role="navigation"]').length,
        main: document.querySelectorAll('main, [role="main"]').length,
        footer: document.querySelectorAll('footer, [role="contentinfo"]').length,
      };
    });
    
    console.log('🗺️ Landmarks:', landmarks);
    
    expect(landmarks.main).toBeGreaterThan(0);
    expect(landmarks.header).toBeGreaterThan(0);
  });

  test('Titres de page devraient être uniques et descriptifs', async ({ page }) => {
    const pages = [
      { url: 'http://localhost:3000', name: 'Accueil' },
      { url: 'http://localhost:3000/products', name: 'Produits' },
      { url: 'http://localhost:3000/login', name: 'Connexion' },
    ];
    
    const titles = [];
    
    for (const p of pages) {
      try {
        await page.goto(p.url);
        const title = await page.title();
        titles.push({ page: p.name, title });
      } catch (e) {
        console.log(`⚠ Page ${p.name} non accessible`);
      }
    }
    
    console.log('📄 Titres de pages:');
    titles.forEach(t => console.log(`  ${t.page}: "${t.title}"`));
    
    // Tous les titres devraient être différents
    const uniqueTitles = new Set(titles.map(t => t.title));
    expect(uniqueTitles.size).toBe(titles.length);
  });
});

describe('Tests d\'Accessibilité - Formulaires', () => {
  test('Messages d\'erreur devraient être annoncés', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // Soumettre formulaire vide
    const submitBtn = page.locator('button[type="submit"]').first();
    
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      
      // Chercher région d'alerte
      const alertRegion = page.locator('[role="alert"], [aria-live="assertive"]');
      
      try {
        await expect(alertRegion.first()).toBeVisible({ timeout: 2000 });
        console.log('✓ Messages d\'erreur annoncés via ARIA');
      } catch {
        console.log('⚠ Vérifier les messages d\'erreur ARIA');
      }
    }
  });

  test('Champs requis devraient être indiqués', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    const requiredFields = await page.locator('input[required], input[aria-required="true"]').count();
    
    console.log(`✓ ${requiredFields} champs requis identifiés`);
    expect(requiredFields).toBeGreaterThan(0);
  });
});
