"use client";

import { useEffect, useState } from "react";

export interface CurrentUser {
  name: string;
  email?: string;
  roles: string[];
}

/** Signed-in user from the auth cookie endpoint, or null when signed out. */
export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/cookie", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.authenticated || !data.user) return;
        const u = data.user;
        setUser({
          name: u.profile?.name ?? u.name ?? u.username ?? "You",
          email: u.email,
          roles: u.roles ?? [],
        });
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}
