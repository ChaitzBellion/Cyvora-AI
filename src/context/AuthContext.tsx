import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { 
  signInWithGoogle as firebaseSignInWithGoogle, 
  signInWithEmail as firebaseSignInWithEmail,
  signUpWithEmail as firebaseSignUpWithEmail,
  signOutUser, 
  subscribeToAuthChanges, 
  AuthResult 
} from '../services/authService';
import { isFirebaseConfigured } from '../lib/firebase';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<AuthResult>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Subscribe to Firebase Auth state updates
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async (): Promise<AuthResult> => {
    return await firebaseSignInWithGoogle();
  };

  const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    return await firebaseSignInWithEmail(email, password);
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string): Promise<AuthResult> => {
    return await firebaseSignUpWithEmail(email, password, displayName);
  };

  const logout = async (): Promise<void> => {
    await signOutUser();
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isConfigured: isFirebaseConfigured,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
