"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avater";
import { Button } from "@/components/ui/button";

const CREATORS = [
  {
    id: 1,
    name: "Jin-ho Yoon",
    role: "System Design",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    id: 2,
    name: "Tomás Rivera",
    role: "UX Research",
    avatar: "https://i.pravatar.cc/80?img=15",
  },
  {
    id: 3,
    name: "Meera Krishnan",
    role: "React & TypeScript",
    avatar: "https://i.pravatar.cc/80?img=44",
  },
];

export function TopCreatorsCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3">
        Top Creators
      </h3>

      <ul className="space-y-3">
        {CREATORS.map((u) => (
          <li key={u.id} className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={u.avatar} alt={u.name} />
              <AvatarFallback>{u.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {u.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">{u.role}</p>
            </div>
            <Button size="sm" className="h-7 px-3 text-xs rounded-full">
              Follow
            </Button>
          </li>
        ))}
      </ul>

      <button className="mt-4 w-full text-sm text-primary hover:underline text-center">
        Discover more →
      </button>
    </div>
  );
}
