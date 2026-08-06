# TODO — Add Notes container to Admin Profile

## Steps

- [x] Extend `src/components/book-note-form.tsx` with a Note Type selector (Course / Book / Idea / Plan)
- [x] Update `src/app/admin/profile/page.tsx`:
  - Convert category lists to state so added notes persist in-session
  - Add a new **Notes** container (below Course, above Book) with combined items
  - Add controlled Sheet modals that close after adding a note
  - Route added notes to the matching category list
- [ ] Verify with the dev server (no TypeScript / lint errors)
