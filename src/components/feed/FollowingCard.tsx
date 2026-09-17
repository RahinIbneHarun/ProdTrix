"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avater";
import { Button } from "@/components/ui/button";

const FOLLOWING = [
  {
    id: 1,
    name: "Ayasha Malik",
    role: "Full Stack Engineer",
    avatar: "https://i.pravatar.cc/80?img=47",
  },
  {
    id: 2,
    name: "Priya Nair",
    role: "Data Scientist",
    avatar: "https://i.pravatar.cc/80?img=45",
  },
  {
    id: 3,
    name: "Lucas Fernandes",
    role: "Cloud Architect",
    avatar: "https://i.pravatar.cc/80?img=33",
  },
];

export function FollowingCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-3">
        Following
      </h3>

      <ul className="space-y-3">
        {FOLLOWING.map((u) => (
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
            <span className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground">
              Following
            </span>
          </li>
        ))}
      </ul>

      <button className="mt-4 w-full text-sm text-primary hover:underline text-center">
        See all →
      </button>
    </div>
  );
}
