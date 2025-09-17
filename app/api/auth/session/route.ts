// Get current admin session
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Get current session
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin-session");

    if (!sessionCookie) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
      const sessionData = JSON.parse(sessionCookie.value);

      return NextResponse.json({ user: sessionData }, { status: 200 });
    } catch {
      // Invalid session data, clear cookie
      (await cookies()).set("admin-session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
      });

      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (error) {
    console.error("Session error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
