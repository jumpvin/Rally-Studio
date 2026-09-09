# Studio 4 Milestone 02 — Implementation Note

## Outcome

The Website Workspace now has a Page-first Explorer, shared Component Instance selection, an instance-aware Context Panel, explicit Edit and Preview modes, and safe structured-content editing. The website canvas remains the dominant surface.

## Interaction and state contracts

- Explorer and canvas actions call the same `selectComponent(instanceId)` store method.
- `workspace.mode` is either `edit` or `preview`; Preview clears selection and does not attach selection or editing handlers.
- Inline edits and Context Panel changes both call `updateComponentContent(instanceId, path, value)`.
- Nested field paths support representative repeatable content while all mutations remain inside the selected instance's structured `content` object.
- Component Definition `editableFields` metadata drives Context Panel controls. Render functions remain presentation-only.

## Run and validate

- Run `node index.js`, then open `http://localhost:4173/`.
- Run `node --test studio4/tests/*.test.mjs` for model, registry, selection, modes, and content updates.
- Use the Explorer and canvas to select Hero, Services, and CTA. Edit fields in the Context Panel or focus and edit marked canvas text. Switch to Preview to verify clean output and disabled editing chrome.

## Limitations and deferred capabilities

Edits remain in memory behind the existing persistence seam. Inline edits commit on blur and Context Panel edits commit on change. Adding, reordering, duplicating, hiding, deleting, variants, undo/history, responsive overrides, multi-page management, comments, deployment, and later roadmap systems remain intentionally deferred.
