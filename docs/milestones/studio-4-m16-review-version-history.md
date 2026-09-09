---
milestone-id: studio-4-m16-review-version-history
mode: implementation
status: implemented
baseline: f111855995799df5779b58e0e63d0e28885d9b51
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m16-review-version-history.md
  - package.json
affected-surfaces:
  - Review Version records
  - Review Session/version linkage
  - Version timeline and comparison metadata
  - Restore-from-review-version workflow
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 16

## Title
Review / Version History

## Objective
Complete Stage 5 by introducing explicit Review Version records that connect Website snapshots, Review Sessions, conversations, questionnaire state, and approval evidence into a coherent historical timeline.

This milestone must preserve the separation between day-to-day Workspace edit history and formal review/version history. Workspace Undo/Redo remains an editing tool; Review Versions are intentional checkpoints used to understand and restore significant Website states.

## Scope
Implement:
1. A structured Review Version model with stable identity.
2. Explicit creation of a Review Version from the current Website state.
3. Automatic linkage between a Review Session checkpoint and its Review Version where appropriate.
4. A Website-level Review/Version History surface listing versions chronologically.
5. Version metadata including label, timestamp, actor placeholder, Website identity, source/reason, and document fingerprint.
6. Full immutable Website snapshot data sufficient to inspect and restore the recorded Website state in-session.
7. Read-only inspection of an earlier Review Version without mutating current Website state.
8. Intentional restore from a Review Version into the current Workspace Website as one Website-history transaction.
9. Clear handling of conversations, Review Sessions, Tasks, questionnaire responses, and approvals when Website state is restored.
10. Tests proving version immutability, restore behavior, identity semantics, and separation from Workspace Undo/Redo.

## Review Version Model
At minimum each Review Version must contain:
- `id`;
- `websiteId` at capture time;
- `label`;
- `createdAt`;
- `createdBy` actor placeholder;
- `source`/reason such as `manual`, `review-session-start`, `approved-review`;
- optional `reviewSessionId`;
- deterministic `documentFingerprint`;
- immutable captured Website document snapshot or equivalent complete restorable representation;
- summary metadata such as Page count and Component count.

Review Version identity must remain stable and separate from Website/Page/Component identities contained inside the captured snapshot.

## Version Creation
Support an intentional **Create Version** action from the Website Workspace/History area.

Creation must:
- capture the current canonical Website document state;
- not alter the Website itself;
- not create a Website edit-history transaction;
- produce a human-readable default label with optional rename/label input;
- keep the captured data immutable after creation.

## Review Session Integration
A formal Review Session checkpoint should reference a Review Version rather than exist as an unrelated competing snapshot concept.

Builder may migrate/adapt the Milestone 13 checkpoint representation so that:
- starting a Review Session creates or resolves one stable Review Version representing the Website presented for that session;
- the Review Session retains `reviewVersionId` plus its existing lightweight checkpoint metadata if useful;
- the same Website state is not needlessly duplicated through two independently authoritative snapshot systems.

Historical Review Sessions created in test fixtures may be normalized safely.

## Approval Integration
Approval records must continue referencing the exact reviewed state.

Where practical, Approval records should retain `reviewVersionId` in addition to or instead of a legacy checkpoint ID. Existing append-only approval semantics remain authoritative.

Approving must not automatically restore or publish anything.

## Version Timeline UX
Add a compact Website-level Version History surface.

Each entry should show enough to answer:
- what version is this?;
- when was it created?;
- who/what created it?;
- was it tied to a Review Session?;
- is there approval evidence associated with it?;
- how many Pages/Components were captured?;
- is it the current Website state or an older state?

Do not build a visual Git-style diff system in this milestone.

## Inspect Version
Selecting **Inspect** on a Review Version must allow the user to view the captured Website state read-only.

The Website should remain the visual star. A practical implementation may use the existing renderer with a temporary read-only snapshot context.

Inspection must not:
- replace current canonical Website state;
- create Undo/Redo entries;
- allow editing the historical snapshot;
- reassign conversations/tasks/approvals.

A clear exit returns to the current Workspace state.

## Restore Version
Provide an intentional protected **Restore this version** action.

Restore semantics:
1. retain the Review Version record permanently;
2. replace current canonical Website document state with a deep clone of the captured snapshot;
3. restore the exact Website/Page/Component identities contained in that Review Version;
4. record the replacement as one meaningful Website edit-history transaction;
5. allow immediate Undo to return to the pre-restore Website state;
6. Redo restores the same version state again;
7. do not automatically delete or rewrite conversations, Tasks, Review Sessions, questionnaire responses, or approval records.

Because collaboration/workflow objects reference stable Website/Page/Component identities, anchors may become available/unavailable naturally depending on the restored state. Do not fuzzy-reassign them.

## Current-State Relationship
A Review Version is historical evidence, not a live branch.

After restoring an old Review Version and editing it:
- the existing version remains unchanged;
- new edits affect only current Website state;
- a new Review Version must be intentionally created to capture the new state.

Do not implement branching/merging.

