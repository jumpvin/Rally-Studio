---
milestone-id: studio-4-m14-conversation-task-handoff
mode: implementation
status: active
baseline: c51acee67fbc76e0dbe68d47b867c8b9f8e74225
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m14-conversation-task-handoff.md
  - package.json
affected-surfaces:
  - Review Conversation to Task conversion
  - Task lifecycle and status
  - Conversation/Review Session task references
  - Task list and navigation
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 14

## Title
Conversation → Task Handoff

## Objective
Add the first internal execution layer on top of the Review/Collaboration system by allowing actionable review feedback to create a separate Task that references its source Conversation and, when applicable, Review Session and Website context.

This milestone must preserve the architectural separation established in Milestones 12–13: Conversations remain collaboration records, Tasks become workflow records, and Website document state/Undo remains independent from both.

## Scope
Implement:
1. A structured Task model independent of Website document state and Conversation message state.
2. Explicit Create Task from Conversation behavior.
3. Source references from Task to Conversation, Website, Page, optional Component Instance and optional Review Session.
4. A compact internal Tasks surface/list accessible from the Website Workspace or Comments/Review area.
5. Task statuses: `todo`, `in-progress`, `blocked`, `done`.
6. Task title and optional description.
7. Actor placeholders for creator and optional assignee.
8. Created/updated/completed timestamps as appropriate.
9. Selecting a Task navigates back to its source Conversation and available Website/Page/Component context.
10. Source Conversation displays linked Task identity/status without becoming or being replaced by the Task.
11. Marking a Task done does not automatically resolve its source Conversation.
12. Resolving a Conversation does not automatically complete a linked Task.
13. Review Session readiness continues to derive only from Conversation states, not Task states.
14. Functional tests proving reference integrity, lifecycle independence, navigation and history separation.

## Task Model
Each Task must have a stable identity and, at minimum:
- `id`;
- `websiteId`;
- `sourceConversationId`;
- optional `reviewSessionId`;
- source `pageId`;
- optional source `componentInstanceId`;
- `title`;
- optional `description`;
- `status`;
- `createdAt`;
- `createdBy` actor placeholder;
- optional `assignedTo` actor placeholder;
- `updatedAt`;
- optional `completedAt`.

The Task owns execution/workflow metadata only. It must not copy the Conversation thread as a second source of truth.

## Source Semantics
Task creation from a Conversation copies only stable references and useful display context; it does not mutate the Conversation into a Task.

Rules:
- source Conversation remains intact and fully usable;
- one Conversation may have one or more Tasks if explicitly created;
- Task may retain source Page/Component IDs even if later unavailable;
- deleting a Component or Page does not silently delete the Task;
- Website replacement may leave prior-site Tasks retained against unavailable source context;
- no fuzzy reassignment to a different Conversation or component.

## Task Lifecycle
Supported statuses:
- `todo`;
- `in-progress`;
- `blocked`;
- `done`.

Rules:
- new Task defaults to `todo`;
- status changes are intentional workflow actions;
- entering `done` records `completedAt`;
- moving from `done` to another state clears or supersedes completion time using a documented rule;
- title/description/assignee/status edits belong to Task state, not Website history;
- deleting Tasks is not required in this milestone. If Builder includes archive/remove, it must be protected and must not delete the source Conversation.

## Create Task UX
Provide a clear action from Conversation detail such as **Create Task**.

The default flow should be fast:
- prefill title from the first Conversation message or concise generated local label;
- allow user to adjust title;
- optional description;
- optional assignee placeholder;
- create intentionally.

After creation, show the linked Task in the Conversation detail and allow opening it.

Do not automatically create Tasks from every Conversation or unresolved comment.

## Tasks Surface
Add a compact internal Tasks view/list suitable for proving the workflow model.

It should support:
- current Website tasks;
- status filtering;
- concise source context;
- title/status/assignee visibility;
- selecting a Task;
- navigation back to source Conversation/context when available;
- explicit unavailable-source indication when Website/Page/Component/Conversation context cannot currently be reached.

This is not a full project-management board.

## Navigation
Selecting a Task should:
1. identify its source Conversation;
2. open/select Comments/Review context;
3. if the source Website is current and Page exists, navigate to that Page;
4. if Component exists, focus/select it;
5. select the source Conversation;
6. clearly report unavailable source context rather than silently redirecting elsewhere.

