/* ============================================================
   TopRatedVAs.com — VA dashboard + listing editor (Phase 6B)
   Goal: dead-simple for VAs worldwide, in EN / Tagalog / Español.
   Patterns borrowed from Fiverr / Upwork / OnlineJobs.ph:
     • a profile-completion meter + "steps to go live" checklist
     • one big, obvious status (Draft / Live / Hidden)
     • plain language, short labels, icons, mobile-first
     • a clear availability control + a 30-day "still available" check-in
   All writes go to the VA's OWN docs (owner-writable — no rules change):
     users/{uid}                     ← name, role, testAttempts
     vaProfiles/{uid}                ← public listing (Browse reads this)
     vaProfiles/{uid}/private/contact← ghosted contact (revealed on unlock)
   Loaded as a module with auth.js (guards VA-only + single session),
   data.js (TRV_scoreMeta) and questions.js (TRV_CERTS).
   ============================================================ */
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth, db } from "./firebase.js";

const PASS = 80;
const SESSION_KEY = "trv_session";
const scoreMeta = window.TRV_scoreMeta;

/* ---------- reference data ---------- */
const COUNTRIES = [
  { name: "Philippines", flag: "🇵🇭", tz: "GMT+8" }, { name: "India", flag: "🇮🇳", tz: "GMT+5:30" },
  { name: "Pakistan", flag: "🇵🇰", tz: "GMT+5" }, { name: "Bangladesh", flag: "🇧🇩", tz: "GMT+6" },
  { name: "Indonesia", flag: "🇮🇩", tz: "GMT+7" }, { name: "Vietnam", flag: "🇻🇳", tz: "GMT+7" },
  { name: "Kenya", flag: "🇰🇪", tz: "GMT+3" }, { name: "Nigeria", flag: "🇳🇬", tz: "GMT+1" },
  { name: "Ghana", flag: "🇬🇭", tz: "GMT+0" }, { name: "Egypt", flag: "🇪🇬", tz: "GMT+2" },
  { name: "Morocco", flag: "🇲🇦", tz: "GMT+1" }, { name: "South Africa", flag: "🇿🇦", tz: "GMT+2" },
  { name: "Venezuela", flag: "🇻🇪", tz: "GMT-4" }, { name: "Colombia", flag: "🇨🇴", tz: "GMT-5" },
  { name: "Mexico", flag: "🇲🇽", tz: "GMT-6" }, { name: "Brazil", flag: "🇧🇷", tz: "GMT-3" },
  { name: "Argentina", flag: "🇦🇷", tz: "GMT-3" }, { name: "Serbia", flag: "🇷🇸", tz: "GMT+2" },
  { name: "Ukraine", flag: "🇺🇦", tz: "GMT+3" }, { name: "Other", flag: "🌐", tz: "GMT+0" }
];
const TZS = ["GMT-8","GMT-7","GMT-6","GMT-5","GMT-4","GMT-3","GMT-1","GMT+0","GMT+1","GMT+2","GMT+3","GMT+5","GMT+5:30","GMT+6","GMT+7","GMT+8","GMT+9"];
const GRADS = [
  "linear-gradient(135deg,#0FB893,#0A6E5A)","linear-gradient(135deg,#3E7FE8,#1E4FA8)",
  "linear-gradient(135deg,#C9962E,#8F6A1D)","linear-gradient(135deg,#8E6BC9,#5F4FA8)",
  "linear-gradient(135deg,#E25555,#A83232)","linear-gradient(135deg,#0A8A70,#86B817)"
];
const AVAILS = [
  { av: "av-now", label: "Available now" },
  { av: "av-open", label: "Open to offers" },
  { av: "av-hired", label: "Hired 🎉" }
];

/* ============================================================
   i18n — EN / Tagalog / Español
   ============================================================ */
