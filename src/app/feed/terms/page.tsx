import { FileText } from "lucide-react";
import { PageHeading } from "@/components/feed/PageHeading";

const SECTIONS = [
  {
    title: "Community guidelines",
    body: "Share accurate, original educational content. Spam, misinformation, copyright infringement and harassment are not allowed and can be reported from any post's menu.",
  },
  {
    title: "Content ownership",
    body: "Creators keep ownership of what they publish. By posting you grant ProdTrix a licence to display and distribute the content within the platform.",
  },
  {
    title: "Privacy & analytics",
    body: "We collect aggregate viewing metrics (views, active reading time, unique viewers) to power post insights. Idle time is excluded from these measurements.",
  },
  {
    title: "Account verification",
    body: "Verified badges are granted after identity and credential review. Misrepresenting your identity may lead to removal of the badge or the account.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeading icon={<FileText />} title="Terms & Policies" description="The short version of how ProdTrix works." />
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-sm font-semibold">{s.title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
