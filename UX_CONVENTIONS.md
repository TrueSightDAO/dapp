# TrueSight DAO DApp - UX Conventions

This document outlines UX patterns and conventions used across the TrueSight DAO DApp to ensure consistency and provide clear user feedback.

## Table of Contents
1. [Remote Data Loading Patterns](#remote-data-loading-patterns)
2. [Form Field States](#form-field-states)
3. [Digital Signature Verification](#digital-signature-verification)
4. [Combobox/Searchable Dropdowns](#comboboxsearchable-dropdowns)
5. [Error Handling](#error-handling)

---

## Remote Data Loading Patterns

### Pattern: Loading Remote Values into Form Fields

**When to use:** When form fields need to be populated with data fetched from a remote API (e.g., Google Apps Script, Edgar backend).

**Implementation Requirements:**

1. **Immediate Visual Feedback:**
   - Show loading state **immediately** when user action triggers remote data fetch
   - Apply loading state to all fields that will be populated
   - Use visual indicators (dimmed fields, "Loading..." text) to show fields are being updated

2. **Loading State Indicators:**
   - Fields should be visually dimmed (opacity: 0.6)
   - Fields should be disabled (pointer-events: none) during loading
   - Help text should change to indicate loading: "Loading [data type] details..."
   - Use blue/italic styling for loading messages to differentiate from normal help text

3. **Clear Loading State:**
   - Remove loading indicators once data is successfully loaded
   - Restore original help text after fields are populated
   - Handle errors gracefully with clear error messages

**Example Implementation:**

```javascript
function showFieldLoadingState() {
    // Apply loading class to fields
    field1.classList.add('loading-field');
    field2.classList.add('loading-field');
    
    // Update help text
    helpText1.textContent = 'Loading QR code details...';
    helpText1.className = 'field-loading-message';
}

function clearFieldLoadingState() {
    // Remove loading class
    field1.classList.remove('loading-field');
    field2.classList.remove('loading-field');
    
    // Restore original help text
    helpText1.textContent = 'Original help text';
    helpText1.className = 'help-text';
}

async function loadRemoteData() {
    showFieldLoadingState(); // Show immediately
    
    try {
        const data = await fetch(apiEndpoint);
        // Populate fields with data
        populateFields(data);
        clearFieldLoadingState(); // Clear after success
    } catch (err) {
        clearFieldLoadingState(); // Clear even on error
        showError(err.message);
    }
}
```

**CSS Classes:**

```css
.loading-field {
    opacity: 0.6;
    pointer-events: none;
    position: relative;
}

.loading-field::after {
    content: 'Loading...';
    position: absolute;
    right: 0.8rem;
    top: 50%;
    transform: translateY(-50%);
    color: #007bff;
    font-size: 0.85rem;
    font-style: italic;
}

.field-loading-message {
    font-size: 0.85rem;
    color: #007bff;
    font-style: italic;
    margin-top: 0.25rem;
}
```

**Files Using This Pattern:**
- `update_qr_code.html` - When QR code is selected, loads associated member, status, and email
- `report_inventory_movement.html` - When QR code is scanned, loads item details
- Future modules that populate fields from remote data

**Rationale:**
- Prevents user confusion during network latency
- Clearly indicates which fields are being updated
- Provides immediate feedback that the system is working
- Reduces perceived wait time

---

## Form Field States

### Normal State
- Fields are enabled and interactive
- Help text provides guidance on field usage
- Standard styling (black text, white background)

### Loading State
- Fields are dimmed and disabled
- Help text shows loading message
- Visual "Loading..." indicator

### Error State
- Fields may show error styling (red border)
- Help text shows error message in red
- User can correct and retry

### Success State
- Fields show populated values
- Help text may show current values if applicable
- Fields remain editable for updates

---

## Digital Signature Verification

### Pattern: Signature Verification on Page Load

**When to use:** On pages that require authenticated user actions.

**Implementation:**
1. Show "Verifying your digital signature..." message immediately on page load
2. Check for signature in localStorage
3. If missing, redirect to `create_signature.html` after 2-second countdown
4. If present, verify with backend
5. If verification fails, show error and redirect to create signature
6. If successful, show welcome message and enable form

**Files Using This Pattern:**
- `report_contribution.html`
- `report_inventory_movement.html`
- `update_qr_code.html`
- All authenticated DApp modules

---

## Combobox/Searchable Dropdowns

### Pattern: Searchable Dropdown for Large Lists

**When to use:** When selecting from a large list of items (e.g., QR codes, members, managers).

**Implementation:**
1. Display div shows selected value or placeholder
2. Clicking opens dropdown with search input
3. Typing filters list in real-time
4. Clicking item selects it and closes dropdown
5. Enter key selects first match
6. Escape key closes dropdown
7. Click outside closes dropdown

**Files Using This Pattern:**
- `update_qr_code.html` - QR code selection, member selection
- `report_inventory_movement.html` - Manager selection, item selection, recipient selection

---

## Error Handling

### Pattern: User-Friendly Error Messages

**Guidelines:**
1. Show clear, actionable error messages
2. Use red color for errors (#dc3545)
3. Provide next steps when possible
4. For signature errors, redirect to create signature page
5. For network errors, offer offline alternatives (copy to clipboard)

**Error States:**
- **Signature Missing:** Redirect to create signature (2-second countdown)
- **Signature Invalid:** Show error, redirect to create signature
- **Network Error:** Show error, offer offline submission option
- **Validation Error:** Show inline error near relevant field

---

## Contributing

When adding new modules or features to the DApp:

1. **Follow these conventions** for consistency
2. **Reference this document** when implementing similar patterns
3. **Update this document** if introducing new UX patterns
4. **Test loading states** on slow network connections
5. **Ensure accessibility** - loading states should be screen-reader friendly

---

## Notes

- All loading states should be cleared even if errors occur
- Help text should always be restored to original state after loading
- Visual feedback should be immediate (don't wait for network response)
- Consider mobile users with slow connections when implementing loading states