const STR = {
  en: {
    accountVA: "VA Account", overview: "Overview", certs: "My Certifications", takeTest: "Take a Test",
    listing: "My Listing", videos: "My Videos", reviews: "My Reviews", discord: "Discord", logout: "Log out",
    loading: "Loading your dashboard…",
    welcome: "Welcome back, {0} 👋",
    liveT: "Your profile is LIVE 🎉", liveS: "Employers can find and unlock you on Browse.",
    draftT: "Your profile is not live yet", draftS: "Finish the steps below to appear on Browse.",
    hiddenT: "Your listing is hidden", hiddenS: "Employers can't see you right now. Show it again anytime.",
    stepsTitle: "Steps to go live", stepsDone: "{0} of {1} done",
    stCertT: "Pass at least one exam", stCertS: "Earn a badge (80+) to start your profile.",
    stLocT: "Add your country & timezone", stLocS: "So employers in your hours can find you.",
    stRateT: "Set your rate", stRateS: "Hourly or monthly, and how you want to be hired.",
    stBioT: "Write a short bio", stBioS: "2–3 sentences about your experience.",
    stContactT: "Add your contact details", stContactS: "Hidden until an employer unlocks you.",
    stVideoT: "Add your proof videos", stVideoS: "Optional now — coming in the next step.",
    goTake: "Take an exam", goEdit: "Add details", goContact: "Add contact", goVideos: "Later",
    goLive: "🚀 Go live now", goLiveHint: "All required steps are done — publish your profile!",
    viewPublic: "👁 View my public profile", editListing: "✏️ Edit my listing",
    hide: "Hide my listing", show: "Show my listing again",
    availTitle: "Your availability", availHelp: "Tap to change what employers see on your card.",
    now: "Available now", open: "Open to offers", hired: "Hired 🎉",
    hbTitle: "Availability check-in", hbBody: "Every 30 days, confirm you're still available so you stay listed.",
    hbBtn: "✅ Yes, I'm still available", hbConfirmed: "Last confirmed: {0}", hbNever: "Not confirmed yet",
    certsTitle: "My certifications", thCert: "Certification", thScore: "Score", thLevel: "Level", thStatus: "Status", thAction: "",
    onProfile: "On your profile", passed: "Passed", notPassed: "Not passed yet", notTaken: "Not taken",
    mgrLock: "🔒 Pass all 4 first", take: "Take exam", retake: "Retake", freeRetake: "Free retake",
    videosTitle: "My proof videos",
    videosBody: "Two short videos prove your skills and identity: a work video against an assigned checklist, and a summary video explaining the model. This step is being built next (Phase 6C).",
    videosSoon: "Coming next",
    reviewsTitle: "My reviews", reviewsEmpty: "No reviews yet. Employers can review you after they unlock and work with you.",
    discordTitle: "Community", discordBody: "Join the TopRatedVAs Discord for peer training and support — hyper-focused on EcomSniper Amazon→eBay work.", discordBtn: "Open Discord",
    renewTitle: "Listing & renewal", renewLive: "Your first passed exam includes 2 months listed free, then $5/month to stay listed (simulated in this demo).",
    /* listing editor */
    editTitle: "Edit your listing", editSub: "This is what employers see on Browse. Keep it clear and honest.",
    back: "← Back to dashboard",
    fgBasics: "Your basics", fgBasicsSub: "Your name, where you are, and your card color.",
    lName: "Display name", hName: "First name + last initial, e.g. \"Maria D.\"",
    lCountry: "Country", lCity: "City (optional)", lTz: "Timezone", lColor: "Card color",
    fgRates: "Your rates & hours", fgRatesSub: "Employers filter by these before they unlock you — be realistic.",
    lHire: "How do you want to be hired?", hHourly: "Hourly", hMonthly: "Monthly / full-time",
    lHourly: "Hourly rate (USD)", lMonthly: "Monthly rate (USD)", lHours: "Hours per week", lNeg: "Is your rate negotiable?",
    yes: "Yes", no: "No", perHr: "/hr", perMo: "/mo",
    fgBio: "About you", fgBioSub: "A short, friendly summary of your experience.",
    lBio: "Short bio", hBio: "Example: \"3 years of eBay customer service. Fast, friendly replies and dropship-safe handling of returns and cases.\"",
    fgContact: "Contact details", fgContactSub: "🔒 Hidden from employers until they pay to unlock you. Never shown on Browse.",
    lFull: "Full name", lWhats: "WhatsApp number", lTele: "Telegram username", lEmail: "Email", lLinks: "Profile links", hLinks: "Separate with commas — e.g. OnlineJobs.ph, Upwork, Résumé PDF",
    save: "Save changes", saving: "Saving…", saved: "Saved ✓", saveErr: "Couldn't save — please try again.",
    needLive: "needed to go live", optional: "optional",
    req: "Required", selCountry: "Select your country"
  },
  tl: {
    accountVA: "VA Account", overview: "Overview", certs: "Mga Certification", takeTest: "Mag-Exam",
    listing: "Aking Listing", videos: "Mga Video", reviews: "Mga Review", discord: "Discord", logout: "Mag-logout",
    loading: "Nilo-load ang iyong dashboard…",
    welcome: "Maligayang pagbabalik, {0} 👋",
    liveT: "LIVE na ang iyong profile 🎉", liveS: "Makikita at ma-a-unlock ka na ng mga employer sa Browse.",
    draftT: "Hindi pa live ang iyong profile", draftS: "Tapusin ang mga hakbang sa ibaba para lumabas sa Browse.",
    hiddenT: "Nakatago ang iyong listing", hiddenS: "Hindi ka nakikita ng mga employer ngayon. Puwede mong ipakita ulit anumang oras.",
    stepsTitle: "Mga hakbang para mag-live", stepsDone: "{0} sa {1} tapos na",
    stCertT: "Pumasa sa kahit isang exam", stCertS: "Kumita ng badge (80+) para masimulan ang profile.",
    stLocT: "Ilagay ang bansa at timezone", stLocS: "Para mahanap ka ng employer sa iyong oras.",
    stRateT: "Itakda ang iyong rate", stRateS: "Hourly o monthly, at paano ka gustong ma-hire.",
    stBioT: "Sumulat ng maikling bio", stBioS: "2–3 pangungusap tungkol sa iyong karanasan.",
    stContactT: "Idagdag ang contact details", stContactS: "Nakatago hangga't hindi ka na-unlock ng employer.",
    stVideoT: "Idagdag ang proof videos", stVideoS: "Opsyonal muna — darating sa susunod na hakbang.",
    goTake: "Mag-exam", goEdit: "Magdagdag", goContact: "Contact", goVideos: "Mamaya",
    goLive: "🚀 Mag-live na", goLiveHint: "Tapos na lahat ng kailangan — i-publish ang profile!",
    viewPublic: "👁 Tingnan ang public profile ko", editListing: "✏️ I-edit ang listing ko",
    hide: "Itago ang listing ko", show: "Ipakita ulit ang listing ko",
    availTitle: "Iyong availability", availHelp: "I-tap para palitan ang nakikita ng employer sa card mo.",
    now: "Available ngayon", open: "Open sa offer", hired: "Na-hire 🎉",
    hbTitle: "Availability check-in", hbBody: "Kada 30 araw, kumpirmahin na available ka pa para manatiling nakalista.",
    hbBtn: "✅ Oo, available pa ako", hbConfirmed: "Huling kumpirma: {0}", hbNever: "Wala pang kumpirmasyon",
    certsTitle: "Mga certification ko", thCert: "Certification", thScore: "Score", thLevel: "Antas", thStatus: "Status", thAction: "",
    onProfile: "Nasa profile mo", passed: "Pasado", notPassed: "Hindi pa pasado", notTaken: "Hindi pa kinuha",
    mgrLock: "🔒 Pasahin muna ang 4", take: "Mag-exam", retake: "Ulitin", freeRetake: "Libreng ulit",
    videosTitle: "Aking proof videos",
    videosBody: "Dalawang maikling video ang magpapatunay ng skill at pagkakakilanlan mo: isang work video ayon sa checklist, at summary video na nagpapaliwanag ng modelo. Ginagawa pa ito sa susunod na hakbang (Phase 6C).",
    videosSoon: "Susunod na",
    reviewsTitle: "Mga review ko", reviewsEmpty: "Wala pang review. Puwede kang i-review ng employer pagkatapos ka nilang i-unlock at makatrabaho.",
    discordTitle: "Komunidad", discordBody: "Sumali sa TopRatedVAs Discord para sa peer training at suporta — nakatuon sa EcomSniper Amazon→eBay.", discordBtn: "Buksan ang Discord",
    renewTitle: "Listing at renewal", renewLive: "Ang unang pasadong exam ay may kasamang 2 buwang libreng listing, tapos $5/buwan para manatiling nakalista (simulated sa demo na ito).",
    editTitle: "I-edit ang listing mo", editSub: "Ito ang nakikita ng employer sa Browse. Panatilihing malinaw at totoo.",
    back: "← Bumalik sa dashboard",
    fgBasics: "Mga batayan", fgBasicsSub: "Pangalan mo, lokasyon, at kulay ng card.",
    lName: "Display name", hName: "Unang pangalan + inisyal ng apelyido, hal. \"Maria D.\"",
    lCountry: "Bansa", lCity: "Lungsod (opsyonal)", lTz: "Timezone", lColor: "Kulay ng card",
    fgRates: "Rate at oras", fgRatesSub: "Fina-filter ito ng employer bago ka i-unlock — maging realistiko.",
    lHire: "Paano ka gustong ma-hire?", hHourly: "Hourly", hMonthly: "Monthly / full-time",
    lHourly: "Hourly rate (USD)", lMonthly: "Monthly rate (USD)", lHours: "Oras bawat linggo", lNeg: "Negotiable ba ang rate mo?",
    yes: "Oo", no: "Hindi", perHr: "/oras", perMo: "/buwan",
    fgBio: "Tungkol sa iyo", fgBioSub: "Maikli at magiliw na buod ng karanasan mo.",
    lBio: "Maikling bio", hBio: "Halimbawa: \"3 taon sa eBay customer service. Mabilis, magalang, at dropship-safe sa returns at cases.\"",
    fgContact: "Contact details", fgContactSub: "🔒 Nakatago sa employer hangga't hindi ka na-unlock. Hindi lumalabas sa Browse.",
    lFull: "Buong pangalan", lWhats: "WhatsApp number", lTele: "Telegram username", lEmail: "Email", lLinks: "Mga profile link", hLinks: "Paghiwalayin ng comma — hal. OnlineJobs.ph, Upwork, Résumé PDF",
    save: "I-save ang pagbabago", saving: "Sina-save…", saved: "Na-save ✓", saveErr: "Hindi na-save — subukan ulit.",
    needLive: "kailangan para mag-live", optional: "opsyonal",
    req: "Kailangan", selCountry: "Piliin ang bansa mo"
  },
  es: {
    accountVA: "Cuenta VA", overview: "Resumen", certs: "Mis Certificaciones", takeTest: "Hacer Examen",
    listing: "Mi Perfil", videos: "Mis Videos", reviews: "Mis Reseñas", discord: "Discord", logout: "Cerrar sesión",
    loading: "Cargando tu panel…",
    welcome: "Bienvenido de nuevo, {0} 👋",
    liveT: "Tu perfil está PUBLICADO 🎉", liveS: "Los empleadores pueden encontrarte y desbloquearte en Explorar.",
    draftT: "Tu perfil aún no está publicado", draftS: "Completa los pasos de abajo para aparecer en Explorar.",
    hiddenT: "Tu perfil está oculto", hiddenS: "Los empleadores no pueden verte ahora. Puedes mostrarlo de nuevo cuando quieras.",
    stepsTitle: "Pasos para publicar", stepsDone: "{0} de {1} listos",
    stCertT: "Aprueba al menos un examen", stCertS: "Gana una insignia (80+) para iniciar tu perfil.",
    stLocT: "Agrega tu país y zona horaria", stLocS: "Para que te encuentren en tu horario.",
    stRateT: "Define tu tarifa", stRateS: "Por hora o mensual, y cómo quieres ser contratado.",
    stBioT: "Escribe una breve biografía", stBioS: "2–3 frases sobre tu experiencia.",
    stContactT: "Agrega tus datos de contacto", stContactS: "Ocultos hasta que un empleador te desbloquee.",
    stVideoT: "Agrega tus videos de prueba", stVideoS: "Opcional por ahora — llega en el próximo paso.",
    goTake: "Hacer examen", goEdit: "Agregar datos", goContact: "Contacto", goVideos: "Después",
    goLive: "🚀 Publicar ahora", goLiveHint: "Todos los pasos requeridos están listos — ¡publica tu perfil!",
    viewPublic: "👁 Ver mi perfil público", editListing: "✏️ Editar mi perfil",
    hide: "Ocultar mi perfil", show: "Mostrar mi perfil de nuevo",
    availTitle: "Tu disponibilidad", availHelp: "Toca para cambiar lo que ven los empleadores en tu tarjeta.",
    now: "Disponible ahora", open: "Abierto a ofertas", hired: "Contratado 🎉",
    hbTitle: "Confirmación de disponibilidad", hbBody: "Cada 30 días, confirma que sigues disponible para seguir listado.",
    hbBtn: "✅ Sí, sigo disponible", hbConfirmed: "Última confirmación: {0}", hbNever: "Aún sin confirmar",
    certsTitle: "Mis certificaciones", thCert: "Certificación", thScore: "Puntaje", thLevel: "Nivel", thStatus: "Estado", thAction: "",
    onProfile: "En tu perfil", passed: "Aprobado", notPassed: "Aún no aprobado", notTaken: "No realizado",
    mgrLock: "🔒 Aprueba los 4 primero", take: "Hacer examen", retake: "Repetir", freeRetake: "Repetir gratis",
    videosTitle: "Mis videos de prueba",
    videosBody: "Dos videos cortos prueban tus habilidades e identidad: un video de trabajo según una lista asignada, y un video resumen explicando el modelo. Este paso se está construyendo a continuación (Fase 6C).",
    videosSoon: "Próximamente",
    reviewsTitle: "Mis reseñas", reviewsEmpty: "Aún no hay reseñas. Los empleadores pueden reseñarte después de desbloquearte y trabajar contigo.",
    discordTitle: "Comunidad", discordBody: "Únete al Discord de TopRatedVAs para entrenamiento y apoyo entre pares — enfocado en EcomSniper Amazon→eBay.", discordBtn: "Abrir Discord",
    renewTitle: "Perfil y renovación", renewLive: "Tu primer examen aprobado incluye 2 meses de perfil gratis, luego $5/mes para seguir listado (simulado en esta demo).",
    editTitle: "Editar tu perfil", editSub: "Esto es lo que ven los empleadores en Explorar. Mantenlo claro y honesto.",
    back: "← Volver al panel",
    fgBasics: "Tus datos básicos", fgBasicsSub: "Tu nombre, dónde estás y el color de tu tarjeta.",
    lName: "Nombre visible", hName: "Nombre + inicial del apellido, ej. \"Maria D.\"",
    lCountry: "País", lCity: "Ciudad (opcional)", lTz: "Zona horaria", lColor: "Color de tarjeta",
    fgRates: "Tarifas y horas", fgRatesSub: "Los empleadores filtran por esto antes de desbloquearte — sé realista.",
    lHire: "¿Cómo quieres ser contratado?", hHourly: "Por hora", hMonthly: "Mensual / tiempo completo",
    lHourly: "Tarifa por hora (USD)", lMonthly: "Tarifa mensual (USD)", lHours: "Horas por semana", lNeg: "¿Tu tarifa es negociable?",
    yes: "Sí", no: "No", perHr: "/hr", perMo: "/mes",
    fgBio: "Sobre ti", fgBioSub: "Un resumen breve y amable de tu experiencia.",
    lBio: "Biografía breve", hBio: "Ejemplo: \"3 años de servicio al cliente en eBay. Respuestas rápidas y amables, manejo seguro de devoluciones y casos.\"",
    fgContact: "Datos de contacto", fgContactSub: "🔒 Ocultos para los empleadores hasta que paguen por desbloquearte. Nunca se muestran en Explorar.",
    lFull: "Nombre completo", lWhats: "Número de WhatsApp", lTele: "Usuario de Telegram", lEmail: "Correo", lLinks: "Enlaces de perfil", hLinks: "Separa con comas — ej. OnlineJobs.ph, Upwork, CV PDF",
    save: "Guardar cambios", saving: "Guardando…", saved: "Guardado ✓", saveErr: "No se pudo guardar — inténtalo de nuevo.",
    needLive: "necesario para publicar", optional: "opcional",
    req: "Requerido", selCountry: "Selecciona tu país"
  }
};
let LANG = (function () { try { return localStorage.getItem("trv_lang") || "en"; } catch (e) { return "en"; } })();
function t(k, a, b) {
  let s = (STR[LANG] && STR[LANG][k] != null) ? STR[LANG][k] : STR.en[k];
  if (s == null) s = k;
  if (a != null) s = s.replace("{0}", a);
  if (b != null) s = s.replace("{1}", b);
  return s;
}

