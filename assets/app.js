/* ============================================================
   TopRatedVAs.com — shared site shell
   Injects the header, footer, chatbot and language switcher on
   every page so navigation lives in ONE place. Page-specific
   content stays static in each .html file.
   Set <body data-page="home"> etc. to light the active nav item.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- LOGO (shared) ---------- */
  var SEAL = 'assets/img/seal.png';

  /* ---------- HEADER ---------- */
  var HEADER = ''
    + '<div class="demo-strip"><b>BETA</b> — demo data · payments &amp; AI review simulated · independent site — not affiliated with EcomSniper</div>'
    + '<header class="topbar"><div class="wrap">'
    +   '<a class="logo" href="index.html"><img src="' + SEAL + '" alt="TopRatedVAs seal" style="width:38px;height:38px"><span class="wordmark"><span data-i18n="logoA">TopRated</span>VAs<span class="tld">.com</span></span></a>'
    +   '<nav class="navlinks">'
    +     '<a id="nl-browse" href="browse.html" data-i18n="navBrowse">Browse VAs</a>'
    +     '<a id="nl-course" href="course.html" data-i18n="navCourse">Free Course</a>'
    +     '<a id="nl-pricing" href="pricing.html" data-i18n="navPricing">Pricing</a>'
    +     '<a id="nl-test" href="sample-test.html" data-i18n="navTest">Sample Test</a>'
    +   '</nav>'
    +   '<div class="nav-cta">'
    +     '<div class="lang-sel">'
    +       '<button class="lang-btn" type="button" onclick="TRV.toggleLang(event)">🌐 <span id="langLabel">EN</span> ▾</button>'
    +       '<div class="lang-menu" id="langMenu">'
    +         '<button type="button" class="on" onclick="TRV.setLang(\'en\',event)">English</button>'
    +         '<button type="button" onclick="TRV.setLang(\'tl\',event)">Tagalog</button>'
    +         '<button type="button" onclick="TRV.setLang(\'es\',event)">Español</button>'
    +       '</div>'
    +     '</div>'
    +     '<a class="btn btn-outline" href="va-dashboard.html" data-i18n="navVaDash">VA Dashboard</a>'
    +     '<a class="btn btn-navy" href="employer-dashboard.html" data-i18n="navEmpDash">Employer Dashboard</a>'
    +   '</div>'
    + '</div></header>';

  /* ---------- FOOTER ---------- */
  var FOOTER = ''
    + '<footer><div class="wrap">'
    +   '<div>'
    +     '<div class="logo" style="color:#fff;margin-bottom:10px"><img src="' + SEAL + '" alt="TopRatedVAs seal" style="width:38px;height:38px"><span class="wordmark">TopRatedVAs<span class="tld">.com</span></span></div>'
    +     '<p style="max-width:280px">The certification + directory platform for EcomSniper-trained eBay dropshipping VAs. We connect — you hire directly. No middlemen, no salary markups.</p>'
    +   '</div>'
    +   '<div class="cols">'
    +     '<ul><h4>MARKETPLACE</h4><li><a href="browse.html">Browse VAs</a></li><li><a href="pricing.html">Pricing &amp; credits</a></li><li><a href="verify.html">Verify a certificate</a></li><li><a href="trust.html">7-day guarantee</a></li></ul>'
    +     '<ul><h4>FOR VAs</h4><li><a href="course.html">Free course</a></li><li><a href="sample-test.html">Sample exam</a></li><li><a href="va-dashboard.html">Discord community</a></li><li><a href="va-dashboard.html">VA dashboard</a></li></ul>'
    +     '<ul><h4>TRUST</h4><li><a href="trust.html">Trust &amp; Fairness policy</a></li><li><a href="trust.html">Anti-cheating system</a></li><li><a href="terms.html">Terms of Service</a></li><li><a href="privacy.html">Privacy · Refunds</a></li></ul>'
    +   '</div>'
    +   '<div class="fine">© 2026 TopRatedVAs.com — a certification &amp; directory platform, not a staffing agency. VAs are independent professionals; employers hire and pay them directly. EcomSniper is a product of its respective owner; TopRatedVAs is an independent training &amp; marketplace site. · <span class="mono">v1 — demo data; payments &amp; AI review simulated</span></div>'
    + '</div></footer>';

  /* ---------- CHATBOT ---------- */
  var CHAT = ''
    + '<button class="chat-fab" id="chatFab" type="button" onclick="TRV.toggleChat()">💬</button>'
    + '<div class="chat-panel" id="chatPanel">'
    +   '<div class="chat-head"><div class="ct">TopRatedVAs Assistant</div><div class="cs">● Online · answers in EN / TL / ES</div></div>'
    +   '<div class="chat-body" id="chatBody">'
    +     '<div class="cmsg bot">👋 Hi! I’m the TopRatedVAs assistant. I can explain certifications, unlocks, credits, or renewals. What would you like to know?</div>'
    +   '</div>'
    +   '<div class="chat-quick">'
    +     '<button type="button" onclick="TRV.askBot(\'unlock\')">How do unlocks work?</button>'
    +     '<button type="button" onclick="TRV.askBot(\'cert\')">How do I get certified?</button>'
    +     '<button type="button" onclick="TRV.askBot(\'price\')">What does it cost?</button>'
    +     '<button type="button" onclick="TRV.askBot(\'guarantee\')">Is there a guarantee?</button>'
    +   '</div>'
    + '</div>';

  /* ---------- UNLOCK MODAL (contact reveal — simulated in v1) ---------- */
  var MODAL = ''
    + '<div class="modal-bg" id="unlockModal" onclick="if(event.target===this)TRV.closeUnlock()">'
    +   '<div class="modal">'
    +     '<button class="mx" type="button" onclick="TRV.closeUnlock()">✕</button>'
    +     '<h3 id="umTitle">Unlock this VA’s contact info?</h3>'
    +     '<p>One-time $29 (or 1 credit). Full name, WhatsApp, email, résumé, and profile links reveal instantly and stay in your dashboard <b>forever</b>. Covered by the 7-day response guarantee.</p>'
    +     '<div class="revealed" id="umRevealed">'
    +       '<div>👤 <b>[ Full name revealed ]</b></div>'
    +       '<div>📱 WhatsApp: <b>[ verified number ]</b></div>'
    +       '<div>✉️ <b>[ email address ]</b></div>'
    +       '<div>🔗 OnlineJobs.ph · Résumé PDF · Upwork</div>'
    +       '<div style="color:#0A7A5F;font-weight:700;font-size:12.5px;margin-top:4px">✓ Saved to My Unlocked VAs — yours forever</div>'
    +     '</div>'
    +     '<button class="btn btn-amber btn-big" id="umBtn" style="width:100%" onclick="TRV.doUnlock()">Confirm unlock — $29 <span style="font-weight:500;font-size:12px">(demo)</span></button>'
    +     '<div style="font-size:11px;color:var(--ink-soft);text-align:center;margin-top:8px">Payments are simulated in this demo — no charge, and contact fields are placeholders.</div>'
    +   '</div>'
    + '</div>';

  var BOT = {
    unlock: ["How do unlocks work?", "Browse every profile free — scores, videos, reviews, rates. When you find your VA, pay <b>$29</b> (or 1 credit) to reveal their name and contact info. It’s yours <b>forever</b>, saved in your dashboard. Credit packs: 5 for $79 or 15 for $199."],
    cert: ["How do I get certified?", "1) Study the free course. 2) Pay for your exam ($15 first, discounts after). 3) Pass a randomized scenario exam (80+ = Certified, 90+ = Pro, 95+ = Elite). 4) Record your two proof videos. 5) AI review approves you — usually within hours. Your first pass includes 2 months listed free!"],
    price: ["What does it cost?", "<b>VAs:</b> exams $15/$15/$10/$10 (or $45 bundle) — VA Manager exam FREE after all four. Listing: 2 months free, then $5/mo. <b>Employers:</b> browsing free; $29/unlock, $79 for 5 credits, $199 for 15."],
    guarantee: ["Is there a guarantee?", "Yes — if an unlocked VA doesn’t respond within 7 days, you automatically get a free replacement credit. Plus check-in surveys earn you ¼ credit each toward future unlocks."]
  };

  /* ---------- i18n (key marketing strings; extends per page) ---------- */
  var I18N = {
    en: { logoA: "TopRated", navBrowse: "Browse VAs", navCourse: "Free Course", navPricing: "Pricing", navTest: "Sample Test", navVaDash: "VA Dashboard", navEmpDash: "Employer Dashboard",
      heroKicker: "The certified VA marketplace for eBay dropshipping", heroLead: "Every VA here is tested and certified on the EcomSniper Amazon→eBay model — customer service, listing, sniping, ordering — with scores, proof videos, and verified reviews. Browse free. Pay only to unlock contact info.",
      heroCta1: "Browse Certified VAs →", heroCta2: "Become a Certified VA", stat1: "Certified VAs", stat2: "Response rate", stat3: "Avg. VA rating", stat4: "Certifications",
      howKicker: "How it works", howH2: "From browsing to hired in four steps",
      pathEmpH: "I’m a dropshipper — I need help", pathEmpP: "Stop gambling on unvetted hires. Browse VAs whose skills are proven by exams and videos, not promises. Free to browse, forever.", pathEmpCta: "Browse Certified VAs",
      pathVaH: "I’m a VA — I want better clients", pathVaP: "Study the free course, pass the exam, post your proof videos — and get found by employers who pay to reach YOU. From $15, includes 2 months listed.", pathVaCta: "Start My Certification",
      brH1: "Browse certified VAs", brP: "Every profile: real test scores, AI-scored English, proof videos, verified reviews. Contact info unlocks for $29 or 1 credit.",
      heroH1: 'Hire a VA who already <em>knows your business.</em>' },
    tl: { logoA: "TopRated", navBrowse: "Mga VA", navCourse: "Libreng Kurso", navPricing: "Presyo", navTest: "Sample na Exam", navVaDash: "VA Dashboard", navEmpDash: "Employer Dashboard",
      heroKicker: "Ang certified VA marketplace para sa eBay dropshipping", heroLead: "Bawat VA dito ay nasubok at sertipikado sa EcomSniper Amazon→eBay model — customer service, listing, sniping, ordering — may mga score, proof video, at verified na review. Libreng mag-browse. Magbayad lang para i-unlock ang contact info.",
      heroCta1: "Tingnan ang mga Certified VA →", heroCta2: "Maging Certified VA", stat1: "Certified VAs", stat2: "Response rate", stat3: "Avg. rating ng VA", stat4: "Sertipikasyon",
      howKicker: "Paano ito gumagana", howH2: "Mula sa pag-browse hanggang sa pagka-hire sa apat na hakbang",
      pathEmpH: "Dropshipper ako — kailangan ko ng tulong", pathEmpP: "Huwag nang magsugal sa hindi pa nasusubukang hire. Mag-browse ng mga VA na napatunayan ng exam at video ang galing. Libre ang pag-browse, habang-buhay.", pathEmpCta: "Tingnan ang mga Certified VA",
      pathVaH: "VA ako — gusto ko ng mas magagandang kliyente", pathVaP: "Pag-aralan ang libreng kurso, ipasa ang exam, i-post ang proof videos — at hanapin ka ng mga employer na nagbabayad para maabot KA. Simula $15, kasama ang 2 buwang listing.", pathVaCta: "Simulan ang Sertipikasyon",
      brH1: "Mga certified VA", brP: "Bawat profile: totoong test score, AI-scored English, proof video, verified na review. Ang contact info ay nau-unlock sa $29 o 1 credit.",
      heroH1: 'Mag-hire ng VA na <em>alam na ang negosyo mo.</em>' },
    es: { logoA: "TopRated", navBrowse: "Ver VAs", navCourse: "Curso Gratis", navPricing: "Precios", navTest: "Examen de Prueba", navVaDash: "Panel VA", navEmpDash: "Panel Empleador",
      heroKicker: "El marketplace de VAs certificados para dropshipping en eBay", heroLead: "Cada VA aquí está evaluado y certificado en el modelo EcomSniper Amazon→eBay — servicio al cliente, publicación, sniping, pedidos — con puntajes, videos de prueba y reseñas verificadas. Navega gratis. Paga solo para desbloquear el contacto.",
      heroCta1: "Ver VAs Certificados →", heroCta2: "Certifícate como VA", stat1: "VAs certificados", stat2: "Tasa de respuesta", stat3: "Calificación prom.", stat4: "Certificaciones",
      howKicker: "Cómo funciona", howH2: "De navegar a contratar en cuatro pasos",
      pathEmpH: "Soy dropshipper — necesito ayuda", pathEmpP: "Deja de apostar con contrataciones sin verificar. Explora VAs cuyas habilidades están probadas con exámenes y videos. Navegar es gratis, para siempre.", pathEmpCta: "Ver VAs Certificados",
      pathVaH: "Soy VA — quiero mejores clientes", pathVaP: "Estudia el curso gratis, aprueba el examen, sube tus videos — y deja que los empleadores paguen por contactarte a TI. Desde $15, incluye 2 meses publicado.", pathVaCta: "Iniciar Mi Certificación",
      brH1: "VAs certificados", brP: "Cada perfil: puntajes reales, inglés calificado por IA, videos de prueba, reseñas verificadas. El contacto se desbloquea por $29 o 1 crédito.",
      heroH1: 'Contrata un VA que ya <em>conoce tu negocio.</em>' }
  };

  /* ---------- PUBLIC API (window.TRV) ---------- */
  var TRV = {
    toggleChat: function () { document.getElementById('chatPanel').classList.toggle('show'); },
    askBot: function (k) {
      var b = document.getElementById('chatBody');
      b.innerHTML += '<div class="cmsg me">' + BOT[k][0] + '</div>';
      setTimeout(function () { b.innerHTML += '<div class="cmsg bot">' + BOT[k][1] + '</div>'; b.scrollTop = b.scrollHeight; }, 450);
      b.scrollTop = b.scrollHeight;
    },
    toggleLang: function (e) { if (e) e.stopPropagation(); document.getElementById('langMenu').classList.toggle('show'); },
    setLang: function (l, e) {
      if (e) e.stopPropagation();
      var d = I18N[l]; if (!d) return;
      document.querySelectorAll('[data-i18n]').forEach(function (el) { var k = el.getAttribute('data-i18n'); if (d[k]) el.textContent = d[k]; });
      document.querySelectorAll('[data-i18n-html]').forEach(function (el) { var k = el.getAttribute('data-i18n-html'); if (d[k]) el.innerHTML = d[k]; });
      document.getElementById('langLabel').textContent = l.toUpperCase();
      document.getElementById('langMenu').classList.remove('show');
      document.querySelectorAll('#langMenu button').forEach(function (b) { b.classList.remove('on'); });
      if (e && e.target) e.target.classList.add('on');
      try { localStorage.setItem('trv_lang', l); } catch (x) {}
      // let JS-rendered pages (VA dashboard / listing editor) re-translate
      try { window.dispatchEvent(new CustomEvent('trv:lang', { detail: l })); } catch (x) {}
    },
    openUnlock: function (name) {
      var m = document.getElementById('unlockModal'); if (!m) return;
      document.getElementById('umTitle').textContent = 'Unlock ' + (name || 'this VA') + '’s contact info?';
      document.getElementById('umRevealed').classList.remove('show');
      var b = document.getElementById('umBtn');
      b.innerHTML = 'Confirm unlock — $29 <span style="font-weight:500;font-size:12px">(demo)</span>';
      b.classList.remove('btn-teal'); b.classList.add('btn-amber'); b.onclick = TRV.doUnlock;
      m.classList.add('show');
    },
    closeUnlock: function () { var m = document.getElementById('unlockModal'); if (m) m.classList.remove('show'); },
    demoBuy: function (label) {
      alert('Demo checkout — ' + label + '\n\nPayments are simulated in this version, so nothing was charged. In the live product this is a real checkout and the credits would be added to your Employer dashboard.');
    },
    doUnlock: function () {
      document.getElementById('umRevealed').classList.add('show');
      var b = document.getElementById('umBtn');
      b.innerHTML = '✓ Unlocked — saved to your dashboard';
      b.classList.remove('btn-amber'); b.classList.add('btn-teal'); b.onclick = TRV.closeUnlock;
    }
  };
  window.TRV = TRV;

  /* ---------- MOUNT ---------- */
  function mount() {
    document.body.insertAdjacentHTML('afterbegin', HEADER);
    document.body.insertAdjacentHTML('beforeend', FOOTER + CHAT + MODAL);

    // highlight active nav
    var page = document.body.getAttribute('data-page');
    var map = { browse: 'nl-browse', course: 'nl-course', pricing: 'nl-pricing', test: 'nl-test' };
    if (map[page]) { var el = document.getElementById(map[page]); if (el) el.classList.add('on'); }

    // close language menu on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.lang-sel')) { var m = document.getElementById('langMenu'); if (m) m.classList.remove('show'); }
    });

    // restore saved language
    try { var saved = localStorage.getItem('trv_lang'); if (saved && saved !== 'en') TRV.setLang(saved); } catch (x) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
