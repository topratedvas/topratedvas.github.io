/* ============================================================
   TopRatedVAs.com — Browse: load VA profiles from Firestore
   (falls back to the static examples if Firestore is empty/offline),
   render cards, and wire all filters. ES module.
   ============================================================ */
import { getVaProfiles } from "./db.js";

const meta = window.TRV_scoreMeta;
const badgeFor = { elite: "b-elite", pro: "b-pro", cert: "b-cert" };
let VAS = [];

// certs may come as {role,score} (Firestore) or [role,score] (static) — normalize.
function normCerts(certs) { return (certs || []).map(c => Array.isArray(c) ? { role: c[0], score: c[1] } : c); }
function normVa(v) { return Object.assign({}, v, { certs: normCerts(v.certs) }); }

function rateDisplay(v) { return v.hourly != null ? "$" + Number(v.hourly).toFixed(2) + "/hr" : "$" + v.monthly + "/mo"; }
function rateSub(v) {
  if (v.hourly != null && v.monthly != null) return "or $" + v.monthly + "/mo full-time";
  if (v.hourly != null) return (v.hours >= 35 ? "up to " + v.hours + " hrs/wk" : v.hours + " hrs/wk part-time");
  return v.negotiable ? "full-time · negotiable" : "full-time";
}

function cardHTML(v) {
  const certs = v.certs.map(c => {
    const color = typeof c.score === "number" ? meta(c.score).color : "#0A8A70";
    return '<div class="certline"><span class="cl-name">' + c.role + '</span><span class="cl-score" style="color:' + color + '">' + c.score + "</span></div>";
  }).join("");
  return "" +
    '<a class="vacard demo" href="profile.html?id=' + v.id + '">' +
      '<div class="top">' +
        '<div class="avatar" style="background:' + v.grad + '">' + v.initials + "</div>" +
        '<div><div class="name">' + v.name + ' <span class="badge ' + badgeFor[v.tier] + '">' + v.tierLabel + '</span></div><div class="loc">' + v.flag + " " + v.city + ", " + v.country + " · " + v.tz + "</div></div>" +
      "</div>" +
      '<div><span class="avail ' + v.avail + '">' + v.availLabel + "</span>" + (v.unlocks ? '<span class="unlocked-n">🔥 ' + v.unlocks + "</span>" : "") + "</div>" +
      '<div class="certs">' + certs + "</div>" +
      '<div class="starline"><span class="stars">' + v.stars + "</span> <b>" + v.rating + " (" + v.reviews + ")</b> verified reviews</div>" +
      '<div class="foot">' +
        '<div class="rate">' + rateDisplay(v) + "<small>" + rateSub(v) + "</small></div>" +
        '<div class="eng">English<br><b>' + v.english + "/10</b></div>" +
      "</div>" +
    "</a>";
}

function checkedValues(name) {
  return Array.prototype.slice.call(document.querySelectorAll('input[data-filter="' + name + '"]:checked')).map(el => el.value);
}
function val(id) { const el = document.getElementById(id); return el ? el.value : "any"; }
function passRate(v, s) {
  if (s === "any") return true;
  if (s === "h3") return v.hourly != null && v.hourly <= 3;
  if (s === "h5") return v.hourly != null && v.hourly <= 5;
  if (s === "m600") return v.monthly != null && v.monthly <= 600;
  if (s === "m900") return v.monthly != null && v.monthly <= 900;
  return true;
}
function passEnglish(v, s) { return s === "any" ? true : v.english >= parseInt(s, 10); }
function passHours(v, s) {
  if (s === "any") return true;
  if (s === "full") return v.hours >= 35;
  if (s === "mid") return v.hours >= 20 && v.hours < 35;
  if (s === "low") return v.hours >= 10 && v.hours < 20;
  return true;
}

function apply() {
  const certs = checkedValues("cert"), levels = checkedValues("level"),
        hires = checkedValues("hire"), avails = checkedValues("avail");
  const rate = val("fRate"), eng = val("fEnglish"), hours = val("fHours"), sort = val("fSort");

  let out = VAS.filter(v => {
    if (certs.length && !v.certs.some(c => certs.indexOf(c.role) !== -1)) return false;
    if (levels.length && levels.indexOf(v.tier) === -1) return false;
    if (hires.length && !hires.some(h => (v.hireTypes || []).indexOf(h) !== -1)) return false;
    if (avails.length && avails.indexOf(v.avail) === -1) return false;
    if (!passRate(v, rate)) return false;
    if (!passEnglish(v, eng)) return false;
    if (!passHours(v, hours)) return false;
    return true;
  });

  const maxScore = v => Math.max.apply(null, v.certs.map(c => typeof c.score === "number" ? c.score : 0).concat([0]));
  const minRate = v => v.hourly != null ? v.hourly : (v.monthly / 160);
  if (sort === "score") out.sort((a, b) => maxScore(b) - maxScore(a));
  else if (sort === "rate") out.sort((a, b) => minRate(a) - minRate(b));
  else if (sort === "reviews") out.sort((a, b) => b.reviews - a.reviews);

  const grid = document.getElementById("vaGrid");
  grid.innerHTML = out.length ? out.map(cardHTML).join("")
    : '<div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--ink-soft)">No VAs match these filters. Try clearing a few.</div>';

  const now = out.filter(v => v.avail === "av-now").length;
  const c = document.getElementById("vaCount"); if (c) c.textContent = out.length;
  const n = document.getElementById("vaNow"); if (n) n.textContent = now + " available now";
}

async function load() {
  const statics = (window.TRV_VAS || []).map(normVa);
  let remote = [];
  try { remote = (await getVaProfiles()).map(normVa); } catch (e) { remote = []; }
  // Only show listings that are live (seeded examples are live). Real VAs
  // start as "pending-listing" after passing a test and appear once they
  // finish their listing details (Phase 6b).
  remote = remote.filter(v => v.isExample || v.status === "live");
  if (remote.length) {
    // preserve the curated static order, then append any extras (real VAs)
    const order = {}; statics.forEach((v, i) => order[v.id] = i);
    remote.sort((a, b) => (order[a.id] ?? 999) - (order[b.id] ?? 999));
    VAS = remote;
  } else {
    VAS = statics;
  }
}

async function init() {
  const grid = document.getElementById("vaGrid");
  if (!grid) return;
  grid.innerHTML = '<div style="grid-column:1/-1;padding:40px;text-align:center;color:var(--ink-soft)">Loading certified VAs…</div>';
  await load();
  document.querySelectorAll(".frail input, .frail select, #fSort").forEach(el => el.addEventListener("change", apply));
  apply();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
