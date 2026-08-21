export const DEMO_SESSION_COOKIE = "prodtrix_demo_session";
const DEMO_SESSION_VALUE = "active";

export const demoAuthUser = {
  id: 0,
  username: "prodtrix-demo",
  email: "demo@prodtrix.local",
  name: "ProdTrix Demo",
  roles: ["ROLE_ADMIN", "ROLE_USER"],
  profile: {
    name: "ProdTrix Demo",
  },
};

function isDemoAuthEnabled() {
  return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
}

export function hasValidDemoCredentials(email: string, password: string) {
  return (
    isDemoAuthEnabled() &&
    email.toLowerCase() === "demo@prodtrix.local" &&
    password === "ProdTrix@2026"
  );
}

export function hasDemoSession(sessionValue?: string) {
  return isDemoAuthEnabled() && sessionValue === DEMO_SESSION_VALUE;
}

export const demoSessionCookie = {
  name: DEMO_SESSION_COOKIE,
  value: DEMO_SESSION_VALUE,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 8,
};
