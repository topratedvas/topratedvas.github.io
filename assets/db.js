/* ============================================================
   TopRatedVAs.com — Firestore data layer (Phase 5)
   Reads VA profiles + the protected contact doc + unlock records.
   Contact access is gated by security rules, not by this code.
   ============================================================ */
import {
  collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc,
  query, where, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db, auth } from "./firebase.js";

// All public VA profiles (browsing is public).
export async function getVaProfiles() {
  const snap = await getDocs(collection(db, "vaProfiles"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// One public VA profile, or null.
export async function getVaProfile(id) {
  const d = await getDoc(doc(db, "vaProfiles", id));
  return d.exists() ? { id: d.id, ...d.data() } : null;
}

// The ghosted contact. Returns:
//   { status: "ok", data }   → allowed (owner / unlocked / admin)
//   { status: "locked" }     → rules denied the read (not unlocked)
//   { status: "none" }       → allowed but no contact doc exists
//   { status: "error", ... } → unexpected
export async function getContact(vaId) {
  try {
    const d = await getDoc(doc(db, "vaProfiles", vaId, "private", "contact"));
    return d.exists() ? { status: "ok", data: d.data() } : { status: "none" };
  } catch (e) {
    return { status: e.code === "permission-denied" ? "locked" : "error", message: e.message };
  }
}

// Does the current employer already hold an unlock for this VA?
export async function hasUnlock(vaId) {
  const u = auth.currentUser;
  if (!u) return false;
  try {
    const d = await getDoc(doc(db, "unlocks", u.uid + "_" + vaId));
    return d.exists();
  } catch (e) { return false; }
}

// Create an unlock record (simulated purchase in v1 — real credit/payment
// gating arrives in Phase 7). Doc id MUST be `${uid}_${vaId}` so the contact
// rule's exists() check can find it.
export async function createUnlock(vaId) {
  const u = auth.currentUser;
  if (!u) throw new Error("You must be logged in as an employer to unlock a VA.");
  await setDoc(doc(db, "unlocks", u.uid + "_" + vaId), {
    employerUid: u.uid, vaId, at: serverTimestamp(), status: "unlocked"
  }, { merge: true });
}

/* ============================================================
   EMPLOYER data layer (Phase 7) — unlocks-as-CRM, credits,
   verified reviews, saves. All gated by the security rules.
   ============================================================ */
const DEMO_GRANT = 3;

// Every VA this employer has unlocked (kept forever) with their CRM data.
export async function getMyUnlocks() {
  const u = auth.currentUser; if (!u) return [];
  const q = query(collection(db, "unlocks"), where("employerUid", "==", u.uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
// Update the employer's private CRM fields on an unlock (status, notes, surveys…).
export async function updateUnlock(vaId, patch) {
  const u = auth.currentUser; if (!u) throw new Error("Not signed in.");
  await updateDoc(doc(db, "unlocks", u.uid + "_" + vaId), patch);
}
// Fetch several public VA profiles by id (to enrich the unlock rows).
export async function getProfilesByIds(ids) {
  const out = {};
  await Promise.all((ids || []).map(async id => {
    try { const d = await getDoc(doc(db, "vaProfiles", id)); if (d.exists()) out[id] = { id, ...d.data() }; } catch (e) {}
  }));
  return out;
}

// Credits wallet — created with a few demo credits on first use.
export async function getCredits() {
  const u = auth.currentUser; if (!u) return { balance: 0, ledger: [] };
  const ref = doc(db, "credits", u.uid);
  const d = await getDoc(ref);
  if (d.exists()) return d.data();
  const seed = { balance: DEMO_GRANT, ledger: [{ type: "grant", amount: DEMO_GRANT, note: "Welcome — demo credits", at: Date.now() }] };
  try { await setDoc(ref, seed); } catch (e) {}
  return seed;
}
export async function addCredits(amount, type, note) {
  const u = auth.currentUser; if (!u) throw new Error("Not signed in.");
  const cur = await getCredits();
  const ledger = (cur.ledger || []).concat([{ type, amount, note, at: Date.now() }]);
  const balance = Math.round(((cur.balance || 0) + amount) * 100) / 100;
  await setDoc(doc(db, "credits", u.uid), { balance, ledger }, { merge: true });
  return { balance, ledger };
}

// Verified reviews (public read; write only if you unlocked the VA).
export async function getReviewsForVa(vaId) {
  const q = query(collection(db, "reviews"), where("vaId", "==", vaId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function getMyReviews() {
  const u = auth.currentUser; if (!u) return [];
  const q = query(collection(db, "reviews"), where("employerUid", "==", u.uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function leaveReview(vaId, rating, text, label) {
  const u = auth.currentUser; if (!u) throw new Error("Not signed in.");
  await setDoc(doc(db, "reviews", u.uid + "_" + vaId),
    { employerUid: u.uid, vaId, rating, text, label: label || "", at: Date.now() }, { merge: true });
}

// Saves / shortlist.
export async function getSaves() {
  const u = auth.currentUser; if (!u) return [];
  const q = query(collection(db, "saves"), where("employerUid", "==", u.uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function isSaved(vaId) {
  const u = auth.currentUser; if (!u) return false;
  try { return (await getDoc(doc(db, "saves", u.uid + "_" + vaId))).exists(); } catch (e) { return false; }
}
export async function addSave(vaId, snap) {
  const u = auth.currentUser; if (!u) throw new Error("Not signed in.");
  await setDoc(doc(db, "saves", u.uid + "_" + vaId), Object.assign({ employerUid: u.uid, vaId, at: Date.now() }, snap || {}));
}
export async function removeSave(vaId) {
  const u = auth.currentUser; if (!u) throw new Error("Not signed in.");
  await deleteDoc(doc(db, "saves", u.uid + "_" + vaId));
}
