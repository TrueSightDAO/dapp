/**
 * Expense form utility functions - isomorphic (browser + Node).
 * Used by report_dao_expenses.html and tested in tests/expense-form-utils.test.js
 */
(function (global) {
    'use strict';

    function normalizeLedgerName(ledgerName) {
        if (!ledgerName) return '';
        return ledgerName.toLowerCase().replace(/[\s\-_]/g, '');
    }

    function extractLedgerFromResource(resourceValue) {
        if (!resourceValue) return null;
        const match = String(resourceValue).match(/^\[([^\]]+)\]\s*(.+)$/);
        return match ? match[1] : null;
    }

    function extractCleanCurrency(resourceValue) {
        if (!resourceValue) return '';
        const match = String(resourceValue).match(/^\[([^\]]+)\]\s*(.+)$/);
        return match ? match[2].trim() : String(resourceValue).trim();
    }

    /**
     * Builds submit payload: resourceName (clean currency) and targetLedger.
     * @param {string} rawResourceValue - e.g. "[AGL15] USD" or "USD"
     * @param {string} ledgerValue - Explicit ledger from dropdown
     * @returns {{ resourceName: string, targetLedger: string }}
     */
    function buildSubmitPayload(rawResourceValue, ledgerValue) {
        const resourceName = extractCleanCurrency(rawResourceValue);
        const targetLedger = (ledgerValue && String(ledgerValue).toLowerCase() !== 'offchain')
            ? ledgerValue
            : (extractLedgerFromResource(rawResourceValue) || 'offchain');
        return { resourceName, targetLedger };
    }

    function validateDescription(description) {
        if (!description) return false;
        return !/[\n\r]/.test(description);
    }

    function generateExpenseFileName(originalFileName, contributorName) {
        const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
        const cleanContributorName = (contributorName || '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const cleanFileName = (originalFileName || '').replace(/[^a-zA-Z0-9.]/g, '_').toLowerCase();
        return `expense_${timestamp}_${cleanContributorName}_${cleanFileName}`;
    }

    var utils = {
        normalizeLedgerName: normalizeLedgerName,
        extractLedgerFromResource: extractLedgerFromResource,
        extractCleanCurrency: extractCleanCurrency,
        buildSubmitPayload: buildSubmitPayload,
        validateDescription: validateDescription,
        generateExpenseFileName: generateExpenseFileName
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = utils;
    } else {
        global.expenseFormUtils = utils;
    }
})(typeof window !== 'undefined' ? window : globalThis);
