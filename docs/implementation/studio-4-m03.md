# Studio 4 Milestone 03 — Implementation Note

Milestone 03 adds current-page structural editing while preserving the Website, Page, registry, selection, content, and design-setting boundaries established by Milestones 01–02.

## Structural contracts

- `Page.componentInstanceIds` remains the sole rendering and Explorer order.
- Store methods centralize move, insert, duplicate, hide/show, delete, and one-level Undo.
- Each structural command captures a bounded pre-action snapshot. Undo restores page order, instances, content, hidden state, and selection without introducing Version History.
- New and duplicated instances receive unique identities. Duplicate content is deeply cloned.
- Component Definitions provide `defaultContent`; the Add Section chooser discovers definitions from `registry.list()`.
- Hidden instances remain in the Page and Explorer, render with an Edit-mode marker, and are omitted from Preview.

## Run and validation

Run `node index.js` and open `http://localhost:4173/`. Run `node --test studio4/tests/*.test.mjs` for structural state validation. Explorer and canvas arrows exercise the same move command. Add Section is available between canvas sections and in the Explorer. Selected-instance actions provide Duplicate, Hide/Show, and Delete; the toast restores the most recent structural action.

## Intentional limits

Reordering uses bounded arrows rather than drag-and-drop. Undo is one level and in memory. Variants, Library behavior, multi-page management, persistent history, responsive overrides, and all later-roadmap systems remain deferred.
