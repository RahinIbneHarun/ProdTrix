import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { PageHeading } from "@/components/feed/PageHeading";

const FAQ = [
  {
    q: "What do the four reactions mean?",
    a: "🥇 Gold for outstanding work, 💎 Diamond for rare insight, 👏 Clap for effort, 😋 Tasty for content that's just enjoyable. You can hold one reaction per post — tap another to switch or tap the same one to undo.",
  },
  {
    q: "What is Saved?",
    a: "Saved is where you keep posts for later. Tap Save on any post; open your saved posts from the menu or the sidebar.",
  },
  {
    q: "How is the Value-Add ratio calculated?",
    a: "Total active watch/reading time divided by total views. The timer pauses after 60 seconds without interaction so idle tabs don't inflate it.",
  },
  {
    q: "What does the v1 / v2 badge mean?",
    a: "It's the post's current version. Hover or tap the badge to see the changelog and when it was last edited.",
  },
  {
    q: "How do Interested / Not interested work?",
    a: "They tune your feed. Interested boosts that creator and topic; Not interested hides the post and shows fewer posts on that topic. Reset them any time in Settings.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeading icon={<HelpCircle />} title="Help" description="Answers to common questions about the feed." />
      <div className="divide-y divide-border rounded-2xl border border-border bg-card">
        {FAQ.map(({ q, a }) => (
          <details key={q} className="group p-4">
            <summary className="cursor-pointer list-none text-sm font-medium marker:hidden">
              <span className="mr-2 inline-block transition-transform group-open:rotate-90">›</span>
              {q}
            </summary>
            <p className="mt-2 pl-4 text-sm leading-6 text-muted-foreground">{a}</p>
          </details>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Still stuck?{" "}
        <Link href="/support" className="font-medium text-foreground underline">
          Contact support
        </Link>
        .
      </p>
    </div>
  );
}