/* ---------- state + helpers ---------- */
let USER = null, UDATA = {}, PROFILE = null, CONTACT = {};
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function app() { return document.getElementById("vaApp"); }
function initialsOf(name) { const p = String(name || "").trim().split(/\s+/); return ((p[0] || "?")[0] + (p[1] ? p[1][0] : "")).toUpperCase(); }
function todayStr() { return new Date().toISOString().slice(0, 10); }
function attempts() { return UDATA.testAttempts || {}; }
function passedSpecialists() { return ["customer-service","listing","sourcing","fulfillment"].filter(k => attempts()[k] && attempts()[k].latestScore >= PASS).length; }
function daysSince(ms) { return ms ? (Date.now() - ms) / 86400000 : Infinity; }

/* completion steps that gate "go live" */
function steps() {
  const p = PROFILE || {};
  return [
    { key: "cert", t: t("stCertT"), s: t("stCertS"), done: passedSpecialists() >= 1 || (attempts() && Object.keys(attempts()).some(k => attempts()[k].latestScore >= PASS)), cta: t("goTake"), href: "take-test.html" },
    { key: "loc", t: t("stLocT"), s: t("stLocS"), done: !!p.country, cta: t("goEdit"), href: "va-listing.html" },
    { key: "rate", t: t("stRateT"), s: t("stRateS"), done: (p.hourly != null || p.monthly != null) && (p.hireTypes || []).length > 0, cta: t("goEdit"), href: "va-listing.html" },
    { key: "bio", t: t("stBioT"), s: t("stBioS"), done: !!(p.bio && p.bio.trim().length >= 40), cta: t("goEdit"), href: "va-listing.html" },
    { key: "contact", t: t("stContactT"), s: t("stContactS"), done: !!(CONTACT.fullName && (CONTACT.whatsapp || CONTACT.telegram || CONTACT.email)), cta: t("goContact"), href: "va-listing.html#contact" }
  ];
}
function canGoLive() { return steps().every(s => s.done); }

