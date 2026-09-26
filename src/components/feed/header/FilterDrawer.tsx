"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FEED_POSTS } from "@/data/feed-data";
import { EMPTY_FILTERS, type FeedFilters } from "@/interfaces/feed.interface";
import { filtersFromParams, filtersToQuery, uniqueValues } from "@/lib/feed/utils";
import { cn } from "@/lib/utils";

const selectCls =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40";

export function FilterDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [draft, setDraft] = useState<FeedFilters>(() => filtersFromParams(params));

  // Re-seed the form from the URL every time the drawer opens.
  useEffect(() => {
    if (open) setDraft(filtersFromParams(params));
  }, [open, params]);

  const subjects = useMemo(
    () =>
      uniqueValues(
        FEED_POSTS.filter((p) => !draft.category || p.category === draft.category),
        (p) => p.subject,
      ),
    [draft.category],
  );
  const chapters = useMemo(
    () =>
      uniqueValues(
        FEED_POSTS.filter(
          (p) =>
            (!draft.category || p.category === draft.category) &&
            (!draft.subject || p.subject === draft.subject),
        ),
        (p) => p.chapter,
      ),
    [draft.category, draft.subject],
  );

  const set = <K extends keyof FeedFilters>(key: K, value: FeedFilters[K]) =>
    setDraft((d) => {
      const next = { ...d, [key]: value };
      // Drop now-invalid dependent selections.
      if (key === "category") {
        next.subject = "";
        next.chapter = "";
      }
      if (key === "subject") next.chapter = "";
      return next;
    });

  const apply = () => {
    router.push(`/feed${filtersToQuery(draft)}`);
    onOpenChange(false);
  };

  const reset = () => {
    setDraft({ ...EMPTY_FILTERS, q: draft.q });
    if (pathname === "/feed") router.push(`/feed${filtersToQuery({ q: draft.q })}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Filter content</SheetTitle>
          <SheetDescription>Narrow the feed by category, subject, chapter, version and date.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-6">
          <Field label="Category">
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
              {(
                [
                  ["", "All"],
                  ["academic", "Academic"],
                  ["non-academic", "Non-Academic"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("category", value)}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-xs font-medium",
                    draft.category === value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Subject" htmlFor="f-subject">
            <select
              id="f-subject"
              className={selectCls}
              value={draft.subject}
              onChange={(e) => set("subject", e.target.value)}
            >
              <option value="">Any subject</option>
              {subjects.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="Chapter" htmlFor="f-chapter">
            <select
              id="f-chapter"
              className={selectCls}
              value={draft.chapter}
              onChange={(e) => set("chapter", e.target.value)}
            >
              <option value="">Any chapter</option>
              {chapters.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Version" htmlFor="f-version">
            <select
              id="f-version"
              className={selectCls}
              value={draft.version}
              onChange={(e) => set("version", e.target.value)}
            >
              <option value="">Any version</option>
              <option value="1">v1 (original)</option>
              <option value="2">v2</option>
              <option value="3+">v3 and above</option>
            </select>
          </Field>

          <Field label="Date range">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                aria-label="From date"
                className={selectCls}
                value={draft.from}
                max={draft.to || undefined}
                onChange={(e) => set("from", e.target.value)}
              />
              <input
                type="date"
                aria-label="To date"
                className={selectCls}
                value={draft.to}
                min={draft.from || undefined}
                onChange={(e) => set("to", e.target.value)}
              />
            </div>
          </Field>
        </div>

        <SheetFooter className="flex-row gap-2 border-t border-border">
          <button
            type="button"
            onClick={reset}
            className="h-10 flex-1 rounded-lg border border-border text-sm font-medium hover:bg-muted"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={apply}
            className="h-10 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/85"
          >
            Apply filters
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
