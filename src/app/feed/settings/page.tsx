"use client";

import Link from "next/link";
import { RotateCcw, Settings } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PageHeading } from "@/components/feed/PageHeading";
import { useFeedStore } from "@/store/feed-store";

export default function FeedSettingsPage() {
  const birthdayReminders = useFeedStore((s) => s.birthdayReminders);
  const setBirthdayReminders = useFeedStore((s) => s.setBirthdayReminders);
  const hiddenCount = useFeedStore((s) => s.hidden.length);

  const resetPreferences = () => {
    useFeedStore.setState({ hidden: [], topicAffinity: {}, creatorAffinity: {} });
    toast.success("Feed preferences reset");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeading icon={<Settings />} title="Settings" description="Personalise your feed and notifications." />

      <div className="divide-y divide-border rounded-2xl border border-border bg-card">
        <Row title="Appearance" description="Switch between light and dark mode.">
          <ThemeToggle />
        </Row>
        <Row title="Birthday reminders" description="Get reminded about birthdays of friends and creators you follow.">
          <Switch checked={birthdayReminders} onChange={setBirthdayReminders} label="Birthday reminders" />
        </Row>
        <Row
          title="Feed preferences"
          description={`Clears Interested / Not interested signals and un-hides ${hiddenCount} post${hiddenCount === 1 ? "" : "s"}.`}
        >
          <button
            type="button"
            onClick={resetPreferences}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium hover:bg-muted"
          >
            <RotateCcw className="size-4" /> Reset
          </button>
        </Row>
        <Row title="Account" description="Profile details, password and sign-in.">
          <Link href="/admin/profile" className="text-sm font-medium underline-offset-4 hover:underline">
            Open profile
          </Link>
        </Row>
      </div>
    </div>
  );
}

function Row({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted-foreground/30"}`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[22px]" : "translate-x-0.5"}`}
      />
    </button>
  );
}
