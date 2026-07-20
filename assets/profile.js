/* ============================================================
   TopRatedVAs.com — VA Profile page
   Reads ?id= from the URL, renders that VA from window.TRV_VAS.
   Contact info stays locked (unlock is simulated in v1).
   ============================================================ */
(function () {
  "use strict";
  var VAS = window.TRV_VAS || [];
  var meta = window.TRV_scoreMeta;
  var badgeFor = { elite: 'b-elite', pro: 'b-pro', cert: 'b-cert' };

  function param(k) { return new URLSearchParams(location.search).get(k); }
  function set(id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; }

  function render(v) {
    document.title = v.name + ' — Certified VA · TopRatedVAs.com';

    var av = document.getElementById('pAvatar');
    if (av) { av.textContent = v.initials; av.style.background = v.grad; }

    set('pName', v.name + ' <span class="badge ' + badgeFor[v.tier] + '">' + v.tierLabel + '</span>');
    set('pLoc', v.flag + ' ' + v.city + ', ' + v.country + ' · ' + v.tz + ' · Last confirmed available: 2026-07-18');

    var badges = '<span class="avail ' + v.avail + '">' + v.availLabel + '</span>' +
      '<span class="badge b-cert">✓ Verified WhatsApp</span>' +
      '<span class="badge b-cert">✓ Discord member</span>' +
      (v.unlocks ? '<span class="badge b-elite">Unlocked by ' + v.unlocks.replace(' unlocks', '') + ' employers this month</span>' : '');
    set('pBadges', badges);

    var rate = v.hourly != null ? '$' + v.hourly.toFixed(2) + '/hr' : '$' + v.monthly + '/mo';
    var rateSmall = v.hourly != null && v.monthly != null ? 'or $' + v.monthly + '/mo full-time'
      : (v.hourly != null ? 'up to ' + v.hours + ' hrs/wk' : 'full-time');
    set('pRate', rate + ' <small>' + rateSmall + '</small>');
    set('pNeg', (v.negotiable ? 'Rate negotiable · ' : 'Rate fixed · ') + 'up to ' + v.hours + ' hrs/wk' + (v.negotiable ? ' · overtime OK' : ''));

    // scores
    var rows = v.certs.map(function (c) {
      var isNum = typeof c[1] === 'number';
      var color = isNum ? meta(c[1]).color : '#0A8A70';
      var w = isNum ? c[1] : 100;
      return '<div class="score-row"><div><div class="rname">' + c[0] + '</div><div class="rdate">' +
        (isNum ? '20 randomized scenario questions' : 'All four specialist exams passed') +
        '</div></div><div class="meter"><i style="width:' + w + '%;background:' + color + '"></i></div>' +
        '<div class="sc" style="color:' + color + '">' + c[1] + '</div></div>';
    }).join('');
    rows += '<div class="score-row"><div><div class="rname">English proficiency <span class="badge b-cert">AI-scored</span></div>' +
      '<div class="rdate">From summary video · clarity, grammar, fluency</div></div>' +
      '<div class="meter"><i style="width:' + (v.english * 10) + '%;background:#0FB893"></i></div>' +
      '<div class="sc" style="color:#0A8A70">' + v.english + '</div></div>';
    rows += '<div class="score-row"><div><div class="rname">Answer speed rating</div>' +
      '<div class="rdate">Average time per exam question</div></div>' +
      '<div class="meter"><i style="width:88%;background:#0FB893"></i></div>' +
      '<div class="sc" style="color:#0A8A70">' + v.answerSpeed + '</div></div>';
    set('pScores', rows);

    // quick facts
    var hireTxt = v.hireTypes.map(function (h) { return h === 'hourly' ? 'Hourly' : 'Monthly'; }).join(' or ');
    set('pFacts',
      '<li><span class="k">Hire types</span><span class="v">' + hireTxt + '</span></li>' +
      '<li><span class="k">Hours available</span><span class="v">Up to ' + v.hours + ' / week</span></li>' +
      '<li><span class="k">Timezone</span><span class="v">' + v.tz + '</span></li>' +
      '<li><span class="k">Experience</span><span class="v">eBay dropshipping</span></li>' +
      '<li><span class="k">Heartbeat status</span><span class="v" style="color:#0A7A5F">Confirmed 2026-07-18</span></li>' +
      '<li><span class="k">Certificate</span><span class="v mono">verify/' + v.cert + '</span></li>');

    set('pBio', v.bio);

    // wire unlock buttons to this VA's name
    document.querySelectorAll('[data-unlock]').forEach(function (b) {
      b.onclick = function () { window.TRV.openUnlock(v.name); };
    });
  }

  function init() {
    if (!document.getElementById('pName')) return;
    var id = param('id');
    var v = VAS.filter(function (x) { return x.id === id; })[0] || VAS[0];
    if (v) render(v);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
