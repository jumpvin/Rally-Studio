# Rally Site Studio 4.0 — Milestone 16 Architecture Review

Milestone: `studio-4-m16-review-version-history`
Implementation commit: `4da5848699ac2fa81deb72517bb4312251d5f1d2`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 16 satisfies the frozen Review / Version History architecture and completes the major Stage 5 roadmap capabilities.

Review Versions are intentional immutable Website checkpoints separate from frequent Workspace edit transactions. Each version owns stable identity, Website identity, label, actor/time, source reason, optional Review Session reference, deterministic fingerprint, size metadata and a deep-cloned complete Website document snapshot. Reads and inspection return clones, protecting captured evidence from mutation.

Manual capture, relabeling, browsing and read-only inspection remain outside Website Undo/Redo. Later Website edits do not alter existing versions and explicit later captures create distinct version identities.

Review Session activation creates exactly one Review Version and links the Session/checkpoint to it. Approval evidence carries the same Review Version identity, so the approved state refers to an exact captured Website rather than only a mutable current workspace.

Restore semantics are correct: restore requires explicit confirmation, restores the captured Website/Page/Component identities into canonical document state, and records one normal Workspace transaction. Undo returns to the exact pre-restore state and Redo reapplies the restored version. Review Versions and collaboration/workflow state remain untouched; Conversation/Task anchor availability follows stable identity naturally.

The compact Version History surface provides intentional capture, metadata, current-state indication, Review/approval context, read-only inspection and protected restore without introducing deployment/version branching semantics.

Functional evidence reports 67 automated tests passing across Milestones 01–15 plus immutable capture, Review/Approval linkage, inspection, relabeling, protected restore, exact identity Undo/Redo, collaboration retention and distinct later versions. Startup/assets, Framework integrity, Studio v3 preservation and live capture/inspection validation also passed.

## Scope discipline
No persistence, branching/merging, visual diffing, deployment versions, production rollback, Portal access, authentication or Stage 6+ systems were introduced.

## Stage 5 exit assessment
Stage 5 now has working Review Sessions, contextual Conversations, replies/waiting/resolve/reopen behavior, Task conversion, guided review questionnaire, explicit Approval records and Review/version history. The client-review domain is architecturally complete enough to move to Stage 6 while persistence/authentication/Portal exposure remain intentionally later concerns.

## Forward architecture notes
1. Stage 6 Discovery should introduce its own semantic records while reusing compatible questionnaire primitives rather than reusing Review Session meaning.
2. The Interactive Strategy Packet should reference/render the real Website workspace/version rather than copy Website content into a presentation-only duplicate.
3. Shared design controls between Strategy Packet and Website must continue to mutate the canonical Design Settings boundary so the packet demonstrates the actual deployable site.
4. Persistence will eventually need durable Review Version storage and immutable historical questionnaire-definition versions, but that should be designed with the broader Organization/Project persistence model rather than bolted onto Stage 5 now.

## Decision
Approved. Stage 5 is complete. Architecture may begin Stage 6 — Interactive Strategy Packet & Discovery.