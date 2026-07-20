/* ============================================================
   TopRatedVAs.com — Sample exam interactivity (demo)
   Option select + live answer-speed bar. The full randomized
   20-of-30 engine (shuffled Q + A order) arrives in Phase 6.
   ============================================================ */
(function () {
  "use strict";

  window.pickOpt = function (el) {
    document.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('sel'); });
    el.classList.add('sel');
  };

  var tSec = 12;
  function tick() {
    var t = document.getElementById('qTimer'); if (!t) return;
    tSec++;
    t.textContent = '⏱ ' + Math.floor(tSec / 60) + ':' + String(tSec % 60).padStart(2, '0') + ' elapsed';
    var bar = document.getElementById('speedBar'), lab = document.getElementById('speedLabel');
    if (!bar || !lab) return;
    bar.style.width = Math.min(100, tSec / 120 * 100) + '%';
    if (tSec < 60) { bar.style.background = '#0FB893'; lab.textContent = 'Full marks zone'; lab.style.color = '#0A8A70'; }
    else if (tSec < 90) { bar.style.background = '#FFAA2B'; lab.textContent = 'Minor time penalty'; lab.style.color = '#B5722A'; }
    else { bar.style.background = '#E25555'; lab.textContent = 'Points reducing…'; lab.style.color = '#B03A3A'; }
  }

  function init() { if (document.getElementById('qTimer')) setInterval(tick, 1000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
