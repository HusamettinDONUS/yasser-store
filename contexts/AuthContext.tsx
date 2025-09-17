"use client";

// Authentication context for managing admin user state
import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component using simple session-based auth
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser({
            id: data.user.userId,
            email: data.user.email,
            displayName: data.user.name,
            isAdmin: data.user.isAdmin,
            createdAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error("Session check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser({
          id: data.user.id,
          email: data.user.email,
          displayName: data.user.name,
          isAdmin: data.user.isAdmin,
          createdAt: new Date(),
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAdmin: user?.isAdmin || false,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Hook to require authentication
 */
export function useRequireAuth(): User {
  const { user, loading } = useAuth();

  if (loading) {
    throw new Error("Authentication is still loading");
  }

  if (!user) {
    throw new Error("User must be authenticated");
  }

  return user;
}

/**
 * Hook to require admin authentication
 */
export function useRequireAdmin(): User {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    throw new Error("Authentication is still loading");
  }

  if (!user) {
    throw new Error("User must be authenticated");
  }

  if (!isAdmin) {
    throw new Error("User must be an admin");
  }

  return user;
}
