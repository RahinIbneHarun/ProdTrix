"use client";

import { useState } from "react";
import {
  Plus,
  BookOpen,
  Lightbulb,
  GraduationCap,
  Camera,
  Pencil,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
const courseItems = ["C++", "C#", "AI Fundamentals"];
const bookItems = ["Clean Code", "The Pragmatic Programmer"];
const ideaItems = ["Build a SaaS", "Open source CLI tool"];

const TABS = [
  { id: "basic-info", label: "Basic Info" },
  { id: "templates", label: "Templates +" },
  { id: "design", label: "Design +" },
  { id: "saved", label: "Saved" },
];

// ── Tab Content ───────────────────────────────────────────────────────────────
function TabContent({ activeTab }: { activeTab: string }) {
  if (activeTab === "basic-info") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {[
          { label: "Name", value: "Sifur Rahman" },
          { label: "Field", value: "Full Stack Developer" },
          { label: "Email", value: "sifur@example.com" },
          { label: "Status", value: "Available for work", green: true },
        ].map((item) => (
          <div key={item.label} className="theme-card px-5 py-4 space-y-1">
            <p className="theme-label">{item.label}</p>
            <p
              className={`font-medium text-sm mt-1 ${item.green ? "text-emerald-500 dark:text-emerald-400" : "text-black dark:text-white"}`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-4 theme-card px-6 py-10 text-center text-gray-400 dark:text-white/25 text-sm">
      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content coming
      soon.
    </div>
  );
}

// ── Content Column ────────────────────────────────────────────────────────────
function ContentColumn({
  title,
  icon,
  items,
  accentColor,
  className = "",
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  accentColor: string;
  className?: string;
}) {
  return (
    <div className={`theme-card p-5 flex flex-col gap-3 h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-white/10">
        {icon}
        <h3 className="font-semibold text-black dark:text-white text-sm">
          {title}
        </h3>
      </div>

      {/* Add Button */}
      <button className="theme-button-secondary flex items-center justify-center gap-2 w-full py-3 text-sm">
        <Plus className="h-4 w-4" />
        <span>Add {title}</span>
      </button>

      {/* Items */}
      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex-1 min-w-[140px] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 flex items-center justify-between hover:border-gray-300 dark:hover:border-white/20 transition-colors bg-gray-50 dark:bg-white/5"
          >
            <span className={`font-medium text-sm ${accentColor}`}>{item}</span>
            <span className="text-[10px] text-gray-400 dark:text-white/20 uppercase tracking-widest">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("basic-info");

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* ── Profile Card ── */}
        <div className="theme-card overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gray-100 dark:bg-white/5 relative flex items-center justify-center border-b border-gray-200 dark:border-white/10">
            {/* Grid overlay — dark mode only, matches homepage */}
            <div className="theme-grid absolute inset-0 opacity-40" />
            {/* Violet glow — dark mode only, matches homepage */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-violet-700/20 blur-[80px] pointer-events-none dark:block hidden" />
            <span className="theme-label relative z-10">Cover Photo</span>
            <button className="absolute bottom-3 right-4 theme-button-secondary flex items-center gap-2 px-3 py-1.5 text-xs">
              <Camera className="h-3.5 w-3.5" />
              Upload
            </button>
          </div>

          {/* Avatar + Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-10">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full border-4 border-white dark:border-[#040404] bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-white/40 text-sm font-semibold shrink-0 relative z-10">
                SR
              </div>

              {/* Name + Bio */}
              <div className="flex-1 text-center sm:text-left space-y-1 pb-1">
                <h1 className="text-lg font-semibold text-black dark:text-white">
                  Sifur Rahman
                </h1>
                <p className="text-xs text-gray-500 dark:text-white/40">
                  Full Stack Developer · On Demand ·{" "}
                  <span className="text-emerald-500 dark:text-emerald-400">
                    100% Complete
                  </span>
                </p>
                <p className="text-xs text-gray-400 dark:text-white/30 italic border-l-2 border-gray-200 dark:border-white/10 pl-3 mt-1">
                  "Building clean, scalable systems — one commit at a time."
                </p>
              </div>

              {/* Edit Button */}
              <button className="theme-button-secondary flex items-center gap-2 px-4 py-2 text-sm self-center sm:self-auto">
                <Pencil className="h-3.5 w-3.5" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* ── Content Grid ── */}
        <div className="flex flex-col gap-4">
          <ContentColumn
            title="Course"
            icon={
              <GraduationCap className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            }
            items={courseItems}
            accentColor="text-blue-500 dark:text-blue-400"
            className="w-full"
          />
          <ContentColumn
            title="Book"
            icon={
              <BookOpen className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            }
            items={bookItems}
            accentColor="text-emerald-500 dark:text-emerald-400"
            className="w-full"
          />
          <ContentColumn
            title="Idea / Plan"
            icon={
              <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            }
            items={ideaItems}
            accentColor="text-amber-500 dark:text-amber-400"
            className="w-full"
          />
        </div>

        {/* ── Tabs ── */}
        <div className="theme-card p-2 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-gray-500 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <TabContent activeTab={activeTab} />
      </div>
    </div>
  );
}
