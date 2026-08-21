"use client";

import React from "react";
import Link from "next/link";
import {
  Search,
  Home,
  Users,
  Bell,
  SlidersHorizontal,
  MoreVertical,
} from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-4xl mx-auto flex h-14 items-center justify-between px-4 gap-2">
        {/* Search Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics, classes, posts..."
              className="w-full rounded-md border border-input bg-muted/50 pl-8 pr-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/feed"
            className="p-2 rounded-md hover:bg-accent text-foreground flex items-center justify-center"
            title="Home"
          >
            <Home className="h-5 w-5" />
          </Link>
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center"
            title="Followers"
          >
            <Users className="h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground relative flex items-center justify-center"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center"
            title="Filter"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </nav>

        {/* Feed Corner 3-Dot */}
        <div className="flex items-center">
          <button
            className="p-2 rounded-md hover:bg-accent text-muted-foreground"
            title="Feed options"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
