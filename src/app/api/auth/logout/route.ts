import { NextRequest, NextResponse } from "next/server";
import { DEMO_SESSION_COOKIE } from "@/lib/demo-auth";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/Home", request.url));
  response.cookies.set({
    name: DEMO_SESSION_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return response;
}
