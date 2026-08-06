"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";

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

  return (
    <section className="relative w-full flex items-center justify-center">
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
            ● VALIDATING NOW
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-foreground">
              Student help
              <br />
              that feels
              <br />
              <span className="theme-heading-accent">simple and reliable.</span>
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="max-w-xl text-lg leading-8 text-muted-foreground"
          >
            A student-first support platform for quick guidance, centralized help
            requests, faster responses, and a smoother academic journey across
            departments.
          </motion.p>

          {/* Navigation buttons removed from hero area; top-right header handles navigation */}

          {/* Removed hero stats (24/7, 1.2K+, 95%) per request */}
        </div>

        {/* Right */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="theme-terminal w-full max-w-3xl ml-auto">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <span className="w-3 h-3 rounded-full bg-muted" />
              <span className="w-3 h-3 rounded-full bg-muted" />
              <span className="w-3 h-3 rounded-full bg-muted" />
              <span className="ml-4 text-sm text-muted-foreground">
                student-help-cli
              </span>
            </div>

            <div className="p-6 md:p-8 font-mono text-sm md:text-base leading-8 text-foreground">
              <div>$ student-help connect --request</div>
              <div className="text-muted-foreground">
                → Routing your question to the right department...
              </div>
              <div className="text-muted-foreground">
                → Checking active student support updates...
              </div>
              <div className="text-primary">
                ✓ Request received • Priority assigned • 2 min avg response
              </div>
              <div className="text-muted-foreground">
                → Preparing guidance summary...
              </div>
              <div className="text-primary">
                ✓ Summary shared: student-support-guide.pdf
              </div>
              <div className="mt-2 w-3 h-6 rounded-full bg-primary/70 animate-pulse" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
