"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Menu, Upload, X, Plus } from "lucide-react";

export type BookNoteInput = {
  title: string;
  section: string;
  description: string;
  className: string;
  chapter: string;
  imageFile: File | null;
  noteType?: string;
};

type OptionItem = { value: string; label: string };

type Props = {
  bookOptions?: string[];
  classOptions?: string[];
  sectionOptions?: OptionItem[];
  noteTypeOptions?: OptionItem[];
  defaultNoteType?: string;
  initialValues?: Partial<BookNoteInput>;
  onSuccess?: () => void;
  onSubmitValue?: (note: BookNoteInput) => void;
  submitLabel?: string;
  modal?: boolean;
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
  sectionOptions = [
    { value: "academic", label: "Academic" },
    { value: "non-academic", label: "Non Academic" },
  ],
  noteTypeOptions,
  defaultNoteType,
  initialValues,
  onSuccess,
  onSubmitValue,
  submitLabel = "OK",
  modal = false,
}: Props) {
  const router = useRouter();

  // Dynamic Options Lists (can grow when user adds new ones)
  const [availableBooks, setAvailableBooks] = useState<string[]>(bookOptions);
  const [availableClasses, setAvailableClasses] =
    useState<string[]>(classOptions);

  // Form State
  const [bookName, setBookName] = useState(initialValues?.title ?? "");
  const [className, setClassName] = useState(initialValues?.className ?? "");
  const [section, setSection] = useState(
    initialValues?.section ?? sectionOptions[0]?.value ?? "academic",
  );
  const [chapter, setChapter] = useState(initialValues?.chapter ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [noteType, setNoteType] = useState(
    initialValues?.noteType ??
      noteTypeOptions?.[0]?.value ??
      defaultNoteType ??
      "",
  );

  // Custom "Add New" input toggles
  const [isCustomBook, setIsCustomBook] = useState(false);
  const [isCustomClass, setIsCustomClass] = useState(false);
  const [customBookName, setCustomBookName] = useState("");
  const [customClassName, setCustomClassName] = useState("");

  // File upload states
  const [imageFile, setImageFile] = useState<File | null>(
    initialValues?.imageFile ?? null,
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (initialValues?.imageFile) {
      setImagePreview(URL.createObjectURL(initialValues.imageFile));
    }
  }, [initialValues]);

  // Sync color variables
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
  }, [isCustomBook, isCustomClass]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const finalBookName = isCustomBook ? customBookName.trim() : bookName;
    const finalClassName = isCustomClass ? customClassName.trim() : className;

    const note: BookNoteInput = {
      title: finalBookName || chapter || "Untitled Note",
      section,
      description: description.trim(),
      className: finalClassName,
      chapter: chapter.trim(),
      imageFile,
      ...(noteTypeOptions
        ? { noteType: noteType || noteTypeOptions[0]?.value }
        : defaultNoteType
          ? { noteType: defaultNoteType }
          : {}),
    };

    if (onSubmitValue) onSubmitValue(note);
    if (onSuccess) onSuccess();
    else router.push("/book-notes");
  }

  return (
    <div className={modal ? "" : "max-w-xl pb-16"}>
      {!modal && (
        <div className="flex items-center justify-between mb-4">
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

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={modal ? "space-y-4 p-6 sm:p-8" : "theme-card space-y-4 p-6"}
      >
        {/* Note Type (Dynamic) */}
        {noteTypeOptions && noteTypeOptions.length > 0 && (
          <div className="space-y-1.5">
            <label className="theme-label">Note Type</label>
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {noteTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Book Selector (Select or Custom Input) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="theme-label">Book Name</label>
            <button
              type="button"
              onClick={() => {
                setIsCustomBook(!isCustomBook);
                setBookName("");
                setCustomBookName("");
              }}
              className="text-[11px] text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              {isCustomBook ? "Choose existing" : "+ Add new book"}
            </button>
          </div>

          {isCustomBook ? (
            <Input
              value={customBookName}
              onChange={(e) => setCustomBookName(e.target.value)}
              placeholder="Enter new book name"
              required
            />
          ) : (
            <Select value={bookName} onValueChange={setBookName}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
              <SelectContent>
                {availableBooks.map((book) => (
                  <SelectItem key={book} value={book}>
                    {book}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Class Selector (Select or Custom Input) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="theme-label">Class</label>
            <button
              type="button"
              onClick={() => {
                setIsCustomClass(!isCustomClass);
                setClassName("");
                setCustomClassName("");
              }}
              className="text-[11px] text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              {isCustomClass ? "Choose existing" : "+ Add new class"}
            </button>
          </div>

          {isCustomClass ? (
            <Input
              value={customClassName}
              onChange={(e) => setCustomClassName(e.target.value)}
              placeholder="Enter new class or tag"
            />
          ) : (
            <Select
              value={className}
              onValueChange={(val) => {
                setClassName(val);
                if (val.toLowerCase().includes("non academic")) {
                  setSection("non-academic");
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {availableClasses.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Section Selector */}
        <div className="space-y-1.5">
          <label className="theme-label">Category</label>
          <Select value={section} onValueChange={setSection}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {sectionOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Chapter input */}
        <div className="space-y-1.5">
          <label className="theme-label">Chapter / Topic</label>
          <Input
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="e.g. Chapter 3 — Timers & Counters"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="theme-label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short summary of this note…"
            rows={3}
            className="w-full resize-none rounded-xl border border-gray-300 dark:border-white/15 bg-white dark:bg-white/5 px-3 py-2.5 text-sm placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        {/* Dynamic Image Upload from Local Computer */}
        <div className="space-y-1.5">
          <label className="theme-label">Upload Image (Local File)</label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {!imagePreview ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 dark:border-white/15 hover:border-gray-400 dark:hover:border-white/30 rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-gray-50/50 dark:bg-white/5 transition-colors"
            >
              <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-white/70">
                <Upload className="h-4 w-4" />
              </div>
              <div className="text-center">
                <p className="font-medium text-xs text-black dark:text-white">
                  Choose image from device
                </p>
                <p className="text-[10px] text-gray-500 dark:text-white/40 mt-0.5">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            </button>
          ) : (
            <div className="relative rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-2 flex items-center gap-3">
              <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-white/10">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs text-black dark:text-white truncate">
                  {imageFile?.name ?? "Selected Image"}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-white/40">
                  {imageFile ? (imageFile.size / 1024).toFixed(1) + " KB" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 hover:text-red-500 transition-colors mr-1"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
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
