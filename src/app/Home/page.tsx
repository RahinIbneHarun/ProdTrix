"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";

const supportJourney = [
  {
    command: "$ prodtrix request --new",
    detail: "→ Choose your course and support topic...",
    status: "✓ Request created · ready for routing",
  },
  {
    command: "$ prodtrix route --department",
    detail: "→ Matching your request with the right team...",
    status: "✓ Department notified · coordinator assigned",
  },
  {
    command: "$ prodtrix track --updates",
    detail: "→ Checking the latest progress on your request...",
    status: "✓ Live status available · no inbox searching",
  },
  {
    command: "$ prodtrix resolve --summary",
    detail: "→ Preparing your guidance and next actions...",
    status: "✓ Support summary shared · journey complete",
  },
];

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 24 },
    },
  };

  const journeyCardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 180, damping: 22 },
    },
  };

  return (
    <div className="relative w-full py-10 md:py-14">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/20 blur-[140px] pointer-events-none dark:block hidden" />

      <motion.div
        className="w-full grid grid-cols-1 lg:grid-cols-2 gap-14 items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left */}
        <div className="max-w-2xl space-y-8">
          <motion.div variants={itemVariants} className="theme-label">
            ● ProdTrix PLATFORM
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-foreground">
              ProdTrix brings
              <br />
              clarity to every
              <br />
              <span className="theme-heading-accent">academic support need.</span>
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="max-w-xl text-lg leading-8 text-muted-foreground"
          >
            A dependable support experience for students and departments, with
            faster routing, clearer updates, and smarter coordination across
            every step of the journey.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Get started
            </Link>
            <Link
              href="/support"
              className="inline-flex items-center justify-center rounded-full border border-primary bg-primary/85 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary"
            >
              Explore support
            </Link>
          </motion.div>

          <div className="flex w-full max-w-3xl flex-col gap-4">
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-card/90 p-7 text-sm leading-8 text-muted-foreground shadow-[0_0_80px_rgba(54,13,54,0.18)]"
            >
              <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary/80 to-transparent" />
              <div className="absolute right-0 top-0 h-full w-1.5 bg-gradient-to-b from-primary/80 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(54,13,54,0.18),transparent_55%)]" />
              <div className="relative z-10">
                <p className="font-semibold text-foreground">
                  ProdTrix brings a focused academic support experience to every
                  student and department.
                </p>
                <p className="mt-2">
                  From guidance requests to follow-up coordination, the platform keeps
                  support organized, clear, and aligned with the project theme.
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative w-full overflow-hidden rounded-[2rem] border border-primary/20 bg-card/90 p-6 text-sm leading-7 text-muted-foreground shadow-[0_0_60px_rgba(54,13,54,0.14)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(54,13,54,0.14),transparent_60%)]" />
              <div className="relative z-10">
                <p className="font-semibold text-foreground">
                  Structured guidance for every support journey.
                </p>
                <p className="mt-2">
                  Keep requests, updates, and follow-ups aligned with a calm and clearly
                  organized experience.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="theme-terminal w-full max-w-3xl ml-auto">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <span className="w-3 h-3 rounded-full bg-muted" />
              <span className="w-3 h-3 rounded-full bg-muted" />
              <span className="w-3 h-3 rounded-full bg-muted" />
              <span className="ml-4 text-sm text-muted-foreground">
                ProdTrix CLI
              </span>
            </div>

            <div className="p-6 md:p-8 font-mono text-sm md:text-base leading-8 text-foreground">
              <div>$ prodtrix connect --support</div>
              <div className="text-muted-foreground">
                → Routing your request to the right team...
              </div>
              <div className="text-muted-foreground">
                → Checking active support updates...
              </div>
              <div className="text-primary">
                ✓ Request received • Priority assigned • 2 min avg response
              </div>
              <div className="text-muted-foreground">
                → Preparing guidance summary...
              </div>
              <div className="text-primary">
                ✓ Summary shared: prodtrix-support-guide.pdf
              </div>
              <div className="mt-2 w-3 h-6 rounded-full bg-primary/70 animate-pulse" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <section className="relative mx-auto mt-24 w-full max-w-5xl border-t border-border/70 pb-6 pt-16 md:mt-32 md:pb-8 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="theme-label">A CLEAR SUPPORT JOURNEY</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Every request has a clear next step.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Follow your support request from submission to a shared guidance
            summary—without losing the context along the way.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-12 flex w-full max-w-4xl flex-col gap-10 md:mt-16 md:gap-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          transition={{ staggerChildren: 0.12 }}
        >
          {supportJourney.map((step, index) => (
            <motion.article
              key={step.command}
              variants={journeyCardVariants}
              whileHover={{ y: -5 }}
              className={`theme-terminal group relative w-full max-w-[34rem] overflow-hidden transition-shadow duration-300 hover:shadow-[0_22px_55px_hsl(var(--primary)/0.18)] ${
                index % 2 === 0
                  ? "self-start md:translate-x-8"
                  : "self-end md:-translate-x-8"
              }`}
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-primary/70 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-muted" />
                <span className="h-3 w-3 rounded-full bg-muted" />
                <span className="h-3 w-3 rounded-full bg-muted" />
                <span className="ml-3 text-xs text-muted-foreground">
                  ProdTrix CLI
                </span>
                <span className="ml-auto font-mono text-[11px] text-muted-foreground/70">
                  0{index + 1}
                </span>
              </div>

              <div className="space-y-2 px-6 py-6 font-mono text-[13px] leading-6 sm:px-7 sm:text-sm sm:leading-7">
                <p className="font-semibold text-foreground">{step.command}</p>
                <p className="text-muted-foreground">{step.detail}</p>
                <p className="text-primary">{step.status}</p>
                <div className="mt-3 h-5 w-2.5 rounded-full bg-primary/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
