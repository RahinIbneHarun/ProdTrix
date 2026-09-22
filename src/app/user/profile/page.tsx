"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Plus,
  BookOpen,
  Lightbulb,
  GraduationCap,
  Camera,
  Pencil,
  ChevronLeft,
  ChevronRight,
  StickyNote,
  Loader2,
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

// ── Types ─────────────────────────────────────────────────────────────────────
type CarouselItem = { name: string; image: string };

type ProfileData = {
  name: string;
  field: string;
  email: string;
  status: string;
  bio: string;
  coverPhoto: string;
  avatarPhoto: string;
  courseItems: CarouselItem[];
  bookItems: CarouselItem[];
  ideaItems: CarouselItem[];
};

const NOTE_TYPE_OPTIONS = [
  { value: "course", label: "Course" },
  { value: "book", label: "Book" },
  { value: "idea", label: "Idea / Plan" },
];

const TABS = [
  { id: "basic-info", label: "Basic Info" },
  { id: "templates", label: "Templates +" },
  { id: "design", label: "Design +" },
  { id: "saved", label: "Saved" },
];

// ── Auto-scrolling Carousel ───────────────────────────────────────────────────
function ItemCarousel({
  items,
  accentColor,
}: {
  items: CarouselItem[];
  accentColor: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const isWrappingRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length === 0) return;

    let rafId: number;
    const speed = 0.4;

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
        if (maxScroll <= 0) {
          // fits container
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
  }, [items.length]);

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
    const cardWidth = firstCard ? firstCard.offsetWidth + 12 : 200;
    el.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  if (items.length === 0) {
    return (
      <div className="px-9 py-6 text-center text-xs text-black dark:text-white/20">
        Nothing here yet.
      </div>
    );
  }

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Scroll left"
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border border-gray-300 dark:border-white/10 bg-white/90 dark:bg-black/50 backdrop-blur-sm shadow-md shadow-gray-400/50 dark:shadow-none flex items-center justify-center hover:bg-white dark:hover:bg-black/70 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-white/70" />
      </button>

      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto no-scrollbar w-full px-9"
      >
        {items.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="shrink-0 w-1/2 lg:w-1/4 h-[100px] border border-gray-300 dark:border-white/10 rounded-xl flex items-stretch overflow-hidden hover:border-gray-400 dark:hover:border-white/20 transition-colors bg-white dark:bg-white/5 shadow-xl shadow-gray-400/50 dark:shadow-none"
          >
            <div className="relative w-[100px] h-[100px] shrink-0 self-center">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="100px"
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center gap-2 p-3 min-w-0">
              <span
                className={`font-medium text-sm leading-snug ${accentColor} truncate`}
              >
                {item.name}
              </span>
              <span className="text-[10px] text-black dark:text-white/20 uppercase tracking-widest">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Scroll right"
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border border-gray-300 dark:border-white/10 bg-white/90 dark:bg-black/50 backdrop-blur-sm shadow-md shadow-gray-400/50 dark:shadow-none flex items-center justify-center hover:bg-white dark:hover:bg-black/70 transition-colors"
      >
        <ChevronRight className="h-4 w-4 text-gray-600 dark:text-white/70" />
      </button>
    </div>
  );
}

