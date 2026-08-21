import { BrandLogo } from "@/components/brand-logo";
import Link from "next/link";

const accountDetails = [
  { label: "Name", value: "ProdTrix Demo" },
  { label: "Email", value: "demo@prodtrix.local" },
  { label: "Role", value: "Student account" },
];

export default function ProfilePage() {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-primary/10 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <p className="theme-label">PRODTRIX ACCOUNT</p>
        <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Your profile
            </h1>
            <p className="mt-3 max-w-xl text-lg leading-8 text-muted-foreground">
              Your ProdTrix account is ready to keep your academic support journey organized.
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/15 px-4 py-2 text-sm font-medium text-foreground">
            Account active
          </span>
        </div>

        <div className="theme-terminal mt-10 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-5 py-4">
            <span className="h-3 w-3 rounded-full border border-[#e0443e] bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full border border-[#d79a20] bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full border border-[#24a148] bg-[#28c840]" />
            <span className="ml-3 text-sm text-muted-foreground">profile-access</span>
          </div>

          <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[auto_1fr] md:items-start">
            <BrandLogo className="h-20 w-20 rounded-2xl" />

            <div>
              <h2 className="text-2xl font-semibold text-foreground">ProdTrix Demo</h2>
              <p className="mt-1 text-muted-foreground">Student account</p>

              <dl className="mt-7 grid gap-4 sm:grid-cols-3">
                {accountDetails.map((detail) => (
                  <div key={detail.label} className="border-t border-border pt-3">
                    <dt className="theme-label">{detail.label}</dt>
                    <dd className="mt-2 break-words text-sm font-medium text-foreground">
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/Home"
                className="theme-button-primary mt-8 inline-flex px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