/* ============================================================
   DASHBOARD
   ============================================================ */
function shell(mainHtml) {
  const name = UDATA.name || (USER && USER.displayName) || "VA";
  const nav = [
    ["overview", "🏠", t("overview"), "#top"],
    ["certs", "🎓", t("certs"), "#sec-certs"],
    ["takeTest", "📝", t("takeTest"), "take-test.html"],
    ["listing", "📇", t("listing"), "va-listing.html"],
    ["videos", "🎬", t("videos"), "#sec-videos"],
    ["reviews", "⭐", t("reviews"), "#sec-reviews"],
    ["discord", "💬", t("discord"), "#sec-discord"]
  ].map(([k, ic, label, href], i) =>
    '<button data-nav="' + href + '"' + (i === 0 ? ' class="on"' : "") + ">" + ic + " " + esc(label) + "</button>").join("");
  return '<div class="dash" id="top">' +
    '<aside class="dash-side"><div class="dz"><div class="who">' + esc(name) + '</div><div class="role-tag">' + t("accountVA") + "</div></div>" +
    '<nav class="dnav">' + nav + '<button data-logout style="margin-top:12px;color:#9FB8C8">↩ ' + t("logout") + "</button></nav></aside>" +
    '<div class="dash-main">' + mainHtml + "</div></div>";
}

