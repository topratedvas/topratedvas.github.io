/* ============================================================
   TopRatedVAs.com — Employer dashboard (Phase 7)
   The employer's hiring HQ. Every VA they've unlocked is kept forever
   with a pipeline status + private notes (a mini hiring CRM). Plus a
   "build your team" tracker across the 5 EcomSniper roles, a credits
   wallet (buy = simulated), check-in surveys that earn ¼ credit each,
   verified reviews, and a saved-VA shortlist.
   Reads/writes are gated by the Firestore security rules.
   Loaded with auth.js (guards employer-only + single session), data.js
   (TRV_scoreMeta) and questions.js (TRV_CERTS).
   ============================================================ */
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from "./firebase.js";
import {
  getMyUnlocks, updateUnlock, getProfilesByIds, getContact,
  getCredits, addCredits, getMyReviews, leaveReview, getSaves, removeSave
} from "./db.js";

const SESSION_KEY = "trv_session";
const scoreMeta = window.TRV_scoreMeta;
const badgeFor = { elite: "b-elite", pro: "b-pro", cert: "b-cert" };

const STATUSES = [
  { key: "unlocked", label: "New lead" },
  { key: "contacted", label: "Contacted" },
  { key: "interviewing", label: "Interviewing" },
  { key: "hired", label: "Hired ✓" },
  { key: "passed", label: "Passed" },
  { key: "no_response", label: "No response" }
];
const SURVEYS = [
  { q: "Did this VA respond within your first week of reaching out?", opts: ["Yes, quickly", "Yes, eventually", "No response yet"] },
  { q: "Did their real skills match their test scores?", opts: ["Yes, spot on", "Mostly", "Not really"] },
  { q: "Where are you with this VA?", opts: ["Hired them", "Still interviewing", "Decided to pass"] },
  { q: "Any feedback on this VA? (a sentence or two)", text: true }
];

let USER = null, UDATA = {};
let UNLOCKS = [], PROFILES = {}, CONTACTS = {}, CREDITS = { balance: 0, ledger: [] }, REVIEWS = {}, SAVES = [];

function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function app() { return document.getElementById("empApp"); }
function roleName(key) { const c = (window.TRV_CERTS || []).find(x => x.key === key); return c ? c.role : key; }
function certList(v) { return (v && v.certs || []).map(c => Array.isArray(c) ? { role: c[0], score: c[1] } : c); }
function statusLabel(k) { const s = STATUSES.find(x => x.key === k); return s ? s.label : "New lead"; }

/* ============================================================
   LOAD
   ============================================================ */
async function load() {
  try { const s = await getDoc(doc(db, "users", USER.uid)); UDATA = s.exists() ? s.data() : {}; } catch (e) { UDATA = {}; }
  try { UNLOCKS = await getMyUnlocks(); } catch (e) { UNLOCKS = []; }
  const ids = UNLOCKS.map(u => u.vaId);
  try { PROFILES = await getProfilesByIds(ids); } catch (e) { PROFILES = {}; }
  CONTACTS = {};
  await Promise.all(UNLOCKS.map(async u => { try { const r = await getContact(u.vaId); if (r.status === "ok") CONTACTS[u.vaId] = r.data; } catch (e) {} }));
  // These read collections whose rules ship in Phase 7 — stay resilient if
  // the rules haven't been published yet, so the dashboard still renders.
  try { CREDITS = await getCredits(); } catch (e) { CREDITS = { balance: 0, ledger: [] }; }
  try { SAVES = await getSaves(); } catch (e) { SAVES = []; }
  REVIEWS = {};
  try { (await getMyReviews()).forEach(r => REVIEWS[r.vaId] = r); } catch (e) {}
}

/* ============================================================
   SHELL
   ============================================================ */
