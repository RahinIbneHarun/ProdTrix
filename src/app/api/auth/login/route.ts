import { NextRequest, NextResponse } from "next/server";
import {
  demoAuthUser,
  demoSessionCookie,
  hasValidDemoCredentials,
} from "@/lib/demo-auth";

const AUTH_SERVER_URL =
  process.env.NEXT_PUBLIC_AUTH_SERVER ||
  process.env.NEXT_PUBLIC_AUTH_SERVER_BASE_URL ||
  "http://localhost:9000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    let response: Response;

    try {
      response = await fetch(`${AUTH_SERVER_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: body.email,
          password: body.password,
        }),
      });
    } catch {
      if (hasValidDemoCredentials(body.email, body.password)) {
        const demoResponse = NextResponse.json(
          { authenticated: true, user: demoAuthUser },
          { status: 200 },
        );
        demoResponse.cookies.set(demoSessionCookie);
        return demoResponse;
      }

      return NextResponse.json(
        {
          error: "Login service is unavailable",
          message: "Start the auth server or use the local demo account.",
        },
        { status: 503 },
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.message || data.error || "Login failed",
          message: data.message || data.error || "Login failed",
        },
        { status: response.status },
      );
    }

    // Forward cookies from auth server
    const setCookieHeaders = response.headers.getSetCookie();
    const authResponse = NextResponse.json(data, { status: 200 });

    setCookieHeaders.forEach((cookie) => {
      authResponse.headers.append("Set-Cookie", cookie);
    });

    return authResponse;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed", message: "An error occurred during login" },
      { status: 500 },
    );
  }
}
