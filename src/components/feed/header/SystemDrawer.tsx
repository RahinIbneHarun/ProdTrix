"use client";

import Link from "next/link";
import {
  Cake,
  ChevronRight,
  LifeBuoy,
  LogOut,
  Menu,
  User,
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
import { FeedIcon } from "../FeedIcon";
import { HeaderIconButton } from "./HeaderIconButton";

export function SystemDrawer() {
  const savedCount = useFeedStore((s) => Object.keys(s.saved).length);
  const verification = useFeedStore((s) => s.verification);
  const incomingCount = useFeedStore((s) => s.incomingRequests.length);
  const birthdays = useTodaysBirthdays();

  const links: { href: string; label: string; icon: React.ReactNode; meta?: string | number }[] = [
    { href: "/admin/profile", label: "Profile", icon: <User className="size-[18px]" /> },
    { href: "/feed/settings", label: "Settings", icon: <FeedIcon name="settings" className="size-[18px]" /> },
    {
      href: "/feed/saved",
      label: "Saved",
      icon: <FeedIcon name="packaging" className="size-[18px]" />,
      meta: savedCount || undefined,
    },
    {
      href: "/feed/friends",
      label: "Friends",
      icon: <FeedIcon name="people" className="size-[18px]" />,
      meta: incomingCount || undefined,
    },
    { href: "/feed/help", label: "Help", icon: <FeedIcon name="question-mark" className="size-[18px]" /> },
    { href: "/support", label: "Support / Contact Us", icon: <LifeBuoy className="size-[18px]" /> },
    {
      href: "/feed/birthdays",
      label: "Birthday reminders",
      icon: <Cake className="size-[18px]" />,
      meta: birthdays.length ? `${birthdays.length} today` : undefined,
    },
    { href: "/feed/terms", label: "Terms & Policies", icon: <FeedIcon name="newspaper" className="size-[18px]" /> },
    {
      href: "/feed/verify",
      label: "Verify Account",
      icon: <FeedIcon name="approved" className="size-[18px]" />,
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
          {links.map(({ href, label, icon, meta }) => (
            <SheetClose asChild key={href}>
              <Link
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <span className="flex text-muted-foreground">{icon}</span>
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