function renderDashboard() {
  const p = PROFILE || {};
  const name = UDATA.name || (USER && USER.displayName) || "VA";
  const first = String(name).split(/\s+/)[0];
  const status = p.status || (PROFILE ? "pending-listing" : "none");
  const isLive = status === "live";
  const isHidden = status === "hidden";
  const st = steps();
  const doneN = st.filter(s => s.done).length;
  const pct = Math.round(100 * doneN / st.length);

  /* status banner */
  let banner;
  if (isLive) banner = '<div class="statusbanner live"><div class="sb-emoji">🎉</div><div><div class="sb-t">' + t("liveT") + '</div><div class="sb-s">' + t("liveS") + "</div></div></div>";
  else if (isHidden) banner = '<div class="statusbanner hidden"><div class="sb-emoji">🙈</div><div><div class="sb-t">' + t("hiddenT") + '</div><div class="sb-s">' + t("hiddenS") + "</div></div></div>";
  else banner = '<div class="statusbanner draft"><div class="sb-emoji">📝</div><div><div class="sb-t">' + t("draftT") + '</div><div class="sb-s">' + t("draftS") + "</div></div></div>";

  /* checklist OR live controls */
  let progressBlock;
  if (isLive) {
    progressBlock = '<div class="panel"><div style="display:flex;gap:11px;flex-wrap:wrap">' +
      '<a class="btn btn-teal" href="profile.html?id=' + esc(USER.uid) + '" target="_blank">' + t("viewPublic") + "</a>" +
      '<a class="btn btn-outline" href="va-listing.html">' + t("editListing") + "</a>" +
      '<button class="btn btn-outline" data-act="hide">' + t("hide") + "</button></div></div>";
  } else {
    const items = st.map((s, i) =>
      '<li class="checkitem' + (s.done ? " done" : "") + '">' +
        '<div class="ci-ic">' + (s.done ? "✓" : (i + 1)) + "</div>" +
        '<div class="ci-txt"><div class="ci-t">' + esc(s.t) + '</div><div class="ci-s">' + esc(s.s) + "</div></div>" +
        (s.done ? "" : '<div class="ci-go"><a class="btn btn-outline" href="' + s.href + '">' + esc(s.cta) + "</a></div>") +
      "</li>").join("");
    const goLive = canGoLive()
      ? '<div class="notebox" style="background:#F1FAF6;border-color:#BFE8DA;color:#0A6E5A;margin-top:14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap"><b style="flex:1">' + t("goLiveHint") + '</b><button class="btn btn-teal" data-act="golive">' + t("goLive") + "</button></div>"
      : (isHidden ? '<div style="margin-top:14px"><button class="btn btn-teal" data-act="unhide">' + t("show") + "</button></div>" : "");
    progressBlock = '<div class="panel"><div class="progresshead"><span>' + t("stepsTitle") + '</span><span>' + t("stepsDone", doneN, st.length) + '</span></div>' +
      '<div class="meter wide" style="margin-bottom:16px"><i style="width:' + pct + '%;background:var(--teal)"></i></div>' +
      '<ul class="checklist">' + items + "</ul>" + goLive + "</div>";
  }

  /* availability */
  const curAv = p.avail || "av-now";
  const availChips = AVAILS.map(a =>
    '<button class="availchip' + (a.av === curAv ? " sel" : "") + '" data-av="' + a.av + '"><span class="dot"></span>' +
    (a.av === "av-now" ? t("now") : a.av === "av-open" ? t("open") : t("hired")) + "</button>").join("");
  const availBlock = '<div class="dsec">' + t("availTitle") + "</div>" +
    '<div class="panel"><div style="font-size:13px;color:var(--ink-soft);margin-bottom:12px">' + t("availHelp") + "</div>" +
    '<div class="availset">' + availChips + "</div></div>";

  /* heartbeat */
  const hb = p.lastConfirmed ? t("hbConfirmed", p.lastConfirmed) : t("hbNever");
  const hbBlock = '<div class="panel" style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">' +
    '<div style="flex:1;min-width:220px"><div style="font-weight:800;font-size:14.5px">' + t("hbTitle") + '</div>' +
    '<div style="font-size:13px;color:var(--ink-soft);margin-top:2px">' + t("hbBody") + '</div>' +
    '<div class="mono" style="font-size:12px;color:#0A7A5F;margin-top:6px">' + esc(hb) + "</div></div>" +
    '<button class="btn btn-outline" data-act="heartbeat">' + t("hbBtn") + "</button></div>";

  const main =
    '<h2>' + esc(t("welcome", first)) + "</h2>" +
    '<div class="dsub">' + esc((USER && USER.email) || "") + " · " + t("accountVA") + "</div>" +
    banner + progressBlock + availBlock + hbBlock +
    '<div class="dsec" id="sec-certs">' + t("certsTitle") + "</div>" + certsTable() +
    '<div class="dsec" id="sec-videos">' + t("videosTitle") + "</div>" +
      '<div class="panel"><span class="pill p-pend">' + t("videosSoon") + '</span><p style="margin-top:10px;color:var(--ink-soft);font-size:13.5px">' + t("videosBody") + "</p></div>" +
    '<div class="dsec" id="sec-reviews">' + t("reviewsTitle") + "</div>" +
      '<div class="panel"><p style="color:var(--ink-soft);font-size:13.5px;margin:0">⭐ ' + t("reviewsEmpty") + "</p></div>" +
    '<div class="dsec" id="sec-discord">' + t("discordTitle") + "</div>" +
      '<div class="panel"><p style="color:var(--ink-soft);font-size:13.5px;margin:0 0 12px">' + t("discordBody") + '</p><a class="btn btn-navy" href="https://discord.com" target="_blank" rel="noopener">' + t("discordBtn") + "</a></div>" +
    '<div class="dsec">' + t("renewTitle") + "</div>" +
      '<div class="notebox">' + t("renewLive") + "</div>";

  app().innerHTML = shell(main);
  wireDashboard();
}

