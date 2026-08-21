import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const footerColumns = [
  {
    title: "Platform",
    links: [
      { label: "Home", href: "/Home" },
      { label: "Academic support", href: "/support" },
    ],
  },
  {
    title: "Support journey",
    items: [
      "Guidance requests",
      "Department routing",
      "Live request updates",
    ],
  },
  {
    title: "Access",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Get support", href: "/support" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-card text-foreground">
      <div className="theme-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 px-[10%]">
        <section className="flex flex-col gap-8 border-b border-border py-10 md:flex-row md:items-end md:justify-between md:py-14">
          <div className="max-w-xl">
            <p className="theme-label">ProdTrix SUPPORT</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Clear support starts here.
            </h2>
            <p className="mt-3 max-w-lg leading-7 text-muted-foreground">
              Bring every academic question, update, and next action into one
              focused support journey.
            </p>
          </div>
        </section>

        <section className="grid gap-10 py-12 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] md:gap-8 md:py-16">
          <div className="max-w-xs">
            <BrandLogo className="h-11 w-11 rounded-xl" />
            <p className="mt-5 text-lg font-medium tracking-tight">ProdTrix</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Academic support that stays organized from the first question to
              the final guidance summary.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-medium text-foreground">{column.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                {column.links?.map((link) => (
                  <li key={link.href + link.label}>
                    <Link className="transition-colors hover:text-foreground" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
                {column.items?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ProdTrix. Academic support, clearly organized.</p>
          <p>Built for students and departments.</p>
        </div>
      </div>
    </footer>
  );
}
