"use client";

import { useState } from "react";
import { Image as ImageIcon, Smile } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PostComposer() {
  const [text, setText] = useState("");

  return (
    <Card className="p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share something with your class..."
        rows={2}
        className="w-full resize-none rounded-2xl bg-muted/40 p-3 text-sm outline-none placeholder:text-muted-foreground"
      />

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Add image">
            <ImageIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Add emoji">
            <Smile />
          </Button>
        </div>

        <Button size="sm" disabled={!text.trim()}>
          Post
        </Button>
      </div>
    </Card>
  );
}
