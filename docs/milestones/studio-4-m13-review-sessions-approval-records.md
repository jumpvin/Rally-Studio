---
milestone-id: studio-4-m13-review-sessions-approval-records
mode: implementation
status: active
baseline: 843752d1a67b5efd601eea9326a8e2464e567f45
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m13-review-sessions-approval-records.md
  - package.json
affected-surfaces:
  - Review Session lifecycle
  - Website review checkpoints
  - Session-scoped conversations
  - Approval and sign-off records
  - Review summary and readiness UI
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 13

## Title
Review Sessions & Approval Records

## Objective
Build the formal review layer on top of Milestone 12 conversations by introducing structured Review Sessions that point to a defined Website review checkpoint and group the conversations created during that review.

This milestone also introduces explicit approval/sign-off records as collaboration metadata. Approval must remain distinct from conversation resolution: a Review Session with zero open conversations may be ready for approval, but it is never automatically approved.

The milestone must preserve the architecture established in Milestone 12: canonical Website/Page/Component content and Website Undo/Redo remain separate from collaboration state.

## Scope
Implement:
1. A structured Review Session model with stable identity.
2. A lightweight Website review checkpoint/reference captured when a session starts.
3. Review Session states sufficient for draft/active/completed review flow.
4. Starting a Review Session for the current Website.
5. Opening an existing Review Session in the Website review experience.
6. Associating new and existing conversations with a Review Session without copying conversation content.
7. Session summary UI showing conversation counts by status.
8. A clear readiness signal based on unresolved conversation state.
9. Explicit approval/sign-off as a separate structured record.
10. Approve, revoke/withdraw, and re-approve behavior with clear audit timestamps and actor placeholders.
11. Approval requirements that prevent accidental approval while unresolved conversations remain, unless the user intentionally overrides with a recorded reason.
12. Functional tests proving session lifecycle, checkpoint stability, conversation association, approval separation, and Website-history separation.

## Review Session Model
A Review Session must have a stable identity and collaboration metadata sufficient for later client-facing workflows.

At minimum:
- `id`;
- `websiteId`;
- `title` or human-readable label;
- `status`;
- `createdAt`;
- `createdBy` actor placeholder;
- `startedAt` when activated;
- optional `completedAt`;
- `checkpoint` metadata identifying the Website state targeted for review;
- ordered or stable references to associated Conversation IDs;
- approval/sign-off records or references.

Approved Review Session states for this milestone:
- `draft`;
- `active`;
- `completed`.

Rules:
- a new session may be created as `draft`;
- starting/activating the session sets it to `active` and captures the review checkpoint;
- a completed session remains inspectable and does not destroy its conversations or approvals;
- reopening a completed session may return it to `active` if Builder can preserve approval semantics cleanly; otherwise keep reopen out and document the limitation rather than invent a partial workflow.

## Website Review Checkpoint
A Review Session must identify what Website state the reviewer is reviewing.

For this milestone, the checkpoint may be lightweight and in-memory, but it must be structurally explicit. It should include at minimum:
- Website ID;
- a stable checkpoint/session-start identifier;
- timestamp;
- enough immutable summary metadata to distinguish the review target from later edits.

The checkpoint must not create a parallel editable Website document.

Preferred architecture:
- Review Session references the real Website;
- checkpoint records review-target identity/metadata;
- normal Website editing remains canonical;
- later Website edits may make the current live Website diverge from the checkpoint, but the Review Session still records what was presented at session start.

Do not clone every Page/Component into a second review document in this milestone.

## Conversation Association
Milestone 12 Conversations remain their own collaboration objects.

Requirements:
- a Conversation may optionally reference a Review Session ID;
- conversations created while a Review Session is active should be associated with that session;
- existing Website conversations may be linked to a session intentionally if appropriate;
- associating a Conversation with a session must not duplicate or mutate its messages;
- deleting or completing a Review Session must not silently delete its Conversations;
- a Conversation can continue to retain its Website/Page/Component anchors from Milestone 12.

