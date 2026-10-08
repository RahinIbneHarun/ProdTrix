"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarPanel } from "./SidebarPanel";

const TOPICS = ["All", "Web Development", "System Design", "Programming", "Databases", "UI / UX", "DevOps"];

/** Desktop (≥1024px) left rail: profile summary and topic chips. */
export function LeftSidebar() {
  const [activeTopic, setActiveTopic] = useState("All");

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 space-y-4 overflow-y-auto py-6 lg:block">
      <SidebarPanel className="flex flex-col items-center py-5 text-center">
        <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary text-base font-medium text-primary-foreground">
          P
        </span>
        <p className="text-sm font-medium text-foreground">ProdTrix Demo</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Learner · Web Development</p>
      </SidebarPanel>

      <SidebarPanel title="Topics">
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setActiveTopic(topic)}
              aria-pressed={activeTopic === topic}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                activeTopic === topic
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {topic}
            </button>
          ))}
        </div>
      </SidebarPanel>
    </aside>
  );
}
