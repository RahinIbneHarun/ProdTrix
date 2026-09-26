"use client";

import { useState } from "react";
import { BadgeCheck, Check } from "lucide-react";
import { toast } from "sonner";
import { PageHeading } from "@/components/feed/PageHeading";
import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feed-store";

const STEPS = ["About you", "Credentials", "Review"] as const;
const ROLES = ["Teacher / Educator", "Student creator", "Subject expert", "Institution"];

const inputCls =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40";

export default function VerifyAccountPage() {
  const status = useFeedStore((s) => s.verification);
  const submitVerification = useFeedStore((s) => s.submitVerification);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", role: ROLES[0], institution: "", portfolio: "", why: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const canNext =
    (step === 0 && form.name.trim().length > 1) ||
    (step === 1 && form.institution.trim() && /^https?:\/\/\S+\.\S+/.test(form.portfolio)) ||
    step === 2;

  const submit = () => {
    submitVerification();
    toast.success("Verification application submitted");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeading
        icon={<BadgeCheck />}
        title="Verify Account"
        description="Apply for a verified badge on your posts and profile."
      />

      {status === "submitted" ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm font-semibold">Application status</p>
          <ol className="mt-4 space-y-4">
            {[
              { label: "Submitted", done: true, note: "We've received your application." },
              { label: "Under review", done: false, active: true, note: "Our team usually responds within 3–5 working days." },
              { label: "Decision", done: false, note: "You'll get a notification when a decision is made." },
            ].map((s) => (
              <li key={s.label} className="flex gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs",
                    s.done && "border-transparent bg-emerald-500 text-white",
                    s.active && "border-amber-500 text-amber-600",
                  )}
                >
                  {s.done ? <Check className="size-3.5" /> : s.active ? "•" : ""}
                </span>
                <div>
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card">
          <ol className="flex border-b border-border">
            {STEPS.map((label, i) => (
              <li
                key={label}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 py-3 text-xs font-medium",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border text-[10px]",
                    i < step && "border-transparent bg-primary text-primary-foreground",
                    i === step && "border-foreground",
                  )}
                >
                  {i < step ? <Check className="size-3" /> : i + 1}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </li>
            ))}
          </ol>

          <div className="space-y-4 p-6">
            {step === 0 && (
              <>
                <Field label="Display name" id="v-name">
                  <input id="v-name" className={inputCls} value={form.name} onChange={set("name")} autoComplete="name" />
                </Field>
                <Field label="I am a…" id="v-role">
                  <select id="v-role" className={inputCls} value={form.role} onChange={set("role")}>
                    {ROLES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </Field>
              </>
            )}
            {step === 1 && (
              <>
                <Field label="Institution or organisation" id="v-inst">
                  <input id="v-inst" className={inputCls} value={form.institution} onChange={set("institution")} />
                </Field>
                <Field label="Portfolio or proof link" id="v-link" hint="A public page that shows your work (https://…)">
                  <input id="v-link" type="url" className={inputCls} value={form.portfolio} onChange={set("portfolio")} placeholder="https://" />
                </Field>
                <Field label="Why should you be verified? (optional)" id="v-why">
                  <textarea id="v-why" rows={3} className={cn(inputCls, "h-auto py-2")} value={form.why} onChange={set("why")} maxLength={500} />
                </Field>
              </>
            )}
            {step === 2 && (
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Name</dt>
                <dd>{form.name}</dd>
                <dt className="text-muted-foreground">Role</dt>
                <dd>{form.role}</dd>
                <dt className="text-muted-foreground">Institution</dt>
                <dd>{form.institution}</dd>
                <dt className="text-muted-foreground">Portfolio</dt>
                <dd className="break-all">{form.portfolio}</dd>
                {form.why && (
                  <>
                    <dt className="text-muted-foreground">Reason</dt>
                    <dd>{form.why}</dd>
                  </>
                )}
              </dl>
            )}
          </div>

          <div className="flex justify-between border-t border-border p-4">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
              className="h-9 rounded-lg px-4 text-sm font-medium hover:bg-muted disabled:invisible"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!canNext}
              onClick={() => (step < 2 ? setStep((s) => s + 1) : submit())}
              className="h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {step < 2 ? "Continue" : "Submit application"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, id, hint, children }: { label: string; id: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
