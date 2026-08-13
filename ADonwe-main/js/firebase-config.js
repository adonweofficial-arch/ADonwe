// ADonWe - Firebase Configuration File
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// Firebase project configuration
const firebaseConfig = {
 apiKey: "AIzaSyD7WzNQcmTzZwBaHM5aZk6E-vX7fO4fbEg",
  authDomain: "adonwe.firebaseapp.com",
  projectId: "adonwe",
  storageBucket: "adonwe.firebasestorage.app",
  messagingSenderId: "170782043397",
  appId: "1:170782043397:web:7d1a4c87aa7a89c0af5b6c",
  measurementId: "G-QVVMVK08E6"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app, "default");
export default app;
