"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { BookOpen, Filter, Menu, Plus, ChevronLeft, ChevronRight } from "lucide-react";
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

// ── Auto-scrolling Carousel (with manual nav buttons) ────────────────────────
function ItemCarousel({ items }: { items: BookNote[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Repeat the list enough times so the scrollable track is always wider
  // than the container — otherwise short lists (2-3 items) run out of
  // content and leave blank space before the loop resets.
  const REPEAT = Math.max(6, Math.ceil(12 / items.length));
  const loopItems = Array.from({ length: REPEAT }, (_, i) =>
    items.map((item, j) => ({ ...item, _loopKey: `${i}-${j}` }))
  ).flat();

  // Each card is 190px wide + 14px gap → 204px per step
  const step = 204;

  // Auto-scroll loop using requestAnimationFrame
  const scroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    if (pausedRef.current) {
      // Auto-scroll paused — still update smooth-scroll behaviour
      return;
    }

    el.scrollLeft += 0.5;

    const maxScroll = el.scrollWidth - el.clientWidth - step;
    if (el.scrollLeft >= maxScroll) {
      el.scrollLeft = 0; // seamless loop reset
    }

    requestAnimationFrame(scroll);
  }, [step]);

  useEffect(() => {
    const raf = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(raf);
  }, [scroll]);

  // Reset the resume timeout whenever the user manually scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
      resumeTimeoutRef.current = setTimeout(() => {
        pausedRef.current = false;
      }, 1000);
    };
    const el = trackRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => {
      el?.removeEventListener("scroll", handleScroll);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const pause = () => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const scrollByStep = (dir: 1 | -1) => {
    pause();
    trackRef.current?.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="flex items-center gap-3">
      {/* Prev button */}
      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollByStep(-1)}
        className="theme-button-secondary flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Carousel track */}
      <div
        ref={trackRef}
        className="no-scrollbar flex flex-1 gap-3.5 overflow-x-auto scroll-smooth"
        onMouseEnter={pause}
        onTouchStart={pause}
      >
        {loopItems.map((item) => (
          <div
            key={item._loopKey}
            className="theme-card w-[190px] shrink-0 overflow-hidden rounded-2xl text-center transition-all hover:-translate-y-0.5"
          >
            {/* Picture */}
            <div className="relative h-36 w-full overflow-hidden bg-gray-100 dark:bg-white/5">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="190px"
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
        ))}
      </div>

      {/* Next button */}
      <button
        type="button"
        aria-label="Next"
        onClick={() => scrollByStep(1)}
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

        {/* Sections */}
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
