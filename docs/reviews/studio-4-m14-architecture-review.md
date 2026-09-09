# Rally Site Studio 4.0 — Milestone 14 Architecture Review

Milestone: `studio-4-m14-conversation-task-handoff`
Implementation commit: `20ee65025a23542feed5b9415e1f6d9e3afef583`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 14 satisfies the frozen Conversation → Task handoff architecture.

Tasks are independent workflow records rather than transformed Conversations. Each Task retains stable source references to Website, Conversation, Page, optional Component Instance and optional Review Session while the Conversation remains the collaboration source of truth. Conversation messages are not copied into Task state.

Task lifecycle is correctly bounded to `todo`, `in-progress`, `blocked`, and `done`, with completion timestamps following status transitions. Task title, description and placeholder assignment are editable independently.

The source-navigation boundary is sound. Tasks resolve availability through their source Conversation and its stable anchors, navigate back through the Conversation when available, remain retained when Website/Page/Component context disappears, and recover navigation when original identities return. No fuzzy reassignment is introduced.

The implementation preserves the critical state separations: Task operations do not resolve/reopen Conversations, do not affect Review Session readiness, do not mutate Approval records, and remain outside Website Undo/Redo history. Conversation lifecycle likewise does not automatically change Task status.

The compact Tasks surface and linked-Task display in Conversation detail provide the required operational handoff without introducing generalized project-management infrastructure.

Functional evidence reports 57 automated tests passing across prior milestones and new Task behavior, plus live browser validation of Conversation creation, Task handoff, linked display, Task editing and source navigation.

## Scope discipline
No Task deletion/archive, subtasks, due dates, scheduling, notifications, Portal exposure, authentication, persistence, generalized project management or later service-platform systems were introduced.

## Forward architecture notes
1. Tasks are now a viable workflow primitive for later Project/Portal work. Future project management should wrap/reference these Task identities rather than replace them with a second task model.
2. Persistence should preserve source references even when source objects are archived or unavailable; unavailable context is valid historical state.
3. Client-facing task exposure should be permission/capability driven. A client should not automatically receive access to every internal Task simply because it originated from their Conversation.
4. Automation may later propose Task creation, but the current explicit handoff should remain the baseline for human-controlled review workflows.

## Decision
Approved. Architecture may create the next Studio 4 milestone.