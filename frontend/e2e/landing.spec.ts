import { test, expect } from "@playwright/test";

test.describe("DubQuant landing page E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("page loads with CTA visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /start learning/i })).toBeVisible();
    await expect(page.locator("h1")).toContainText("DubQuant");
  });

  test("nav anchor links scroll to sections", async ({ page }) => {
    await page.getByRole("link", { name: /how it works/i }).first().click();
    await expect(page.locator("#how")).toBeInViewport();

    await page.getByRole("link", { name: /features/i }).first().click();
    await expect(page.locator("#features")).toBeInViewport();

    await page.getByRole("link", { name: /leaderboard/i }).first().click();
    await expect(page.locator("#leaderboard")).toBeInViewport();

    await page.getByRole("link", { name: /faq/i }).first().click();
    await expect(page.locator("#faq")).toBeInViewport();
  });

  test("Sign In modal opens and Escape closes", async ({ page }) => {
    // Click desktop Sign In button and wait for dialog
    await page.locator("header").getByRole("button", { name: /sign in/i }).click();
    await page.waitForTimeout(500);

    // Check for dialog via selector (framer-motion creates it dynamically)
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog.first()).toBeVisible({ timeout: 10000 });

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible({ timeout: 10000 });
  });

  test("AI popover opens and Escape closes", async ({ page }) => {
    // Scroll to predictions console to ensure it's visible
    const aiButton = page.getByLabel(/open ai insight for aapl/i);
    await aiButton.scrollIntoViewIfNeeded();
    await aiButton.click();
    await page.waitForTimeout(500);

    const panel = page.locator('[data-testid="ai-panel"]');
    await expect(panel).toBeVisible({ timeout: 10000 });

    await page.keyboard.press("Escape");
    await expect(panel).not.toBeVisible({ timeout: 10000 });
  });

  test("mobile nav — hamburger opens and link click closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);

    const hamburger = page.getByLabel(/open menu/i);
    await expect(hamburger).toBeVisible({ timeout: 10000 });
    await hamburger.click();
    await page.waitForTimeout(500);

    const mobileDialog = page.locator('[role="dialog"][aria-label="Mobile navigation"]');
    await expect(mobileDialog).toBeVisible({ timeout: 10000 });

    await mobileDialog.getByRole("link", { name: /how it works/i }).click();
    await expect(mobileDialog).not.toBeVisible({ timeout: 10000 });
  });
});
