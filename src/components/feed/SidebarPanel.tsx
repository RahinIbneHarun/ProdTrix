import { cn } from "@/lib/utils";

/** Theme card used by the feed's left and right side rails. */
export function SidebarPanel({
  title,
  className,
  children,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card px-4 py-4 text-card-foreground shadow-sm",
        className,
      )}
    >
      {title && (
        <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
