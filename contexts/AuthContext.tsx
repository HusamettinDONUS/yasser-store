'use client';

// Authentication context for managing user state across the application
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/lib/types';
import { onAuthStateChange, getCurrentUser } from '@/lib/services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Initial auth check
    getCurrentUser()
      .then((user) => {
        setUser(user);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error getting current user:', error);
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  const isAdmin = user?.isAdmin || false;

  const value: AuthContextType = {
    user,
    loading,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to require authentication
 */
export function useRequireAuth(): User {
  const { user, loading } = useAuth();
  
  if (loading) {
    throw new Error('Authentication is still loading');
  }
  
  if (!user) {
    throw new Error('User must be authenticated');
  }
  
  return user;
}

/**
 * Hook to require admin authentication
 */
export function useRequireAdmin(): User {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    throw new Error('Authentication is still loading');
  }
  
  if (!user) {
    throw new Error('User must be authenticated');
  }
  
  if (!isAdmin) {
    throw new Error('User must be an admin');
  }
  
  return user;
}