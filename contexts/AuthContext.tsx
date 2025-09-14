'use client';

// Authentication context for managing user state with NextAuth.js
import React, { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@/lib/types';

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
 * Authentication provider component using NextAuth.js
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  
  const loading = status === 'loading';
  const user = session?.user ? {
    id: session.user.id || '',
    email: session.user.email || '',
    displayName: session.user.name,
    isAdmin: (session.user as any).isAdmin || false,
    createdAt: new Date() // This would come from the database in a real app
  } as User : null;
  
  const isAdmin = (session?.user as any)?.isAdmin || false;

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