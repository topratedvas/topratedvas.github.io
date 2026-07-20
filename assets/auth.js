/* ============================================================
   TopRatedVAs.com — Firebase Auth (Phase 4)
   Email/password signup + login for two roles (VA / Employer),
   role stored in Firestore users/{uid}, single active session,
   and role-based dashboard guarding.
   Loaded as <script type="module">.
   ============================================================ */
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc, setDoc, getDoc, updateDoc, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from "./firebase.js";

const SESSION_KEY = "trv_session";
const ROLE_DASH = { va: "va-dashboard.html", employer: "employer-dashboard.html" };

function newSessionId() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return Array.from(a, b => b.toString(16).padStart(2, "0")).join("");
}
function showError(msg) {
  const el = document.getElementById("authError");
  if (el) { el.textContent = msg; el.style.display = "block"; }
  else alert(msg);
}
function friendly(code) {
  const m = {
    "auth/invalid-email": "That doesn't look like a valid email address.",
    "auth/email-already-in-use": "An account with this email already exists — try logging in.",
    "auth/weak-password": "Password is too weak — use at least 6 characters.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/user-not-found": "No account found with this email.",
    "auth/too-many-requests": "Too many attempts — please wait a moment and try again.",
    "auth/network-request-failed": "Network error — check your connection and try again.",
    "permission-denied": "Account database isn't ready yet (Firestore rules not published). See setup."
  };
  return m[code] || ("Something went wrong (" + code + "). Please try again.");
}

/* ---------- SIGNUP ---------- */
async function handleSignup(e) {
  e.preventDefault();
  const f = e.target;
  const name = f.name.value.trim();
  const email = f.email.value.trim();
  const password = f.password.value;
  const role = (f.role && f.role.value) || "employer";
  const btn = f.querySelector('button[type="submit"]');
  btn.disabled = true; btn.textContent = "Creating account…";
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
    const sessionId = newSessionId();
    await setDoc(doc(db, "users", cred.user.uid), {
      role, name, email, sessionId, createdAt: serverTimestamp()
    });
    localStorage.setItem(SESSION_KEY, sessionId);
    window.location.href = ROLE_DASH[role] || ROLE_DASH.employer;
  } catch (err) {
    showError(friendly(err.code || err.message));
    btn.disabled = false; btn.textContent = "Create account";
  }
}

/* ---------- LOGIN ---------- */
async function handleLogin(e) {
  e.preventDefault();
  const f = e.target;
  const email = f.email.value.trim();
  const password = f.password.value;
  const btn = f.querySelector('button[type="submit"]');
  btn.disabled = true; btn.textContent = "Signing in…";
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    const data = snap.exists() ? snap.data() : { role: "employer" };
    const sessionId = newSessionId();
    await updateDoc(doc(db, "users", cred.user.uid), { sessionId });
    localStorage.setItem(SESSION_KEY, sessionId);
    window.location.href = ROLE_DASH[data.role] || ROLE_DASH.employer;
  } catch (err) {
    showError(friendly(err.code || err.message));
    btn.disabled = false; btn.textContent = "Sign in";
  }
}

/* ---------- DASHBOARD GUARD + SINGLE SESSION ---------- */
function guardDashboard(expectedRole) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) { window.location.href = "login.html"; return; }
    let data;
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      data = snap.exists() ? snap.data() : null;
    } catch (err) { data = null; }
    if (!data) { // no user doc (rules issue or new) — send to login
      window.location.href = "login.html";
      return;
    }
    if (data.role && data.role !== expectedRole) {
      window.location.href = ROLE_DASH[data.role] || "login.html";
      return;
    }
    // populate any auth-aware fields
    document.querySelectorAll("[data-auth-name]").forEach(el => el.textContent = data.name || user.email);
    document.querySelectorAll("[data-auth-email]").forEach(el => el.textContent = user.email);
    document.body.removeAttribute("data-auth-loading");

    // single active session: if the stored sessionId changes, we were signed out elsewhere
    onSnapshot(doc(db, "users", user.uid), (snap) => {
      const live = snap.data();
      const mine = localStorage.getItem(SESSION_KEY);
      if (live && live.sessionId && mine && live.sessionId !== mine) {
        localStorage.removeItem(SESSION_KEY);
        signOut(auth).finally(() => {
          window.location.href = "login.html?ended=1";
        });
      }
    });
  });
}

/* ---------- LOGOUT ---------- */
function wireLogout() {
  document.querySelectorAll("[data-logout]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem(SESSION_KEY);
      signOut(auth).finally(() => { window.location.href = "index.html"; });
    });
  });
}

/* ---------- INIT (per page) ---------- */
function init() {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const dashRole = document.body.getAttribute("data-auth");

  if (signupForm) signupForm.addEventListener("submit", handleSignup);
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
    if (new URLSearchParams(location.search).get("ended")) {
      showError("You were signed out because your account was used to sign in on another device.");
    }
  }
  wireLogout();
  if (dashRole === "va" || dashRole === "employer") guardDashboard(dashRole);
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
