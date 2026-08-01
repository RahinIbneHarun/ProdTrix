# Book Notes Page – Implementation TODO

## Steps

- [x] 1. Update `src/components/book-note-form.tsx`
  - [x] Export `BookNoteInput` type (`title`, `section`, `description`, `image`)
  - [x] Add Description input field
  - [x] Add Image URL input field (optional; fallback to picsum seed image)
  - [x] Add `onSubmitValue?: (note: BookNoteInput) => void` prop
  - [x] Call `onSubmitValue` with structured note on submit

- [x] 2. Update `src/app/book-notes/page.tsx`
  - [x] Extend `BookNote` type with `description`, `image`, `section`
  - [x] Add `description`/`image` to initial sample data
  - [x] Manage notes in `useState` (academic + non-academic)
  - [x] Replace `AddNoteCard`/`/book-notes/new` link with a Sheet modal using `BookNoteForm`
  - [x] Wire `onSubmitValue` to append note to the appropriate section
  - [x] Add auto-scrolling `ItemCarousel` (from profile page pattern) per section
  - [x] Card layout: picture → title → description (vertical)
  - [x] Keep header with Filter/Menu buttons

- [x] 3. Verify
  - [x] Reviewed `src/components/ui/sheet.tsx` – all Sheet imports (`Side="center"`) confirmed available
  - [ ] Run lint/build to check for errors (user declined `npx tsc --noEmit`)
