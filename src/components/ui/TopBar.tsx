"use client";

import React from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avater";

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-14 items-center gap-4 px-4">
        {/* ── Logo ─────────────────────────────── */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold text-sm">
            L
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">
            LearnFeed
          </span>
        </div>

        {/* ── Search (centered) ────────────────── */}
        <div className="flex-1 max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search lessons, topics..."
            className="w-full h-9 pl-9 pr-4 rounded-full border border-input bg-muted/50 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        {/* ── Avatar ───────────────────────────── */}
        <Avatar className="h-9 w-9 shrink-0 cursor-pointer">
          <AvatarImage src="https://i.pravatar.cc/80?img=68" alt="Profile" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
