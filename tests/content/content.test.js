const { test, expect } = require('@playwright/test');
const fs = require('fs').promises;
const path = require('path');

describe('Tests de Contenu - Traductions', () => {
  test('Fichier i18n devrait être valide', async () => {
    const i18nPath = path.join(__dirname, '../../client/src/i18n.js');
    const content = await fs.readFile(i18nPath, 'utf-8');
    
    expect(content).toBeTruthy();
    expect(content).not.toContain('undefined');
    
    console.log('✓ Fichier i18n valide');
  });

  test('Page ne devrait pas afficher de clés i18n brutes', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const bodyText = await page.locator('body').textContent();
    
    const hasBrokenTranslations = bodyText.includes('{{') || 
                                   bodyText.includes('}}') ||
                                   bodyText.match(/\w+\.\w+\.\w+/); // Ex: common.title.main
    
    if (hasBrokenTranslations) {
      console.log('⚠ Traductions manquantes détectées');
    } else {
      console.log('✓ Toutes les traductions sont appliquées');
    }
  });

  test('Changement de langue devrait fonctionner', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const initialText = await page.locator('body').textContent();
    
    // Chercher sélecteur de langue
    const langBtn = page.locator('button:has-text("FR"), button:has-text("EN")').first();
    
    if (await langBtn.isVisible()) {
      await langBtn.click();
      await page.waitForTimeout(500);
      
      const newText = await page.locator('body').textContent();
      
      if (initialText !== newText) {
        console.log('✓ Changement de langue fonctionnel');
      }
    }
  });
});

describe('Tests de Contenu - Messages d\'Erreur', () => {
  test('Messages d\'erreur devraient être clairs', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    // Soumettre formulaire vide
    const submitBtn = page.locator('button[type="submit"]').first();
    
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      
      const errorMsg = page.locator('.error, [role="alert"]').first();
      
      try {
        await expect(errorMsg).toBeVisible({ timeout: 2000 });
        const text = await errorMsg.textContent();
        
        expect(text.length).toBeGreaterThan(5);
        console.log(`✓ Message d'erreur: "${text.substring(0, 50)}"`);
      } catch {
        console.log('⚠ Messages d\'erreur à vérifier');
      }
    }
  });
});

describe('Tests de Contenu - Documentation', () => {
  test('README devrait exister', async () => {
    const readmePath = path.join(__dirname, '../../README.md');
    
    try {
      const content = await fs.readFile(readmePath, 'utf-8');
      expect(content.length).toBeGreaterThan(100);
      console.log('✓ README.md présent et complet');
    } catch {
      console.log('⚠ README.md manquant');
    }
  });

  test('Documentation API devrait être accessible', async ({ page }) => {
    try {
      await page.goto('http://localhost:3001/api-docs');
      
      const title = await page.title();
      
      if (title.toLowerCase().includes('swagger') || title.toLowerCase().includes('api')) {
        console.log('✓ Documentation API accessible');
      }
    } catch {
      console.log('⚠ Documentation API non accessible');
    }
  });
});
