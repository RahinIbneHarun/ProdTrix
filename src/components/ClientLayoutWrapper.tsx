"use client";

import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/site-footer";
import { SidebarNav } from "@/components/sidebar-nav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarProvider } from "@/components/ui/sidebar";
import { isPathAllowedForRoles } from "@/lib/auth/route-permissions";
import { ChevronRight, Home, LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState, Suspense } from "react";
export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);

  // Handle redirects for /admin and /supervisor
  useEffect(() => {
    if (pathname === "/admin") {
      router.push("/admin/dashboard");
    } else if (pathname === "/supervisor") {
      router.push("/supervisor/dashboard");
    }
  }, [pathname, router]);

  const isPublicShellRoute =
    pathname.startsWith("/api/") || // guard: never run auth
    pathname === "/" ||
    pathname.startsWith("/Home") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/authenticate") ||
    pathname.startsWith("/auth-callback") ||
    pathname.startsWith("/support") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/admin/profile") ||
    pathname.startsWith("/feed") ||
    pathname.startsWith("/book-notes");

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await fetch(`/api/auth/cookie`, {
          credentials: "include",
        });

        if (res.ok) {
          const authData = await res.json();

          if (authData?.authenticated && authData?.user) {
            setAuthUser(authData);
            setIsAuthReady(true);

            // For protected routes, check role authorization
            if (!isPublicShellRoute) {
              const userRoles = authData.user.roles ?? [];
              const isAllowed = isPathAllowedForRoles(pathname, userRoles);

              if (!isAllowed) {
                router.replace("/unauthorized");
                return;
              }
            }

            return;
          }
        }
      } catch (err) {
        // fallthrough
      }

      setIsAuthReady(true);

      // Only redirect to login for protected routes
      if (!isPublicShellRoute) {
        const next = encodeURIComponent(pathname || "/admin/dashboard");
        window.location.replace(`/api/auth/login?next=${next}`);
      }
    };

    initAuth();
  }, [isPublicShellRoute, pathname, router]);
  if (!isPublicShellRoute && !isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  // Public routes (landing page, auth pages)
  if (isPublicShellRoute) {
    return (
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background text-foreground transition-colors duration-300">
        <header
          className="theme-nav sticky top-0 z-50 transition-all duration-300"
          style={{
            backgroundColor:
              theme === "dark"
                ? "rgba(15, 15, 15, 0.95)"
                : "rgba(255, 255, 255, 0.97)",
            borderBottom: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
          }}
        >
          <div
            className="mx-auto flex w-full items-center justify-between py-4"
            style={{
              paddingLeft: "10%",
              paddingRight: "10%",
            }}
          >
            <div className="flex items-center gap-4">
              <Link
                href="/Home"
                className="flex items-center gap-3 transition-opacity duration-300"
              >
                <BrandLogo className="h-10 w-10 rounded-lg" />
                <span className="text-[20px] font-medium tracking-tight text-foreground transition-colors duration-300">
                  ProdTrix
                </span>
              </Link>
            </div>

            <nav className="flex items-center gap-4 text-[15px] font-medium text-muted-foreground">
              <Link
                href="/Home"
                className="transition-colors hover:text-foreground"
              >
                Home
              </Link>

              <Link
                href="/about"
                className="transition-colors hover:text-foreground"
              >
                About
              </Link>

              <div className="ml-4 flex items-center gap-3">
                <Link
                  href="/support"
                  className="theme-button-primary px-4 py-2 font-medium transition-all"
                >
                  Support
                </Link>

                {authUser ? (
                  <>
                    <Link
                      href="/admin/profile"
                      title="Go to profile"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-foreground"
                    >
                      <User className="h-4 w-4" />
                    </Link>
                    <a
                      href="/api/auth/logout"
                      title="Sign out"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                    </a>
                  </>
                ) : (
                  <>
                    {pathname !== "/login" && (
                      <Link
                        href="/login"
                        className="theme-button-primary px-4 py-2 font-medium transition-all"
                      >
                        Login
                      </Link>
                    )}
                  </>
                )}
              </div>

              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main className="theme-shell relative flex flex-1 overflow-hidden">
          <div className="theme-grid pointer-events-none absolute inset-0 opacity-40" />
          <div
            className="relative z-10 mx-auto flex w-full flex-1 flex-col"
            style={{
              paddingLeft: "10%",
              paddingRight: "10%",
            }}
          >
            {children}
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter((path) => path);
    const breadcrumbs = [];

    // Add Home breadcrumb
    breadcrumbs.push({
      label: "Dashboard",
      href: "/dashboard",
      isLast: paths.length === 0,
    });

    // Build breadcrumb path
    let currentPath = "";
    for (let i = 0; i < paths.length; i++) {
      currentPath += `/${paths[i]}`;
      const label = formatBreadcrumbLabel(paths[i], currentPath);

      breadcrumbs.push({
        label,
        href: currentPath,
        isLast: i === paths.length - 1,
      });
    }

    return breadcrumbs;
  };

  const formatBreadcrumbLabel = (path: string, fullPath: string): string => {
    // Custom labels for specific paths
    const customLabels: Record<string, string> = {
      dashboard: "Dashboard",
      supervisor: "Supervisor",
      admin: "Admin",
      "ProdTrix Group": "ProdTrix Groups",
      documents: "Documents",
      students: "Students",
      courses: "Courses",
      reports: "Reports",
      messages: "Messages",
      settings: "Settings",
      help: "Help Center",
    };

    // Check if we have a custom label for the full path
    if (customLabels[fullPath.substring(1)]) {
      return customLabels[fullPath.substring(1)];
    }

    // Check if we have a custom label for just the path segment
    if (customLabels[path]) {
      return customLabels[path];
    }

    // Format the path segment: convert kebab-case to Title Case
    return path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbs = generateBreadcrumbs();

  // Authenticated routes with sidebar
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        {/* Sidebar */}
        <aside
          className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card transition-all duration-300"
          style={{
            backgroundColor:
              theme === "dark"
                ? "rgba(20, 20, 20, 0.8)"
                : "rgba(250, 250, 250, 0.8)",
          }}
        >
          <div
            className="flex h-16 items-center border-b border-border px-4 transition-all duration-300"
            style={{
              borderColor:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="flex items-center gap-3">
              <BrandLogo className="h-8 w-8 rounded-md" />
              <span className="text-lg font-medium tracking-tight text-foreground">
                ProdTrix
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4">
            <SidebarNav userRoles={authUser?.user?.roles ?? []} />
          </div>
        </aside>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card shadow-sm transition-all duration-300 md:hidden"
          style={{
            backgroundColor:
              theme === "dark"
                ? "rgba(40, 40, 40, 0.9)"
                : "rgba(245, 245, 245, 0.9)",
          }}
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-50 bg-primary/30 backdrop-blur-sm transition-all duration-300 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed left-0 top-0 z-50 h-full w-64 transform animate-in slide-in-from-left duration-300 md:hidden">
              <div
                className="flex h-full flex-col bg-card shadow-xl transition-all duration-300"
                style={{
                  backgroundColor:
                    theme === "dark"
                      ? "rgba(20, 20, 20, 0.95)"
                      : "rgba(250, 250, 250, 0.95)",
                }}
              >
                <div
                  className="flex h-16 items-center justify-between border-b border-border px-4 transition-all duration-300"
                  style={{
                    borderColor:
                      theme === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <BrandLogo className="h-8 w-8 rounded-md" />
                    <span className="text-lg font-medium tracking-tight text-foreground">
                      ProdTrix
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-md p-1 hover:bg-secondary"
                  >
                    <X className="h-5 w-5 text-foreground" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <SidebarNav userRoles={authUser?.user?.roles ?? []} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <header
            className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-card/95 transition-all duration-300"
            style={{
              paddingLeft: "1rem",
              paddingRight: "2rem",
              backgroundColor:
                theme === "dark"
                  ? "rgba(20, 20, 20, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
              borderColor:
                theme === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2">
              <nav className="flex items-center gap-1 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center gap-1">
                    {index === 0 && (
                      <Home className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    {crumb.isLast ? (
                      <span className="font-medium text-foreground">
                        {crumb.label}
                      </span>
                    ) : (
                      <>
                        <Link
                          href={crumb.href}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {crumb.label}
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {authUser && (
                <>
                  <Link
                    href="/support"
                    className="theme-button-primary px-3 py-1.5 text-sm font-medium transition-all"
                  >
                    Support
                  </Link>
                  <ThemeToggle />
                  <button className="flex h-8 items-center justify-center rounded-full border border-border bg-secondary px-4">
                    <span className="text-sm font-medium text-foreground">
                      {authUser?.user?.profile?.name ??
                        authUser?.user?.username ??
                        "User"}
                    </span>
                  </button>
                  <a
                    href="/api/auth/logout"
                    title="Sign out"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </a>
                </>
              )}
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <Suspense
              fallback={
                <div className="flex min-h-[200px] items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
                </div>
              }
            >
              <div>{children}</div>
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
