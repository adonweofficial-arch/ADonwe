const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const express = require("express");

admin.initializeApp();
const db = getFirestore(admin.app(), "default");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

const app = express();
app.use(express.json());

// Middleware to validate Firebase ID token from Authorization header.
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ error: "Unauthorized" });
  }
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function checkAdmin(uid, email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) return false;
  const adminDoc = await db.collection("admins").doc(normalizedEmail).get();
  return adminDoc.exists;
}

app.get("/check-admin", authenticate, async (req, res) => {
  try {
    const isAdmin = await checkAdmin(req.user.uid, req.user.email);
    return res.json({ isAdmin });
  } catch (err) {
    console.error("Admin check failed:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/admins", authenticate, async (req, res) => {
  try {
    const isAdminUser = await checkAdmin(req.user.uid, req.user.email);
    if (!isAdminUser) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const snapshot = await db.collection("admins").get();
    const admins = snapshot.docs.map((doc) => ({ email: doc.id, ...doc.data() }));
    return res.json({ admins });
  } catch (err) {
    console.error("List admins failed:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/admins", authenticate, async (req, res) => {
  try {
    const isAdminUser = await checkAdmin(req.user.uid, req.user.email);
    if (!isAdminUser) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const email = normalizeEmail(req.body?.email);
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await db.collection("admins").doc(email).set({
      addedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: normalizeEmail(req.user.email) || null,
    });

    return res.status(201).json({ email });
  } catch (err) {
    console.error("Add admin failed:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/admins/:email", authenticate, async (req, res) => {
  try {
    const isAdminUser = await checkAdmin(req.user.uid, req.user.email);
    if (!isAdminUser) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const email = normalizeEmail(decodeURIComponent(req.params.email));
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await db.collection("admins").doc(email).delete();
    return res.json({ email });
  } catch (err) {
    console.error("Remove admin failed:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

function validateSubmission(data) {
  const required = ["fullName", "email", "phone", "iType", "city", "message"];
  return required.every((key) => typeof data[key] === "string" && data[key].trim().length > 0);
}

app.post("/submissions", async (req, res) => {
  try {
    const submission = req.body;
    if (!submission || !validateSubmission(submission)) {
      return res.status(400).json({ error: "Invalid submission payload." });
    }

    const docRef = await db.collection("submissions").add({
      fullName: submission.fullName.trim(),
      company: submission.company?.trim() || null,
      email: submission.email.trim(),
      phone: submission.phone.trim(),
      iType: submission.iType.trim(),
      city: submission.city.trim(),
      service: submission.service?.trim() || null,
      budget: submission.budget?.trim() || null,
      message: submission.message.trim(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.status(201).json({ id: docRef.id });
  } catch (err) {
    console.error("Submit contact failed:", err);
    return res.status(500).json({ error: "Unable to save submission." });
  }
});

app.get("/submissions", authenticate, async (req, res) => {
  try {
    const isAdminUser = await checkAdmin(req.user.uid, req.user.email);
    if (!isAdminUser) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const snapshot = await db.collection("submissions").orderBy("createdAt", "desc").get();
    const submissions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.json({ submissions });
  } catch (err) {
    console.error("List submissions failed:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.api = functions.https.onRequest(app);
