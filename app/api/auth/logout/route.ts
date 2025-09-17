// Simple admin logout API endpoint
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Handle admin logout
 */
export async function POST() {
  try {
    const cookieStore = await cookies();

    // Clear the session cookie
    cookieStore.set("admin-session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
    });

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
