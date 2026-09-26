"use client";

import Link from "next/link";
import {
  BadgeCheck,
  Bookmark,
  Cake,
  ChevronRight,
  FileText,
  HelpCircle,
  LifeBuoy,
  LogOut,
  Menu,
  Settings,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTodaysBirthdays } from "@/lib/feed/use-birthdays";
import { useFeedStore } from "@/store/feed-store";
import { HeaderIconButton } from "./HeaderIconButton";

export function SystemDrawer() {
  const savedCount = useFeedStore((s) => Object.keys(s.saved).length);
  const verification = useFeedStore((s) => s.verification);
  const birthdays = useTodaysBirthdays();

  const links = [
    { href: "/feed/settings", label: "Settings", icon: Settings },
    { href: "/feed/saved", label: "Saved", icon: Bookmark, meta: savedCount || undefined },
    { href: "/feed/help", label: "Help", icon: HelpCircle },
    { href: "/support", label: "Support / Contact Us", icon: LifeBuoy },
    { href: "/feed/birthdays", label: "Birthday reminders", icon: Cake, meta: birthdays.length ? `${birthdays.length} today` : undefined },
    { href: "/feed/terms", label: "Terms & Policies", icon: FileText },
    {
      href: "/feed/verify",
      label: "Verify Account",
      icon: BadgeCheck,
      meta: verification === "submitted" ? "In review" : undefined,
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <HeaderIconButton label="Open menu">
          <Menu />
        </HeaderIconButton>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] sm:max-w-xs">
        <SheetHeader className="border-b border-border">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-9 w-9 rounded-lg" />
            <div>
              <SheetTitle>ProdTrix</SheetTitle>
              <SheetDescription className="text-xs">Menu</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto p-2">
          {links.map(({ href, label, icon: Icon, meta }) => (
            <SheetClose asChild key={href}>
              <Link
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <Icon className="size-[18px] text-muted-foreground" />
                <span className="flex-1">{label}</span>
                {meta !== undefined && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    {meta}
                  </span>
                )}
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            </SheetClose>
          ))}
        </nav>

        <div className="flex items-center justify-between border-t border-border p-4">
          <ThemeToggle />
          <a
            href="/api/auth/logout"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <LogOut className="size-4" /> Sign out
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
