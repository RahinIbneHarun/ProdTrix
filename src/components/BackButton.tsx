"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Goes back to the previous page. If this tab has nothing to go back to (the page was opened
 * directly), it goes to `fallbackHref` instead of doing nothing.
 */
export function BackButton({
  fallbackHref = "/Home",
  className,
}: {
  fallbackHref?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => (window.history.length > 1 ? router.back() : router.push(fallbackHref))}
      aria-label="Go back"
      title="Go back"
      className={cn(
        "theme-button-secondary inline-flex h-9 w-9 shrink-0 items-center justify-center transition-colors",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
    </button>
  );
}
