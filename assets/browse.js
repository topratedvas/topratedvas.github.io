/* ============================================================
   TopRatedVAs.com — Browse page: render + working filters
   Reads window.TRV_VAS (assets/data.js). All client-side.
   ============================================================ */
(function () {
  "use strict";
  var VAS = window.TRV_VAS || [];
  var meta = window.TRV_scoreMeta;
  var badgeFor = { elite: 'b-elite', pro: 'b-pro', cert: 'b-cert' };

  function rateDisplay(v) { return v.hourly != null ? '$' + v.hourly.toFixed(2) + '/hr' : '$' + v.monthly + '/mo'; }
  function rateSub(v) {
    if (v.hourly != null && v.monthly != null) return 'or $' + v.monthly + '/mo full-time';
    if (v.hourly != null) return (v.hours >= 35 ? 'up to ' + v.hours + ' hrs/wk' : v.hours + ' hrs/wk part-time');
    return v.negotiable ? 'full-time · negotiable' : 'full-time';
  }

  function cardHTML(v) {
    var certs = v.certs.map(function (c) {
      var color = typeof c[1] === 'number' ? meta(c[1]).color : '#0A8A70';
      return '<div class="certline"><span class="cl-name">' + c[0] + '</span><span class="cl-score" style="color:' + color + '">' + c[1] + '</span></div>';
    }).join('');
    return '' +
      '<a class="vacard demo" href="profile.html?id=' + v.id + '">' +
        '<div class="top">' +
          '<div class="avatar" style="background:' + v.grad + '">' + v.initials + '</div>' +
          '<div><div class="name">' + v.name + ' <span class="badge ' + badgeFor[v.tier] + '">' + v.tierLabel + '</span></div><div class="loc">' + v.flag + ' ' + v.city + ', ' + v.country + ' · ' + v.tz + '</div></div>' +
        '</div>' +
        '<div><span class="avail ' + v.avail + '">' + v.availLabel + '</span>' + (v.unlocks ? '<span class="unlocked-n">🔥 ' + v.unlocks + '</span>' : '') + '</div>' +
        '<div class="certs">' + certs + '</div>' +
        '<div class="starline"><span class="stars">' + v.stars + '</span> <b>' + v.rating + ' (' + v.reviews + ')</b> verified reviews</div>' +
        '<div class="foot">' +
          '<div class="rate">' + rateDisplay(v) + '<small>' + rateSub(v) + '</small></div>' +
          '<div class="eng">English<br><b>' + v.english + '/10</b></div>' +
        '</div>' +
      '</a>';
  }

  function checkedValues(name) {
    return Array.prototype.slice.call(document.querySelectorAll('input[data-filter="' + name + '"]:checked')).map(function (el) { return el.value; });
  }
  function val(id) { var el = document.getElementById(id); return el ? el.value : 'any'; }

  function passRate(v, sel) {
    if (sel === 'any') return true;
    if (sel === 'h3') return v.hourly != null && v.hourly <= 3;
    if (sel === 'h5') return v.hourly != null && v.hourly <= 5;
    if (sel === 'm600') return v.monthly != null && v.monthly <= 600;
    if (sel === 'm900') return v.monthly != null && v.monthly <= 900;
    return true;
  }
  function passEnglish(v, sel) {
    if (sel === 'any') return true;
    return v.english >= parseInt(sel, 10);
  }
  function passHours(v, sel) {
    if (sel === 'any') return true;
    if (sel === 'full') return v.hours >= 35;
    if (sel === 'mid') return v.hours >= 20 && v.hours < 35;
    if (sel === 'low') return v.hours >= 10 && v.hours < 20;
    return true;
  }

  function apply() {
    var certs = checkedValues('cert'), levels = checkedValues('level'),
        hires = checkedValues('hire'), avails = checkedValues('avail');
    var rate = val('fRate'), eng = val('fEnglish'), hours = val('fHours'), sort = val('fSort');

    var out = VAS.filter(function (v) {
      if (certs.length && !v.certs.some(function (c) { return certs.indexOf(c[0]) !== -1; })) return false;
      if (levels.length && levels.indexOf(v.tier) === -1) return false;
      if (hires.length && !hires.some(function (h) { return v.hireTypes.indexOf(h) !== -1; })) return false;
      if (avails.length && avails.indexOf(v.avail) === -1) return false;
      if (!passRate(v, rate)) return false;
      if (!passEnglish(v, eng)) return false;
      if (!passHours(v, hours)) return false;
      return true;
    });

    var maxScore = function (v) { return Math.max.apply(null, v.certs.map(function (c) { return typeof c[1] === 'number' ? c[1] : 0; })); };
    var minRate = function (v) { return v.hourly != null ? v.hourly : (v.monthly / 160); };
    if (sort === 'score') out.sort(function (a, b) { return maxScore(b) - maxScore(a); });
    else if (sort === 'rate') out.sort(function (a, b) { return minRate(a) - minRate(b); });
    else if (sort === 'reviews') out.sort(function (a, b) { return b.reviews - a.reviews; });

    var grid = document.getElementById('vaGrid');
    if (out.length) grid.innerHTML = out.map(cardHTML).join('');
    else grid.innerHTML = '<div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--ink-soft)">No VAs match these filters. Try clearing a few.</div>';

    var nowCount = out.filter(function (v) { return v.avail === 'av-now'; }).length;
    var cEl = document.getElementById('vaCount'); if (cEl) cEl.textContent = out.length;
    var nEl = document.getElementById('vaNow'); if (nEl) nEl.textContent = nowCount + ' available now';
  }

  function init() {
    if (!document.getElementById('vaGrid')) return;
    document.querySelectorAll('.frail input, .frail select, #fSort').forEach(function (el) {
      el.addEventListener('change', apply);
    });
    apply();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
