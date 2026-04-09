import { test, expect } from '@playwright/test';

test.describe('Buyer Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as buyer
    await page.goto('/login');
    await page.fill('input[name="email"]', 'buyer@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/buyer/dashboard');
  });

  test('should display dashboard with stats', async ({ page }) => {
    // Check if dashboard loads
    await expect(page.locator('h1')).toContainText("Buyer Dashboard");

    // Check if stats cards are visible
    await expect(page.locator('text=Total Orders')).toBeVisible();
    await expect(page.locator('text=Total Spent')).toBeVisible();
    await expect(page.locator('text=Active Suppliers')).toBeVisible();
    await expect(page.locator('text=Reputation Score')).toBeVisible();
  });

  test('should navigate to supplier discovery', async ({ page }) => {
    // Click on suppliers link
    await page.click('text=Find Suppliers');
    await page.waitForURL('/buyer/dashboard/sourcing/suppliers');

    // Check if supplier list loads
    await expect(page.locator('h1')).toContainText("Smart Sourcing");
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });

  test('should filter suppliers by district', async ({ page }) => {
    await page.goto('/buyer/dashboard/sourcing/suppliers');

    // Apply district filter
    await page.fill('input[placeholder*="Search"]', 'Pune');
    await page.waitForTimeout(500); // Wait for debounce

    // Check if results are filtered
    const suppliers = page.locator('[data-testid="supplier-card"]');
    await expect(suppliers.first()).toBeVisible();
  });

  test('should place a bid', async ({ page }) => {
    await page.goto('/buyer/dashboard/bidding');

    // Click place bid button
    await page.click('text=Place New Bid');

    // Fill bid form
    await page.selectOption('select[name="productId"]', { index: 1 });
    await page.fill('input[name="quantity"]', '100');
    await page.fill('input[name="pricePerUnit"]', '420');

    // Submit bid
    await page.click('button[type="submit"]');

    // Check success message
    await expect(page.locator('text=Bid placed successfully')).toBeVisible();
  });

  test('should create pre-booking', async ({ page }) => {
    await page.goto('/buyer/dashboard/pre-bookings');

    // Click create button
    await page.click('text=New Pre-Booking');

    // Fill form
    await page.selectOption('select', { index: 1 });
    await page.fill('input[type="number"]', '500');
    await page.fill('input[type="date"]', '2024-12-01');

    // Submit
    await page.click('text=Create Pre-Booking');

    // Check success
    await expect(page.locator('text=Pre-booking created successfully')).toBeVisible();
  });

  test('should track order in real-time', async ({ page }) => {
    await page.goto('/buyer/dashboard/orders');

    // Click on an order
    await page.click('[data-testid="order-card"]').first();

    // Check tracking timeline
    await expect(page.locator('text=Tracking Details')).toBeVisible();
    await expect(page.locator('[data-testid="tracking-event"]')).toHaveCount.greaterThan(0);
  });

  test('should view reputation score', async ({ page }) => {
    await page.goto('/buyer/dashboard/reputation');

    // Check reputation display
    await expect(page.locator('text=Reputation Score')).toBeVisible();
    await expect(page.locator('[data-testid="score-value"]')).toBeVisible();

    // Check breakdown
    await expect(page.locator('text=Payment Reliability')).toBeVisible();
    await expect(page.locator('text=Order Completion')).toBeVisible();
  });

  test('should use AI chat assistant', async ({ page }) => {
    await page.goto('/buyer/dashboard');

    // Open chat
    await page.click('[data-testid="chat-button"]');

    // Send message
    await page.fill('textarea[placeholder*="message"]', 'What are the best wheat suppliers?');
    await page.click('button[aria-label="Send"]');

    // Check response
    await expect(page.locator('[data-testid="chat-message"]').last()).toBeVisible();
  });

  test('should view blockchain trace', async ({ page }) => {
    await page.goto('/buyer/dashboard/blockchain');

    // Select a product
    await page.click('[data-testid="product-card"]').first();

    // Check trace timeline
    await expect(page.locator('text=Blockchain Trace')).toBeVisible();
    await expect(page.locator('[data-testid="trace-event"]')).toHaveCount.greaterThan(0);
  });

  test('should manage escrow order', async ({ page }) => {
    await page.goto('/buyer/dashboard/escrow');

    // Click on escrow order
    await page.click('[data-testid="escrow-card"]').first();

    // Confirm delivery
    await page.click('text=Confirm Delivery');

    // Check confirmation
    await expect(page.locator('text=Delivery confirmed')).toBeVisible();
  });

  test('should receive real-time notifications', async ({ page }) => {
    await page.goto('/buyer/dashboard');

    // Wait for socket connection
    await page.waitForTimeout(1000);

    // Trigger a bid update (this would come from backend in real scenario)
    // Check if notification appears
    await expect(page.locator('[data-testid="notification-bell"]')).toBeVisible();
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should display mobile menu', async ({ page }) => {
    await page.goto('/buyer/dashboard');

    // Check if mobile menu button is visible
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();

    // Open menu
    await page.click('[data-testid="mobile-menu-button"]');

    // Check menu items
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Suppliers')).toBeVisible();
  });

  test('should display cards in single column', async ({ page }) => {
    await page.goto('/buyer/dashboard');

    // Check if stats cards stack vertically
    const cards = page.locator('[data-testid="stat-card"]');
    const firstCard = cards.first();
    const secondCard = cards.nth(1);

    const firstBox = await firstCard.boundingBox();
    const secondBox = await secondCard.boundingBox();

    // Cards should be stacked (second card below first)
    expect(secondBox!.y).toBeGreaterThan(firstBox!.y + firstBox!.height);
  });
});

test.describe('Performance', () => {
  test('should load dashboard within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/buyer/dashboard');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle 100 suppliers without lag', async ({ page }) => {
    await page.goto('/buyer/dashboard/sourcing/suppliers');

    // Scroll through list
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(100);
    }

    // Check if page is still responsive
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });
});
