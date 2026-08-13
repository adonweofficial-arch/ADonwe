const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

const serviceAccountPath = path.resolve(__dirname, "serviceAccountKey.json");

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized successfully.");
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error.message);
  console.error("Make sure serviceAccountKey.json exists and contains valid credentials.");
  process.exit(1);
}

const auth = admin.auth();
const firestore = getFirestore(admin.app(), "default");

async function listAdmins() {
  try {
    const snapshot = await firestore.collection("admins").limit(10).get();
    console.log("Admins documents:");
    snapshot.forEach((doc) => {
      console.log(`${doc.id} =>`, doc.data());
    });
  } catch (err) {
    console.error("Error reading admins collection:", err.message);
  }
}

listAdmins().catch((err) => {
  console.error(err);
  process.exit(1);
});
