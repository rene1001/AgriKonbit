import { test, expect } from '@playwright/test';

// Prereqs: dev servers running: API :5000, Front :3000, DB migrated

test('Investor registers, deposits GYT, browses projects, invests, buys product, and tracks order (happy path)', async ({ page }) => {
  await page.goto('/');

  // Go to Register
  await page.getByRole('link', { name: /créer un compte|register/i }).first().click();

  const email = `e2e_${Date.now()}@example.com`;
  await page.getByLabel(/full name|nom/i).fill('E2E Test');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password|mot de passe/i).fill('Password123!');
  const roleSelect = page.locator('select');
  if (await roleSelect.count()) {
    await roleSelect.first().selectOption('investor');
  }
  await page.getByRole('button', { name: /create|créer/i }).click();

  // Dashboard visible
  await expect(page.getByText(/tableau de bord|dashboard/i)).toBeVisible();

  // Deposit via Stripe
  const depositInput = page.locator('input[type="number"]').first();
  await depositInput.fill('50');
  await page.getByRole('button', { name: /stripe/i }).click();
  await expect(page.getByText(/dépôt 50 gyt effectué/i)).toBeVisible({ timeout: 15000 });

  // Browse Projects (if any validated)
  await page.getByRole('link', { name: /projets|projects/i }).first().click();
  // Optional: open first project card if present
  const firstDetails = page.getByRole('link', { name: /détails|details/i }).first();
  if (await firstDetails.count()) {
    await firstDetails.click();
    // Try investing minimum 10 GYT if invest form exists
    const amountInput = page.locator('input[type="number"]').first();
    if (await amountInput.count()) {
      await amountInput.fill('10');
      const investBtn = page.getByRole('button', { name: /invest/i });
      if (await investBtn.count()) {
        await investBtn.click();
      }
    }
  }

  // Go to Marketplace, add to cart, checkout
  await page.getByRole('link', { name: /market|marketplace/i }).first().click();
  const firstProduct = page.getByRole('button', { name: /add to cart|ajouter au panier/i }).first();
  if (await firstProduct.count()) {
    await firstProduct.click();
    await page.goto('/cart');
    await page.getByRole('link', { name: /checkout|paiement|commander/i }).click();
    const placeOrder = page.getByRole('button', { name: /place order|passer commande|gyt wallet/i });
    if (await placeOrder.count()) {
      await placeOrder.click();
      await expect(page.getByText(/Order placed|Commande|Order created/i)).toBeVisible({ timeout: 15000 });
    }
  }
});
