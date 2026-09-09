# Studio 4 Milestone 06 — Implementation Note

Milestone 06 replaces the structural one-off snapshot with a shared in-session transaction history for all meaningful Studio document edits.

## Transaction model

Each entry has a stable ID, action label/type, ISO timestamp, `local-system` actor placeholder, affected object identity, and bounded before/after document snapshots. The tracked document contains Website, Page, Design Settings, and Component Instances. Selection, preview device, Edit/Preview mode, and panel state remain transient and never create entries.

History is bounded to 50 entries. A new edit after Undo truncates the incompatible Redo branch. Undo and Redo move the cursor and apply snapshots without generating entries. Restore intentionally moves the cursor to the selected entry’s after-state; it does not create a second history source.

## Grouping

Context and inline fields commit once on change/blur. Design color/range controls commit on change rather than every input event. Variant, responsive, and structural actions each form one transaction.

## UX and validation

The Edit-mode History button opens a newest-first Workspace History drawer with timestamps, affected objects, current-point highlighting, Undo, Redo, and intentional restore. Preview hides the history surface.

Run `node --test studio4/tests/*.test.mjs` for mixed edits, UI-state exclusion, multi-step Undo/Redo, branch invalidation, restore, identity/content restoration, and prior milestone regression coverage.

## Limitations

History is in-memory and snapshot-based. It is not persisted, user-authenticated, client-facing, a named release system, a production rollback mechanism, or an audit log.
