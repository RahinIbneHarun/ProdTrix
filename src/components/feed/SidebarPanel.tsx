import { cn } from "@/lib/utils";

/** Theme card used by the feed's left and right side rails. */
export function SidebarPanel({
  title,
  icon,
  className,
  children,
}: {
  title?: string;
  icon?: React.ReactNode;
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
        <h2 className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {icon}
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