function certsTable() {
  const certs = window.TRV_CERTS || [];
  const passed4 = passedSpecialists();
  const onProfile = new Set((PROFILE && PROFILE.certs || []).map(c => c.role));
  const rows = certs.map(c => {
    const att = attempts()[c.key];
    const locked = c.locked && passed4 < 4;
    let score = "—", level = "—", statusHtml, action = "";
    if (locked) {
      statusHtml = '<span class="pill p-lock">' + t("mgrLock") + "</span>";
    } else if (att) {
      score = '<span class="mono">' + att.latestScore + "</span>";
      const passedThis = att.latestScore >= PASS;
      if (passedThis) { const m = scoreMeta(att.latestScore); level = '<span class="badge ' + m.badge + '">' + m.label + "</span>"; }
      statusHtml = onProfile.has(c.role)
        ? '<span class="pill p-live">' + t("onProfile") + "</span>"
        : (passedThis ? '<span class="pill p-live">' + t("passed") + "</span>" : '<span class="pill p-pend">' + t("notPassed") + "</span>");
      const freeElig = !att.freeRetakeUsed && daysSince(att.lastAttemptAt) >= 7;
      action = '<a class="btn btn-outline" style="padding:6px 13px;font-size:12.5px" href="take-test.html?cert=' + c.key + '">' + (freeElig ? t("freeRetake") : t("retake")) + "</a>";
    } else {
      statusHtml = '<span class="pill p-pend">' + t("notTaken") + "</span>";
      action = '<a class="btn btn-teal" style="padding:6px 13px;font-size:12.5px" href="take-test.html?cert=' + c.key + '">' + t("take") + "</a>";
    }
    return "<tr><td><b>" + esc(c.role) + "</b></td><td>" + score + "</td><td>" + level + "</td><td>" + statusHtml + "</td><td>" + action + "</td></tr>";
  }).join("");
  return '<table class="tbl"><tr><th>' + t("thCert") + "</th><th>" + t("thScore") + "</th><th>" + t("thLevel") + "</th><th>" + t("thStatus") + "</th><th></th></tr>" + rows + "</table>";
}

