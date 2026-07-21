/* ============================================================
   TopRatedVAs.com — admin seeder (Phase 5)
   Writes the 12 demo VAs (window.TRV_VAS) into Firestore:
     vaProfiles/{id}            → public profile (isExample:true)
     vaProfiles/{id}/private/contact → ghosted contact (protected)
   Only runs for the admin account (rules also enforce this).
   ============================================================ */
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { db, auth } from "./firebase.js";

const ADMIN_EMAILS = ["topratedvas@gmail.com", "dshenterpriseinc@gmail.com"];
const ADMIN_EMAIL = ADMIN_EMAILS[0]; // shown in prompts
const LAST = {
  "maria-d": "Dizon", "grace-t": "Tan", "jomar-p": "Pascual", "kevin-o": "Otieno",
  "priya-s": "Sharma", "carlos-m": "Mendoza", "ana-r": "Radic", "dmitri-k": "Kovalenko",
  "bea-l": "Lim", "samuel-a": "Adeyemi", "diana-c": "Castro", "rae-m": "Morales"
};

function log(msg) {
  const el = document.getElementById("seedLog");
  if (el) { el.textContent += msg + "\n"; el.scrollTop = el.scrollHeight; }
}

function contactFor(v, i) {
  const first = v.name.replace(/\s+\S\.$/, "");
  const num = String(1000 + i * 137 % 9000).padStart(4, "0");
  return {
    fullName: first + " " + (LAST[v.id] || "Cruz"),
    email: v.id.replace(/-/g, ".") + "@example.com",
    whatsapp: "+00 000 555 " + num,
    telegram: "@" + v.id.replace(/-/g, ""),
    links: ["OnlineJobs.ph profile", "Résumé PDF", "Upwork profile"],
    note: "Example profile — placeholder contact for demo."
  };
}

async function seedAll() {
  const vas = window.TRV_VAS || [];
  if (!vas.length) { log("No demo data found (TRV_VAS empty)."); return; }
  log("Seeding " + vas.length + " example profiles…");
  let n = 0;
  for (let i = 0; i < vas.length; i++) {
    const v = vas[i];
    const { id, certs, ...pub } = v;
    // Firestore forbids arrays-of-arrays, so store certs as objects.
    const certsMap = (certs || []).map(c => ({ role: c[0], score: c[1] }));
    await setDoc(doc(db, "vaProfiles", id), {
      ...pub, certs: certsMap, isExample: true, ownerUid: "system", status: "live", createdAt: serverTimestamp()
    });
    await setDoc(doc(db, "vaProfiles", id, "private", "contact"), contactFor(v, i));
    n++;
    log("  ✓ " + n + "/" + vas.length + "  " + v.name + "  (" + v.cert + ")");
  }
  log("Done — " + n + " example profiles + protected contacts seeded. ✅");
  log("Refresh Browse to see them load from Firestore (after Phase 5b).");
}

function init() {
  const gate = document.getElementById("seedGate");
  const panel = document.getElementById("seedPanel");
  onAuthStateChanged(auth, (user) => {
    const isAdmin = user && ADMIN_EMAILS.includes(user.email);
    gate.style.display = isAdmin ? "none" : "block";
    panel.style.display = isAdmin ? "block" : "none";
    if (!isAdmin) {
      gate.innerHTML = user
        ? "Signed in as <b>" + user.email + "</b>, but seeding requires the admin account (<b>" + ADMIN_EMAIL + "</b>). <a href='login.html'>Switch account</a>."
        : "Please <a href='login.html'>log in</a> (or <a href='signup.html'>sign up</a>) as <b>" + ADMIN_EMAIL + "</b> to seed the database.";
    } else {
      const btn = document.getElementById("seedBtn");
      btn.onclick = () => { btn.disabled = true; btn.textContent = "Seeding…"; seedAll().catch(e => log("ERROR: " + (e.code || e.message))).finally(() => { btn.disabled = false; btn.textContent = "Seed again"; }); };
    }
  });
}
document.addEventListener("DOMContentLoaded", init);
