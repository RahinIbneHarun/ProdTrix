import { FeedShell } from "@/components/feed/FeedShell";

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return <FeedShell>{children}</FeedShell>;
}