function shell(main) {
  const name = UDATA.name || (USER && USER.displayName) || "Employer";
  const nav = [
    ["🏠 Overview", "#top"], ["🔎 Browse VAs", "browse.html"], ["🔓 My Unlocked VAs", "#sec-unlocked"],
    ["👥 Build My Team", "#sec-team"], ["🪙 My Credits", "#sec-credits"], ["📋 Check-in Surveys", "#sec-surveys"],
    ["⭐ My Reviews", "#sec-reviews"], ["❤ Saved VAs", "#sec-saved"]
  ].map(([label, href], i) => '<button data-nav="' + href + '"' + (i === 0 ? ' class="on"' : "") + ">" + label + "</button>").join("");
  return '<div class="dash" id="top">' +
    '<aside class="dash-side"><div class="dz"><div class="who">' + esc(name) + '</div><div class="role-tag" style="color:#FFAA2B">Employer Account</div></div>' +
    '<nav class="dnav">' + nav + '<button data-logout style="margin-top:12px;color:#9FB8C8">↩ Log out</button></nav></aside>' +
    '<div class="dash-main">' + main + "</div></div>";
}

/* ============================================================
   RENDER
   ============================================================ */
function render() {
  const name = (UDATA.name || (USER && USER.displayName) || "there").split(/\s+/)[0];
  const hired = UNLOCKS.filter(u => u.status === "hired");
  const pendingSurveys = UNLOCKS.reduce((n, u) => n + Math.max(0, 4 - ((u.surveys || []).length)), 0);
  const rolesFilled = rolesCovered(hired);

  const main =
    "<h2>Your hiring HQ, " + esc(name) + " 👋</h2>" +
    '<div class="dsub">Every VA you unlock stays here forever — even after your credits expire.</div>' +
    creditBanner() +
    '<div class="statrow">' +
      '<div class="stat"><div class="sv" style="color:#0A8A70">' + UNLOCKS.length + '</div><div class="sl">VAs unlocked</div></div>' +
      '<div class="stat"><div class="sv">' + hired.length + '</div><div class="sl">Hired</div></div>' +
      '<div class="stat"><div class="sv" style="color:#B5722A">' + rolesFilled + '/5</div><div class="sl">Team roles filled</div></div>' +
      '<div class="stat warn"><div class="sv">' + pendingSurveys + '</div><div class="sl">Surveys to earn credits</div></div>' +
    "</div>" +
    '<div class="dsec" id="sec-unlocked">🔓 My unlocked VAs</div>' + unlockedSection() +
    '<div class="dsec" id="sec-team">👥 Build my team</div>' + teamSection(hired) +
    '<div class="dsec" id="sec-credits">🪙 My credits</div>' + creditsSection() +
    '<div class="dsec" id="sec-surveys">📋 Check-in surveys</div>' + surveysSection() +
    '<div class="dsec" id="sec-reviews">⭐ My reviews</div>' + reviewsSection() +
    '<div class="dsec" id="sec-saved">❤ Saved VAs</div>' + savedSection();

  app().innerHTML = shell(main);
  wire();
}

function creditBanner() {
  return '<div class="credit-big" style="display:flex;align-items:center;gap:18px;background:linear-gradient(120deg,var(--navy-900),var(--navy-700));color:#EAF2F8;border-radius:16px;padding:20px 24px;margin-bottom:22px">' +
    '<div><div class="cnum" style="font-family:\'Spline Sans Mono\';font-size:34px;font-weight:600;color:#fff">' + (CREDITS.balance || 0) + '</div>' +
    '<div style="font-size:11px;letter-spacing:.06em;font-weight:700;color:#AFC6D4">CREDITS AVAILABLE</div></div>' +
    '<p style="flex:1;font-size:13px;color:#C6D6E2;margin:0">Each credit unlocks one VA\'s full contact — yours forever. Earn ¼ credit per check-in survey; a full month of feedback earns a free unlock.</p>' +
    '<button class="btn btn-amber" data-nav="#sec-credits">Buy credits</button></div>';
}

/* ---------- unlocked VAs (the CRM) ---------- */
function unlockedSection() {
  if (!UNLOCKS.length) {
    return '<div class="panel"><p style="color:var(--ink-soft);font-size:14px;margin:0 0 12px">You haven\'t unlocked any VAs yet. Browsing is free — unlock a VA\'s contact when you find the right fit.</p>' +
      '<a class="btn btn-teal" href="browse.html">Browse certified VAs →</a></div>';
  }
  return UNLOCKS.slice().sort((a, b) => (tms(b.at) - tms(a.at))).map(unlockCard).join("");
}
function tms(at) { return at && at.seconds ? at.seconds * 1000 : (typeof at === "number" ? at : 0); }
function dateStr(at) { const t = tms(at); if (!t) return "—"; return new Date(t).toISOString().slice(0, 10); }

