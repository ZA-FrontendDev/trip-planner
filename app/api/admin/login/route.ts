import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { api } from "@/convex/_generated/api";
import { createAdminSessionToken, hashAdminPassword, ADMIN_SESSION_COOKIE } from "@/lib/admin-session";
import { getConvexServerClient } from "@/lib/convex-server";

export async function POST(request: Request) {
  try {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required." },
        { status: 400 }
      );
    }

    const convex = getConvexServerClient();
    const admin = await convex.mutation(api.adminAuth.login, {
      username,
      passwordHash: hashAdminPassword(password)
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid admin credentials." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(
      ADMIN_SESSION_COOKIE,
      createAdminSessionToken({
        username: admin.username ?? username,
        name: admin.name,
        role: admin.role
      }),
      {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to complete admin login."
      },
      { status: 500 }
    );
  }
}
