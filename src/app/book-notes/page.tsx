"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
  Menu,
  Plus,
  Search,
} from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import BookNoteForm, { type BookNoteInput } from "@/components/book-note-form";

// ── Data ──────────────────────────────────────────────────────────────────────
type BookNote = {
  id: string;
  title: string;
  description: string;
  image: string;
  section: "academic" | "non-academic";
};

const initialNotes: BookNote[] = [
  // Academic
  {
    id: "acad-1",
    title: "Microcontrollers",
    description:
      "Timers, interrupts, and embedded C programming fundamentals.",
    image: "https://picsum.photos/seed/book-microcontrollers/300/300",
    section: "academic",
  },
  {
    id: "acad-2",
    title: "Engineering Ethics",
    description: "Professional responsibility, codes of conduct, and case studies.",
    image: "https://picsum.photos/seed/book-ethics/300/300",
    section: "academic",
  },
  {
    id: "acad-3",
    title: "Digital Logic",
    description: "Boolean algebra, combinational and sequential circuits.",
    image: "https://picsum.photos/seed/book-digital-logic/300/300",
    section: "academic",
  },
  // Non Academic
  {
    id: "non-1",
    title: "Atomic Habits",
    description: "Tiny changes, remarkable results — habit stacking in practice.",
    image: "https://picsum.photos/seed/book-atomic-habits/300/300",
    section: "non-academic",
  },
  {
    id: "non-2",
    title: "The Alchemist",
    description: "Follow your personal legend and listen to your heart.",
    image: "https://picsum.photos/seed/book-alchemist/300/300",
    section: "non-academic",
  },
];

// ── Note Card (picture → title → description) ────────────────────────────────
function NoteCard({ note }: { note: BookNote }) {
  return (
    <div className="shrink-0 w-[200px] sm:w-[240px] rounded-xl border border-gray-300 dark:border-white/10 overflow-hidden bg-white dark:bg-white/5 shadow-xl shadow-gray-400/50 dark:shadow-none hover:border-gray-400 dark:hover:border-white/20 transition-colors">
      {/* Picture */}
      <div className="relative h-28 w-full bg-gray-100 dark:bg-white/5">
        <Image
          src={note.image}
          alt={note.title}
          fill
          sizes="240px"
          className="object-cover"
        />
      </div>

      {/* Title + Description */}
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-medium text-black dark:text-white leading-snug truncate">
          {note.title}
        </h3>
        <p className="text-xs text-black dark:text-white/40 leading-snug line-clamp-2">
          {note.description}
        </p>
      </div>
    </div>
  );
}

// ── Auto-scrolling Carousel (with manual nav buttons) ────────────────────────
// Shows each note exactly once, scrolling forward and looping back to the
// first item when the end is reached.
function NoteCarousel({ notes }: { notes: BookNote[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const isWrappingRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll via rAF; when reaching the end, smoothly wrap back to start.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || notes.length === 0) return;

    let rafId: number;
    const speed = 0.4; // px per frame (~24px/s)

    const wrapBack = () => {
      isWrappingRef.current = true;
      el.scrollTo({ left: 0, behavior: "smooth" });
      // Resume forward scrolling once the wrap animation finishes
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = setTimeout(() => {
        isWrappingRef.current = false;
      }, 600);
    };

    const step = () => {
      if (el && !pausedRef.current && !isWrappingRef.current) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 0) {
          // Nothing to scroll (track fits inside the container)
        } else if (el.scrollLeft >= maxScroll - 1) {
          wrapBack();
        } else {
          el.scrollLeft += speed;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [notes.length]);

  const pauseThenResume = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 1800);
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    pauseThenResume();
    const maxScroll = el.scrollWidth - el.clientWidth;

    // At the right edge and pressing right → wrap back to start
    if (direction === 1 && el.scrollLeft >= maxScroll - 1) {
      isWrappingRef.current = true;
      el.scrollTo({ left: 0, behavior: "smooth" });
      resumeTimeoutRef.current = setTimeout(() => {
        isWrappingRef.current = false;
      }, 600);
      return;
    }

    // At the left edge and pressing left → jump to the end
    if (direction === -1 && el.scrollLeft <= 0) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    const firstCard = el.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.offsetWidth + 12 : 240;
    el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      {/* Left button */}
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Scroll left"
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border border-gray-300 dark:border-white/10 bg-white/90 dark:bg-black/50 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/70 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-white/70" />
      </button>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto no-scrollbar w-full px-9"
      >
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>

      {/* Right button */}
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Scroll right"
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border border-gray-300 dark:border-white/10 bg-white/90 dark:bg-black/50 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white dark:hover:bg-black/70 transition-colors"
      >
        <ChevronRight className="h-4 w-4 text-gray-600 dark:text-white/70" />
      </button>
    </div>
  );
}