function unlockCard(u) {
  const v = PROFILES[u.vaId] || { name: u.vaId, initials: "··", grad: "linear-gradient(135deg,#5F7C8A,#3A4E58)", tier: "cert", tierLabel: "Certified", certs: [] };
  const c = CONTACTS[u.vaId] || {};
  const certs = certList(v).map(x => {
    const col = typeof x.score === "number" ? scoreMeta(x.score).color : "#0A8A70";
    return '<span style="font-size:12px;margin-right:10px">' + esc(x.role) + ' <b style="color:' + col + '">' + x.score + "</b></span>";
  }).join("");
  const statusOpts = STATUSES.map(s => '<option value="' + s.key + '"' + ((u.status || "unlocked") === s.key ? " selected" : "") + ">" + esc(s.label) + "</option>").join("");
  const contact = '<div style="background:#E9F8F2;border:1px solid #BFE8DA;border-radius:10px;padding:11px 13px;font-size:13px;margin:10px 0">' +
    (c.fullName ? '<div style="padding:2px 0">👤 <b>' + esc(c.fullName) + "</b></div>" : "") +
    (c.whatsapp ? '<div style="padding:2px 0">📱 ' + esc(c.whatsapp) + "</div>" : "") +
    (c.telegram ? '<div style="padding:2px 0">✈️ ' + esc(c.telegram) + "</div>" : "") +
    (c.email ? '<div style="padding:2px 0">✉️ ' + esc(c.email) + "</div>" : "") +
    (c.links ? '<div style="padding:2px 0;color:var(--ink-soft)">🔗 ' + esc((c.links || []).join(" · ")) + "</div>" : "") +
    (!c.fullName && !c.whatsapp && !c.email ? '<div style="color:var(--ink-soft)">Contact on file — open the profile to view.</div>' : "") + "</div>";
  const reviewed = REVIEWS[u.vaId];
  return '<div class="panel" data-card="' + esc(u.vaId) + '">' +
    '<div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap">' +
      '<div class="avatar" style="background:' + esc(v.grad) + '">' + esc(v.initials) + "</div>" +
      '<div style="flex:1;min-width:200px">' +
        '<div style="font-weight:800;font-size:16px">' + esc(v.name) + ' <span class="badge ' + (badgeFor[v.tier] || "b-cert") + '">' + esc(v.tierLabel || "Certified") + "</span></div>" +
        '<div style="margin:4px 0 2px">' + certs + "</div>" +
        '<div style="font-size:12px;color:var(--ink-soft)">Unlocked ' + dateStr(u.at) + " · English " + (v.english || "—") + "/10</div>" +
      "</div>" +
      '<div style="text-align:right">' +
        '<select data-status="' + esc(u.vaId) + '" style="border:1px solid var(--line);border-radius:9px;padding:8px 10px;font-family:inherit;font-size:13px;font-weight:700;background:#FCFBF7">' + statusOpts + "</select>" +
      "</div>" +
    "</div>" +
    contact +
    '<label style="display:block;font-size:12px;font-weight:700;color:#2C4356;margin-bottom:5px">Private notes (only you can see these)</label>' +
    '<textarea data-notes="' + esc(u.vaId) + '" placeholder="e.g. Asked $600/mo, negotiable to $550. 2nd call Friday. Strong on cases." style="width:100%;min-height:66px;border:1px solid var(--line);border-radius:10px;padding:10px 12px;font-family:inherit;font-size:14px;background:#FCFBF7;outline:none;resize:vertical">' + esc(u.notes || "") + "</textarea>" +
    '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:10px;align-items:center">' +
      '<button class="btn btn-teal" data-savenotes="' + esc(u.vaId) + '" style="padding:8px 15px;font-size:13px">Save notes</button>' +
      '<a class="btn btn-outline" href="profile.html?id=' + esc(u.vaId) + '" style="padding:8px 15px;font-size:13px">View profile</a>' +
      '<button class="btn btn-outline" data-review="' + esc(u.vaId) + '" style="padding:8px 15px;font-size:13px">' + (reviewed ? "Edit review ★" + reviewed.rating : "Leave a review") + "</button>" +
      (u.status === "no_response" ? '<span class="pill p-live">✓ Replacement credit issued</span>'
        : '<button class="btn btn-outline" data-noresp="' + esc(u.vaId) + '" style="padding:8px 15px;font-size:13px;color:#9A6A10">No response? Get a free credit</button>') +
      '<span data-msg="' + esc(u.vaId) + '" style="font-size:12.5px;font-weight:700;color:#0A7A5F"></span>' +
    "</div>" +
    '<div data-reviewbox="' + esc(u.vaId) + '"></div>' +
  "</div>";
}

