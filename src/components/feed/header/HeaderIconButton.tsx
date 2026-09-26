"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

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
      className={cn(
        "relative inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground [&_svg]:size-5",
        className,
      )}
      {...props}
    >
      {children}
      {badge ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground ring-2 ring-background">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </button>
  ),
);
HeaderIconButton.displayName = "HeaderIconButton";
