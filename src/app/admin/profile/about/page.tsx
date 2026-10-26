"use client";

import { ProfilePageShell } from "@/components/profile/ProfilePageShell";
import { useCurrentUser } from "@/lib/feed/use-current-user";
import { PROFILE } from "@/lib/profile/profile-data";

const roleLabel = (roles: string[]) =>
  roles
    .map((r) => r.replace(/^ROLE_/, "").toLowerCase().replace(/(^|_)(\w)/g, (_, s, c) => (s ? " " : "") + c.toUpperCase()))
    .join(", ");

export default function ProfileAboutPage() {
  const { user, loading } = useCurrentUser();

  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Name", value: PROFILE.name },
    { label: "Field", value: PROFILE.field },
    { label: "Headline", value: `${PROFILE.field} · ${PROFILE.availability}` },
    { label: "Bio", value: <span className="italic">“{PROFILE.bio}”</span> },
    { label: "Email", value: PROFILE.email },
    {
      label: "Status",
      value: <span className="text-emerald-500 dark:text-emerald-400">{PROFILE.status}</span>,
    },
    { label: "Profile completion", value: `${PROFILE.completion}%` },
    { label: "Signed in as", value: loading ? "…" : (user?.email ?? "Not signed in") },
    { label: "Account role", value: loading ? "…" : user?.roles.length ? roleLabel(user.roles) : "—" },
  ];

  return (
    <ProfilePageShell title="About" description="Basic information about this profile.">
      <div className="theme-card overflow-hidden">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Basic profile information</caption>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {rows.map(({ label, value }) => (
              <tr key={label} className="odd:bg-gray-50/70 dark:odd:bg-white/[0.03]">
                <th
                  scope="row"
                  className="theme-label w-2/5 whitespace-nowrap px-5 py-4 align-top font-normal sm:w-1/3"
                >
                  {label}
                </th>
                <td className="px-5 py-4 font-medium text-black dark:text-white">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProfilePageShell>
  );
}