/* ---------- build my team ---------- */
function rolesCovered(hired) {
  const roles = new Set();
  hired.forEach(u => certList(PROFILES[u.vaId]).forEach(c => roles.add(c.role)));
  return ["Customer Service", "Listing", "Sourcing / Sniping", "Order Fulfillment", "VA Manager"].filter(r => roles.has(r)).length;
}
function teamSection(hired) {
  const roleFill = {};
  hired.forEach(u => certList(PROFILES[u.vaId]).forEach(c => { if (!roleFill[c.role]) roleFill[c.role] = PROFILES[u.vaId]; }));
  const seats = (window.TRV_CERTS || []).map(c => {
    const filledBy = roleFill[c.role];
    return '<div class="stat" style="display:block;padding:16px">' +
      '<div style="font-weight:800;font-size:14px;margin-bottom:6px">' + esc(c.role) + "</div>" +
      (filledBy
        ? '<span class="pill p-live">✓ Hired</span><div style="font-size:12.5px;margin-top:7px">' + esc(filledBy.name) + "</div>"
        : '<span class="pill p-pend">Open seat</span><div style="margin-top:7px"><a href="browse.html" style="font-size:12.5px;color:#0A8A70;font-weight:700">Browse ' + esc(c.role) + " VAs →</a></div>") +
      "</div>";
  }).join("");
  return '<div class="panel"><p style="font-size:13.5px;color:var(--ink-soft);margin:0 0 14px">The EcomSniper store runs on five roles — and, as the AI agents take over, eventually one VA Manager who supervises them all. Fill your seats:</p>' +
    '<div class="statrow" style="grid-template-columns:repeat(3,1fr)">' + seats + "</div></div>";
}

/* ---------- credits ---------- */
function creditsSection() {
  const packs = [["Single unlock", 29, 1], ["5-Credit Pack", 79, 5], ["Agency Pack", 199, 15]].map(([n, price, amt]) =>
    '<div class="stat" style="display:block;padding:18px">' +
      '<div style="font-weight:800">' + n + '</div><div style="font-family:\'Spline Sans Mono\';font-size:22px;margin:4px 0">$' + price + "</div>" +
      '<div style="font-size:12px;color:var(--ink-soft);margin-bottom:10px">' + amt + " credit" + (amt > 1 ? "s" : "") + "</div>" +
      '<button class="btn btn-teal" data-buy="' + amt + '" data-price="' + price + '" style="padding:8px 14px;font-size:13px">Buy (demo)</button></div>').join("");
  const ledger = (CREDITS.ledger || []).slice().reverse().slice(0, 8).map(e =>
    "<tr><td>" + dateStr(e.at) + '</td><td>' + esc(e.note || e.type) + '</td><td class="mono" style="text-align:right;color:' + (e.amount >= 0 ? "#0A7A5F" : "#B02A1F") + '">' + (e.amount >= 0 ? "+" : "") + e.amount + "</td></tr>").join("");
  return '<div class="panel"><div class="statrow" style="grid-template-columns:repeat(3,1fr);margin-bottom:18px">' + packs + "</div>" +
    '<div class="notebox" style="margin-bottom:16px">🛡️ <b>7-day response guarantee:</b> if an unlocked VA doesn\'t reply within 7 days, claim a free replacement credit from their card above. Credits expire 12 months after purchase. <b>(Payments simulated in this demo.)</b></div>' +
    '<table class="tbl"><tr><th>Date</th><th>Activity</th><th style="text-align:right">Credits</th></tr>' + (ledger || '<tr><td colspan="3">No activity yet.</td></tr>') + "</table></div>";
}

