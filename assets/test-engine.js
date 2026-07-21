/* ============================================================
   TopRatedVAs.com — Certification test engine (Phase 6)
   • Draws 20 of 30 (or all, if the bank is smaller) per attempt
   • Shuffles question order AND answer order — no two exams alike
   • Untimed, but answer-speed is scored (fast = full marks, slow costs)
   • Badge tiers: Certified 80+ / Pro 90+ / Elite 95+  (pass = 80)
   • Records attempts to users/{uid}.testAttempts and, on a pass,
     upserts the VA's public vaProfiles/{uid} listing (owner-writable —
     no Firestore rules change needed). Payments are SIMULATED in v1.
   Loaded as <script type="module"> alongside auth.js (which guards the
   page to VA accounts) and questions.js (the banks).
   ============================================================ */
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth, db } from "./firebase.js";

const PASS = 80;
const DRAW = 20;                 // scored MC questions per attempt (or the whole bank if smaller)
const FILL_DRAW = 3;             // typed "in your own words" questions shown after the MC (not scored)
const FAST_SEC = 40;             // <= this per question → full marks
const SLOW_SEC = 150;            // >= this → maximum speed penalty
const SPEED_FLOOR = 0.85;        // slowest correct answer still earns 85% of its point
const RETAKE_WAIT_DAYS = 7;      // free retake allowed after this wait
const scoreMeta = window.TRV_scoreMeta;

let USER = null;                 // firebase auth user
let UDATA = {};                  // users/{uid} doc data (incl. testAttempts)
let S = null;                    // active exam state

