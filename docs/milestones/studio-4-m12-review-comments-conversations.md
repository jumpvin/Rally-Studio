---
milestone-id: studio-4-m12-review-comments-conversations
mode: implementation
status: implemented
baseline: 40e7034c01dcafda23ec1193eb12d2da5e9a7f65
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m12-review-comments-conversations.md
  - package.json
affected-surfaces:
  - Review mode and conversations sidebar
  - Comment anchors and temporary canvas pins
  - Conversation state and replies
  - Conversation navigation across Website Pages
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 12

## Title
Review Comments & Conversations

## Objective
Introduce the first client/staff review layer directly on top of the real Website Workspace by allowing contextual conversations to be created, viewed, navigated, replied to, and resolved without altering canonical Website content or requiring external email threads.

This milestone establishes the Review/Conversation object boundary and the approved sidebar-plus-temporary-pins interaction. It does not yet implement formal Review Sessions, questionnaires, approval records, tasks, authentication, Portal access, or persisted collaboration infrastructure.

## Scope
Implement:
1. A structured Conversation/Comment model independent from canonical Website document content.
2. A Comments/Conversations mode or lens accessible from the Website Workspace.
3. A sidebar that lists conversations for the current Website.
4. Contextual conversation anchors to a Page and, when applicable, a Component Instance.
5. Temporary visible pins on the canvas only while Comments mode is active.
6. Selecting a sidebar conversation navigates to its Page and associated Component Instance/section when available.
7. Selecting a canvas pin opens/selects the corresponding sidebar conversation.
8. Starting a new conversation from the current canvas/component context.
9. Starting a new general Page-level conversation from the sidebar.
10. Replies within a conversation.
11. Conversation states: `open`, `waiting-on-rally`, `waiting-on-client`, `resolved`.
12. Resolve and reopen behavior.
13. Human-readable timestamps and actor placeholder metadata.
14. Basic filters for open/resolved and current-page/all-pages.
15. Functional tests proving navigation, anchoring, replies, state changes, and no mutation of Website document history.

## Conversation Model
A Conversation must have a stable identity and structured metadata sufficient for future collaboration systems.

At minimum:
- `id`;
- `websiteId`;
- `pageId`;
- optional `componentInstanceId`;
- optional anchor metadata sufficient to identify the section/context;
- `status`;
- `createdAt`;
- `createdBy` actor placeholder;
- ordered messages/replies.

Each message/reply must have:
- stable ID;
- author placeholder;
- timestamp;
- body text.

Conversation storage must remain architecturally separate from canonical Website/Page/Component state. Comments are collaboration metadata, not page content.

## Anchor Semantics
### Component-level conversation
When a Component Instance is selected in Comments mode, starting a conversation anchors it to:
- current Website;
- current Page;
- selected Component Instance.

### Page-level conversation
The sidebar must allow a conversation scoped to the current Page without requiring a specific Component Instance.

### Anchor resilience
If a referenced Component Instance is later hidden, reordered, or edited, the conversation remains valid and navigable to that instance.

If the referenced Component Instance is deleted, the Conversation must not be silently deleted. It should remain in the sidebar with a clear `anchor unavailable`/equivalent state while retaining Page context.

Undo/Redo of the component deletion may restore normal anchor navigation automatically because the stable Component Instance identity returns.

Do not attempt fuzzy reattachment to a different component in this milestone.

## Comments Mode UX
The Website remains the visual star.

When Comments mode is enabled:
- show the Conversations sidebar;
- show temporary pins/markers for component-anchored conversations on the active Page;
- do not permanently clutter the normal Edit/Preview canvas;
- selecting a pin selects/opens the conversation;
- selecting a conversation switches to its Page if necessary and scrolls/focuses the associated section when available.

When Comments mode is disabled:
- pins disappear;
- normal editing/preview behavior remains unchanged.

The Comments sidebar may coexist with Edit mode, but adding/replying to comments must not accidentally trigger content edits.

## Starting Conversations
Provide two entry points:
1. **Canvas/component context** — selected Component Instance -> Start conversation.
2. **Sidebar** — New conversation for current Page.

Starting a component-level conversation should require only the initial message. Avoid multi-step dialogs unless necessary.

The newly created conversation becomes selected/open in the sidebar.

## Replies
Users can add ordered text replies to a Conversation.

For this milestone actor identity may use simple placeholders such as:
- `rally-staff`;
- `client`;
- `local-user`.

A compact actor selector/test affordance is acceptable to prove the model. Do not implement authentication or permissions.

## Conversation Status
Supported states:
- `open`;
- `waiting-on-rally`;
- `waiting-on-client`;
- `resolved`.

Rules:
- new conversations default to `open`;
- status may be changed intentionally from the conversation UI;
- Resolve sets `resolved`;
- Reopen returns to `open` unless Builder has a clearer documented rule;
- status changes belong to collaboration history/state, not Website document history.

## Separation from Document History
Creating, replying to, resolving, reopening, or changing conversation status must **not** create entries in the existing Website edit transaction/history system.

Likewise, merely navigating to a conversation/page must not create document history.

