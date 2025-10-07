import { test, expect } from '@playwright/test';

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://localhost:3001';

// Test credentials
const ADMIN_EMAIL = 'admin@agrikonbit.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

test.describe('Admin Panel - Authentication', () => {
  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await expect(page).toHaveURL(/\/login/);
  });

  test('should allow admin to login and access admin panel', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Fill login form
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForURL(`${BASE_URL}/admin`, { timeout: 10000 });
    
    // Verify admin dashboard is visible
    await expect(page.locator('h1:has-text("Admin Panel")')).toBeVisible();
  });

  test('should show access denied for non-admin users', async ({ page }) => {
    // Login as farmer
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'farmer@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Try to access admin
    await page.goto(`${BASE_URL}/admin`);
    
    // Should see access denied message
    await expect(page.locator('text=/Accès refusé/i')).toBeVisible();
  });
});

test.describe('Admin Panel - Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`);
  });

  test('should display KPI cards with data', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForSelector('.card', { timeout: 5000 });
    
    // Check that KPI cards are present
    await expect(page.locator('text=/Utilisateurs/i')).toBeVisible();
    await expect(page.locator('text=/Projets/i')).toBeVisible();
    await expect(page.locator('text=/Commandes/i')).toBeVisible();
  });

  test('should display analytics charts', async ({ page }) => {
    // Wait for Recharts to render
    await page.waitForSelector('.recharts-wrapper', { timeout: 10000 });
    
    // Verify at least one chart is visible
    const charts = page.locator('.recharts-wrapper');
    await expect(charts).toHaveCount(3); // Pie, Bar, Bar charts
  });

  test('should navigate to users page', async ({ page }) => {
    await page.click('text=/👥 Utilisateurs/i');
    await page.waitForURL(`${BASE_URL}/admin/users`);
    await expect(page.locator('h1:has-text("Utilisateurs")')).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    await page.click('text=/🛒 Produits/i');
    await page.waitForURL(`${BASE_URL}/admin/products`);
    await expect(page.locator('h1')).toContainText('Produits');
  });
});

test.describe('Admin Panel - Project Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`);
  });

  test('should display pending projects', async ({ page }) => {
    // Scroll to pending projects section
    await page.locator('h2:has-text("Projets en attente")').scrollIntoViewIfNeeded();
    
    // Check if section is visible
    await expect(page.locator('h2:has-text("Projets en attente")')).toBeVisible();
  });

  test('should approve project with notes', async ({ page }) => {
    // Wait for pending projects to load
    await page.waitForSelector('h2:has-text("Projets en attente")');
    
    // Check if there are pending projects
    const noPendingMsg = page.locator('text=/Aucun projet en attente/i');
    const hasPending = await noPendingMsg.count() === 0;
    
    if (hasPending) {
      // Fill validation notes
      const notesTextarea = page.locator('textarea').first();
      await notesTextarea.fill('Projet approuvé - Bon dossier');
      
      // Click approve button
      await page.click('button:has-text("Approuver")');
      
      // Wait for toast notification
      await expect(page.locator('text=/Projet mis à jour/i')).toBeVisible({ timeout: 5000 });
    } else {
      console.log('No pending projects to test approval');
    }
  });

  test('should reject project with notes', async ({ page }) => {
    await page.waitForSelector('h2:has-text("Projets en attente")');
    
    const noPendingMsg = page.locator('text=/Aucun projet en attente/i');
    const hasPending = await noPendingMsg.count() === 0;
    
    if (hasPending) {
      const notesTextarea = page.locator('textarea').first();
      await notesTextarea.fill('Projet rejeté - Documentation incomplète');
      
      await page.click('button:has-text("Rejeter")');
      await expect(page.locator('text=/Projet mis à jour/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should paginate pending projects', async ({ page }) => {
    await page.waitForSelector('h2:has-text("Projets en attente")');
    
    // Check if pagination controls exist
    const nextButton = page.locator('button:has-text("Suivant")');
    const prevButton = page.locator('button:has-text("Précédent")');
    
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    
    // Previous button should be disabled on first page
    await expect(prevButton).toBeDisabled();
  });
});

test.describe('Admin Panel - User Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.goto(`${BASE_URL}/admin/users`);
  });

  test('should display users table', async ({ page }) => {
    await expect(page.locator('h1:has-text("Utilisateurs")')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('should filter users by role', async ({ page }) => {
    // Select farmer role filter
    await page.selectOption('select:near(:text("Rôle"))', 'farmer');
    
    // Wait for table to update
    await page.waitForTimeout(1000);
    
    // Verify URL has filter
    expect(page.url()).toContain('role=farmer');
  });

  test('should filter users by status', async ({ page }) => {
    await page.selectOption('select:near(:text("Statut"))', 'active');
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('status=active');
  });

  test('should change user role', async ({ page }) => {
    // Wait for users to load
    await page.waitForSelector('table tbody tr', { timeout: 5000 });
    
    const roleSelects = page.locator('table tbody tr select');
    const count = await roleSelects.count();
    
    if (count > 0) {
      // Change first user's role
      const firstSelect = roleSelects.first();
      await firstSelect.selectOption('investor');
      
      // Wait for toast
      await expect(page.locator('text=/Rôle mis à jour/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should activate/deactivate user', async ({ page }) => {
    await page.waitForSelector('table tbody tr');
    
    const actionButtons = page.locator('table tbody tr button').filter({ hasText: /Activer|Désactiver/ });
    const count = await actionButtons.count();
    
    if (count > 0) {
      await actionButtons.first().click();
      await expect(page.locator('text=/Utilisateur mis à jour/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should export users to CSV', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Exporter CSV")');
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/users-export-\d+\.csv/);
  });

  test('should paginate users', async ({ page }) => {
    await page.waitForSelector('table');
    
    const pageInfo = page.locator('text=/Page \\d+ \\/ \\d+/');
    await expect(pageInfo).toBeVisible();
    
    const nextButton = page.locator('button:has-text("Suivant")');
    await expect(nextButton).toBeVisible();
  });
});

test.describe('Admin Panel - Product Moderation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.goto(`${BASE_URL}/admin/products`);
  });

  test('should display products table', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
  });

  test('should filter products by status', async ({ page }) => {
    await page.selectOption('select:near(:text("Statut"))', 'active');
    await page.waitForTimeout(1000);
  });

  test('should filter products by category', async ({ page }) => {
    await page.selectOption('select:near(:text("Catégorie"))', 'fruits');
    await page.waitForTimeout(1000);
  });

  test('should search products', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Nom ou description"]');
    await searchInput.fill('tomate');
    await page.waitForTimeout(1000);
  });

  test('should toggle product status', async ({ page }) => {
    await page.waitForSelector('table tbody tr');
    
    const actionButtons = page.locator('table tbody tr button').filter({ hasText: /Activer|Désactiver/ });
    const count = await actionButtons.count();
    
    if (count > 0) {
      await actionButtons.first().click();
      await expect(page.locator('text=/Produit mis à jour/i')).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('Admin Panel - CSV Exports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/admin`);
  });

  test('should export users CSV', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.click('text=/Utilisateurs/i >> .. >> button');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/users-export-\d+\.csv/);
  });

  test('should export projects CSV', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.locator('button:near(:text("Projets"))').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/projects-export-\d+\.csv/);
  });

  test('should export investments CSV', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.locator('button:near(:text("Investissements"))').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/investments-export-\d+\.csv/);
  });

  test('should export orders CSV', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.locator('button:near(:text("Commandes"))').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/orders-export-\d+\.csv/);
  });
});