// ── Add Note Button (opens BookNoteForm in a Sheet modal) ────────────────────
function AddNoteCard({
  onAdd,
}: {
  onAdd: (note: BookNoteInput) => void;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="theme-button-secondary flex items-center justify-center gap-2 w-full py-3 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Note</span>
        </button>
      </SheetTrigger>
      <SheetContent side="center">
        <SheetHeader className="px-10">
          <SheetTitle>Add a new note</SheetTitle>
          <SheetDescription>Create a new BookNote entry.</SheetDescription>
        </SheetHeader>
        <BookNoteForm modal={true} onSubmitValue={onAdd} />
      </SheetContent>
    </Sheet>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
function NoteSection({
  title,
  notes,
  onAdd,
}: {
  title: string;
  notes: BookNote[];
  onAdd: (note: BookNoteInput) => void;
}) {
  return (
    <div className="theme-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          <h2 className="text-sm font-semibold text-black dark:text-white">
            {title}
          </h2>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-black dark:text-white/25">
          {notes.length} notes
        </span>
      </div>

      {/* Add Note – opens modal */}
      <AddNoteCard onAdd={onAdd} />

      {/* Items — auto-scrolling carousel */}
      {notes.length > 0 ? (
        <NoteCarousel notes={notes} />
      ) : (
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 shadow-lg shadow-gray-400/40 dark:shadow-none px-6 py-8 text-center text-black dark:text-white/25 text-sm">
          No {title.toLowerCase()} notes match your search.
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BookNoteListPage() {
  const [notes, setNotes] = useState<BookNote[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchQuery.trim().toLowerCase();
  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(query)
  );
  const academicNotes = filteredNotes.filter((n) => n.section === "academic");
  const nonAcademicNotes = filteredNotes.filter((n) => n.section === "non-academic");

  function handleAddNote(note: BookNoteInput) {
    const nextId = `note-${Date.now()}`;
    setNotes((prev) => [
      ...prev,
      {
        id: nextId,
        title: note.title,
        description: note.description,
        image: note.image,
        section: note.section,
      },
    ]);
  }

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

        {/* Search */}
        <div className="relative shadow-lg shadow-gray-400/50 rounded-full dark:shadow-none">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-black dark:text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by name…"
            className="w-full rounded-full border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 pl-10 pr-4 py-2.5 text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors"
          />
        </div>

        {/* Sections */}
        {filteredNotes.length === 0 ? (
          <div className="theme-card rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 shadow-xl shadow-gray-400/50 dark:shadow-none px-6 py-10 text-center text-black dark:text-white/25 text-sm">
            No notes found for “{searchQuery.trim()}”.
          </div>
        ) : (
          <>
            <NoteSection
              title="Academic"
              notes={academicNotes}
              onAdd={handleAddNote}
            />
            <NoteSection
              title="Non Academic"
              notes={nonAcademicNotes}
              onAdd={handleAddNote}
            />
          </>
        )}
      </div>
    </div>
  );
}
