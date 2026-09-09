# Studio 4 Milestone 12 — Implementation Note

Milestone 12 adds contextual review conversations as collaboration metadata separate from the canonical Website document and its Undo/Redo history.

## Conversation and message model

`createConversationStore()` owns stable Conversation identities, Website/Page/optional Component anchors, one of four approved statuses, actor placeholders, timestamps, and ordered stable Message identities. New conversations default to `open`; replies append chronologically; status supports `open`, `waiting-on-rally`, `waiting-on-client`, and `resolved`, with reopen returning to `open`.

The collaboration store is not included in the document snapshot boundary. Creating, replying, resolving, reopening, filtering, selecting, and navigating conversations creates no Website history entry, while normal document edits continue to use the existing transaction store.

## Anchors and resilience

Component conversations bind to stable Website, Page, and Component Instance IDs. Page conversations omit the Component identity. Selection navigates to an available Page and selects its available Component without creating document history.

Reorder, hide, content, variant, and responsive changes preserve anchors. Deleted Components and Pages leave conversations intact with an `anchor unavailable` state. Undo restoration of the same identities automatically restores navigation. Whole-Website replacement retains prior conversations against the unavailable prior Website instead of reassigning or deleting them.

## Comments mode UX

The Comments lens opens a Conversations sidebar over the Website Workspace. It supports current/all Page and open/resolved/all status filters, Page-level creation, component-level creation from the Context Panel, conversation selection, actor-aware replies, and intentional status changes.

Temporary component pins appear only while Comments mode is open. Selecting a pin selects its conversation; selecting a conversation navigates across Pages and focuses the anchored section when available. Edit, Preview, Library, History, Page Template, and Starter Package surfaces remain independent.

## Validation evidence and limitations

Functional validation passed 47 automated tests covering Milestones 01–11 plus conversation creation, replies, actors, statuses, filters, cross-Page navigation, unavailable anchors, identity restoration, Website replacement, and document-history separation. JavaScript syntax, Framework integrity, HTTP assets, Studio v3 preservation, and live Page-conversation creation passed without runtime errors.

Formal Review Sessions, approvals, tasks, assignments, notifications, Portal access, authentication, persistence, realtime sync, attachments, annotation tools, fuzzy reattachment, and later service-platform systems remain intentionally out of scope.
