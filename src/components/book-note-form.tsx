// src/components/book-note-form.tsx
"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Menu } from "lucide-react";

/** Structured note data emitted by the form. */
export type BookNoteInput = {
  title: string;
  /** "academic" or "non-academic" */
  section: "academic" | "non-academic";
  description: string;
  image: string;
  /** Note category – only present when a Note Type selector is rendered */
  noteType?: string;
};

type NoteTypeOption = { value: string; label: string };

type Props = {
  /** Optional data arrays – defaults to the current hard‑coded lists */
  bookOptions?: string[];
  classOptions?: string[];
  /** Callback after successful submit */
  onSuccess?: () => void;
  /** Emits the structured note right before onSuccess is called */
  onSubmitValue?: (note: BookNoteInput) => void;
  /** Optional custom submit label */
  submitLabel?: string;
  /** When true, renders as a bare form (no page shell/header) for use inside modals */
  modal?: boolean;
  /** When provided, renders a "Note Type" selector above the other fields */
  noteTypeOptions?: NoteTypeOption[];
  /** Category used when no Note Type selector is rendered (e.g. per-container modals) */
  defaultNoteType?: string;
};

export default function BookNoteForm({
  bookOptions = [
    "Microcontrollers",
    "Engineering Ethics",
    "Digital Logic",
    "Atomic Habits",
    "The Alchemist",
  ],
  classOptions = ["CSE Semester 8", "CSE Semester 7", "Non Academic"],
  onSuccess,
  onSubmitValue,
  submitLabel = "OK",
  modal = false,
  noteTypeOptions,
  defaultNoteType,
}: Props) {
  const router = useRouter();

  const [bookName, setBookName] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState<BookNoteInput["section"]>("academic");
  const [chapter, setChapter] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [noteType, setNoteType] = useState(
    noteTypeOptions?.[0]?.value ?? defaultNoteType ?? "",
  );

  // Force visible text color on all form fields after mount
  // (bypasses any CSS/Tailwind specificity issues inside modals)
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formRef.current) return;
    const isDark = document.documentElement.classList.contains("dark");
    const textColor = isDark ? "#f8fafc" : "#0f172a";
    formRef.current
      .querySelectorAll("input, textarea, select")
      .forEach((el: Element) => {
        const field = el as HTMLElement;
        field.style.color = textColor;
        field.style.setProperty("caret-color", textColor, "important");
        field.style.setProperty(
          "-webkit-text-fill-color",
          textColor,
          "important",
        );
      });
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Auto-generate a stable placeholder image when none is provided
    const image =
      imageUrl.trim() ||
      `https://picsum.photos/seed/book-${
        bookName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "note"
      }/300/300`;

    const note: BookNoteInput = {
      title: bookName,
      section,
      description: description.trim(),
      image,
      ...(noteTypeOptions
        ? { noteType: noteType || noteTypeOptions[0]?.value }
        : defaultNoteType
          ? { noteType: defaultNoteType }
          : {}),
    };

    // TODO: replace with real API call when ready
    console.log({ ...note, className, chapter });

    if (onSubmitValue) onSubmitValue(note);
    if (onSuccess) onSuccess();
    else router.push("/book-notes");
  }

  return (
    <div className={modal ? "" : "max-w-xl pb-16"}>
      {/* Header – only shown on standalone page, hidden in modal mode */}
      {!modal && (
        <div className="flex items-center justify-between ">
          <h1 className="text-xl font-semibold text-black dark:text-white">
            Make a BookNote
          </h1>
          <button
            type="button"
            aria-label="Navigation"
            className="theme-button-secondary flex h-9 w-9 items-center justify-center rounded-full"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={modal ? "space-y-5 p-10" : "theme-card space-y-5 p-6"}
      >
        {/* Note Type selector – only shown when the parent provides options */}
        {noteTypeOptions && noteTypeOptions.length > 0 && (
          <div className="space-y-1.5">
            <label className="theme-label">Note Type</label>
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {noteTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Book selector */}
        <div className="space-y-1.5">
          <label className="theme-label">Book Name</label>
          <Select value={bookName} onValueChange={setBookName}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a book" />
            </SelectTrigger>
            <SelectContent>
              {bookOptions.map((book) => (
                <SelectItem key={book} value={book}>
                  {book}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Class selector */}
        <div className="space-y-1.5">
          <label className="theme-label">Class</label>
          <Select
            value={className}
            onValueChange={(value) => {
              setClassName(value);
              // Auto-sync section when a class implies it, user can override
              if (value.toLowerCase().includes("non academic")) {
                setSection("non-academic");
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Section selector – choose Academic or Non-Academic */}
        <div className="space-y-1.5">
          <label className="theme-label">Academic / Non Academic</label>
          <Select
            value={section}
            onValueChange={(value) =>
              setSection(value as BookNoteInput["section"])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="non-academic">Non Academic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chapter input */}
        <div className="space-y-1.5">
          <label className="theme-label">Chapter</label>
          <Input
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="e.g. Chapter 3 — Timers & Counters "
          />
        </div>

        {/* Description input */}
        <div className="space-y-1.5">
          <label className="theme-label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short summary of this note…"
            rows={3}
            style={{
              color: "var(--form-text)",
              caretColor: "var(--form-text)",
              WebkitTextFillColor: "var(--form-text)",
            }}
            className="w-full resize-none rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2.5 text-sm placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        {/* Image URL input (optional) */}
        <div className="space-y-1.5">
          <label className="theme-label">Image URL (optional)</label>
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://… (blank = auto placeholder image)"
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className="theme-button-primary px-10 py-2.5 text-sm font-medium transition-all"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
