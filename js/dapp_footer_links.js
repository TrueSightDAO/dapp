/**
 * Shared footer: "Reload Latest Version" (?reload=) and "View Source Code" (GitHub blob for this page).
 * Idempotent: safe if included twice. Inserts before </body> end (appends to body).
 */
(function () {
  'use strict';

  var MARKER_ID = 'dapp-footer-links';

  function insertFooter() {
    if (document.getElementById(MARKER_ID)) {
      return;
    }
    var wrap = document.createElement('div');
    wrap.id = MARKER_ID;
    wrap.style.textAlign = 'center';
    wrap.style.marginTop = '1rem';
    wrap.style.marginBottom = '0.5rem';
    wrap.setAttribute('aria-label', 'Page utilities');

    var line1 = document.createElement('div');
    line1.style.marginTop = '0.25rem';
    var reloadA = document.createElement('a');
    try {
      var u = new URL(window.location.href);
      u.searchParams.set('reload', 'true');
      reloadA.href = u.toString();
    } catch (e) {
      reloadA.href = window.location.pathname + '?reload=true';
    }
    reloadA.textContent = 'Reload Latest Version';
    reloadA.style.fontSize = '0.8rem';
    reloadA.style.color = '#007bff';
    reloadA.style.textDecoration = 'none';
    line1.appendChild(reloadA);

    var line2 = document.createElement('div');
    line2.style.marginTop = '0.35rem';
    var page = (window.location.pathname.split('/').pop() || 'index.html').split('?')[0] || 'index.html';
    if (!page || page === '') page = 'index.html';
    var srcA = document.createElement('a');
    srcA.href = 'https://github.com/TrueSightDAO/dapp/blob/main/' + encodeURIComponent(page);
    srcA.textContent = 'View Source Code';
    srcA.target = '_blank';
    srcA.rel = 'noopener noreferrer';
    srcA.style.fontSize = '0.8rem';
    srcA.style.color = '#007bff';
    srcA.style.textDecoration = 'none';
    line2.appendChild(srcA);

    wrap.appendChild(line1);
    wrap.appendChild(line2);
    document.body.appendChild(wrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertFooter);
  } else {
    insertFooter();
  }
})();
