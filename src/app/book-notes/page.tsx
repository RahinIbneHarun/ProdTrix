"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, Filter, Menu, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import BookNoteForm, { type BookNoteInput } from "@/components/book-note-form";

// ── Data ──────────────────────────────────────────────────────────────────────
type BookNote = {
  id: string;
  title: string;
  description: string;
  image: string;
  section: "academic" | "non-academic";
};

const initialAcademicNotes: BookNote[] = [
  {
    id: "acad-1",
    title: "Microcontrollers",
    description: "Timers, interrupts and embedded C programming fundamentals.",
    image: "https://picsum.photos/seed/microcontrollers/300/300",
    section: "academic",
  },
  {
    id: "acad-2",
    title: "Engineering Ethics",
    description: "Professional responsibility and ethical decision making.",
    image: "https://picsum.photos/seed/engineering-ethics/300/300",
    section: "academic",
  },
  {
    id: "acad-3",
    title: "Digital Logic",
    description: "Boolean algebra, combinational and sequential circuits.",
    image: "https://picsum.photos/seed/digital-logic/300/300",
    section: "academic",
  },
];

const initialNonAcademicNotes: BookNote[] = [
  {
    id: "non-1",
    title: "Atomic Habits",
    description: "Tiny changes, remarkable results — habit building systems.",
    image: "https://picsum.photos/seed/atomic-habits/300/300",
    section: "non-academic",
  },
  {
    id: "non-2",
    title: "The Alchemist",
    description: "A journey of following one's personal legend.",
    image: "https://picsum.photos/seed/the-alchemist/300/300",
    section: "non-academic",
  },
];

// ── Note Card ─────────────────────────────────────────────────────────────────
function NoteCard({ item }: { item: BookNote }) {
  return (
    <div className="theme-card overflow-hidden rounded-2xl text-center transition-all hover:-translate-y-0.5">
      {/* Picture */}
      <div className="relative h-36 w-full overflow-hidden bg-gray-100 dark:bg-white/5">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        {/* Title */}
        <h3 className="text-xs font-semibold text-black dark:text-white line-clamp-1">
          {item.title}
        </h3>
        {/* Description */}
        <p className="text-[11px] leading-snug text-gray-500 dark:text-white/40 line-clamp-2">
          {item.description || "No description available."}
        </p>
      </div>
    </div>
  );
}

// ── Auto-scrolling Carousel (with manual nav buttons) ────────────────────────
function ItemCarousel({ items }: { items: BookNote[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const isWrappingRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cards are rendered exactly once (no duplicates). Responsive widths show
  // 2 (mobile) / 3 (sm) / 4 (lg) cards per view, with calc() accounting for
  // the 14px gaps so a full set fits exactly on screen.
  // Track: w-[calc(50%-7px)]  sm:w-[calc(33.333%-9.333px)]  lg:w-[calc(25%-10.5px)]

  // Auto-scroll via rAF; when reaching the end, smoothly wrap back to start.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length === 0) return;

    let rafId: number;
    const speed = 0.5; // px per frame (~30px/s)

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
        if (maxScroll > 0) {
          if (el.scrollLeft >= maxScroll - 1) {
            wrapBack();
          } else {
            el.scrollLeft += speed;
          }
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [items.length]);

  const pause = () => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const resume = () => {
    pausedRef.current = false;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const pauseThenResume = () => {
    pause();
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 1800);
  };

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    pauseThenResume();

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return; // not enough items to scroll

    // At the right edge and pressing right → wrap back to start
    if (direction === 1 && el.scrollLeft >= maxScroll - 1) {
      isWrappingRef.current = true;
      el.scrollTo({ left: 0, behavior: "smooth" });
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
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
    const cardWidth = firstCard ? firstCard.offsetWidth + 14 : 204;
    el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  return (
    <div className="flex items-center gap-3">
      {/* Prev button */}
      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollByCard(-1)}
        className="theme-button-secondary flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Carousel track */}
      <div
        ref={trackRef}
        className="no-scrollbar flex flex-1 gap-3.5 overflow-x-auto scroll-smooth"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pauseThenResume}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="w-[calc(50%-7px)] shrink-0 sm:w-[calc(33.333%-9.333px)] lg:w-[calc(25%-10.5px)]"
          >
            <NoteCard item={item} />
          </div>
        ))}
      </div>

      {/* Next button */}
      <button
        type="button"
        aria-label="Next"
        onClick={() => scrollByCard(1)}
        className="theme-button-secondary flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
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
  onAdd: () => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-black dark:text-white">
        {title}
      </h2>
      <ItemCarousel items={notes} />
      {/* Add Note button (opens the modal) */}
      <button
        type="button"
        onClick={onAdd}
        className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/15 text-gray-400 dark:text-white/30 transition-colors hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400"
      >
        <Plus className="h-6 w-6" />
        <span className="text-[11px] font-medium">Add Note</span>
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BookNoteListPage() {
  const [academicNotes, setAcademicNotes] = useState(initialAcademicNotes);
  const [nonAcademicNotes, setNonAcademicNotes] = useState(initialNonAcademicNotes);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;

  const matchingAcademic = academicNotes.filter((note) =>
    note.title.toLowerCase().includes(query)
  );
  const matchingNonAcademic = nonAcademicNotes.filter((note) =>
    note.title.toLowerCase().includes(query)
  );
  const matchingNotes = [...matchingAcademic, ...matchingNonAcademic];

  const handleAddNote = (note: BookNoteInput) => {
    const newNote: BookNote = {
      id: `note-${Date.now()}`,
      title: note.title,
      description: note.description,
      image: note.image,
      section: note.section,
    };

    if (note.section === "academic") {
      setAcademicNotes((prev) => [...prev, newNote]);
    } else {
      setNonAcademicNotes((prev) => [...prev, newNote]);
    }
  };

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

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-white/30" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by name..."
            className="pl-9"
          />
        </div>

        {isSearching ? (
          /* ── Search Results ── */
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-black dark:text-white">
              Search Results ({matchingNotes.length})
            </h2>
            {matchingNotes.length > 0 ? (
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
                {matchingNotes.map((note) => (
                  <NoteCard key={note.id} item={note} />
                ))}
              </div>
            ) : (
              <div className="theme-card flex h-40 items-center justify-center rounded-2xl text-sm text-gray-400 dark:text-white/30">
                {`No notes found matching "${searchQuery}".`}
              </div>
            )}
          </div>
        ) : (
          /* ── Sections ── */
          <>
            <NoteSection
              title="Academic"
              notes={academicNotes}
              onAdd={() => setModalOpen(true)}
            />
            <NoteSection
              title="Non Academic"
              notes={nonAcademicNotes}
              onAdd={() => setModalOpen(true)}
            />
          </>
        )}
      </div>

      {/* Add Note Modal */}
      <Sheet open={modalOpen} onOpenChange={setModalOpen}>
        <SheetContent side="center" showCloseButton>
          <SheetHeader>
            <SheetTitle>Make a BookNote</SheetTitle>
            <SheetDescription>
              Fill in the details below — the note will appear in the list instantly.
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto">
            <BookNoteForm
              modal
              submitLabel="Add Note"
              onSubmitValue={handleAddNote}
              onSuccess={() => setModalOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
