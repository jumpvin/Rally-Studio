# Rally Site Studio 4.0 — Milestone 13 Architecture Review

Milestone: `studio-4-m13-review-sessions-approval-records`
Implementation commit: `6344e0c924fe026cbcbbbbf9471eb76c87f688c1`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 13 satisfies the frozen Review Sessions & Approval Records architecture.

Review Sessions are structured collaboration objects separate from canonical Website document state and Website Undo/Redo. They own stable identities, Website identity, draft/active/completed lifecycle, actor/timestamps, a lightweight immutable review checkpoint, Conversation references, and append-only Approval records.

Checkpoint behavior preserves the intended boundary: activation captures stable Website identity, timestamp, page/component counts and a deterministic fingerprint of the Website snapshot without creating a second editable Website model. Later Website edits do not rewrite the checkpoint.

Conversation integration is reference-based. Active-session conversations receive the Review Session identity and existing conversations may be associated without copying messages or changing Page/Component anchors. Session readiness is derived from current associated Conversation states and remains distinct from approval.

Approval semantics are correct: approval is explicit; unresolved Conversations block approval unless an override reason is supplied; approval records are append-only; revocation appends evidence rather than mutating prior approval; re-approval creates another record. New unresolved activity can change readiness after approval without erasing approval history.

Functional evidence reports 52 automated tests passing across prior milestones and new Session/checkpoint/approval behavior, plus Framework integrity, startup/assets, Studio v3 preservation and a live Review Session activation scenario.

## Scope discipline
No Portal exposure, Tasks, assignments, authentication, persistence, notifications, legal e-signature, publishing/deployment approval automation or later service-platform systems were introduced.

## Forward architecture notes
1. Persisted collaboration will eventually need durable immutable checkpoint/version identity rather than relying only on an in-memory fingerprint, but this representation is appropriate for the current non-persistent phase.
2. Approval evidence should remain collaboration/service state and must not be collapsed into Website edit history when persistence arrives.
3. Client Portal exposure should consume Review Sessions and Approval records through a constrained role-specific view rather than create a separate review data model.
4. Task conversion, if introduced, should reference source Conversation and Review Session IDs while remaining a separate workflow object.

## Decision
Approved. Architecture may create the next Studio 4 milestone.