/**
 * DaoMembersCache — shared session-memoized fetch of dao_members.json.
 *
 * Source: https://raw.githubusercontent.com/TrueSightDAO/treasury-cache/main/dao_members.json
 * Published by tokenomics/google_app_scripts/tdg_identity_management/dao_members_cache_publisher.gs
 * on every EMAIL VERIFICATION activation (sentiment_importer#1028) + daily cron.
 *
 * One in-flight promise is shared across all callers on a page, so multiple
 * DApp components (tdg_balance.js, create_signature.html) fetch the snapshot
 * at most once per page load regardless of how many consumers need it.
 *
 * Exposes:
 *   window.DaoMembersCache.fetchSnapshot()
 *       → Promise<snapshot JSON>.
 *   window.DaoMembersCache.findByPublicKey(pk)
 *       → Promise<{contributor, key, daoTotals, snapshot}>, fields null on miss.
 *   window.DaoMembersCache.invalidate()
 *       → drops the memoized promise; next call refetches.
 *   window.DaoMembersCache.DEFAULT_URL — the raw.githubusercontent.com URL.
 *
 * Callers opt in to the cache; graceful-fallback behaviour (to GAS / Edgar)
 * is each caller's responsibility since the right fallback differs by page.
 */
(function (global) {
  const DEFAULT_URL =
      'https://raw.githubusercontent.com/TrueSightDAO/treasury-cache/main/dao_members.json';

  let cachedPromise = null;
  let cachedUrl = null;

  function resolveUrl() {
    return (global.Routes && global.Routes.daoMembersCache) || DEFAULT_URL;
  }

  function fetchSnapshot() {
    const url = resolveUrl();
    if (cachedPromise && cachedUrl === url) return cachedPromise;
    cachedUrl = url;
    cachedPromise = global.fetch(url, { cache: 'no-cache' }).then(function (resp) {
      if (!resp.ok) {
        cachedPromise = null; // don't pin a bad response for the rest of the session
        throw new Error('dao_members.json HTTP ' + resp.status);
      }
      return resp.json();
    }).catch(function (err) {
      cachedPromise = null;
      throw err;
    });
    return cachedPromise;
  }

  function findByPublicKey(publicKey) {
    return fetchSnapshot().then(function (snapshot) {
      const contributors = (snapshot && snapshot.contributors) || [];
      for (let i = 0; i < contributors.length; i++) {
        const c = contributors[i];
        const keys = (c && c.public_keys) || [];
        for (let j = 0; j < keys.length; j++) {
          if (keys[j] && keys[j].public_key === publicKey) {
            return {
              contributor: c,
              key: keys[j],
              daoTotals: (snapshot && snapshot.dao_totals) || null,
              snapshot: snapshot
            };
          }
        }
      }
      return {
        contributor: null,
        key: null,
        daoTotals: (snapshot && snapshot.dao_totals) || null,
        snapshot: snapshot
      };
    });
  }

  function invalidate() {
    cachedPromise = null;
    cachedUrl = null;
  }

  global.DaoMembersCache = {
    DEFAULT_URL: DEFAULT_URL,
    fetchSnapshot: fetchSnapshot,
    findByPublicKey: findByPublicKey,
    invalidate: invalidate
  };
})(window);
