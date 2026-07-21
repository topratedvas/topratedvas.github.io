/* ============================================================
   TopRatedVAs.com — VA Profile: load from Firestore, render public
   fields, and drive the live contact protection (🔒 → unlock → reveal).
   Contact reads are gated by security rules, not this code. ES module.
   ============================================================ */
import { getVaProfile, getContact, createUnlock } from "./db.js";
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const meta = window.TRV_scoreMeta;
const badgeFor = { elite: "b-elite", pro: "b-pro", cert: "b-cert" };
let currentVaId = null;

function normCerts(certs) { return (certs || []).map(c => Array.isArray(c) ? { role: c[0], score: c[1] } : c); }
function normVa(v) { return Object.assign({}, v, { certs: normCerts(v.certs) }); }
function param(k) { return new URLSearchParams(location.search).get(k); }
function set(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }

function renderPublic(v) {
  document.title = v.name + " — Certified VA · TopRatedVAs.com";
  const av = document.getElementById("pAvatar");
  if (av) { av.textContent = v.initials; av.style.background = v.grad; }
  set("pName", v.name + ' <span class="badge ' + badgeFor[v.tier] + '">' + v.tierLabel + "</span>");
  const confirmed = v.lastConfirmed || "2026-07-18";
  set("pLoc", v.flag + " " + (v.city ? v.city + ", " : "") + v.country + " · " + v.tz + " · Last confirmed available: " + confirmed);
  set("pBadges",
    '<span class="avail ' + v.avail + '">' + v.availLabel + "</span>" +
    '<span class="badge b-cert">✓ Verified WhatsApp</span>' +
    '<span class="badge b-cert">✓ Discord member</span>' +
    (v.unlocks ? '<span class="badge b-elite">Unlocked by ' + String(v.unlocks).replace(" unlocks", "") + " employers this month</span>" : ""));

  const rate = v.hourly != null ? "$" + Number(v.hourly).toFixed(2) + "/hr" : "$" + v.monthly + "/mo";
  const rateSmall = v.hourly != null && v.monthly != null ? "or $" + v.monthly + "/mo full-time"
    : (v.hourly != null ? "up to " + v.hours + " hrs/wk" : "full-time");
  set("pRate", rate + " <small>" + rateSmall + "</small>");
  set("pNeg", (v.negotiable ? "Rate negotiable · " : "Rate fixed · ") + "up to " + v.hours + " hrs/wk" + (v.negotiable ? " · overtime OK" : ""));

  let rows = v.certs.map(c => {
    const isNum = typeof c.score === "number";
    const color = isNum ? meta(c.score).color : "#0A8A70";
    const w = isNum ? c.score : 100;
    return '<div class="score-row"><div><div class="rname">' + c.role + '</div><div class="rdate">' +
      (isNum ? "20 randomized scenario questions" : "All four specialist exams passed") +
      '</div></div><div class="meter"><i style="width:' + w + '%;background:' + color + '"></i></div>' +
      '<div class="sc" style="color:' + color + '">' + c.score + "</div></div>";
  }).join("");
  rows += '<div class="score-row"><div><div class="rname">English proficiency <span class="badge b-cert">AI-scored</span></div>' +
    '<div class="rdate">From summary video · clarity, grammar, fluency</div></div>' +
    '<div class="meter"><i style="width:' + (v.english * 10) + '%;background:#0FB893"></i></div>' +
    '<div class="sc" style="color:#0A8A70">' + v.english + "</div></div>";
  rows += '<div class="score-row"><div><div class="rname">Answer speed rating</div>' +
    '<div class="rdate">Average time per exam question</div></div>' +
    '<div class="meter"><i style="width:88%;background:#0FB893"></i></div>' +
    '<div class="sc" style="color:#0A8A70">' + (v.answerSpeed || "A") + "</div></div>";
  set("pScores", rows);

  const hireTxt = (v.hireTypes || []).map(h => h === "hourly" ? "Hourly" : "Monthly").join(" or ") || "—";
  set("pFacts",
    '<li><span class="k">Hire types</span><span class="v">' + hireTxt + "</span></li>" +
    '<li><span class="k">Hours available</span><span class="v">Up to ' + v.hours + " / week</span></li>" +
    '<li><span class="k">Timezone</span><span class="v">' + v.tz + "</span></li>" +
    '<li><span class="k">Experience</span><span class="v">eBay dropshipping</span></li>' +
    '<li><span class="k">Heartbeat status</span><span class="v" style="color:#0A7A5F">Confirmed ' + confirmed + "</span></li>" +
    '<li><span class="k">Certificate</span><span class="v mono">verify/' + v.cert + "</span></li>");
  set("pBio", v.bio || "");
}

