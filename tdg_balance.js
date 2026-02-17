/**
 * TDG Balance Badge - Global TDG holdings display
 *
 * Shows the user's TDG voting rights and estimated value across all DApp pages
 * once their digital signature is verified. Improves onboarding and context.
 *
 * Usage: Include <script src="./tdg_balance.js"></script> and
 *        <div id="tdgBalanceBadge"></div> on every DApp page (after navDropdown).
 * See DAPP_PAGE_CONVENTIONS.md and UX_CONVENTIONS.md.
 */
(function() {
  const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbygmwRbyqse-dpCYMco0rb93NSgg-Jc1QIw7kUiBM7CZK6jnWnMB5DEjdoX_eCsvVs7/exec';

  function formatRights(n) {
    if (n >= 1000000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
  }

  function formatUsd(n) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function injectStyles() {
    if (document.getElementById('tdg-balance-styles')) return;
    var style = document.createElement('style');
    style.id = 'tdg-balance-styles';
    style.textContent =
      '.tdg-balance-container{max-width:600px;width:100%;margin:0.5rem auto;font-size:0.9rem;min-height:1.4rem;box-sizing:border-box;text-align:center}' +
      '.tdg-balance-container:empty{display:none}' +
      '.tdg-balance-loading{color:#6c757d;font-style:italic}' +
      '.tdg-balance-link{display:block;text-decoration:none;color:inherit;background-color:#f8f9fa;border:1px solid #ddd;border-radius:5px;padding:0.5rem 0.8rem;text-align:center;transition:background-color 0.2s,border-color 0.2s}' +
      '.tdg-balance-link:hover{background-color:#e9ecef;border-color:#adb5bd}' +
      '.tdg-balance-rights{font-weight:600;color:#333}' +
      '.tdg-balance-value{font-weight:600;color:#155724}' +
      '.tdg-balance-sep{color:#6c757d;font-weight:normal;margin:0 0.35em}';
    document.head.appendChild(style);
  }

  function init() {
    injectStyles();
    const container = document.getElementById('tdgBalanceBadge');
    if (!container) return;

    const publicKey = localStorage.getItem('publicKey');
    if (!publicKey) return;

    container.innerHTML = '<span class="tdg-balance-loading" aria-live="polite">Loading your TDG holdings…</span>';
    container.className = 'tdg-balance-container tdg-balance-loading-state';

    fetch(API_ENDPOINT + '?signature=' + encodeURIComponent(publicKey) + '&full=true')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) {
          container.innerHTML = '';
          container.className = 'tdg-balance-container';
          return;
        }
        var votingRights = parseFloat(data.voting_rights);
        var valuePerRight = parseFloat(data.asset_per_circulated_voting_right);
        var totalValue = votingRights * valuePerRight;

        container.innerHTML =
          '<a href="./withdraw_voting_rights.html" class="tdg-balance-link" title="View details and cash out voting rights">' +
          '<span class="tdg-balance-rights">' + formatRights(votingRights) + ' voting rights</span>' +
          '<span class="tdg-balance-sep">·</span>' +
          '<span class="tdg-balance-value">~$' + formatUsd(totalValue) + ' est. cash-out value</span>' +
          '</a>';
        container.className = 'tdg-balance-container tdg-balance-verified';
      })
      .catch(function() {
        container.innerHTML = '';
        container.className = 'tdg-balance-container';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
