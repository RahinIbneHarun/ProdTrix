"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// ── Data ──────────────────────────────────────────────────────────────────────
const bookOptions = [
  "Microcontrollers",
  "Engineering Ethics",
  "Digital Logic",
  "Atomic Habits",
  "The Alchemist",
];

const classOptions = ["CSE Semester 8", "CSE Semester 7", "Non Academic"];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MakeBookNotePage() {
  const router = useRouter();
  const [bookName, setBookName] = useState("");
  const [className, setClassName] = useState("");
  const [chapter, setChapter] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // TODO: wire this up to the API once the book-note endpoint is ready
    console.log({ bookName, className, chapter });

    router.push("/book-notes");
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="theme-card space-y-5 p-6">
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

          <div className="space-y-1.5">
            <label className="theme-label">Class</label>
            <Select value={className} onValueChange={setClassName}>
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

          <div className="space-y-1.5">
            <label className="theme-label">Chapter</label>
            <Input
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              placeholder="e.g. Chapter 3 — Timers & Counters"
            />
          </div>

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="theme-button-primary px-10 py-2.5 text-sm font-medium transition-all"
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
