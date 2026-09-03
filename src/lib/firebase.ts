import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore';

/**
 * Firebase Client SDK Configuration
 * Sourced from Vite-compatible environment variables.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

// Verify if the mandatory client configuration parameters are present
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'MY_FIREBASE_API_KEY' &&
  firebaseConfig.projectId !== 'MY_FIREBASE_PROJECT_ID'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    try {
      db = initializeFirestore(app, {
        experimentalForceLongPolling: true,
      });
      console.log('[Cyvora Firestore] Initialized Firestore with experimentalForceLongPolling: true for robust cloud container streaming.');
    } catch {
      db = getFirestore(app);
      console.log('[Cyvora Firestore] Initialized Firestore with default getFirestore.');
    }
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  } catch (error) {
    console.error('[Cyvora Firestore] Failed to initialize Firebase Client App & Firestore:', error);
  }
} else {
  console.warn(
    '[Cyvora Firebase] Firebase environment variables not detected. Please configure VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, and VITE_FIREBASE_PROJECT_ID in your environment.'
  );
}

export { app as firebaseApp, auth, db, googleProvider, firebaseConfig };