Task conversion is not part of this milestone. Future Tasks should reference the source Conversation rather than transform it.

## Review Session UX
Add a formal Review Session surface integrated with the existing Comments/Conversations review lens.

The Website remains visually primary.

At minimum provide:
- list/select Review Sessions for the current Website;
- create Review Session;
- start/activate session;
- display session status and checkpoint timestamp;
- show session-scoped conversations;
- show counts for open, waiting-on-rally, waiting-on-client, and resolved conversations;
- show a concise readiness indicator such as `Ready for approval` only when the defined readiness rule is met;
- show approval status and approval history/record summary;
- allow returning to general Website conversations outside a specific Review Session.

Avoid building a separate service-dashboard application. This remains a review layer inside Site Studio.

## Readiness Semantics
Readiness and approval are different concepts.

Define session readiness as:
- no associated conversations in `open`, `waiting-on-rally`, or `waiting-on-client` state;
- all associated conversations are `resolved`, or the session has no conversations.

A ready session may display `Ready for approval`.

A ready session must **not** automatically create an Approval record or mark the session approved.

If new unresolved conversation activity occurs after approval, retain the Approval record and make the UI clearly indicate that the session has changed since approval / is no longer currently clean. Do not silently delete prior approval evidence.

## Approval Record Model
Approval/sign-off must be a separate collaboration object or explicit immutable record boundary.

At minimum each Approval record must contain:
- stable `id`;
- `reviewSessionId`;
- `websiteId`;
- actor placeholder;
- `createdAt`;
- action/status such as `approved` or `revoked`;
- checkpoint identifier being approved;
- optional note/reason;
- optional override reason when approval occurs despite unresolved conversations.

Preferred semantics:
- approvals are append-only records for audit meaning;
- revocation creates a new revocation/withdrawal record rather than deleting the prior approval;
- re-approval creates a new approval record;
- current approval status is derived from the latest applicable record for the Review Session/checkpoint.

For this milestone simple actor placeholders from M12 remain acceptable. Do not implement authentication or legal electronic-signature infrastructure.

## Approval Rules
1. Approval is an explicit user action.
2. Zero open conversations does not equal approval.
3. By default, the UI should block or strongly gate approval while unresolved conversations remain.
4. If Builder implements an intentional override, it must require an explicit reason and record that reason on the Approval record.
5. Approval must reference the Review Session checkpoint.
6. Later Website edits do not rewrite an existing Approval record.
7. New review activity after approval must not erase approval history.
8. Approval operations must not enter Website Undo/Redo history.

## Separation from Website Document History
Creating, starting, completing, selecting, or navigating Review Sessions must not create Website document-history entries.

Associating conversations with Review Sessions must not create Website document-history entries.

Creating, revoking, or re-creating Approval records must not create Website document-history entries.

Website edits continue through the existing Website transaction store exactly as before.

Website Undo/Redo must not undo Review Session lifecycle changes, Conversation linkage, or Approval records.

## Delete / Replacement Behavior
Review collaboration context must not be silently destroyed because canonical document objects change.

For this milestone:
- deleting a Page/Component continues to use M12 unavailable-anchor behavior for conversations;
- deleting/replacing the Website should leave old Review Sessions and approvals retained against the prior Website identity rather than silently reassigning them;
- Review Session checkpoint identity remains stable even if the live Website later changes;
- do not implement fuzzy migration to a replacement Website.

## Explicitly Out of Scope
Do not implement:
- Client Portal;
- authentication/permissions;
- legal/e-signature compliance;
- database persistence;
- realtime multi-user sync;
- email/SMS notifications;
- assignments/mentions;
- Tasks or task conversion;
- due dates/project management workflow;
- guided questionnaires or Discovery forms;
- screenshot annotations;
- attachments;
- production/deployment approval;
- billing/contracts;
- Organizations/Projects/service workflow;
- automatic publishing after approval;
- automatic approval from resolved comments;
- parallel editable review copies of the Website;
- later roadmap systems.

