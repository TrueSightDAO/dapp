/**
 * Integration tests for report_dao_expenses.html
 * - Verifies scripts load without errors
 * - Verifies expenseFormUtils is available and correct
 * - Verifies form flow with mocked APIs (no real network calls)
 */
import { test, expect } from '@playwright/test';

const MOCK_MEMBERS = [{ name: 'Gary Teh', key: 'gary_teh' }];
const MOCK_LEDGERS = [
  { ledger_name: 'offchain', ledger_url: '' },
  { ledger_name: 'AGL15', ledger_url: 'https://example.com/agl15' },
];
const MOCK_RESOURCES: Array<{ currency: string; amount: number }> = [];
const MOCK_CURRENCIES = [
  {
    product_name: 'USD',
    ledger_quantities: { AGL15: 1000 },
    total_quantity: 1000,
  },
  {
    product_name: 'EUR',
    ledger_quantities: {},
    total_quantity: 500,
  },
];

test.describe('Expense form - script loading', () => {
  test('expense-form-utils.js loads on minimal page', async ({ page }) => {
    await page.goto('/tests/fixtures/utils-test.html');
    await expect(page.locator('#result')).toHaveText('loaded');
    const utils = await page.evaluate(() => (window as any).expenseFormUtils);
    expect(utils).toBeDefined();
    expect(await page.evaluate(() => (window as any).expenseFormUtils.extractCleanCurrency('[AGL15] USD'))).toBe('USD');
  });

  test.beforeEach(async ({ page }) => {
    // Prevent redirect to create_signature - need valid localStorage for page to show form
    await page.addInitScript(() => {
      localStorage.setItem(
        'publicKey',
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyC5HgVLODmtFQZiM91XK'
      );
    });
    // Mock signature verification so page doesn't show error
    await page.route('**/macros/**/exec*', (route) => {
      const url = route.request().url();
      if (url.includes('signature=')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            contributor_name: 'Test User',
            contributor_key: 'test',
          }),
        });
      }
      route.continue();
    });
  });

  test('expense-form-utils.js loads on report_dao_expenses and exposes correct API', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto('/report_dao_expenses.html');
    // Wait for utils to be available (no networkidle - external APIs may poll)
    await page.waitForFunction(
      () =>
        (window as any).expenseFormUtils?.extractCleanCurrency != null,
      { timeout: 5000 }
    );

    expect(errors, `Script errors: ${errors.join('; ')}`).toHaveLength(0);
    // Check API shape in page context (functions don't serialize to Node)
    const apiCheck = await page.evaluate(() => {
      const u = (window as any).expenseFormUtils;
      return {
        defined: !!u,
        hasExtractCleanCurrency: typeof u?.extractCleanCurrency === 'function',
        hasExtractLedgerFromResource: typeof u?.extractLedgerFromResource === 'function',
      };
    });
    expect(apiCheck.defined).toBe(true);
    expect(apiCheck.hasExtractCleanCurrency).toBe(true);
    expect(apiCheck.hasExtractLedgerFromResource).toBe(true);
  });

  test('extractCleanCurrency returns USD for [AGL15] USD (regression test)', async ({
    page,
  }) => {
    await page.goto('/report_dao_expenses.html');
    const result = await page.evaluate(
      () => (window as any).expenseFormUtils.extractCleanCurrency('[AGL15] USD')
    );
    expect(result).toBe('USD');
  });

  test('extractLedgerFromResource returns AGL15 for [AGL15] USD', async ({
    page,
  }) => {
    await page.goto('/report_dao_expenses.html');
    const result = await page.evaluate(
      () =>
        (window as any).expenseFormUtils.extractLedgerFromResource(
          '[AGL15] USD'
        )
    );
    expect(result).toBe('AGL15');
  });
});

test.describe('Expense form - full flow with mocked APIs', () => {
  test.beforeEach(async ({ page }) => {
    // Mock all external APIs - no real network calls
    await page.route('**/macros/**/exec*', (route) => {
      const url = route.request().url();
      if (url.includes('signature=')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            contributor_name: 'Gary Teh',
            contributor_key: 'gary_teh',
          }),
        });
      }
      if (url.includes('list=true')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_MEMBERS),
        });
      }
      if (url.includes('ledgers=true')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_LEDGERS),
        });
      }
      if (url.includes('all_currencies=true')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            data: { currencies: MOCK_CURRENCIES },
          }),
        });
      }
      if (url.includes('manager=')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_RESOURCES),
        });
      }
      route.continue();
    });

    await page.route('**/edgar.truesight.me/**', (route) => {
      if (route.request().url().includes('ping')) {
        return route.fulfill({ status: 200 });
      }
      if (route.request().url().includes('submit_contribution')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ fileUploadedToGithub: true }),
        });
      }
      route.continue();
    });

    // Set localStorage and mock geolocation before page loads
    await page.addInitScript(() => {
      localStorage.setItem(
        'publicKey',
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyC5HgVLODmtFQZiM91XK'
      );
      localStorage.setItem('privateKey', 'fake-private-key-for-test');
    });

    await page.addInitScript(() => {
      const orig = navigator.geolocation.getCurrentPosition.bind(
        navigator.geolocation
      );
      navigator.geolocation.getCurrentPosition = function (
        success: PositionCallback
      ) {
        success({
          coords: {
            latitude: 1.312906,
            longitude: 103.763088,
            accuracy: 1,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        } as GeolocationPosition);
      };
    });
  });

  test('page loads and form becomes visible without script errors', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto('/report_dao_expenses.html');

    await expect(page.getByText('Welcome back')).toBeVisible({
      timeout: 15000,
    });
    expect(errors, `Script errors: ${errors.join('; ')}`).toHaveLength(0);

    // Form fields should be visible (use IDs - labels may not associate with custom combobox)
    await expect(page.locator('#memberInput')).toBeVisible();
    await expect(page.locator('#resourceSelectCombobox')).toBeVisible();
    await expect(page.locator('#ledgerInput')).toBeVisible();
  });

  test('selecting [AGL15] USD auto-fills Target Ledger to AGL15', async ({
    page,
  }) => {
    await page.goto('/report_dao_expenses.html');
    await expect(page.getByText('Welcome back')).toBeVisible({
      timeout: 5000,
    });

    // Select member
    const memberInput = page.getByPlaceholder(/search and filter members/i);
    await memberInput.fill('Gary Teh');
    await memberInput.press('Enter');

    // Wait for resources to load (mocked - allCurrencies has [AGL15] USD)
    await page.waitForTimeout(500);

    // Open resource dropdown
    await page.getByText('Select a resource').click();
    await page.waitForTimeout(200);

    // Select [AGL15] USD - it should appear in the list from allCurrencies
    const agl15Usd = page.getByText('[AGL15] USD', { exact: false }).first();
    await agl15Usd.click();

    // Target Ledger should auto-fill to AGL15
    const ledgerInput = page.locator('#ledgerInput');
    await expect(ledgerInput).toHaveValue('AGL15');
  });
});