/* ---------- surveys ---------- */
function surveysSection() {
  const withUnlocks = UNLOCKS.filter(u => (u.surveys || []).length < 4);
  if (!UNLOCKS.length) return '<div class="panel"><p style="color:var(--ink-soft);font-size:13.5px;margin:0">Unlock a VA first — then a few quick check-in surveys per hire each earn you ¼ credit.</p></div>';
  const done = UNLOCKS.reduce((n, u) => n + (u.surveys || []).length, 0);
  const rows = UNLOCKS.map(u => {
    const v = PROFILES[u.vaId] || { name: u.vaId };
    const n = (u.surveys || []).length;
    if (n >= 4) return '<div class="survey-item" style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #F0EDE3;opacity:.6"><span style="flex:1"><b>' + esc(v.name) + '</b> · all 4 surveys done</span><span class="pill p-live">+1 credit earned</span></div>';
    return '<div class="survey-item" style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #F0EDE3"><span style="flex:1"><b>' + esc(v.name) + "</b> · check-in " + (n + 1) + ' of 4</span><span class="q-cred" style="font-size:12px;font-weight:800;color:#0A7A5F">+0.25 credit</span>' +
      '<button class="btn btn-teal" data-survey="' + esc(u.vaId) + '" style="padding:7px 13px;font-size:12.5px">Answer (1 min)</button></div>' +
      '<div data-surveybox="' + esc(u.vaId) + '"></div>';
  }).join("");
  return '<div class="panel"><p style="font-size:13.5px;color:var(--ink-soft);margin:0 0 8px">' + done + ' surveys completed. Each earns ¼ credit — 4 per VA = a free unlock. Your answers also power the verified reviews other employers rely on.</p>' + rows + "</div>";
}

/* ---------- reviews ---------- */
function reviewsSection() {
  const mine = Object.values(REVIEWS);
  if (!mine.length) return '<div class="panel"><p style="color:var(--ink-soft);font-size:13.5px;margin:0">No reviews yet. You can review any VA you\'ve unlocked — look for “Leave a review” on their card above. Only unlock-verified employers can review, so your reviews carry weight.</p></div>';
  return '<div class="panel">' + mine.map(r => {
    const v = PROFILES[r.vaId] || { name: r.vaId };
    return '<div style="padding:12px 0;border-bottom:1px solid #F0EDE3"><div style="display:flex;justify-content:space-between"><b>' + esc(v.name) + '</b><span class="stars">' + "★".repeat(r.rating) + "☆".repeat(5 - r.rating) + "</span></div>" +
      '<div style="font-size:13.5px;color:var(--ink-soft);margin-top:4px">' + esc(r.text || "") + "</div></div>";
  }).join("") + "</div>";
}

/* ---------- saved ---------- */
function savedSection() {
  if (!SAVES.length) return '<div class="panel"><p style="color:var(--ink-soft);font-size:13.5px;margin:0">No saved VAs yet. Tap ❤ Save on any profile to shortlist them here before you unlock.</p></div>';
  return '<div class="panel">' + SAVES.map(s =>
    '<div style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid #F0EDE3">' +
      '<div class="avatar" style="width:38px;height:38px;font-size:14px;background:' + esc(s.grad || "linear-gradient(135deg,#5F7C8A,#3A4E58)") + '">' + esc(s.initials || "··") + "</div>" +
      '<span style="flex:1;font-weight:700">' + esc(s.name || s.vaId) + "</span>" +
      '<a class="btn btn-outline" href="profile.html?id=' + esc(s.vaId) + '" style="padding:6px 12px;font-size:12.5px">View</a>' +
      '<button class="btn btn-outline" data-unsave="' + esc(s.vaId) + '" style="padding:6px 12px;font-size:12.5px">Remove</button></div>').join("") + "</div>";
}

/* ============================================================
   WIRE
   ============================================================ */
