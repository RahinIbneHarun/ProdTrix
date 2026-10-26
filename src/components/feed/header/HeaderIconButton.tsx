"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const BUTTON_CLASS =
  "relative inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground [&_svg]:size-5";

function Badge({ count }: { count?: number }) {
  if (!count) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground ring-2 ring-background">
      {count > 99 ? "99+" : count}
    </span>
  );
}

type Props = React.ComponentPropsWithoutRef<"button"> & {
  label: string;
  badge?: number;
};

/** Round icon button used across the global header; forwards ref for Radix triggers. */
export const HeaderIconButton = forwardRef<HTMLButtonElement, Props>(
  ({ label, badge, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(BUTTON_CLASS, className)}
      {...props}
    >
      {children}
      <Badge count={badge} />
    </button>
  ),
);
HeaderIconButton.displayName = "HeaderIconButton";

/** Same round icon, but a real link that navigates straight to a page. */
export function HeaderIconLink({
  label,
  badge,
  href,
  active,
  className,
  children,
}: {
  label: string;
  badge?: number;
  href: string;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      aria-current={active ? "page" : undefined}
      className={cn(BUTTON_CLASS, className)}
    >
      {children}
      <Badge count={badge} />
    </Link>
  );
}