function renderContact(res) {
  const panel = document.getElementById("contactPanel");
  if (!panel) return;
  if (res.status === "ok") {
    const d = res.data || {};
    panel.className = "panel";
    panel.innerHTML = "<h3>🔓 Contact unlocked</h3>" +
      '<div style="background:#E9F8F2;border:1px solid #BFE8DA;border-radius:12px;padding:15px;font-size:13.5px">' +
      (d.fullName ? '<div style="padding:3px 0">👤 <b>' + d.fullName + "</b></div>" : "") +
      (d.whatsapp ? '<div style="padding:3px 0">📱 WhatsApp: <b>' + d.whatsapp + "</b></div>" : "") +
      (d.telegram ? '<div style="padding:3px 0">✈️ Telegram: <b>' + d.telegram + "</b></div>" : "") +
      (d.email ? '<div style="padding:3px 0">✉️ <b>' + d.email + "</b></div>" : "") +
      (d.links ? '<div style="padding:3px 0">🔗 ' + d.links.join(" · ") + "</div>" : "") +
      "</div>" +
      '<div style="color:#0A7A5F;font-weight:700;font-size:12.5px;margin-top:10px">✓ Saved to your employer dashboard — yours forever</div>' +
      (d.note ? '<div class="notebox" style="margin-top:10px">' + d.note + "</div>" : "");
    document.querySelectorAll("[data-unlock]").forEach(b => { b.textContent = "✓ Contact unlocked"; b.disabled = true; b.classList.remove("btn-amber"); b.classList.add("btn-teal"); });
    return;
  }
  // locked (or none)
  panel.className = "panel locked-panel";
  panel.innerHTML = '<div class="lock-ic">🔒</div><h3>Contact info is locked</h3>' +
    '<div class="ghost-line" style="width:70%"></div><div class="ghost-line" style="width:55%"></div><div class="ghost-line" style="width:64%"></div>' +
    '<p style="margin-top:12px">Full name, WhatsApp/Telegram, email, résumé, and OnlineJobs.ph / Upwork links reveal after unlock — and stay in your dashboard forever.</p>' +
    '<button class="btn btn-amber" id="unlockBtn" style="width:100%">Unlock for $29</button>' +
    '<div style="font-size:11px;color:var(--ink-soft);margin-top:8px">Demo: unlocking is simulated — no charge.</div>';
  const b = document.getElementById("unlockBtn");
  if (b) b.addEventListener("click", unlock);
}

async function unlock() {
  if (!auth.currentUser) {
    try { sessionStorage.setItem("trv_after_login", location.pathname + location.search); } catch (x) {}
    location.href = "login.html";
    return;
  }
  const ub = document.getElementById("unlockBtn");
  if (ub) { ub.disabled = true; ub.textContent = "Unlocking…"; }
  document.querySelectorAll("[data-unlock]").forEach(b => b.disabled = true);
  try {
    await createUnlock(currentVaId);
    renderContact(await getContact(currentVaId));
  } catch (e) {
    const p = document.getElementById("contactPanel");
    if (p) p.insertAdjacentHTML("beforeend", '<div class="autherr" style="display:block;margin-top:10px">Unlock failed: ' + (e.code || e.message) + "</div>");
    if (ub) { ub.disabled = false; ub.textContent = "Unlock for $29"; }
    document.querySelectorAll("[data-unlock]").forEach(b => b.disabled = false);
  }
}

async function init() {
  if (!document.getElementById("pName")) return;
  currentVaId = param("id");
  let v = null;
  try { v = await getVaProfile(currentVaId); } catch (e) { v = null; }
  if (!v) v = (window.TRV_VAS || []).find(x => x.id === currentVaId) || (window.TRV_VAS || [])[0];
  if (v) { currentVaId = v.id; renderPublic(normVa(v)); }

  document.querySelectorAll("[data-unlock]").forEach(b => b.addEventListener("click", unlock));

  // Load the (protected) contact once auth state is known, and re-check on login/logout.
  onAuthStateChanged(auth, async () => {
    renderContact(await getContact(currentVaId));
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
