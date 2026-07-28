"use client";

import Link from "next/link";
import { BookOpen, Filter, Menu, Plus } from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
type BookNote = {
  id: string;
  title: string;
};

const academicNotes: BookNote[] = [
  { id: "acad-1", title: "Microcontrollers" },
  { id: "acad-2", title: "Engineering Ethics" },
  { id: "acad-3", title: "Digital Logic" },
];

const nonAcademicNotes: BookNote[] = [
  { id: "non-1", title: "Atomic Habits" },
  { id: "non-2", title: "The Alchemist" },
];

// ── Note Card ─────────────────────────────────────────────────────────────────
function NoteCard({ title }: { title: string }) {
  return (
    <button
      type="button"
      className="theme-card aspect-square flex flex-col items-center justify-center gap-2 p-3 text-center transition-all hover:border-blue-400/40 hover:-translate-y-0.5"
    >
      <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400" />
      <span className="text-xs font-medium leading-snug text-black dark:text-white line-clamp-2">
        {title}
      </span>
    </button>
  );
}

// ── Add Note Card ─────────────────────────────────────────────────────────────
function AddNoteCard() {
  return (
    <Link
      href="/book-notes/new"
      className="aspect-square flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/15 text-gray-400 dark:text-white/30 transition-colors hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400"
    >
      <Plus className="h-6 w-6" />
      <span className="text-[11px] font-medium">Add Note</span>
    </Link>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
function NoteSection({ title, notes }: { title: string; notes: BookNote[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-black dark:text-white">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {notes.map((note) => (
          <NoteCard key={note.id} title={note.title} />
        ))}
        <AddNoteCard />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BookNoteListPage() {
  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-black dark:text-white">
            Book Note List
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Filter"
              className="theme-button-secondary flex h-9 w-9 items-center justify-center rounded-full"
            >
              <Filter className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Navigation"
              className="theme-button-secondary flex h-9 w-9 items-center justify-center rounded-full"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sections */}
        <NoteSection title="Academic" notes={academicNotes} />
        <NoteSection title="Non Academic" notes={nonAcademicNotes} />
      </div>
    </div>
  );
}