// Sidebar nav — shared by dashboard + listing pages. Anchor targets only
// exist on the dashboard, so from the listing page we route to it.
function wireNav() {
  const onListing = document.body.getAttribute("data-page") === "valisting";
  app().querySelectorAll("[data-nav]").forEach(b => b.addEventListener("click", () => {
    const href = b.getAttribute("data-nav");
    if (href.charAt(0) === "#") {
      if (onListing) { location.href = "va-dashboard.html" + (href === "#top" ? "" : href); return; }
      app().querySelectorAll(".dnav button").forEach(x => x.classList.remove("on")); b.classList.add("on");
      const el = document.querySelector(href); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else location.href = href;
  }));
}

function wireDashboard() {
  wireNav();
  app().querySelectorAll("[data-av]").forEach(b => b.addEventListener("click", () => setAvailability(b.getAttribute("data-av"))));
  const act = (name, fn) => { const b = app().querySelector('[data-act="' + name + '"]'); if (b) b.addEventListener("click", fn); };
  act("golive", goLive); act("unhide", () => setStatus("live")); act("hide", () => setStatus("hidden"));
  act("heartbeat", heartbeat);
  wireLogout();
}

/* ---------- dashboard actions ---------- */
async function ensureProfileBase() {
  // Guarantee a vaProfiles/{uid} doc exists before we patch fields onto it.
  if (PROFILE) return;
  const name = UDATA.name || (USER && USER.displayName) || (USER.email || "VA").split("@")[0];
  PROFILE = {
    ownerUid: USER.uid, isExample: false, status: "pending-listing",
    name, initials: initialsOf(name), grad: GRADS[0], flag: "🌐", country: "", city: "", tz: "",
    bio: "", avail: "av-now", availLabel: "Available now", hireTypes: [], hours: 40,
    hourly: null, monthly: null, negotiable: true, english: 8, answerSpeed: "A",
    stars: "☆☆☆☆☆", rating: "—", reviews: 0, unlocks: "", certs: [], createdAt: Date.now()
  };
  await setDoc(doc(db, "vaProfiles", USER.uid), PROFILE, { merge: true });
}
async function patchProfile(patch) {
  await ensureProfileBase();
  patch.ownerUid = USER.uid;              // rules require this on every write
  await setDoc(doc(db, "vaProfiles", USER.uid), patch, { merge: true });
  PROFILE = Object.assign({}, PROFILE, patch);
}
async function setAvailability(av) {
  const a = AVAILS.find(x => x.av === av) || AVAILS[0];
  await patchProfile({ avail: av, availLabel: a.label });
  renderDashboard();
}
async function setStatus(status) { await patchProfile({ status }); renderDashboard(); }
async function goLive() {
  if (!canGoLive()) return;
  await patchProfile({ status: "live", lastConfirmed: todayStr() });
  renderDashboard();
}
async function heartbeat() { await patchProfile({ lastConfirmed: todayStr() }); renderDashboard(); }

/* ============================================================
   LISTING EDITOR
   ============================================================ */
function renderListing() {
  const p = PROFILE || {};
  const grad = p.grad || GRADS[0];
  const countryOpts = '<option value="">' + t("selCountry") + "</option>" +
    COUNTRIES.map(c => '<option value="' + esc(c.name) + '"' + (p.country === c.name ? " selected" : "") + ">" + c.flag + " " + esc(c.name) + "</option>").join("");
  const tzOpts = TZS.map(z => '<option value="' + z + '"' + (p.tz === z ? " selected" : "") + ">" + z + "</option>").join("");
  const swatches = GRADS.map((g, i) => '<button type="button" data-grad="' + i + '" class="' + (g === grad ? "on" : "") + '" style="background:' + g + '"></button>').join("");
  const hireHourly = (p.hireTypes || []).indexOf("hourly") !== -1;
  const hireMonthly = (p.hireTypes || []).indexOf("monthly") !== -1;
  const bio = p.bio || "";

  const main =
    '<a class="btn btn-outline" href="va-dashboard.html" style="margin-bottom:14px">' + t("back") + "</a>" +
    "<h2>" + t("editTitle") + '</h2><div class="dsub">' + t("editSub") + "</div>" +

    // BASICS
    '<div class="formgroup"><h4>' + t("fgBasics") + '</h4><div class="fg-sub">' + t("fgBasicsSub") + "</div>" +
      '<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px"><div class="miniava" id="avaPrev" style="background:' + grad + '">' + esc(initialsOf(p.name || (UDATA.name || ""))) + "</div>" +
        '<div class="field" style="flex:1;margin:0"><label>' + t("lName") + '</label><input id="fName" type="text" value="' + esc(p.name || UDATA.name || "") + '"><div class="hint">' + t("hName") + "</div></div></div>" +
      '<div class="field"><label>' + t("lColor") + '</label><div class="avaswatch" id="gradSet">' + swatches + "</div></div>" +
      '<div class="row2"><div class="field"><label>' + t("lCountry") + ' <span style="color:#B02A1F">*</span></label><select id="fCountry">' + countryOpts + "</select></div>" +
        '<div class="field"><label>' + t("lCity") + '</label><input id="fCity" type="text" value="' + esc(p.city || "") + '"></div></div>" +
      '<div class="field" style="max-width:220px"><label>' + t("lTz") + '</label><select id="fTz">' + tzOpts + "</select></div></div>" +

    // RATES
    '<div class="formgroup"><h4>' + t("fgRates") + '</h4><div class="fg-sub">' + t("fgRatesSub") + "</div>" +
      '<div class="field"><label>' + t("lHire") + ' <span style="color:#B02A1F">*</span></label><div class="chkrow">' +
        '<label class="chkbox' + (hireHourly ? " on" : "") + '" id="lblHourly"><input type="checkbox" id="fHourlyOn"' + (hireHourly ? " checked" : "") + "> " + t("hHourly") + "</label>" +
        '<label class="chkbox' + (hireMonthly ? " on" : "") + '" id="lblMonthly"><input type="checkbox" id="fMonthlyOn"' + (hireMonthly ? " checked" : "") + "> " + t("hMonthly") + "</label></div></div>" +
      '<div class="row2"><div class="field"><label>' + t("lHourly") + '</label><input id="fHourly" type="number" min="0" step="0.25" value="' + (p.hourly != null ? p.hourly : "") + '"></div>' +
        '<div class="field"><label>' + t("lMonthly") + '</label><input id="fMonthly" type="number" min="0" step="10" value="' + (p.monthly != null ? p.monthly : "") + '"></div></div>" +
      '<div class="row2"><div class="field"><label>' + t("lHours") + '</label><input id="fHours" type="number" min="1" max="60" value="' + (p.hours != null ? p.hours : 40) + '"></div>' +
        '<div class="field"><label>' + t("lNeg") + '</label><select id="fNeg"><option value="yes"' + (p.negotiable !== false ? " selected" : "") + ">" + t("yes") + '</option><option value="no"' + (p.negotiable === false ? " selected" : "") + ">" + t("no") + "</option></select></div></div></div>" +

    // BIO
    '<div class="formgroup"><h4>' + t("fgBio") + '</h4><div class="fg-sub">' + t("fgBioSub") + "</div>" +
      '<div class="field"><label>' + t("lBio") + ' <span style="color:#B02A1F">*</span> <span class="cnt" id="bioCnt">' + bio.length + '/280</span></label>' +
        '<textarea id="fBio" maxlength="280">' + esc(bio) + '</textarea><div class="hint">' + t("hBio") + "</div></div></div>" +

    // CONTACT
    '<div class="formgroup" id="contact"><h4>' + t("fgContact") + '</h4><div class="fg-sub">' + t("fgContactSub") + "</div>" +
      '<div class="field"><label>' + t("lFull") + ' <span style="color:#B02A1F">*</span></label><input id="cFull" type="text" value="' + esc(CONTACT.fullName || "") + '"></div>' +
      '<div class="row2"><div class="field"><label>' + t("lWhats") + '</label><input id="cWhats" type="text" value="' + esc(CONTACT.whatsapp || "") + '"></div>' +
        '<div class="field"><label>' + t("lTele") + '</label><input id="cTele" type="text" value="' + esc(CONTACT.telegram || "") + '"></div></div>' +
      '<div class="field"><label>' + t("lEmail") + '</label><input id="cEmail" type="email" value="' + esc(CONTACT.email || "") + '"></div>' +
      '<div class="field"><label>' + t("lLinks") + '</label><input id="cLinks" type="text" value="' + esc((CONTACT.links || []).join(", ")) + '"><div class="hint">' + t("hLinks") + "</div></div></div>" +

    '<div class="savebar"><button class="btn btn-teal btn-big" id="saveBtn">' + t("save") + '</button><span class="savemsg" id="saveMsg"></span></div>';

  app().innerHTML = shell(main);
  wireListing();
}

function wireListing() {
  // live avatar preview + color swatches
  const nameEl = document.getElementById("fName");
  const prev = document.getElementById("avaPrev");
  if (nameEl && prev) nameEl.addEventListener("input", () => { prev.textContent = initialsOf(nameEl.value); });
  document.querySelectorAll("#gradSet button").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll("#gradSet button").forEach(x => x.classList.remove("on")); b.classList.add("on");
    if (prev) prev.style.background = GRADS[parseInt(b.getAttribute("data-grad"), 10)];
  }));
  // checkbox highlight
  [["fHourlyOn", "lblHourly"], ["fMonthlyOn", "lblMonthly"]].forEach(([cb, lb]) => {
    const c = document.getElementById(cb), l = document.getElementById(lb);
    if (c && l) c.addEventListener("change", () => l.classList.toggle("on", c.checked));
  });
  const bio = document.getElementById("fBio"), cnt = document.getElementById("bioCnt");
  if (bio && cnt) bio.addEventListener("input", () => { cnt.textContent = bio.value.length + "/280"; });
  document.getElementById("saveBtn").addEventListener("click", saveListing);
  // deep-link to #contact
  if (location.hash === "#contact") { const el = document.getElementById("contact"); if (el) el.scrollIntoView(); }
  wireNav();
  wireLogout();
}

