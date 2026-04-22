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
  // GitHub-raw cache (fast path). Published by the tdg_identity_management GAS
  // project on every EMAIL VERIFICATION + contribution event (tokenomics#236 +
  // sentiment_importer#1028). Shape: {contributors: [{name, voting_rights,
  // asset_per_circulated_voting_right, public_keys: [{public_key, status, ...}]}]}.
  // CDN-served, ~50–150ms TTFB vs 2–5s GAS cold-start.
  const CACHE_URL = (window.Routes && window.Routes.daoMembersCache)
      || 'https://raw.githubusercontent.com/TrueSightDAO/treasury-cache/main/dao_members.json';

  // GAS assetVerify (source of truth; fallback when cache is absent, stale,
  // or the current browser key is too fresh to appear in the last snapshot).
  const API_ENDPOINT = (window.Routes && window.Routes.gas && window.Routes.gas.assetVerify)
      || 'https://script.google.com/macros/s/AKfycbygmwRbyqse-dpCYMco0rb93NSgg-Jc1QIw7kUiBM7CZK6jnWnMB5DEjdoX_eCsvVs7/exec';

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

    // Try the GitHub-raw cache first; fall back to GAS if the cache is
    // unavailable or if this browser's freshly-verified public key hasn't
    // made it into the latest snapshot yet.
    fetchFromCache(publicKey)
      .catch(function() { return fetchFromGas(publicKey); })
      .then(function(data) {
        if (!data || data.error) {
          container.innerHTML = '';
          container.className = 'tdg-balance-container';
          return;
        }
        renderBadge(container, data);
      })
      .catch(function() {
        container.innerHTML = '';
        container.className = 'tdg-balance-container';
      });
  }

  function fetchFromCache(publicKey) {
    return fetch(CACHE_URL, { cache: 'no-cache' })
      .then(function(r) {
        if (!r.ok) throw new Error('cache HTTP ' + r.status);
        return r.json();
      })
      .then(function(snapshot) {
        // DAO-wide ratio used to turn voting_rights into USD. Must live at the
        // snapshot root (it's not per-contributor). If missing, treat the whole
        // cache hit as incomplete and fall back to GAS — keeps the badge honest
        // while the publisher is being upgraded.
        var daoTotals = (snapshot && snapshot.dao_totals) || {};
        var assetPerRight = parseFloat(daoTotals.asset_per_circulated_voting_right);
        if (!isFinite(assetPerRight)) throw new Error('cache missing dao_totals.asset_per_circulated_voting_right');

        var contributors = (snapshot && snapshot.contributors) || [];
        for (var i = 0; i < contributors.length; i++) {
          var c = contributors[i];
          var keys = (c && c.public_keys) || [];
          for (var j = 0; j < keys.length; j++) {
            if (keys[j] && keys[j].public_key === publicKey) {
              return {
                contributor_name: c.name,
                voting_rights: c.voting_rights,
                asset_per_circulated_voting_right: assetPerRight,
                _source: 'github_cache'
              };
            }
          }
        }
        throw new Error('cache miss: public key not found in snapshot');
      });
  }

  function fetchFromGas(publicKey) {
    return fetch(API_ENDPOINT + '?signature=' + encodeURIComponent(publicKey) + '&full=true')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data) data._source = 'gas';
        return data;
      });
  }

  function renderBadge(container, data) {
    var votingRights = parseFloat(data.voting_rights);
    var valuePerRight = parseFloat(data.asset_per_circulated_voting_right);
    if (!isFinite(votingRights) || !isFinite(valuePerRight)) {
      container.innerHTML = '';
      container.className = 'tdg-balance-container';
      return;
    }
    var totalValue = votingRights * valuePerRight;

    container.innerHTML =
      '<a href="./withdraw_voting_rights.html" class="tdg-balance-link" title="View details and cash out voting rights">' +
      '<span class="tdg-balance-rights">' + formatRights(votingRights) + ' voting rights</span>' +
      '<span class="tdg-balance-sep">·</span>' +
      '<span class="tdg-balance-value">~$' + formatUsd(totalValue) + ' est. cash-out value</span>' +
      '</a>';
    container.className = 'tdg-balance-container tdg-balance-verified';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
