# Book Notes Page – Implementation TODO

## Steps

- [x] 1. Update `src/components/book-note-form.tsx`
  - [x] Export `BookNoteInput` type (`title`, `section`, `description`, `image`)
  - [x] Add Description input field
  - [x] Add Image URL input field (optional; fallback to picsum seed image)
  - [x] Add `onSubmitValue?: (note: BookNoteInput) => void` prop
  - [x] Call `onSubmitValue` with structured note on submit

  **Bonus fix:** Added `text-foreground caret-foreground` to `src/components/ui/input.tsx`
  and `text-foreground` to `src/components/ui/select.tsx` so typed/selected text is
  visible inside the Sheet modal (was invisible due to missing text color).

- [x] 2. Update `src/app/book-notes/page.tsx`
  - [x] Extend `BookNote` type with `description`, `image`, `section`
  - [x] Add `description`/`image` to initial sample data
  - [x] Manage notes in `useState` (academic + non-academic)
  - [x] Replace `AddNoteCard`/`/book-notes/new` link with a Sheet modal using `BookNoteForm`
  - [x] Wire `onSubmitValue` to append note to the appropriate section
  - [x] Add auto-scrolling `ItemCarousel` (from profile page pattern) per section
  - [x] Card layout: picture → title → description (vertical)
  - [x] Keep header with Filter/Menu buttons

- [x] 3. Add search bar + responsive carousel improvements
  - [x] Add search bar (Input with Search icon) at the top of the page
  - [x] Filter notes by name (case-insensitive) when searching
  - [x] Show matching cards in a static grid during search
  - [x] Show "no results" message when nothing matches
  - [x] Remove duplicate rendering from carousel (each note rendered exactly once)
  - [x] Responsive card widths: 2 (mobile) / 3 (sm) / 4 (lg) per view
  - [x] Auto-scroll with smooth wrap-back to start (no jump cut)
  - [x] Pause on hover, resume on leave / after touch

- [ ] 4. Verify
  - [ ] Run lint/build to check for errors
  - [ ] Confirm 4 cards visible on large screens
  - [ ] Confirm no duplicate cards anywhere in carousels
  - [ ] Confirm search filters correctly by name
