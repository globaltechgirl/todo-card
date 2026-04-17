# Todo Card — Stage 1a

> HNG14 Frontend Wizards · @globaltechgirl

---

## What Changed from Stage 0

Stage 0 was a static display card with a checkbox, a hardcoded status badge, basic time remaining, and non-functional Edit/Delete buttons.

Stage 1a transforms it into a fully interactive, stateful component:

- **Edit mode** — clicking Edit opens an inline form pre-filled with the current task values. Save commits changes to the card; Cancel restores the previous state exactly using `structuredClone` for deep backup.
- **Due date is now editable** — the date input is pre-populated on open and saved back into state and the time logic on close.
- **Status is now a live dropdown** (`test-todo-status-control`) replacing the static badge, with three states: Pending, In Progress, Done.
- **Checkbox, dropdown status, and status display are fully synchronized** — toggling either one updates the other. Unchecking after Done reverts to Pending.
- **Priority indicator** (`test-todo-priority-indicator`) added as a colored dot that updates visually and the priority badge text updates when priority is changed in edit mode.
- **Expand/collapse** — the description section is collapsible via an accessible toggle button. The expand toggle is conditionally hidden when description length ≤ 120 characters to avoid unnecessary UI controls.
- **Overdue indicator** (`test-todo-overdue-indicator`) appears with red styling when the due date has passed.
- **Time logic is granular** — shows days, hours, or minutes for both upcoming and overdue states, updates every 30-60 seconds, and stops when status is Done (interval is cleared and "Completed" is shown).
- **State management** moved from ad-hoc DOM reads to a single `state` object that is the source of truth for all UI updates.

---

## New Design Decisions

**Floating badge row** — the priority, status, and expand controls sit in an absolutely positioned row that bridges the top section and the card body, giving the layout a layered feel without extra visual weight.

**Status dropdown styled per value** — the select element receives a class (`status-pending`, `status-in-progress`, `status-done`) on every change so each state has a distinct color, matching the priority badge pattern.

**Edit form as a sibling panel** — the form sits alongside the main card inside the article element rather than overlaying it, keeping the layout predictable and avoiding z-index complexity.

**`structuredClone` for state backup** — chosen over `JSON.parse(JSON.stringify())` for cleaner, more explicit deep cloning. The backup is taken at the moment Edit is clicked and fully restored on Cancel, including priority, status, and due date.

**Interval stored in `timer`** — the `setInterval` reference is kept so it can be cleared the moment status becomes Done, preventing unnecessary background ticks and protecting the "Completed" display from being overwritten.

---

## Known Limitations

- **Focus trap not implemented** — the spec lists focus trapping inside the edit form as an optional bonus. Tab can currently leave the form. A full implementation would require intercepting Tab/Shift-Tab on the first and last focusable elements.
- **Due date timezone** — `datetime-local` inputs work in the user's local timezone. The initial due date is stored as UTC (`2026-04-16T18:00:00Z`). On save, the new date is parsed as local time, so users in different timezones may see a slight offset on the displayed date.
- **Delete is not implemented** — the delete button exists with the correct testid but has no removal logic, consistent with Stage 0.
- **No persistence** — state resets on page reload. No localStorage or backend integration.
- **Expand toggle hidden on short descriptions** — if the description is ≤ 120 characters the toggle button is hidden via `display: none`. This means `test-todo-expand-toggle` is present in the DOM but not visible, which is intentional.

---

## Accessibility Notes

- All edit form fields use `<label for="...">` paired with matching `id` attributes.
- The status dropdown has `aria-label="Task status"` for screen reader identification.
- The expand toggle uses `aria-expanded` (toggled on click) and `aria-controls="todo-collapsible"` pointing to the matching `id` on the collapsible section.
- Live time updates use `aria-live="polite"` so screen readers announce changes without interrupting the user.
- The edit form uses `aria-hidden="true"` when closed and has the attribute removed when open, ensuring screen readers only access it when it is visible.
- Focus is sent to the title input when edit mode opens, and returned to the Edit button when the form closes (Save or Cancel).
- The checkbox uses `aria-label="Mark task as complete"` with a visually hidden `<label>` as a redundant label for maximum compatibility.
- Keyboard tab order follows the spec: checkbox → status control → expand toggle → Edit → Delete → Save/Cancel (in edit mode).
- All interactive elements use `button:focus-visible` and `input:focus-visible` outlines for keyboard navigation visibility.