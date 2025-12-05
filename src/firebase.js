import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth
/**
 * Firebase Auth instance yang digunakan di aplikasi.
 *
 * Instance ini dipakai untuk operasi autentikasi (login, logout, token) di seluruh aplikasi.
 */
export const auth = getAuth(app);

// Ensure auth persists across tabs and refresh
setPersistence(auth, browserLocalPersistence).catch(() => {
  // ignore persistence errors silently
});

// Export Firestore
/**
 * Firebase Firestore instance (tidak selalu dipakai oleh semua fitur, tapi diekspor untuk kemudahan).
 */
export const db = getFirestore(app);

// Configure Auth Providers
/**
 * Provider OAuth untuk Google dan GitHub (digunakan pada login via popup).
 */
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Set scopes untuk Google
googleProvider.addScope('profile')
googleProvider.addScope('email')

// Set scopes untuk GitHub
githubProvider.addScope('user:email')