Navigation is transient UI state and must not create Website edit-history entries.

## Conversation Integration
Conversation detail should expose its linked Tasks and statuses.

Important independence rules:
- Task done != Conversation resolved;
- Conversation resolved != Task done;
- Review Session readiness remains Conversation-based;
- Approval records remain unchanged by Task lifecycle;
- a Task may continue after its Review Session is completed;
- source Conversation may remain resolved while a Task is still open, or vice versa.

## History Separation
Task create/edit/status/assignment/navigation operations must not enter the Website document transaction/Undo stack.

Website Undo/Redo must not undo Task creation or Task status changes.

Tasks may use their own simple in-memory state for this milestone. Do not use Website snapshots as Task storage authority.

## Explicitly Out of Scope
Do not implement:
- Organizations/Projects service architecture;
- generalized project task boards;
- dependencies/subtasks;
- due dates/scheduling;
- comments inside Tasks;
- mentions;
- notifications/email/SMS;
- Portal task exposure;
- authentication/permissions;
- realtime sync;
- persistence/database;
- task templates;
- automatic AI task extraction;
- billing/time tracking;
- deployment/publish workflow;
- legal approval/e-signature;
- later roadmap systems.

## Success Criteria
1. Milestones 01–13 remain functional.
2. Tasks are structured workflow objects separate from Website and Conversation objects.
3. User can explicitly create a Task from a Conversation.
4. Created Task retains stable source Conversation/Website/Page/optional Component/Review Session references.
5. Source Conversation remains unchanged except for linked-Task reference/display metadata.
6. New Task defaults to `todo`.
7. Task can intentionally move among `todo`, `in-progress`, `blocked`, and `done`.
8. `done` records completion timing using a documented rule.
9. Task title, description and assignee placeholder can be edited without Website history entries.
10. Conversation detail lists/open linked Tasks.
11. Tasks surface lists current Website Tasks and supports status filtering.
12. Selecting a Task navigates to its source Conversation and Page/Component when available.
13. Deleted Component preserves Task with unavailable Component context.
14. Deleted Page preserves Task with unavailable Page context.
15. Undo restoring original identities restores normal Task source navigation.
16. Website replacement does not silently reassign prior Tasks to the new Website.
17. Completing Task does not resolve Conversation.
18. Resolving Conversation does not complete Task.
19. Review Session readiness is unaffected by Task status except indirectly through independent Conversation changes.
20. Approval/revocation records are not mutated by Task lifecycle.
21. Task operations create zero Website document-history entries.
22. Website Undo/Redo does not undo Task operations.
23. Automated tests cover creation, status lifecycle, independence, navigation, unavailable source context, restored identity and history separation.
24. No broader project-management/Portal/persistence system is partially implemented.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- create a Review Session and Conversation;
- create Task from that Conversation;
- verify source references including Review Session;
- change title/description/assignee/status;
- move Task to done and reopen it;
- verify Conversation remains independently unresolved/resolved as manually controlled;
- verify Review Session readiness follows Conversation only;
- open Task from Conversation;
- open source Conversation/context from Task;
- delete source Component and verify unavailable source behavior;
- Undo deletion and verify source navigation restores;
- delete source Page and verify Task remains retained;
- replace Website and verify old Task is not silently reassigned;
- verify Task operations add zero Website document-history entries;
- verify Website Undo/Redo does not undo Task state;
- verify Milestones 12–13 Comments/Session/Approval behavior remains intact;
- no new runtime errors;
- Studio v3 remains preserved.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 14 implementation note;
3. Task model documentation;
4. Conversation → Task reference semantics;
5. task lifecycle and completion behavior;
6. Tasks surface/navigation behavior;
7. workflow-vs-collaboration-vs-document history separation;
8. functional tests/validation results;
9. known limitations;
10. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is explicit Conversation → Task conversion, a small independent Task lifecycle, linked source navigation and a compact internal Tasks surface. Tasks remain separate from Conversations, Review Sessions, approvals and Website document history. General project management, Portal exposure, persistence, notifications and automation remain deferred.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 14 — Conversation → Task Handoff** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Add a separate Task workflow store/model, explicit Task creation from existing Conversations, stable source references to Website/Page/Component/Review Session, a compact Tasks surface and source navigation, preserve strict independence between Task status, Conversation resolution, Review Session readiness, approval records and Website Undo/Redo, preserve Milestones 01–13, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.