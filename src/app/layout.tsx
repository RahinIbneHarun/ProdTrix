import ClientLayoutWrapper from "@/components/ClientLayoutWrapper"; // Change this import
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Geist, Geist_Mono } from "next/font/google";
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Podtrix",
  description: "",
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
        geistSans.variable,
        geistMono.variable,
        hedvig.variable,
        "font-sans",
        inter.variable,
      )}
      suppressHydrationWarning={true}
    >
      <body className={geistSans.className}>
        <ReactQueryProvider>
          <ThemeProvider>
            <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white" /></div>}>
              <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            </Suspense>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
