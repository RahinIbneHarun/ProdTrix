import ClientLayoutWrapper from "@/components/ClientLayoutWrapper"; // Change this import
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Hedvig_Letters_Serif, Inter } from "next/font/google";
import "./globals.css";
import React, { Suspense } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const hedvig = Hedvig_Letters_Serif({
  subsets: ["latin"],
  variable: "--font-hedvig-letters-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OBE Study Portal",
  description: "A study-focused platform for outcome-based education and academic workflow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        hedvig.variable,
        "font-sans",
        inter.variable,
      )}
      suppressHydrationWarning={true}
    >
      <body className={GeistSans.className}>
        <ReactQueryProvider>
          <ThemeProvider>
            <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" /></div>}>
              <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            </Suspense>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
