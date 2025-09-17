// Simple authentication helpers for admin-only access
import { cookies } from "next/headers";

export interface SessionData {
  userId: string;
  email: string;
  name?: string;
  isAdmin: boolean;
}

/**
 * Get current session from cookie
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin-session");

    if (!sessionCookie) {
      return null;
    }

    const sessionData = JSON.parse(sessionCookie.value);
    return sessionData;
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

/**
 * Check if user is authenticated admin
 */
export async function requireAdmin(): Promise<SessionData> {
  const session = await getSession();

  if (!session) {
    throw new Error("Authentication required");
  }

  if (!session.isAdmin) {
    throw new Error("Admin privileges required");
  }

  return session;
}
