import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** Frame for the pages that live inside the profile: back link, title and a centred column. */
export function ProfilePageShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/profile"
            className="theme-button-secondary inline-flex h-9 items-center gap-2 px-4 text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Profile
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-black dark:text-white">{title}</h1>
            {description && (
              <p className="text-xs text-black/60 dark:text-white/40">{description}</p>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
