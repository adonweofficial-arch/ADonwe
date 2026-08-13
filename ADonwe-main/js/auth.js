// js/auth.js
// Thin wrapper around Firebase Auth. Only login.html and admin.html import
// this — public marketing pages don't need it.

import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function callAdminApi(path, options = {}) {
  const token = options.token || (await auth.currentUser?.getIdToken());
  if (!token) {
    throw new Error("User is not signed in");
  }

  const response = await fetch(`/api/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "same-origin",
    method: options.method || "GET",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Admin API ${path} failed`);
  }

  return response.json();
}

async function isAdminLocal(user) {
  if (!user?.email) return false;
  try {
    const email = normalizeEmail(user.email);
    const docRef = doc(db, "admins", email);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) return true;

    const adminQuery = query(
      collection(db, "admins"),
      where("email", "==", email)
    );
    const result = await getDocs(adminQuery);
    return !result.empty;
  } catch (err) {
    console.warn("[auth] local admin check failed:", err.message);
    return false;
  }
}

async function listAdminsLocal() {
  const snapshot = await getDocs(collection(db, "admins"));
  return snapshot.docs.map((docSnap) => ({ email: docSnap.id, ...docSnap.data() }));
}

async function listSubmissionsLocal() {
  const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

async function addAdminLocal(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Email is required");
  await setDoc(doc(db, "admins", normalized), {
    email: normalized,
    addedAt: new Date().toISOString(),
  });
  return { email: normalized };
}

async function removeAdminLocal(email) {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new Error("Email is required");
  await deleteDoc(doc(db, "admins", normalized));
  return { email: normalized };
}

export async function sendContactSubmission(submission) {
  try {
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || "Contact submission failed.");
    }

    return response.json();
  } catch (err) {
    console.warn("[auth] sendContactSubmission API failed, falling back to direct Firestore write:", err.message);
    try {
      const docRef = await addDoc(collection(db, "submissions"), {
        ...submission,
        createdAt: serverTimestamp(),
      });
      return { id: docRef.id };
    } catch (dbErr) {
      console.error("[auth] Firestore direct write failed:", dbErr.message);
      throw new Error(dbErr.message || "Unable to submit contact query.");
    }
  }
}

export async function isAdmin(user) {
  if (!user) return false;
  try {
    const token = await user.getIdToken();
    const response = await callAdminApi("check-admin", { token });
    return response.isAdmin === true;
  } catch (err) {
    console.warn("[auth] admin check failed, falling back to local Firestore check:", err.message);
    return isAdminLocal(user);
  }
}

export async function listAdmins() {
  try {
    return await callAdminApi("admins");
  } catch (err) {
    console.warn("[auth] admins API failed, using local Firestore fallback:", err.message);
    const admins = await listAdminsLocal();
    return { admins };
  }
}

export async function listSubmissions() {
  try {
    return await callAdminApi("submissions");
  } catch (err) {
    console.warn("[auth] submissions API failed, using local Firestore fallback:", err.message);
    const submissions = await listSubmissionsLocal();
    return { submissions };
  }
}

export async function addAdmin(email) {
  try {
    return await callAdminApi("admins", {
      method: "POST",
      body: { email },
    });
  } catch (err) {
    console.warn("[auth] addAdmin API failed, using local Firestore fallback:", err.message);
    return await addAdminLocal(email);
  }
}

export async function removeAdmin(email) {
  try {
    const encoded = encodeURIComponent(email);
    return await callAdminApi(`admins/${encoded}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("[auth] removeAdmin API failed, using local Firestore fallback:", err.message);
    return await removeAdminLocal(email);
  }
}

export function signInEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signInGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOutUser() {
  return signOut(auth);
}

export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function listLocationsLocal() {
  const q = query(collection(db, "locations"), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function addLocationLocal(id, locationData) {
  const docRef = doc(db, "locations", id);
  await setDoc(docRef, locationData);
  return { id, ...locationData };
}

export async function removeLocationLocal(id) {
  const docRef = doc(db, "locations", id);
  await deleteDoc(docRef);
  return { id };
}

export async function listLocations() {
  return await listLocationsLocal();
}

export async function addLocation(id, locationData) {
  return await addLocationLocal(id, locationData);
}

export async function removeLocation(id) {
  return await removeLocationLocal(id);
}