## Workspace Edit History vs Review Version History
Maintain a strict distinction:

### Workspace edit history
- frequent in-session transactions;
- Undo/Redo;
- bounded and operational;
- may include small individual edits.

### Review Version history
- intentional significant checkpoints;
- immutable;
- Website-level;
- review/approval context;
- not traversed through normal Undo/Redo until a version is explicitly restored.

Creating, inspecting, labeling, or browsing Review Versions must not pollute Website edit history.

## Version Labels
Allow a concise editable label or title for a Review Version, for example:
- `Website V1`;
- `Pre-client review`;
- `Approved September review`.

Changing only the Review Version label changes version metadata, not its captured Website snapshot or Website history.

## Version Retention
For this non-persistent milestone, Review Versions may remain in-memory for the current application lifetime. Do not impose the 50-entry Workspace history bound on formal Review Versions unless clearly necessary.

Do not use browser `localStorage` as final authority.

## Explicitly Out of Scope
Do not implement:
- server/database persistence;
- cross-session durable versions;
- Git-style branching/merging;
- visual content diffing;
- deployment/publish versions;
- production rollback;
- live-site backups;
- legal/e-signature records;
- Portal access;
- notifications;
- authentication/permissions;
- Discovery/Strategy Packet;
- Organizations/Projects/service workflow;
- deployment adapters;
- later roadmap systems.

## Success Criteria
1. Milestones 01–15 remain functional.
2. Review Versions are stable structured records separate from Workspace edit transactions.
3. Manual Create Version captures an immutable complete Website state without changing Website history.
4. Review Session start is linked to one stable Review Version representing the presented Website state.
5. Approval evidence can resolve the exact Review Version reviewed/approved.
6. Version timeline lists versions with useful label/time/actor/source/session/approval/size metadata.
7. Historical snapshot can be inspected read-only without replacing current Website state.
8. Inspection never creates Website history entries.
9. Historical snapshots cannot be edited directly.
10. Restore is intentional/protected.
11. Restore deep-clones the recorded state into canonical Website document state.
12. Restore preserves exact Website/Page/Component identities from the selected version.
13. Restore is one Website edit-history transaction.
14. Undo after restore returns to the exact pre-restore Website state.
15. Redo returns to the exact restored version state.
16. Review Version record itself remains immutable through restore/edit/Undo/Redo.
17. Collaboration/workflow records are not deleted or rewritten by restore.
18. Conversation/Task anchors naturally become available/unavailable based on restored stable identities.
19. Editing after restore does not mutate the historical Review Version.
20. New Review Version creation after further editing captures a distinct state/fingerprint.
21. Version labels can change without mutating captured Website data or Website history.
22. Workspace Undo/Redo remains distinct from formal Review Version browsing.
23. Automated tests cover creation, immutability, session linkage, approval linkage, inspect, restore, Undo/Redo, collaboration retention, identity restoration, and regression of prior milestones.
24. No persistence/deployment/Stage 6+ systems are partially implemented.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- manually create `Website V1`;
- change content/variant/design settings and verify V1 remains unchanged;
- start a Review Session and verify a stable Review Version is attached;
- create/respond/resolve review conversations and questionnaire answers;
- approve and verify approval points to the reviewed version;
- edit the current Website after review and confirm the old Review Version remains unchanged;
- inspect the older Review Version read-only and exit back to current state;
- restore the older Review Version;
- verify exact Page/Component identities from that version return;
- verify conversations/tasks with matching identities become navigable and mismatched anchors remain unavailable;
- Undo restore to return to the exact newer Website;
- Redo restore;
- make a new edit and create another Review Version;
- verify the two versions have distinct fingerprints/state;
- rename a version and verify no Website transaction was created;
- no runtime errors;
- Studio v3 remains preserved.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 16 implementation note;
3. Review Version model documentation;
4. Review Session/checkpoint migration semantics;
5. approval/version linkage semantics;
6. inspect/restore behavior documentation;
7. Workspace-history vs Review-version-history separation documentation;
8. tests/validation results;
9. known limitations;
10. Architecture questions instead of silent scope expansion.

## Architecture Freeze
The frozen scope is immutable in-session Review Version history tied to Website review checkpoints, with read-only inspection and intentional restore through existing Website history. Persistence, deployment versions, production rollback and Stage 6+ systems remain deferred.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 16 — Review / Version History** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Introduce immutable Website-level Review Versions separate from normal Workspace edit history, integrate Review Session checkpoints and Approval evidence with stable Review Version identity, add a compact Version History surface with read-only inspection and protected restore, preserve all collaboration/workflow records across restore, preserve Milestones 01–15, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.

## Implementation Evidence

- Immutable, fully restorable Review Version records with stable metadata and fingerprints.
- Review Session checkpoints and append-only approvals linked to exact Review Version identity.
- Compact timeline with relabel, current-state indication, read-only inspection, and protected restore.
- Restore is one Workspace transaction with exact-identity Undo/Redo and collaboration retention.
- 67 passing functional tests and live browser verification of capture, metadata, and inspection.
