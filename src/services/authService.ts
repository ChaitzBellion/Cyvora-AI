import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User, 
  Unsubscribe,
  AuthError
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';

export interface AuthResult {
  success: boolean;
  user: User | null;
  cancelled?: boolean;
  errorCode?: string;
  error?: string;
  currentDomain?: string;
}

let isSigningInInProgress = false;

/**
 * Initiates Google Sign-In with Firebase Popup Authentication.
 * Protected with an in-flight concurrency lock to prevent duplicate popups.
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  if (isSigningInInProgress) {
    return {
      success: false,
      user: null,
      cancelled: true
    };
  }

  if (!isFirebaseConfigured || !auth || !googleProvider) {
    return {
      success: false,
      user: null,
      errorCode: 'config_missing',
      error: 'Firebase is not yet configured. Please set the VITE_FIREBASE_* environment variables.'
    };
  }

  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  isSigningInInProgress = true;

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: result.user
    };
  } catch (err: unknown) {
    const error = err as AuthError;
    
    // Graceful handling for user cancellation / closed popup
    if (
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-popup-request'
    ) {
      return {
        success: false,
        user: null,
        cancelled: true
      };
    }

    // Specific Firebase Auth error diagnostics
    let userMessage = 'Authentication failed. Please try again.';
    if (error.code === 'auth/unauthorized-domain') {
      userMessage = `The current domain (${currentDomain}) is not authorized in your Firebase project. To fix this, add "${currentDomain}" to Firebase Authentication > Settings > Authorized domains in the Firebase Console.`;
    } else if (error.code === 'auth/popup-blocked') {
      userMessage = 'The Google sign-in popup was blocked by your browser. Please allow popups for this site.';
    } else if (error.code === 'auth/network-request-failed') {
      userMessage = 'Network connection issue. Please check your internet connection.';
    } else if (error.message) {
      userMessage = error.message;
    }

    console.warn(`Firebase Google Sign-In (${error.code || 'unknown'}):`, error.message);
    return {
      success: false,
      user: null,
      errorCode: error.code,
      currentDomain,
      error: userMessage
    };
  } finally {
    isSigningInInProgress = false;
  }
}

/**
 * Signs the user out from Firebase Authentication.
 */
export async function signOutUser(): Promise<{ success: boolean; error?: string }> {
  if (!auth) {
    return { success: true };
  }

  try {
    await signOut(auth);
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Firebase Sign-Out Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign out.'
    };
  }
}

/**
 * Returns the currently authenticated user if one exists.
 */
export function getCurrentUser(): User | null {
  if (!auth) return null;
  return auth.currentUser;
}

/**
 * Subscribes to Firebase Authentication state changes.
 * Returns an unsubscribe callback.
 */
export function subscribeToAuthChanges(callback: (user: User | null) => void): Unsubscribe {
  if (!auth) {
    console.warn('[Cyvora Auth] Firebase auth instance is not available.');
    // If Firebase is not configured, inform subscriber immediately
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(
    auth,
    (user) => {
      console.log(`[Cyvora Auth] onAuthStateChanged fired: ${user ? `Authenticated UID: ${user.uid} (${user.email})` : 'Unauthenticated (user is null)'}`);
      callback(user);
    },
    (error) => {
      console.error('[Cyvora Auth] Firebase Auth State Change Error:', error);
      callback(null);
    }
  );
}