## Success Criteria
1. Milestones 01–12 remain functional.
2. Review Sessions are structured collaboration objects separate from canonical Website state.
3. A Review Session can be created, started and viewed for the current Website.
4. Starting a session captures a stable review checkpoint/reference.
5. The checkpoint does not create a parallel editable Website document.
6. Conversations can be associated with a Review Session by stable reference.
7. Conversations created in an active Review Session are session-scoped without duplicating messages.
8. Existing M12 Website/Page/Component anchors continue to function.
9. Session summary counts correctly reflect the four conversation statuses.
10. Readiness is derived from unresolved conversation state.
11. `Ready for approval` never automatically equals approved.
12. Approval requires an explicit action and produces a stable Approval record.
13. Approval records reference both Review Session and checkpoint identity.
14. Default approval is blocked/gated while unresolved conversations remain.
15. Any allowed unresolved-conversation override requires and records a reason.
16. Revoking approval preserves the prior approval record and creates new audit evidence.
17. Re-approval creates a new approval record.
18. Later Website edits do not mutate historical Approval records.
19. New unresolved conversation activity after approval does not erase approval history and clearly changes current readiness.
20. Review Session and Approval operations create zero Website document-history entries.
21. Website Undo/Redo does not undo Review Session or Approval collaboration state.
22. Website replacement retains prior sessions/approvals against the prior Website identity rather than silently reassigning them.
23. Functional tests cover session lifecycle, checkpoint capture, conversation association, readiness, approval, revocation/re-approval, post-approval changes and history separation.
24. No Portal/Tasks/auth/persistence/notifications/later system is partially implemented.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- create a Review Session for a Website;
- start the session and verify checkpoint metadata is captured;
- create component- and Page-level conversations while the session is active;
- verify those conversations reference the session while retaining their normal anchors;
- move conversations through open/waiting/resolved states and verify session counts;
- verify readiness becomes true only when no unresolved conversations remain;
- verify readiness alone does not create approval;
- explicitly approve the session and inspect the Approval record;
- verify the record references the session checkpoint;
- attempt approval with unresolved conversations and verify gating/override rules;
- revoke approval and verify prior approval evidence remains;
- re-approve and verify a new record is appended;
- edit Website content after approval and verify approval history remains immutable;
- add/reopen an unresolved conversation after approval and verify current readiness changes without erasing approval evidence;
- complete the Review Session and verify it remains inspectable;
- verify all session/approval operations add zero Website document-history entries;
- verify Website edits still create normal Website history entries;
- verify Website Undo/Redo does not affect Review Session/Approval state;
- verify M12 comments pins, filters, navigation and unavailable-anchor behavior remain intact;
- no new runtime errors;
- Studio v3 remains preserved.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 13 implementation note;
3. Review Session model documentation;
4. checkpoint semantics and limitations;
5. Conversation-to-Review-Session association behavior;
6. readiness semantics;
7. Approval record model and lifecycle documentation;
8. collaboration-vs-Website-history separation evidence;
9. functional tests/validation results;
10. known limitations;
11. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is formal Review Sessions, lightweight review checkpoints, session-scoped Conversation references, readiness summaries, and explicit approval/revocation records. Approval remains separate from conversation resolution. Tasks, Portal, authentication, persistence, notifications, legal e-signatures, publishing automation and later service-platform systems require future Architecture authorization.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 13 — Review Sessions & Approval Records** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Build structured Review Sessions around the existing M12 Conversation system, capture a lightweight stable Website review checkpoint without cloning a second editable Website, associate Conversations to sessions by reference, implement session summary/readiness UI, add explicit append-style Approval/revocation records that remain distinct from conversation resolution, preserve collaboration separation from Website Undo/Redo history, preserve Milestones 01–12, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.