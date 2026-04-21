(function (global) {
  // Single source of truth for every remote endpoint the DApp calls.
  // Works in both window (pages) and self (service worker via importScripts).
  // Schemas live in tokenomics/API_ENDPOINTS.md — keep that doc in sync when
  // adding or changing any URL here.
  global.Routes = {
    edgar: {
      base:   'https://edgar.truesight.me',
      ping:   'https://edgar.truesight.me/ping',
      submit: 'https://edgar.truesight.me/dao/submit_contribution',
    },
    gas: {
      assetVerify:      'https://script.google.com/macros/s/AKfycbygmwRbyqse-dpCYMco0rb93NSgg-Jc1QIw7kUiBM7CZK6jnWnMB5DEjdoX_eCsvVs7/exec',
      qrCodes:          'https://script.google.com/macros/s/AKfycbxigq4-J0izShubqIC5k6Z7fgNRyVJLakfQ34HPuENiSpxuCG-wSq0g-wOAedZzzgaL/exec',
      qrCodeGenerator:  'https://script.google.com/macros/s/AKfycbyGD0CDkvjo7K9O1gPnnqmdXvaJt9FM2v39HHqiDud5wwU6Mf41wwIOFS-NDD93xqoL/exec',
      daoForms:         'https://script.google.com/macros/s/AKfycbztpV3TUIRn3ftNW1aGHAKw32OBJrp_p1Pr9mMAttoyWFZyQgBRPU2T6eGhkmJtz7xV/exec',
      proposals:        'https://script.google.com/a/macros/agroverse.shop/s/AKfycbzgNstwRX1dWo17Dxny0t1ipJ6yLX02bTD_cKRuHr5RPJPemNVTj25mFhKo4UmR5Z7BIg/exec',
      feedback:         'https://script.google.com/macros/s/AKfycbz3FQgXLaEc4KNq9fhCCFbf677OIcEMjVq_HjcgttMfCNWk7QWaCeTEq0xc5aRRbduFdg/exec',
      stores:           'https://script.google.com/macros/s/AKfycbwB2zqNV9nMCMWs2hSa8FecjA36Oh-mSVuz3pk8TpXrXcy9dvqOqgbWIirNka2LmacgPw/exec',
      shipping:         'https://script.google.com/macros/s/AKfycbz5Tt_vz1X26i82yqlGUSI_OtCUEO31jImZH2tXfNaxMbfmJ01dkwUIEZDjsnd10xMbcg/exec',
    },
  };
})(typeof self !== 'undefined' ? self : this);
