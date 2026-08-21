import { NextRequest, NextResponse } from "next/server";

const AUTH_SERVER_URL =
  process.env.NEXT_PUBLIC_AUTH_SERVER || "http://localhost:9000";

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

    const response = await fetch(`${AUTH_SERVER_URL}/login`, {
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
