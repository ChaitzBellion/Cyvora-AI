import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { 
  signInWithGoogle as firebaseSignInWithGoogle, 
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

  const logout = async (): Promise<void> => {
    await signOutUser();
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isConfigured: isFirebaseConfigured,
    signInWithGoogle,
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