This milestone may maintain its own lightweight in-memory collaboration timestamps/state. Do not merge collaboration events into the Website Undo/Redo stack.

## Cross-Page Navigation
Because Studio is now multi-page, conversations belong to the Website and can span Pages.

Requirements:
- sidebar can show all Website conversations;
- selecting a conversation on another Page switches `workspace.activePageId` to that Page without creating document history;
- if the Component anchor exists, Studio focuses/selects/scrolls to it;
- current-page filter limits the list without deleting conversations.

## Delete / Website Replacement Behavior
For this milestone:
- deleting a Page does not silently delete its conversations;
- those conversations remain retained but show the Page/anchor as unavailable;
- Undo restoring the Page should restore navigation if the original Page identity returns;
- replacing the entire Website may mark previous conversations as belonging to an unavailable prior Website rather than silently reassigning them.

Do not build archival workflows yet. The important rule is **never silently move or destroy review context because document objects changed**.

## Explicitly Out of Scope
Do not implement:
- formal Review Session objects;
- guided review questionnaires;
- approval/approve Website records;
- client sign-off;
- task creation from conversations;
- assignments/mentions;
- email/SMS notifications;
- Client Portal;
- authentication/permissions;
- real multi-user sync/websockets;
- database persistence;
- attachments/files in comments;
- screenshot annotation/drawing tools;
- exact text-range anchors;
- fuzzy anchor reattachment;
- deployment/production comments;
- Discovery/Strategy Packet;
- Organizations/Projects/service workflow;
- later roadmap systems.

## Success Criteria
1. Milestones 01–11 remain functional.
2. Conversations are structured objects separate from Website/Page/Component canonical document state.
3. Comments mode opens a sidebar and temporary pins without permanently cluttering normal canvas modes.
4. Component-level conversations anchor to Website/Page/Component Instance identities.
5. Page-level conversations work without a Component anchor.
6. New conversations default to `open` and include initial message, timestamp and actor placeholder.
7. Replies append in stable chronological order.
8. Conversation status can move among the four approved states.
9. Resolved conversations can be reopened.
10. Selecting a sidebar conversation navigates to the correct Page.
11. If its Component Instance exists, selecting the conversation focuses/selects that section.
12. Clicking a canvas pin selects the matching sidebar conversation.
13. Current-page and all-pages filtering works.
14. Open/resolved filtering works.
15. Reorder/hide/content/variant/responsive edits do not break component anchors.
16. Deleting an anchored Component preserves the Conversation with clear unavailable-anchor state.
17. Undo restoring the same Component identity restores normal anchor navigation.
18. Deleting a Page preserves its conversations with unavailable Page/anchor state.
19. Conversation operations do not create Website document-history entries.
20. Page navigation caused by conversation selection does not create document-history entries.
21. Existing Website Undo/Redo does not undo conversation messages/status changes.
22. Automated tests cover creation, replies, status, navigation, filtering, unavailable anchors, restoration and history separation.
23. No formal Review Session/Approval/Portal/persistence/later system is partially implemented.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- create a component-level conversation on Home;
- create a Page-level conversation on another Page;
- reply as multiple actor placeholders;
- move among waiting/open/resolved states;
- reopen resolved conversation;
- switch between current-page/all-pages filters;
- select a conversation on another Page and verify automatic navigation;
- click a canvas pin and verify sidebar selection;
- reorder/hide/edit the anchored Component and verify the anchor survives;
- delete the anchored Component and verify unavailable-anchor behavior;
- Undo deletion and verify anchor navigation restores;
- delete a Page with conversations and verify they remain retained/unavailable;
- verify comment/reply/status operations add zero Website document-history entries;
- verify normal content edits still create Website document-history entries;
- Preview/Edit/Library/history/Starter Package behavior remains intact;
- no new runtime errors;
- Studio v3 remains preserved.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 12 implementation note;
3. Conversation/Message model documentation;
4. anchor and unavailable-anchor semantics;
5. Comments mode/sidebar/pin behavior;
6. collaboration-vs-document-history separation documentation;
7. functional tests/validation results;
8. known limitations;
9. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is contextual Website review conversations, sidebar navigation and temporary canvas pins. Formal Review Sessions, approvals, tasks, Portal, persistence and multi-user infrastructure require later Architecture authorization.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 12 — Review Comments & Conversations** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Add structured Website review conversations independent of canonical document state, implement the sidebar-plus-temporary-pins Comments mode, cross-page/context navigation, replies and approved conversation states, preserve review context when document anchors disappear, keep collaboration operations out of Website Undo/Redo history, preserve Milestones 01–11, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.

## Implementation Evidence

- Status: `implemented`; Architecture acceptance is not claimed.
- Functional suite: 47/47 automated tests passed.
- Framework integrity: passed with no failures.
- Live scenario: Comments sidebar opened and created a selected Page conversation with actor, timestamp, status, reply UI, and no runtime errors.
- Implementation note: `docs/implementation/studio-4-m12.md`.
- Release note: Added separate structured review conversations, resilient Page/Component anchors, cross-Page navigation, temporary canvas pins, replies, statuses, filters, and strict Website-history separation.
