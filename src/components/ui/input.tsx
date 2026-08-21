import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, style, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      style={{
        // Inline styles guarantee typed text is always visible inside
        // modals/sheets (portaled to <body>), regardless of CSS ordering.
        // Uses --form-text (defined in globals.css) so it adapts to theme.
        color: "var(--form-text)",
        caretColor: "var(--form-text)",
        WebkitTextFillColor: "var(--form-text)",
        ...style,
      }}
      className={cn(
        "h-9 w-full min-w-0 rounded-3xl border border-gray-300 dark:border-white/15 bg-white dark:bg-white/10 px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 dark:placeholder:text-white/30 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 md:text-sm dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-500/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
