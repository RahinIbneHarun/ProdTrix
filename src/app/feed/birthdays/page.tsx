"use client";

import Link from "next/link";
import { Cake } from "lucide-react";
import { toast } from "sonner";
import { CreatorAvatar } from "@/components/feed/CreatorAvatar";
import { PageHeading } from "@/components/feed/PageHeading";
import { useUpcomingBirthdays } from "@/lib/feed/use-birthdays";
import { useFeedStore } from "@/store/feed-store";

export default function BirthdaysPage() {
  const upcoming = useUpcomingBirthdays(60);
  const enabled = useFeedStore((s) => s.birthdayReminders);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeading icon={<Cake />} title="Birthday reminders" description="Friends and creators you follow, next 60 days." />

      {!enabled ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Birthday reminders are off.{" "}
          <Link href="/feed/settings" className="font-medium text-foreground underline">
            Turn them on in Settings
          </Link>
          .
        </p>
      ) : upcoming.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No birthdays coming up. Follow more creators or add friends to see theirs here.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {upcoming.map(({ creator, daysAway }) => (
            <li key={creator.id} className="flex items-center gap-3 p-4">
              <CreatorAvatar creator={creator} size={40} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{creator.name}</p>
                <p className="text-xs text-muted-foreground">
                  {daysAway === 0 ? "🎂 Today" : daysAway === 1 ? "Tomorrow" : `In ${daysAway} days`}
                </p>
              </div>
              {daysAway === 0 && (
                <button
                  type="button"
                  onClick={() => toast.success(`Birthday wishes sent to ${creator.name}`)}
                  className="h-8 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground"
                >
                  Send wishes
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