/* ---------- helpers ---------- */
function el(id) { return document.getElementById(id); }
function root() { return el("examRoot"); }
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function shuffle(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
function param(k) { return new URLSearchParams(location.search).get(k); }
function daysSince(ms) { return ms ? (Date.now() - ms) / 86400000 : Infinity; }
function initialsOf(name) { const p = String(name || "").trim().split(/\s+/); return ((p[0] || "?")[0] + (p[1] ? p[1][0] : "")).toUpperCase(); }
function certByKey(k) { return (window.TRV_CERTS || []).find(c => c.key === k); }

function speedMult(sec) {
  if (sec <= FAST_SEC) return 1;
  if (sec >= SLOW_SEC) return SPEED_FLOOR;
  return 1 - (1 - SPEED_FLOOR) * (sec - FAST_SEC) / (SLOW_SEC - FAST_SEC);
}
function ratingLetter(avgSec) { return avgSec <= 45 ? "A" : avgSec <= 90 ? "B" : "C"; }

// How many of the 4 specialist exams has this VA passed? (gates VA Manager)
function passedSpecialists() {
  const att = UDATA.testAttempts || {};
  return ["customer-service", "listing", "sourcing", "fulfillment"]
    .filter(k => att[k] && att[k].latestScore >= PASS).length;
}
// Retake state for a cert card.
function retakeInfo(key) {
  const att = (UDATA.testAttempts || {})[key];
  if (!att) return { taken: false };
  const freeEligible = !att.freeRetakeUsed && daysSince(att.lastAttemptAt) >= RETAKE_WAIT_DAYS;
  return { taken: true, latestScore: att.latestScore, freeEligible, lastAttemptAt: att.lastAttemptAt };
}

/* ============================================================
   1. PICKER — choose a certification to take
   ============================================================ */
function renderPicker() {
  const certs = window.TRV_CERTS || [];
  const passed4 = passedSpecialists();
  const cards = certs.map(c => {
    const ri = retakeInfo(c.key);
    const bank = (window.TRV_QUESTIONS[c.key] || []);
    const managerLocked = c.locked && passed4 < 4;
    let statusHtml, btnHtml;

    if (managerLocked) {
      statusHtml = '<span class="pill p-lock">🔒 Pass all 4 specialist exams first (' + passed4 + '/4)</span>';
      btnHtml = '<button class="btn btn-outline" disabled style="opacity:.55">Locked</button>';
    } else if (ri.taken && ri.latestScore >= PASS) {
      const m = scoreMeta(ri.latestScore);
      statusHtml = '<span class="pill p-live">✓ Passed · ' + ri.latestScore + ' · ' + m.label + '</span>';
      const label = ri.freeEligible ? "Free retake" : "Retake ($10)";
      btnHtml = '<button class="btn btn-outline" data-start="' + c.key + '">' + label + "</button>";
    } else if (ri.taken) {
      statusHtml = '<span class="pill p-pend">Not yet passed · best ' + ri.latestScore + '</span>';
      const label = ri.freeEligible ? "Free retake" : "Retake ($10)";
      btnHtml = '<button class="btn btn-teal" data-start="' + c.key + '">' + label + "</button>";
    } else {
      const fee = c.locked ? "FREE" : "$" + c.fee;
      statusHtml = '<span class="pill p-pend">Exam available — ' + fee + '</span>';
      btnHtml = '<button class="btn btn-teal" data-start="' + c.key + '">Start exam</button>';
    }

    return '<div class="stat" style="display:block;padding:20px">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px">' +
        '<div style="font-weight:800;font-size:15.5px">' + esc(c.role) + "</div>" + statusHtml +
      "</div>" +
      '<div style="font-size:13px;color:var(--ink-soft);margin-bottom:14px">' + esc(c.blurb) + "</div>" +
      '<div style="display:flex;justify-content:space-between;align-items:center">' +
        '<span class="mono" style="font-size:11.5px;color:var(--ink-soft)">Draws ' + Math.min(DRAW, bank.length) + " of " + bank.length + " · shuffled</span>" +
        btnHtml +
      "</div></div>";
  }).join("");

  root().innerHTML =
    '<div class="test-shell">' +
      '<div style="text-align:center;margin-bottom:8px"><h1 style="font-size:26px">Take a certification exam</h1>' +
      '<p style="color:var(--ink-soft);max-width:560px;margin:6px auto 0">Each exam is scenario-based and randomized — questions and answer choices are shuffled, and your answer speed is scored. Pass at 80+ to earn a badge.</p></div>' +
      '<div class="statrow" style="grid-template-columns:1fr 1fr;margin-top:22px">' + cards + "</div>" +
      '<div class="test-rules" style="margin-top:22px"><b>How scoring works</b>' +
      "Score = correct answers, adjusted by how quickly you answered each one. Quick answers earn full marks; ~1 minute is fine; long delays progressively reduce points (down to " + Math.round(SPEED_FLOOR * 100) + "% of a correct answer). Certified 80+ · Pro 90+ · Elite 95+. Latest score counts. Payments are simulated in this demo — no charge.</div>" +
    "</div>";

  root().querySelectorAll("[data-start]").forEach(b =>
    b.addEventListener("click", () => startRules(b.getAttribute("data-start"))));
}

/* ============================================================
   2. RULES gate — shown before every exam
   ============================================================ */
function startRules(key) {
  const c = certByKey(key);
  const bank = window.TRV_QUESTIONS[key] || [];
  if (!bank.length) { alert("This question bank is still being written (Phase 9)."); return; }
  const n = Math.min(DRAW, bank.length);
  root().innerHTML =
    '<div class="test-shell">' +
      '<div class="browse-head" style="border-radius:16px;margin-bottom:24px"><div class="wrap" style="padding:26px 24px">' +
        "<h1>" + esc(c.role) + " certification exam</h1>" +
        "<p>" + n + " randomized scenario questions · answer order shuffled · speed-scored · pass at " + PASS + "+.</p>" +
      "</div></div>" +
      '<div class="test-rules"><b>Exam rules (read before you start)</b>' +
        "Answers are selected by you alone — no copy-paste, no AI tools (detection active in the live system), no second device. " +
        "Your answer speed is tracked: quick answers score full marks, ~1 minute is fine, long delays progressively reduce points. " +
        "You may pause between questions. Latest score counts. It ends with a few short written questions (not scored) that employers will read. " +
        "Cheating = 1-year suspension; a second offense = lifetime ban.</div>" +
      '<div class="qcard" style="text-align:center">' +
        "<h2 style='margin-bottom:8px'>Ready when you are</h2>" +
        '<p style="color:var(--ink-soft);margin-bottom:20px">The timer starts on the first question. Give your honest best answer to each scenario.</p>' +
        '<div style="display:flex;gap:11px;justify-content:center">' +
          '<button class="btn btn-teal btn-big" id="beginBtn">Begin exam →</button>' +
          '<button class="btn btn-outline" id="backPick">← Back</button>' +
        "</div></div></div>";
  el("beginBtn").addEventListener("click", () => beginExam(key));
  el("backPick").addEventListener("click", renderPicker);
}

/* ============================================================
   3. EXAM — one question at a time
   ============================================================ */
let timer = null;

function beginExam(key) {
  const c = certByKey(key);
  const bank = window.TRV_QUESTIONS[key] || [];
  const picked = shuffle(bank).slice(0, Math.min(DRAW, bank.length));
  const questions = picked.map(item => {
    const opts = item.options.map((text, i) => ({ text, correct: i === item.answer }));
    const shuffled = shuffle(opts);
    return { scenario: item.scenario || "", q: item.q, options: shuffled };
  });
  const fillins = shuffle(window.TRV_FILLINS && window.TRV_FILLINS[key] || []).slice(0, FILL_DRAW);
  S = { key, role: c.role, questions, idx: 0, answers: [],
        qActiveMs: 0, lastTick: Date.now(), paused: false, chosen: null,
        fillins, fillIdx: 0, fillAnswers: [] };
  renderQuestion();
}

function fmtTime(ms) { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }

function renderQuestion() {
  stopTimer();
  const q = S.questions[S.idx];
  S.qActiveMs = 0; S.lastTick = Date.now(); S.paused = false; S.chosen = null;
  const total = S.questions.length;
  const scen = q.scenario
    ? '<div class="q-ctx"><div class="q-ctx-tag">Scenario</div>' + esc(q.scenario) + "</div>"
    : "";
  const opts = q.options.map((o, i) =>
    '<div class="opt" data-opt="' + i + '"><span class="key">' + "ABCD"[i] + "</span><span>" + esc(o.text) + "</span></div>").join("");

  root().innerHTML =
    '<div class="test-shell">' +
      '<div class="test-top"><span class="mono">QUESTION ' + (S.idx + 1) + " / " + total + " · " + esc(S.role.toUpperCase()) + "</span>" +
        '<span class="mono" id="qTimer">⏱ 0:00 on this question</span></div>' +
      '<div class="qcard">' + scen +
        "<h2>" + esc(q.q) + "</h2>" + opts +
        '<div class="speed"><span>Answer speed</span><div class="track"><i id="speedBar"></i></div>' +
        '<span id="speedLabel" style="color:#0A8A70;font-weight:700">Full marks zone</span></div>' +
        '<div style="display:flex;gap:11px">' +
          '<button class="btn btn-teal btn-big" style="flex:1;opacity:.6" id="submitBtn" disabled>Submit answer →</button>' +
          '<button class="btn btn-outline" id="pauseBtn">⏸ Pause</button>' +
        "</div></div></div>";

  root().querySelectorAll(".opt").forEach(o =>
    o.addEventListener("click", () => {
      root().querySelectorAll(".opt").forEach(x => x.classList.remove("sel"));
      o.classList.add("sel");
      S.chosen = parseInt(o.getAttribute("data-opt"), 10);
      const sb = el("submitBtn"); sb.disabled = false; sb.style.opacity = "1";
    }));
  el("submitBtn").addEventListener("click", submitAnswer);
  el("pauseBtn").addEventListener("click", togglePause);
  startTimer();
}

function startTimer() {
  S.lastTick = Date.now();
  timer = setInterval(() => {
    if (S.paused) return;
    const now = Date.now();
    S.qActiveMs += now - S.lastTick; S.lastTick = now;
    const sec = S.qActiveMs / 1000;
    const tEl = el("qTimer"); if (tEl) tEl.textContent = "⏱ " + fmtTime(S.qActiveMs) + " on this question";
    const bar = el("speedBar"); const lab = el("speedLabel");
    if (bar) bar.style.width = Math.min(100, 8 + sec / SLOW_SEC * 92) + "%";
    if (lab) {
      if (sec <= FAST_SEC) { lab.textContent = "Full marks zone"; lab.style.color = "#0A8A70"; bar.style.background = "var(--teal)"; }
      else if (sec <= 90) { lab.textContent = "Good — slight speed cost"; lab.style.color = "#9A6A10"; bar.style.background = "#E8901A"; }
      else { lab.textContent = "Slower — costing points"; lab.style.color = "#B02A1F"; bar.style.background = "#E25555"; }
    }
  }, 250);
}
function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

function togglePause() {
  S.paused = !S.paused;
  const btn = el("pauseBtn");
  if (S.paused) { btn.textContent = "▶ Resume"; btn.classList.add("btn-teal"); btn.classList.remove("btn-outline"); }
  else { btn.textContent = "⏸ Pause"; btn.classList.remove("btn-teal"); btn.classList.add("btn-outline"); S.lastTick = Date.now(); }
}

function submitAnswer() {
  if (S.chosen == null) return;
  stopTimer();
  const q = S.questions[S.idx];
  const correct = !!q.options[S.chosen].correct;
  S.answers.push({ correct, sec: S.qActiveMs / 1000 });
  if (S.idx < S.questions.length - 1) { S.idx++; renderQuestion(); }
  else if (S.fillins.length) { S.fillIdx = 0; renderFill(); }
  else finishExam();
}

/* ---------- Typed "in your own words" questions (not scored) ---------- */
function renderFill() {
  stopTimer();
  const prompt = S.fillins[S.fillIdx];
  const nOf = (S.fillIdx + 1) + " of " + S.fillins.length;
  const last = S.fillIdx >= S.fillins.length - 1;
  root().innerHTML =
    '<div class="test-shell">' +
      '<div class="test-top"><span class="mono">WRITTEN ANSWER ' + nOf + " · " + esc(S.role.toUpperCase()) + "</span>" +
        '<span class="mono">Not scored</span></div>' +
      '<div class="qcard">' +
        '<div class="q-ctx"><div class="q-ctx-tag">In your own words</div>Employers read these to see how you think. Type your own answer — pasting is turned off. There is no single right answer.</div>' +
        "<h2>" + esc(prompt) + "</h2>" +
        '<textarea id="fillBox" maxlength="900" placeholder="Type your answer here…" style="width:100%;min-height:150px;border:1px solid var(--line);border-radius:12px;padding:14px;font-family:inherit;font-size:15px;line-height:1.5;background:#FCFBF7;outline:none;resize:vertical"></textarea>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">' +
          '<span class="mono" style="font-size:11.5px;color:var(--ink-soft)" id="fillCnt">0 / 900</span>' +
          '<span style="font-size:11.5px;color:var(--ink-soft)">🔒 Paste disabled</span></div>' +
        '<div style="display:flex;gap:11px;margin-top:14px">' +
          '<button class="btn btn-teal btn-big" style="flex:1" id="fillBtn">' + (last ? "Finish exam →" : "Next →") + "</button></div>" +
      "</div></div>";
  const box = el("fillBox"), cnt = el("fillCnt");
  ["paste", "drop"].forEach(ev => box.addEventListener(ev, e => e.preventDefault()));
  box.addEventListener("input", () => { cnt.textContent = box.value.length + " / 900"; });
  el("fillBtn").addEventListener("click", submitFill);
  box.focus();
}
function submitFill() {
  S.fillAnswers[S.fillIdx] = (el("fillBox").value || "").trim();
  if (S.fillIdx < S.fillins.length - 1) { S.fillIdx++; renderFill(); }
  else finishExam();
}

/* ============================================================
   4. RESULT — score, badge, record to Firestore
   ============================================================ */
async function finishExam() {
  const n = S.answers.length;
  const speedAdj = S.answers.reduce((s, a) => s + (a.correct ? speedMult(a.sec) : 0), 0);
  const rawCorrect = S.answers.filter(a => a.correct).length;
  const avgSec = S.answers.reduce((s, a) => s + a.sec, 0) / n;
  const score = Math.round(100 * speedAdj / n);
  const rating = ratingLetter(avgSec);
  const passed = score >= PASS;
  const m = scoreMeta(score);

  root().innerHTML =
    '<div class="test-shell">' +
      '<div class="qcard" style="text-align:center">' +
        (passed
          ? '<div style="font-size:44px">🎉</div><h2 style="font-size:24px;margin:6px 0">You passed — ' + esc(S.role) + "!</h2>"
          : '<div style="font-size:44px">📝</div><h2 style="font-size:24px;margin:6px 0">Exam complete</h2>') +
        '<div style="font-family:\'Spline Sans Mono\';font-size:56px;font-weight:600;color:' + m.color + ';line-height:1">' + score + "</div>" +
        (passed
          ? '<div style="margin:6px 0 4px"><span class="badge ' + m.badge + '" style="font-size:13px">' + m.label + " · " + esc(S.role) + "</span></div>"
          : '<div style="color:var(--ink-soft);margin:6px 0">Not certified yet — you need ' + PASS + "+ to earn a badge.</div>") +
        '<div class="statrow" style="grid-template-columns:repeat(3,1fr);margin:20px 0">' +
          '<div class="stat"><div class="sv">' + rawCorrect + "/" + n + '</div><div class="sl">Correct answers</div></div>' +
          '<div class="stat"><div class="sv">' + Math.round(avgSec) + 's</div><div class="sl">Avg time / question</div></div>' +
          '<div class="stat"><div class="sv">' + rating + '</div><div class="sl">Answer-speed rating</div></div>' +
        "</div>" +
        '<div id="saveNote" class="notebox" style="text-align:left">💾 Saving your result…</div>' +
        '<div style="display:flex;gap:11px;justify-content:center;margin-top:18px">' +
          '<a class="btn btn-teal" href="va-dashboard.html">Go to my dashboard →</a>' +
          '<button class="btn btn-outline" id="againBtn">Take another exam</button>' +
        "</div>" +
        '<div style="font-size:11px;color:var(--ink-soft);margin-top:14px">Auto-graded instantly. In the live system an AI reviewer also checks your typed answers and proof videos — simulated in this demo.</div>' +
      "</div></div>";
  el("againBtn").addEventListener("click", renderPicker);

  const written = (S.fillins || []).map((q, i) => ({ q, a: (S.fillAnswers[i] || "") })).filter(x => x.a);
  try {
    await recordResult(S.key, S.role, score, Math.round(avgSec), rating, passed, written);
    const note = el("saveNote");
    if (note) note.innerHTML = passed
      ? "✅ Saved to your account." + (written.length ? " Your written answers were saved and will show on your profile so employers can read them." : "") + " <b>Next:</b> complete your listing (rates, location, bio) to go live on Browse."
      : "✅ Attempt saved. You can retake this exam (1 free retake after a 7-day wait, then $10 — simulated). Your latest score always counts.";
  } catch (e) {
    const note = el("saveNote");
    if (note) { note.style.background = "#FDECEA"; note.style.borderColor = "#F5C6Cb"; note.style.color = "#8A2A22";
      note.textContent = "⚠ Couldn't save your result (" + (e.code || e.message) + "). Your score above is still valid — try again from the dashboard."; }
  }
}

async function recordResult(key, role, score, avgSec, rating, passed, written) {
  if (!USER) throw new Error("not-signed-in");
  const uref = doc(db, "users", USER.uid);
  const attempts = Object.assign({}, UDATA.testAttempts || {});
  const prev = attempts[key] || { history: [], freeRetakeUsed: false };
  // Consuming a free retake: had a prior attempt, waited 7 days, hadn't used it.
  const usedFreeRetake = prev.history.length > 0 && !prev.freeRetakeUsed && daysSince(prev.lastAttemptAt) >= RETAKE_WAIT_DAYS;
  const history = (prev.history || []).concat([{ score, avgSec, rating, passed, at: Date.now() }]);
  attempts[key] = {
    role, latestScore: score, lastAttemptAt: Date.now(),
    freeRetakeUsed: prev.freeRetakeUsed || usedFreeRetake, history
  };
  UDATA.testAttempts = attempts;
  await setDoc(uref, { testAttempts: attempts }, { merge: true });
  if (passed) await upsertProfileCert(key, role, score, written);
}

// Create/refresh the VA's public listing with the latest cert (latest score counts).
async function upsertProfileCert(key, role, score, written) {
  const pref = doc(db, "vaProfiles", USER.uid);
  let snap = null;
  try { snap = await getDoc(pref); } catch (e) { snap = null; }
  const existing = snap && snap.exists() ? snap.data() : null;
  const name = UDATA.name || USER.displayName || (USER.email || "VA").split("@")[0];

  let certs = existing ? (existing.certs || []).slice() : [];
  const idx = certs.findIndex(c => c.role === role);
  if (idx >= 0) certs[idx] = { role, score }; else certs.push({ role, score });
  const best = Math.max.apply(null, certs.map(c => typeof c.score === "number" ? c.score : 0).concat([0]));
  const m = scoreMeta(best);
  const h = parseInt(USER.uid.slice(0, 6), 36);
  const certId = "TR-" + String(2000 + (Number.isFinite(h) ? h % 8000 : 0));

  const base = existing || {
    ownerUid: USER.uid, isExample: false, status: "pending-listing",
    name, initials: initialsOf(name), grad: "linear-gradient(135deg,#0FB893,#0A6E5A)",
    flag: "🌐", city: "", country: "", tz: "", bio: "",
    avail: "av-now", availLabel: "Available now", hireTypes: [], hours: 40,
    hourly: null, monthly: null, negotiable: true, english: 8, answerSpeed: "A",
    stars: "☆☆☆☆☆", rating: "—", reviews: 0, unlocks: "", cert: certId, createdAt: Date.now()
  };
  base.ownerUid = USER.uid;                 // rules require this on every write
  base.certs = certs;
  base.tier = m.tier; base.tierLabel = m.label;
  if (written && written.length) {          // typed answers, keyed by cert, for employers to read
    const wr = Object.assign({}, existing && existing.writtenResponses || {});
    wr[key] = written;
    base.writtenResponses = wr;
  }
  await setDoc(pref, base, { merge: true });
}

/* ============================================================
   INIT — wait for auth, then show the picker (or a deep-linked exam)
   ============================================================ */
function showSignedOut() {
  root().innerHTML =
    '<div class="test-shell"><div class="qcard" style="text-align:center">' +
      '<div style="font-size:40px">🔒</div><h2>Log in as a VA to take an exam</h2>' +
      '<p style="color:var(--ink-soft);margin:8px 0 18px">Certification exams and your scores are saved to your VA account.</p>' +
      '<div style="display:flex;gap:11px;justify-content:center">' +
        '<a class="btn btn-teal" href="login.html">Log in</a>' +
        '<a class="btn btn-outline" href="signup.html">Create a VA account</a>' +
      "</div></div></div>";
}

function init() {
  if (!root()) return;
  onAuthStateChanged(auth, async (user) => {
    if (!user) { showSignedOut(); return; }
    USER = user;
    try { const s = await getDoc(doc(db, "users", user.uid)); UDATA = s.exists() ? s.data() : {}; }
    catch (e) { UDATA = {}; }
    const deep = param("cert");
    if (deep && certByKey(deep)) startRules(deep); else renderPicker();
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
