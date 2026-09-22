"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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

// ── Data Types ────────────────────────────────────────────────────────────────
export type BookNote = {
  id: string;
  title: string;
  description: string;
  image: string;
  section: string; // Dynamic section/category name
  className?: string;
  chapter?: string;
};

const initialNotes: BookNote[] = [
  {
    id: "acad-1",
    title: "Microcontrollers",
    description: "Timers, interrupts and embedded C programming fundamentals.",
    image: "https://picsum.photos/seed/microcontrollers/300/300",
    section: "academic",
    className: "CSE Semester 8",
  },
  {
    id: "acad-2",
    title: "Engineering Ethics",
    description: "Professional responsibility and ethical decision making.",
    image: "https://picsum.photos/seed/engineering-ethics/300/300",
    section: "academic",
    className: "CSE Semester 7",
  },
  {
    id: "acad-3",
    title: "Digital Logic",
    description: "Boolean algebra, combinational and sequential circuits.",
    image: "https://picsum.photos/seed/digital-logic/300/300",
    section: "academic",
    className: "CSE Semester 7",
  },
  {
    id: "non-1",
    title: "Atomic Habits",
    description: "Tiny changes, remarkable results — habit building systems.",
    image: "https://picsum.photos/seed/atomic-habits/300/300",
    section: "non-academic",
    className: "Self Development",
  },
  {
    id: "non-2",
    title: "The Alchemist",
    description: "A journey of following one's personal legend.",
    image: "https://picsum.photos/seed/the-alchemist/300/300",
    section: "non-academic",
    className: "Literature",
  },
];

// ── Note Card ─────────────────────────────────────────────────────────────────
function NoteCard({ item }: { item: BookNote }) {
  return (
    <div className="theme-card overflow-hidden rounded-2xl text-center transition-all hover:-translate-y-0.5">
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
        <h3 className="text-xs font-semibold text-black dark:text-white line-clamp-1">
          {item.title}
        </h3>
        <p className="text-[11px] leading-snug text-gray-500 dark:text-white/40 line-clamp-2">
          {item.description || "No description available."}
        </p>
      </div>
    </div>
  );
}

// ── Auto-scrolling Carousel ───────────────────────────────────────────────────
function ItemCarousel({ items }: { items: BookNote[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const isWrappingRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length === 0) return;

    let rafId: number;
    const speed = 0.5;

    const wrapBack = () => {
      isWrappingRef.current = true;
      el.scrollTo({ left: 0, behavior: "smooth" });
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
    if (maxScroll <= 0) return;

    if (direction === 1 && el.scrollLeft >= maxScroll - 1) {
      isWrappingRef.current = true;
      el.scrollTo({ left: 0, behavior: "smooth" });
      resumeTimeoutRef.current = setTimeout(() => {
        isWrappingRef.current = false;
      }, 600);
      return;
    }

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
      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollByCard(-1)}
        className="theme-button-secondary flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

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

// ── Section Container ─────────────────────────────────────────────────────────
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
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold capitalize text-black dark:text-white">
          {title.replace("-", " ")}
        </h2>
        <span className="text-xs text-gray-500 dark:text-white/40">
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </span>
      </div>

      {notes.length > 0 ? (
        <ItemCarousel items={notes} />
      ) : (
        <div className="theme-card flex h-24 items-center justify-center rounded-2xl text-xs text-gray-400 dark:text-white/30">
          No notes in this category yet.
        </div>
      )}

      <button
        type="button"
        onClick={onAdd}
        className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 dark:border-white/15 text-gray-400 dark:text-white/30 transition-colors hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400"
      >
        <Plus className="h-6 w-6" />
        <span className="text-[11px] font-medium">Add to {title.replace("-", " ")}</span>
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BookNoteListPage() {
  const [notes, setNotes] = useState<BookNote[]>(initialNotes);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>("academic");
  const [searchQuery, setSearchQuery] = useState("");

  // Dynamically derive unique categories/sections from the notes array
  const dynamicSections = useMemo(() => {
    const rawSections = Array.from(new Set(notes.map((n) => n.section.toLowerCase())));
    if (!rawSections.includes("academic")) rawSections.unshift("academic");
    if (!rawSections.includes("non-academic")) rawSections.push("non-academic");
    return rawSections;
  }, [notes]);

  // Dynamically collect options to populate BookNoteForm dropdowns
  const dynamicBookOptions = useMemo(() => {
    return Array.from(new Set(notes.map((n) => n.title).filter(Boolean)));
  }, [notes]);

  const dynamicClassOptions = useMemo(() => {
    return Array.from(
      new Set(notes.map((n) => n.className).filter(Boolean) as string[])
    );
  }, [notes]);

  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;

  const matchingNotes = useMemo(() => {
    if (!isSearching) return [];
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.description.toLowerCase().includes(query) ||
        note.section.toLowerCase().includes(query) ||
        note.className?.toLowerCase().includes(query)
    );
  }, [notes, query, isSearching]);

  // Handle incoming dynamic form submission with binary local file
  const handleAddNote = (note: BookNoteInput) => {
    // If an image file from local device was chosen, create a local preview blob URL
    let finalImageUrl = `https://picsum.photos/seed/book-${Date.now()}/300/300`;
    if (note.imageFile) {
      finalImageUrl = URL.createObjectURL(note.imageFile);
    }

    const newNote: BookNote = {
      id: `note-${Date.now()}`,
      title: note.title,
      description: note.description,
      image: finalImageUrl,
      section: note.section.toLowerCase(),
      className: note.className,
      chapter: note.chapter,
    };

    setNotes((prev) => [newNote, ...prev]);
  };

  const openAddModal = (sectionName?: string) => {
    if (sectionName) setSelectedSection(sectionName);
    setModalOpen(true);
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
            placeholder="Search by book name, chapter, class, or section..."
            className="pl-9"
          />
        </div>

        {/* Dynamic Content: Search vs Grouped Sections */}
        {isSearching ? (
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
          <div className="space-y-8">
            {dynamicSections.map((sec) => (
              <NoteSection
                key={sec}
                title={sec}
                notes={notes.filter((n) => n.section.toLowerCase() === sec)}
                onAdd={() => openAddModal(sec)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Add Note Modal */}
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
              bookOptions={dynamicBookOptions}
              classOptions={dynamicClassOptions}
              initialValues={{ section: selectedSection }}
              onSubmitValue={handleAddNote}
              onSuccess={() => setModalOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}