/* ============================================================
   TopRatedVAs.com — public certificate verification
   Reads ?cert=TR-1042, shows certification STATUS ONLY.
   Never exposes contact info. Reads window.TRV_VAS.
   ============================================================ */
(function () {
  "use strict";
  var VAS = window.TRV_VAS || [];
  function param(k) { return new URLSearchParams(location.search).get(k); }
  function norm(s) { return (s || '').trim().toUpperCase().replace(/^TR[-\s]?/, ''); }

  window.TRV_verifyGo = function () {
    var el = document.getElementById('vInput'); if (!el) return;
    var val = el.value.trim(); if (!val) return;
    location.href = 'verify.html?cert=' + encodeURIComponent(val);
  };

  function render() {
    var box = document.getElementById('verifyResult'); if (!box) return;
    var q = param('cert');
    var input = document.getElementById('vInput');
    if (input && q) input.value = q;
    if (!q) { box.innerHTML = ''; return; }

    var qn = norm(q);
    var va = VAS.filter(function (x) { return norm(x.cert) === qn; })[0];

    if (!va) {
      box.innerHTML = '<div class="verify-card"><span class="verify-status bad">✕ Not found</span>' +
        '<h2 style="margin-top:16px">No certification matches “' + q + '”</h2>' +
        '<p class="muted">Check the ID — it looks like <b>TR-1042</b> — and try again. A certificate ID appears on each VA’s profile under “Quick facts.”</p></div>';
      return;
    }

    var certs = va.certs.filter(function (c) { return typeof c[1] === 'number'; }).map(function (c) {
      var m = window.TRV_scoreMeta(c[1]);
      return '<div class="certline"><span class="cl-name">' + c[0] + '</span><span class="cl-score" style="color:' + m.color + '">' + c[1] + ' · ' + m.label + '</span></div>';
    }).join('');

    box.innerHTML = '<div class="verify-card">' +
      '<span class="verify-status">✓ Active certification</span>' +
      '<div class="avatar" style="width:66px;height:66px;border-radius:18px;margin:18px auto 10px;font-size:24px;background:' + va.grad + '">' + va.initials + '</div>' +
      '<h2 style="margin:0">' + va.name + '</h2>' +
      '<p class="muted">' + va.flag + ' ' + va.country + ' · Certificate ' + va.cert + '</p>' +
      '<div class="certs" style="margin:18px 0;text-align:left">' + certs + '</div>' +
      '<p class="muted">Certified on the EcomSniper Amazon→eBay model via TopRatedVAs.com. This page confirms certification status only — no contact information is shown here.</p>' +
      '</div>';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