function wire() {
  app().querySelectorAll("[data-nav]").forEach(b => b.addEventListener("click", () => {
    const href = b.getAttribute("data-nav");
    if (href.charAt(0) === "#") {
      app().querySelectorAll(".dnav button").forEach(x => x.classList.remove("on"));
      const nb = app().querySelector('.dnav [data-nav="' + href + '"]'); if (nb) nb.classList.add("on");
      const el = document.querySelector(href); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else location.href = href;
  }));
  app().querySelectorAll("[data-status]").forEach(s => s.addEventListener("change", () => setStatus(s.getAttribute("data-status"), s.value)));
  app().querySelectorAll("[data-savenotes]").forEach(b => b.addEventListener("click", () => saveNotes(b.getAttribute("data-savenotes"))));
  app().querySelectorAll("[data-noresp]").forEach(b => b.addEventListener("click", () => reportNoResponse(b.getAttribute("data-noresp"))));
  app().querySelectorAll("[data-review]").forEach(b => b.addEventListener("click", () => openReview(b.getAttribute("data-review"))));
  app().querySelectorAll("[data-buy]").forEach(b => b.addEventListener("click", () => buyCredits(+b.getAttribute("data-buy"), +b.getAttribute("data-price"))));
  app().querySelectorAll("[data-survey]").forEach(b => b.addEventListener("click", () => openSurvey(b.getAttribute("data-survey"))));
  app().querySelectorAll("[data-unsave]").forEach(b => b.addEventListener("click", () => unsave(b.getAttribute("data-unsave"))));
  wireLogout();
}

function toast(vaId, msg) { const el = app().querySelector('[data-msg="' + cssq(vaId) + '"]'); if (el) { el.textContent = msg; setTimeout(() => { if (el) el.textContent = ""; }, 2500); } }
function cssq(s) { return String(s).replace(/"/g, '\\"'); }
function unlockLocal(vaId) { return UNLOCKS.find(u => u.vaId === vaId); }

async function setStatus(vaId, status) {
  const u = unlockLocal(vaId); if (u) u.status = status;
  try { await updateUnlock(vaId, { status }); } catch (e) {}
  render();
}
async function saveNotes(vaId) {
  const ta = app().querySelector('[data-notes="' + cssq(vaId) + '"]'); if (!ta) return;
  const notes = ta.value;
  const u = unlockLocal(vaId); if (u) u.notes = notes;
  try { await updateUnlock(vaId, { notes }); toast(vaId, "Saved ✓"); }
  catch (e) { toast(vaId, "Couldn't save — publish rules?"); }
}
async function reportNoResponse(vaId) {
  const u = unlockLocal(vaId); const v = PROFILES[vaId] || {};
  try {
    await updateUnlock(vaId, { status: "no_response" });
    CREDITS = await addCredits(1, "guarantee", "Replacement credit — no response from " + (v.name || vaId));
    if (u) u.status = "no_response";
    render();
  } catch (e) { toast(vaId, "Couldn't process — publish rules?"); }
}
async function buyCredits(amt, price) {
  try { CREDITS = await addCredits(amt, "purchase", "Bought " + amt + "-credit pack ($" + price + ", demo)"); render(); }
  catch (e) { alert("Couldn't add credits — the Firestore rules may need to be published."); }
}

function openReview(vaId) {
  const box = app().querySelector('[data-reviewbox="' + cssq(vaId) + '"]'); if (!box) return;
  if (box.innerHTML) { box.innerHTML = ""; return; }
  const cur = REVIEWS[vaId] || { rating: 5, text: "", label: "" };
  box.innerHTML = '<div class="formgroup" style="margin-top:12px;background:#FCFBF7">' +
    '<label style="font-size:12.5px;font-weight:700">Your rating</label>' +
    '<select id="rvRate_' + esc(vaId) + '" style="width:120px;display:block;border:1px solid var(--line);border-radius:9px;padding:9px;margin:6px 0 12px;font-family:inherit">' +
      [5, 4, 3, 2, 1].map(n => '<option value="' + n + '"' + (cur.rating === n ? " selected" : "") + ">" + "★".repeat(n) + "</option>").join("") + "</select>" +
    '<label style="font-size:12.5px;font-weight:700">Your review (verified — you unlocked this VA)</label>' +
    '<textarea id="rvText_' + esc(vaId) + '" style="width:100%;min-height:70px;border:1px solid var(--line);border-radius:10px;padding:10px;font-family:inherit;font-size:14px;margin:6px 0 10px">' + esc(cur.text || "") + "</textarea>" +
    '<input id="rvLabel_' + esc(vaId) + '" placeholder="Your label (e.g. eBay store, 3,200 listings)" value="' + esc(cur.label || "") + '" style="width:100%;border:1px solid var(--line);border-radius:10px;padding:10px;font-family:inherit;font-size:13.5px;margin-bottom:12px">' +
    '<button class="btn btn-teal" data-submitreview="' + esc(vaId) + '" style="padding:8px 15px;font-size:13px">Post review</button></div>';
  box.querySelector("[data-submitreview]").addEventListener("click", () => submitReview(vaId));
}
async function submitReview(vaId) {
  const rating = +document.getElementById("rvRate_" + vaId).value;
  const text = document.getElementById("rvText_" + vaId).value.trim();
  const label = document.getElementById("rvLabel_" + vaId).value.trim();
  try { await leaveReview(vaId, rating, text, label); REVIEWS[vaId] = { vaId, rating, text, label }; render(); }
  catch (e) { toast(vaId, "Couldn't post — publish rules?"); }
}

function openSurvey(vaId) {
  const box = app().querySelector('[data-surveybox="' + cssq(vaId) + '"]'); if (!box) return;
  if (box.innerHTML) { box.innerHTML = ""; return; }
  const u = unlockLocal(vaId); const i = (u.surveys || []).length; const s = SURVEYS[i];
  const body = s.text
    ? '<textarea id="svText_' + esc(vaId) + '" placeholder="A sentence or two…" style="width:100%;min-height:60px;border:1px solid var(--line);border-radius:10px;padding:10px;font-family:inherit;font-size:14px;margin:8px 0"></textarea>'
    : '<select id="svOpt_' + esc(vaId) + '" style="display:block;border:1px solid var(--line);border-radius:9px;padding:9px;margin:8px 0;font-family:inherit;min-width:220px">' + s.opts.map(o => "<option>" + esc(o) + "</option>").join("") + "</select>";
  box.innerHTML = '<div class="formgroup" style="margin:8px 0 4px;background:#FCFBF7"><div style="font-weight:700;font-size:13.5px">' + esc(s.q) + "</div>" + body +
    '<button class="btn btn-teal" data-submitsurvey="' + esc(vaId) + '" style="padding:7px 13px;font-size:12.5px">Submit &amp; earn ¼ credit</button></div>';
  box.querySelector("[data-submitsurvey]").addEventListener("click", () => submitSurvey(vaId));
}
async function submitSurvey(vaId) {
  const u = unlockLocal(vaId); const i = (u.surveys || []).length; const s = SURVEYS[i];
  const answer = s.text ? (document.getElementById("svText_" + vaId).value || "").trim() : document.getElementById("svOpt_" + vaId).value;
  const surveys = (u.surveys || []).concat([{ i, answer, at: Date.now() }]);
  try {
    await updateUnlock(vaId, { surveys });
    u.surveys = surveys;
    CREDITS = await addCredits(0.25, "survey", "Check-in survey on " + ((PROFILES[vaId] || {}).name || vaId));
    render();
  } catch (e) { toast(vaId, "Couldn't submit — publish rules?"); }
}
async function unsave(vaId) {
  try { await removeSave(vaId); SAVES = SAVES.filter(s => s.vaId !== vaId); render(); } catch (e) {}
}

function wireLogout() {
  const b = app().querySelector("[data-logout]");
  if (b) b.addEventListener("click", (e) => { e.preventDefault(); try { localStorage.removeItem(SESSION_KEY); } catch (x) {} signOut(auth).finally(() => { location.href = "index.html"; }); });
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  if (!app()) return;
  onAuthStateChanged(auth, async (user) => {
    if (!user) { location.href = "login.html"; return; }
    USER = user;
    try { const s = await getDoc(doc(db, "users", user.uid)); UDATA = s.exists() ? s.data() : {}; } catch (e) { UDATA = {}; }
    if (UDATA.role && UDATA.role !== "employer") { location.href = "va-dashboard.html"; return; }
    await load();
    render();
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
