/**
 * Unit tests for expense-form-utils.js
 * Run: node tests/expense-form-utils.test.js
 */
const assert = require('assert');
const {
    extractLedgerFromResource,
    extractCleanCurrency,
    normalizeLedgerName,
    buildSubmitPayload,
    validateDescription,
    generateExpenseFileName
} = require('../expense-form-utils.js');

function test(name, fn) {
    try {
        fn();
        console.log(`  ✓ ${name}`);
        return true;
    } catch (err) {
        console.error(`  ✗ ${name}`);
        console.error(`    ${err.message}`);
        return false;
    }
}

console.log('\nExpense Form Utils - Unit Tests\n');

let passed = 0;
let failed = 0;

// extractLedgerFromResource
console.log('extractLedgerFromResource:');
passed += test('[AGL15] USD → AGL15', () => assert.strictEqual(extractLedgerFromResource('[AGL15] USD'), 'AGL15'));
passed += test('[AGL10] EUR → AGL10', () => assert.strictEqual(extractLedgerFromResource('[AGL10] EUR'), 'AGL10'));
passed += test('USD → null', () => assert.strictEqual(extractLedgerFromResource('USD'), null));
passed += test('empty string → null', () => assert.strictEqual(extractLedgerFromResource(''), null));
passed += test('null → null', () => assert.strictEqual(extractLedgerFromResource(null), null));
passed += test('[AGL 10] USD → AGL 10', () => assert.strictEqual(extractLedgerFromResource('[AGL 10] USD'), 'AGL 10'));

// extractCleanCurrency - CRITICAL: prevents regression of Column I = [AGL15] USD
console.log('\nextractCleanCurrency (Column I = clean currency):');
passed += test('[AGL15] USD → USD', () => assert.strictEqual(extractCleanCurrency('[AGL15] USD'), 'USD'));
passed += test('[AGL10] EUR → EUR', () => assert.strictEqual(extractCleanCurrency('[AGL10] EUR'), 'EUR'));
passed += test('USD → USD', () => assert.strictEqual(extractCleanCurrency('USD'), 'USD'));
passed += test('plain currency unchanged', () => assert.strictEqual(extractCleanCurrency('EUR'), 'EUR'));
passed += test('empty string → empty', () => assert.strictEqual(extractCleanCurrency(''), ''));
passed += test('null → empty', () => assert.strictEqual(extractCleanCurrency(null), ''));
passed += test('whitespace trimmed', () => assert.strictEqual(extractCleanCurrency('[AGL15]  USD  '), 'USD'));

// normalizeLedgerName
console.log('\nnormalizeLedgerName:');
passed += test('AGL15 → agl15', () => assert.strictEqual(normalizeLedgerName('AGL15'), 'agl15'));
passed += test('AGL 15 → agl15', () => assert.strictEqual(normalizeLedgerName('AGL 15'), 'agl15'));
passed += test('AGL-15 → agl15', () => assert.strictEqual(normalizeLedgerName('AGL-15'), 'agl15'));
passed += test('empty → empty', () => assert.strictEqual(normalizeLedgerName(''), ''));

// buildSubmitPayload
console.log('\nbuildSubmitPayload (resourceName + targetLedger):');
let r = buildSubmitPayload('[AGL15] USD', '');
passed += test('raw [AGL15] USD, no ledger → USD, AGL15', () => {
    const p = buildSubmitPayload('[AGL15] USD', '');
    assert.strictEqual(p.resourceName, 'USD');
    assert.strictEqual(p.targetLedger, 'AGL15');
});
passed += test('raw [AGL15] USD, ledger AGL15 → USD, AGL15', () => {
    const p = buildSubmitPayload('[AGL15] USD', 'AGL15');
    assert.strictEqual(p.resourceName, 'USD');
    assert.strictEqual(p.targetLedger, 'AGL15');
});
passed += test('raw USD, ledger AGL10 → USD, AGL10', () => {
    const p = buildSubmitPayload('USD', 'AGL10');
    assert.strictEqual(p.resourceName, 'USD');
    assert.strictEqual(p.targetLedger, 'AGL10');
});
passed += test('raw USD, no ledger → USD, offchain', () => {
    const p = buildSubmitPayload('USD', '');
    assert.strictEqual(p.resourceName, 'USD');
    assert.strictEqual(p.targetLedger, 'offchain');
});
passed += test('raw USD, ledger offchain → USD, offchain', () => {
    const p = buildSubmitPayload('USD', 'offchain');
    assert.strictEqual(p.resourceName, 'USD');
    assert.strictEqual(p.targetLedger, 'offchain');
});

// validateDescription
console.log('\nvalidateDescription:');
passed += test('valid description', () => assert.strictEqual(validateDescription('Office supplies'), true));
passed += test('rejects newline', () => assert.strictEqual(validateDescription('Line1\nLine2'), false));
passed += test('rejects carriage return', () => assert.strictEqual(validateDescription('Line1\rLine2'), false));
passed += test('empty → false', () => assert.strictEqual(validateDescription(''), false));

// generateExpenseFileName
console.log('\ngenerateExpenseFileName:');
const fn = generateExpenseFileName('receipt.pdf', 'Gary Teh');
passed += test('contains expense prefix', () => assert.ok(fn.startsWith('expense_')));
passed += test('contains contributor', () => assert.ok(fn.includes('gary_teh')));
passed += test('contains filename', () => assert.ok(fn.includes('receipt.pdf') || fn.includes('receipt_pdf')));
passed += test('sanitizes special chars', () => {
    const f = generateExpenseFileName('file (1).pdf', 'Test User');
    assert.ok(!f.includes(' ') && !f.includes('(') && !f.includes(')'));
});

console.log('\n---');
console.log(`Passed: ${passed}, Failed: ${failed}`);
process.exit(failed > 0 ? 1 : 0);
