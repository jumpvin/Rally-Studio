# Studio 4 Milestone 13 — Implementation Note

Milestone 13 adds formal Review Sessions and append-only approval evidence to the collaboration layer established in Milestone 12. Neither sessions nor approvals enter the canonical Website document or its Undo/Redo stack.

## Review Session model and lifecycle

`createReviewSessionStore()` owns stable Session identities, Website identity, title, `draft`/`active`/`completed` status, actor/timestamps, one checkpoint, stable Conversation references, and ordered Approval records. Draft sessions can be activated and completed. Completed sessions remain inspectable and cannot be restarted in this milestone, avoiding ambiguous approval semantics.

Opening an active session makes it the collaboration context. New Conversations automatically receive its ID; existing Conversations can be associated by stable reference without copying messages or changing Page/Component anchors.

## Checkpoint semantics

Activation captures one immutable lightweight checkpoint containing a stable checkpoint ID, Website ID, timestamp, Page/Component counts, and deterministic document fingerprint. It references the real Website state presented at session start but does not clone a parallel editable Website. Later Website edits and replacements do not rewrite the checkpoint.

## Readiness and approvals

Session summaries derive counts for `open`, `waiting-on-rally`, `waiting-on-client`, and `resolved`. Readiness is true only when no associated Conversation is unresolved. Readiness never creates approval.

Approval is an explicit append-only record containing stable ID, Session and Website IDs, checkpoint ID, actor, timestamp, action, optional note, and optional override reason. Approval with unresolved Conversations is blocked unless a non-empty override reason is provided. Revocation appends a `revoked` record; re-approval appends a new `approved` record. Current approval derives from the latest record, while all prior evidence remains intact.

New unresolved activity after approval changes current readiness but does not erase or mutate approval history. Website editing and Undo/Redo likewise leave Sessions, Conversation associations, checkpoints, and Approval records unchanged.

## Review UX

The Comments sidebar now includes current-Website Review Sessions, draft creation, activation, completion, checkpoint/readiness summaries, four-status counts, session-scoped Conversation filtering, explicit approval, unresolved override reason, revocation, and audit-record count. General Website conversations remain accessible outside a selected Session.

## Validation evidence and limitations

Functional validation passed 52 automated tests covering Milestones 01–12 plus Session lifecycle, checkpoint stability, automatic/manual Conversation association, readiness, approval gating/override, revocation/re-approval, post-approval activity, Website-history separation, and Website replacement retention. JavaScript syntax, Framework integrity, HTTP assets, Studio v3 preservation, and live Session activation passed without runtime errors.

Session reopening, Portal access, Tasks, authentication, persistence, notifications, legal e-signatures, publishing approval, and later service-platform systems remain intentionally out of scope.
