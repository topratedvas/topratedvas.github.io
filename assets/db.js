/* ============================================================
   TopRatedVAs.com — Firestore data layer (Phase 5)
   Reads VA profiles + the protected contact doc + unlock records.
   Contact access is gated by security rules, not by this code.
   ============================================================ */
import {
  collection, getDocs, doc, getDoc, setDoc, serverTimestamp
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
    employerUid: u.uid, vaId, at: serverTimestamp()
  });
}
