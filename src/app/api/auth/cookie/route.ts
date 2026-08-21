import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/helpers/get-auth-user";
import {
  DEMO_SESSION_COOKIE,
  demoAuthUser,
  hasDemoSession,
} from "@/lib/demo-auth";

export async function GET(request: NextRequest) {
  if (hasDemoSession(request.cookies.get(DEMO_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ authenticated: true, user: demoAuthUser });
  }

  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user });
}