// ── Inner Data Card ───────────────────────────────────────────────────────────
function InnerDataCard({
  label,
  value,
  green = false,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 shadow-xl shadow-gray-400/50 dark:shadow-none px-5 py-4 space-y-1">
      <p className="theme-label">{label}</p>
      <p
        className={`font-medium text-sm mt-1 ${
          green
            ? "text-emerald-500 dark:text-emerald-400"
            : "text-black dark:text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

// ── Tab Content ──────────────────────────────────────────────────────────────
function TabContent({
  activeTab,
  profile,
}: {
  activeTab: string;
  profile: ProfileData;
}) {
  return (
    <div className="mt-4 theme-card p-5 shadow-[0_24px_70px_rgba(15,23,42,0.28)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_20px_80px_rgba(0,0,0,0.35)]">
      {activeTab === "basic-info" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InnerDataCard label="Name" value={profile.name} />
          <InnerDataCard label="Field" value={profile.field} />
          <InnerDataCard label="Email" value={profile.email} />
          <InnerDataCard label="Status" value={profile.status} green />
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 shadow-xl shadow-gray-400/50 dark:shadow-none px-6 py-10 text-center text-black dark:text-white/25 text-sm">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content
          coming soon.
        </div>
      )}
    </div>
  );
}

// ── Edit Profile Form ─────────────────────────────────────────────────────────
function EditProfileForm({
  profile,
  saving,
  onSubmit,
}: {
  profile: ProfileData;
  saving: boolean;
  onSubmit: (patch: Partial<ProfileData>) => void;
}) {
  const [name, setName] = useState(profile.name);
  const [field, setField] = useState(profile.field);
  const [email, setEmail] = useState(profile.email);
  const [status, setStatus] = useState(profile.status);
  const [bio, setBio] = useState(profile.bio);

  return (
    <form
      className="px-10 pb-8 pt-4 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, field, email, status, bio });
      }}
    >
      <div className="space-y-1">
        <label className="theme-label">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-black dark:text-white"
        />
      </div>
      <div className="space-y-1">
        <label className="theme-label">Field</label>
        <input
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-black dark:text-white"
        />
      </div>
      <div className="space-y-1">
        <label className="theme-label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-black dark:text-white"
        />
      </div>
      <div className="space-y-1">
        <label className="theme-label">Status</label>
        <input
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-black dark:text-white"
        />
      </div>
      <div className="space-y-1">
        <label className="theme-label">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm text-black dark:text-white resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="theme-button-secondary w-full flex items-center justify-center gap-2 py-3 text-sm disabled:opacity-60"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

// ── Content Column ────────────────────────────────────────────────────────────
function ContentColumn({
  title,
  icon,
  items,
  accentColor,
  className = "",
  open,
  onOpenChange,
  onSubmitNote,
  noteTypeOptions,
  defaultNoteType,
  submitLabel = "OK",
}: {
  title: string;
  icon: React.ReactNode;
  items: CarouselItem[];
  accentColor: string;
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitNote: (note: BookNoteInput) => void;
  noteTypeOptions?: { value: string; label: string }[];
  defaultNoteType?: string;
  submitLabel?: string;
}) {
  return (
    <div className={`theme-card p-5 flex flex-col gap-3 h-full ${className}`}>
      <div className="flex items-center gap-2 pb-3 border-b border-gray-200 dark:border-white/10">
        {icon}
        <h3 className="font-semibold text-black dark:text-white text-sm">
          {title}
        </h3>
      </div>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="theme-button-secondary flex items-center justify-center gap-2 w-full py-3 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add {title}</span>
          </button>
        </SheetTrigger>
        <SheetContent side="center">
          <SheetHeader className="px-10">
            <SheetTitle>Add a new note</SheetTitle>
            <SheetDescription>Create a new BookNote entry.</SheetDescription>
          </SheetHeader>
          <BookNoteForm
            modal={true}
            submitLabel={submitLabel}
            noteTypeOptions={noteTypeOptions}
            defaultNoteType={defaultNoteType}
            onSubmitValue={onSubmitNote}
            onSuccess={() => onOpenChange(false)}
          />
        </SheetContent>
      </Sheet>

      <ItemCarousel items={items} accentColor={accentColor} />
    </div>
  );
}

// ── Main Page Component (Default Export) ──────────────────────────────────────
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("basic-info");

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [ideaModalOpen, setIdeaModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // ── Fetch Profile on Mount ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        const data: ProfileData = await res.json();
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) setLoadError("Couldn't load profile data.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Add Note (via FormData with Local Preview Fallback) ──
  const addNote = async (note: BookNoteInput) => {
    const type = (note.noteType ?? "course").toLowerCase();
    const title = note.title || note.chapter || `Untitled ${type}`;

    // Instant local image preview fallback
    const previewUrl = note.imageFile
      ? URL.createObjectURL(note.imageFile)
      : `https://picsum.photos/seed/${encodeURIComponent(title)}/300/300`;

    const newItem: CarouselItem = { name: title, image: previewUrl };

    // Optimistically update UI
    setProfile((prev) => {
      if (!prev) return prev;
      if (type.includes("book")) {
        return { ...prev, bookItems: [newItem, ...prev.bookItems] };
      }
      if (type.includes("idea")) {
        return { ...prev, ideaItems: [newItem, ...prev.ideaItems] };
      }
      return { ...prev, courseItems: [newItem, ...prev.courseItems] };
    });

    try {
      const formData = new FormData();
      formData.append("noteType", type);
      formData.append("name", title);

      if (note.imageFile) {
        formData.append("image", note.imageFile);
      }

      const res = await fetch("/api/profile/notes", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data: ProfileData = await res.json();
        setProfile(data);
        setLoadError(null);
      }
    } catch (err: any) {
      console.warn("Backend sync failed, note remains active locally:", err);
    }
  };

  // ── Save Basic Info ──
  const saveProfile = async (patch: Partial<ProfileData>) => {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      const data: ProfileData = await res.json();
      setProfile(data);
      setEditModalOpen(false);
      setLoadError(null);
    } catch (err) {
      setLoadError("Couldn't save your changes — try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Upload Cover / Avatar ──
  const handlePhotoSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "coverPhoto" | "avatarPhoto"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploading =
      field === "coverPhoto" ? setUploadingCover : setUploadingAvatar;
    setUploading(true);

    // Instant local UI preview
    const previewUrl = URL.createObjectURL(file);
    setProfile((prev) => (prev ? { ...prev, [field]: previewUrl } : prev));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("field", field);

      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {
        const data: ProfileData = await res.json();
        setProfile(data);
        setLoadError(null);
      }
    } catch (err) {
      console.warn("Server photo update failed, using local preview:", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // ── Loading / Error States ──
  if (loadError && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-black dark:text-white/50">
        {loadError}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-2 text-sm text-black dark:text-white/50">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading profile...
      </div>
    );
  }

  const allNotes: CarouselItem[] = [
    ...profile.courseItems,
    ...profile.bookItems,
    ...profile.ideaItems,
  ];

  const contentColumnProps = {
    onSubmitNote: addNote,
    className: "w-full",
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {loadError && (
          <div className="rounded-lg border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-2 text-xs text-red-600 dark:text-red-400">
            {loadError}
          </div>
        )}

        {/* ── Profile Card ── */}
        <div className="theme-card overflow-hidden shadow-[0_24px_70px_rgba(15,23,42,0.28)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_20px_80px_rgba(0,0,0,0.35)]">
          {/* Cover Photo */}
          <div className="h-48 relative flex items-center justify-center border-b border-gray-200 dark:border-white/10 overflow-hidden">
            <Image
              src={profile.coverPhoto}
              alt="Cover photo"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/10 pointer-events-none" />
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhotoSelect(e, "coverPhoto")}
            />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="absolute bottom-3 right-4 theme-button-secondary flex items-center gap-2 px-3 py-1.5 text-xs bg-white/90 dark:bg-black/40 backdrop-blur-sm z-10 disabled:opacity-60"
            >
              {uploadingCover ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Camera className="h-3.5 w-3.5" />
              )}
              {uploadingCover ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* Avatar + Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-10">
              {/* Avatar */}
              <div className="relative w-20 h-20 rounded-full border-4 border-white dark:border-[#040404] overflow-hidden shrink-0 z-10 group">
                <Image
                  src={profile.avatarPhoto}
                  alt="Profile avatar"
                  fill
                  className="object-cover"
                />
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoSelect(e, "avatarPhoto")}
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-60"
                  aria-label="Change avatar"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  ) : (
                    <Camera className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>

              {/* Name + Bio */}
              <div className="flex-1 text-center sm:text-left space-y-1 pb-1">
                <h1 className="text-lg font-semibold text-black dark:text-white">
                  {profile.name}
                </h1>
                <p className="text-xs text-black dark:text-white/40">
                  {profile.field} · On Demand ·{" "}
                  <span className="text-emerald-500 dark:text-emerald-400">
                    {profile.status}
                  </span>
                </p>
                {profile.bio && (
                  <p className="text-xs text-black dark:text-white/30 italic border-l-2 border-gray-200 dark:border-white/10 pl-3 mt-1">
                    "{profile.bio}"
                  </p>
                )}
              </div>

              {/* Edit Button */}
              <Sheet open={editModalOpen} onOpenChange={setEditModalOpen}>
                <SheetTrigger asChild>
                  <button className="theme-button-secondary flex items-center gap-2 px-4 py-2 text-sm self-center sm:self-auto">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit Profile
                  </button>
                </SheetTrigger>
                <SheetContent side="center">
                  <SheetHeader className="px-10">
                    <SheetTitle>Edit Profile</SheetTitle>
                    <SheetDescription>Update your basic info.</SheetDescription>
                  </SheetHeader>
                  <EditProfileForm
                    profile={profile}
                    saving={savingProfile}
                    onSubmit={saveProfile}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* ── Content Grid ── */}
        <div className="flex flex-col gap-4">
          <ContentColumn
            {...contentColumnProps}
            title="Course"
            icon={
              <GraduationCap className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            }
            items={profile.courseItems}
            accentColor="text-blue-500 dark:text-blue-400"
            open={courseModalOpen}
            onOpenChange={setCourseModalOpen}
            defaultNoteType="course"
            submitLabel="Add Course"
          />

          <ContentColumn
            {...contentColumnProps}
            title="Notes"
            icon={
              <StickyNote className="h-4 w-4 text-violet-500 dark:text-violet-400" />
            }
            items={allNotes}
            accentColor="text-violet-500 dark:text-violet-400"
            open={notesModalOpen}
            onOpenChange={setNotesModalOpen}
            noteTypeOptions={NOTE_TYPE_OPTIONS}
            submitLabel="Add Note"
          />

          <ContentColumn
            {...contentColumnProps}
            title="Book"
            icon={
              <BookOpen className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            }
            items={profile.bookItems}
            accentColor="text-emerald-500 dark:text-emerald-400"
            open={bookModalOpen}
            onOpenChange={setBookModalOpen}
            defaultNoteType="book"
            submitLabel="Add Book"
          />

          <ContentColumn
            {...contentColumnProps}
            title="Idea / Plan"
            icon={
              <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400" />
            }
            items={profile.ideaItems}
            accentColor="text-amber-500 dark:text-amber-400"
            open={ideaModalOpen}
            onOpenChange={setIdeaModalOpen}
            defaultNoteType="idea"
            submitLabel="Add Idea"
          />
        </div>

        {/* ── Tabs ── */}
        <div className="theme-card p-2 flex flex-wrap gap-2 shadow-[0_24px_70px_rgba(15,23,42,0.28)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_20px_80px_rgba(0,0,0,0.35)]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-black dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <TabContent activeTab={activeTab} profile={profile} />
      </div>
    </div>
  );
}