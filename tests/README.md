# DApp Tests

## Quick start

```bash
npm test          # Run unit + integration tests
npm run test:unit # Run unit tests only (~1s)
npm run test:integration  # Run Playwright integration tests (~30-60s)
```

## Unit tests

- **File:** `expense-form-utils.test.js`
- **What:** Pure logic in `expense-form-utils.js` (extractCleanCurrency, extractLedgerFromResource, buildSubmitPayload, etc.)
- **No network** – runs in Node, no browser
- **Fast** – completes in under 1 second

## Integration tests (Playwright)

- **File:** `expense-form.spec.ts`
- **What:**
  - Scripts load without errors
  - `expenseFormUtils` is available in the browser
  - Full expense form flow with **mocked APIs** (no real Google Apps Script or Edgar calls)
- **Network mocking** – all external requests are intercepted and return mock data
- **Runs in Chromium** – uses a local static server (`npx serve`)

## CI (GitHub Actions)

- **Workflow**: `.github/workflows/ci.yml`
- **Triggers**: Push/PR to `main` or `master`; also `workflow_dispatch` (manual)
- **Runs**: Unit tests + Playwright integration (all APIs mocked — no external calls)

## Adding tests

1. **Unit:** Add cases to `expense-form-utils.test.js` for new utils.
2. **Integration:** Add `test()` blocks in `expense-form.spec.ts`; use `page.route()` to mock new endpoints.
