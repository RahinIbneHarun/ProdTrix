"use client";

import { motion, Variants } from "framer-motion";
import { MacWindowControls } from "@/components/mac-window-controls";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthPageProps = {
  mode?: "signup" | "login";
};

export default function AuthPage({ mode = "signup" }: AuthPageProps) {
  const isLogin = mode === "login";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!isLogin) {
      setError("Use the demo account on the Login page for now.");
      return;
    }

    if (
      email.toLowerCase() !== "demo@prodtrix.local" ||
      password !== "ProdTrix@2026"
    ) {
      setError("Use the provided ProdTrix demo email and password.");
      return;
    }

    sessionStorage.setItem("prodtrix-demo-authenticated", "true");
    router.push("/Home");
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[500px] w-[900px] -translate-x-1/2 bg-primary/20 blur-[140px] dark:block hidden" />

      <motion.div
        className="grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-2xl space-y-8">
          <motion.div variants={itemVariants} className="theme-label">
            {isLogin ? "● WELCOME BACK" : "● JOIN STUDENT HELP"}
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {isLogin ? "Welcome back to" : "Join the student help"}
              <br />
              {isLogin ? "your support space" : "platform and get"}
              {!isLogin && <span className="theme-heading-accent"> support faster.</span>}
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="max-w-xl text-lg leading-8 text-muted-foreground"
          >
            {isLogin
              ? "Sign in to get quick guidance, track support requests, and keep your academic journey organized."
              : "Create an account to request help, connect with departments, and stay supported throughout your academic journey."}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={isLogin ? "/signup" : "/login"}
              className="theme-button-secondary inline-flex items-center px-6 py-3 font-medium transition-all"
            >
              {isLogin ? "Create account" : "Sign in instead"}
            </Link>
          </motion.div>

          {/* Highlights removed per user request: 24/7, Secure, Fast */}
        </div>

        <motion.div variants={itemVariants} className="w-full">
          <div className="theme-terminal ml-auto w-full max-w-2xl rounded-[1.6rem] border border-border bg-card/90 shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.45)] backdrop-blur">
            <div className="flex items-center border-b border-border px-4 py-3">
              <MacWindowControls />
              <span className="ml-4 text-sm text-muted-foreground">
                {isLogin ? "account-access" : "account-setup"}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-8">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="Alex Morgan"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="alex@university.edu"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              {error && (
                <p className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-muted-foreground">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="theme-button-primary mt-2 w-full px-6 py-3 font-medium transition-all"
              >
                {isLogin ? "Login" : "Create account"}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