async function saveListing() {
  const btn = document.getElementById("saveBtn"), msg = document.getElementById("saveMsg");
  const val = id => { const e = document.getElementById(id); return e ? e.value.trim() : ""; };
  const num = id => { const v = val(id); return v === "" ? null : Number(v); };
  const country = val("fCountry");
  const c = COUNTRIES.find(x => x.name === country);
  const hireTypes = [];
  if (document.getElementById("fHourlyOn").checked) hireTypes.push("hourly");
  if (document.getElementById("fMonthlyOn").checked) hireTypes.push("monthly");
  const gradBtn = document.querySelector("#gradSet button.on");
  const grad = gradBtn ? GRADS[parseInt(gradBtn.getAttribute("data-grad"), 10)] : GRADS[0];
  const name = val("fName") || UDATA.name || "VA";

  const profilePatch = {
    name, initials: initialsOf(name), grad,
    country, flag: c ? c.flag : "🌐", city: val("fCity"), tz: val("fTz") || (c ? c.tz : "GMT+0"),
    hireTypes, hourly: num("fHourly"), monthly: num("fMonthly"),
    hours: num("fHours") != null ? num("fHours") : 40,
    negotiable: val("fNeg") !== "no", bio: val("fBio")
  };
  const linksRaw = val("cLinks");
  const contactPatch = {
    fullName: val("cFull"), whatsapp: val("cWhats"), telegram: val("cTele"), email: val("cEmail"),
    links: linksRaw ? linksRaw.split(",").map(s => s.trim()).filter(Boolean) : []
  };

  btn.disabled = true; btn.textContent = t("saving"); msg.textContent = ""; msg.style.color = "";
  try {
    await patchProfile(profilePatch);                                   // creates base if needed, then merges
    await setDoc(doc(db, "vaProfiles", USER.uid, "private", "contact"), contactPatch, { merge: true });
    CONTACT = Object.assign({}, CONTACT, contactPatch);
    msg.textContent = t("saved"); msg.style.color = "#0A7A5F";
    btn.disabled = false; btn.textContent = t("save");
    setTimeout(() => { location.href = "va-dashboard.html"; }, 700);
  } catch (e) {
    msg.textContent = t("saveErr") + " (" + (e.code || e.message) + ")"; msg.style.color = "#B02A1F";
    btn.disabled = false; btn.textContent = t("save");
  }
}

/* ---------- shared ---------- */
function wireLogout() {
  const b = app().querySelector("[data-logout]");
  if (b) b.addEventListener("click", (e) => {
    e.preventDefault();
    try { localStorage.removeItem(SESSION_KEY); } catch (x) {}
    signOut(auth).finally(() => { location.href = "index.html"; });
  });
}
function rerender() {
  LANG = (function () { try { return localStorage.getItem("trv_lang") || "en"; } catch (e) { return "en"; } })();
  if (document.body.getAttribute("data-page") === "valisting") renderListing(); else renderDashboard();
}

/* ============================================================
   INIT
   ============================================================ */
async function load() {
  try { const s = await getDoc(doc(db, "users", USER.uid)); UDATA = s.exists() ? s.data() : {}; } catch (e) { UDATA = {}; }
  try { const s = await getDoc(doc(db, "vaProfiles", USER.uid)); PROFILE = s.exists() ? s.data() : null; } catch (e) { PROFILE = null; }
  if (PROFILE) { try { const s = await getDoc(doc(db, "vaProfiles", USER.uid, "private", "contact")); CONTACT = s.exists() ? s.data() : {}; } catch (e) { CONTACT = {}; } }
}
function init() {
  if (!app()) return;
  window.addEventListener("trv:lang", rerender);
  onAuthStateChanged(auth, async (user) => {
    if (!user) { location.href = "login.html"; return; }
    USER = user;
    await load();
    if (UDATA.role && UDATA.role !== "va") { location.href = "employer-dashboard.html"; return; }
    rerender();
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
