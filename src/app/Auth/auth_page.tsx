"use client";

import { motion, Variants } from "framer-motion";
import { MacWindowControls } from "@/components/mac-window-controls";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthPageProps = {
  mode?: "signup" | "login";
};

type FormErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function AuthPage({ mode = "signup" }: AuthPageProps) {
  const isLogin = mode === "login";
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full name validation (signup only)
    if (!isLogin && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (!isLogin && formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation (signup only)
    if (!isLogin && !formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (e) {
        data = { message: "Invalid response from server" };
      }

      if (!response.ok) {
        setErrors({
          general:
            data?.message ||
            data?.error ||
            `${isLogin ? "Login" : "Signup"} failed. Please try again.`,
        });
        setLoading(false);
        return;
      }

      setSuccess(true);

      // Redirect to dashboard after successful login/signup
      setTimeout(() => {
        router.push("/admin/profile");
      }, 1500);
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrors({
        general: err?.message || "An error occurred. Please try again.",
      });
      setLoading(false);
    }
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
              {!isLogin && (
                <span className="theme-heading-accent"> support faster.</span>
              )}
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

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            {isLogin ? (
              <Link
                href="/signup"
                className="theme-button-primary px-6 py-3 font-medium transition-all"
              >
                Create account
              </Link>
            ) : (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            )}
          </motion.div>
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
              {/* General error message */}
              {errors.general && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {errors.general}
                </div>
              )}

              {/* Success message */}
              {success && (
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
                  {isLogin
                    ? "Login successful! Redirecting..."
                    : "Account created! Redirecting..."}
                </div>
              )}

              {/* Full name field (signup only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Alex Morgan"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={loading || success}
                    className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 ${
                      errors.fullName
                        ? "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-primary/20"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">
                      {errors.fullName}
                    </p>
                  )}
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="alex@university.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading || success}
                  className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 ${
                    errors.email
                      ? "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
                      : "border-border focus:border-primary focus:ring-primary/20"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading || success}
                  className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 ${
                    errors.password
                      ? "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
                      : "border-border focus:border-primary focus:ring-primary/20"
                  }`}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
                {!isLogin && (
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters required
                  </p>
                )}
              </div>

              {/* Confirm password field (signup only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading || success}
                    className={`w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:ring-2 ${
                      errors.confirmPassword
                        ? "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-primary/20"
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || success}
                className="theme-button-primary mt-2 w-full px-6 py-3 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : isLogin
                    ? "Login"
                    : "Create account"}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
