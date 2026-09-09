# Studio 4 Milestone 14 — Implementation Note

Milestone 14 adds an explicit Conversation → Task handoff. Tasks are independent workflow records; a Conversation remains the collaboration source of truth, and the Website document remains the only state governed by Website Undo/Redo.

## Task model and references

`createTaskStore()` owns stable Task identities, `todo`/`in-progress`/`blocked`/`done` status, editable title and description, creator and optional assignee placeholders, and created/updated/completed timestamps. Each Task retains stable Website, Conversation, Page, optional Component Instance, and optional Review Session references. It does not copy Conversation messages.

Creation is always explicit from Conversation detail. One Conversation can link to multiple Tasks and stores only their identities for display. Deleted Components or Pages and replaced Websites leave Tasks intact with unavailable-source state; restoring the original document identities restores navigation.

## Lifecycle and navigation

New Tasks begin in `todo`. Entering `done` records `completedAt`; moving to any other status clears it. Task editing and status changes do not resolve/reopen Conversations, affect Review readiness, or mutate Approval records. Conversation changes likewise do not change Task status.

The compact Tasks drawer lists current-Website Tasks, filters by status, exposes title/status/assignee, and edits Task fields. Opening a Task source selects its Conversation and navigates to the referenced Page and Component when those anchors are available. Unavailable context is reported without fuzzy reassignment.

## State separation and validation

Task create/edit/status/assignment/navigation operations remain outside Website history. Website Undo/Redo does not undo Task state. Functional validation passed 57 automated tests covering Milestones 01–13 plus source-reference integrity, Task lifecycle, collaboration/review independence, filtering, navigation, unavailable/restored anchors, Website replacement, and history separation. JavaScript syntax and the live Conversation → Task drawer workflow also passed.

Persistence, deletion/archive, subtasks, scheduling, notifications, Portal exposure, authentication, and generalized project-management views remain intentionally out of scope.
