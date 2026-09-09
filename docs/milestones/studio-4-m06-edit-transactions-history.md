---
milestone-id: studio-4-m06-edit-transactions-history
mode: implementation
status: implemented
baseline: 33dad3d0897e835765c6089c1e653b8882f49957
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m06-edit-transactions-history.md
  - package.json
affected-surfaces:
  - Studio edit transaction boundary
  - Immediate Undo and Redo
  - Workspace change history
  - Restoreable structured page state
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 06

## Title
Edit Transactions & Workspace History

## Objective
Replace the temporary one-level structural snapshot Undo with a durable-in-application transaction model that gives Studio a coherent history across the editing capabilities already implemented in Milestones 01–05.

This milestone establishes the architectural seam for future persisted Version History without implementing server/database persistence, publishing versions, review versions, or production rollback.

## Scope
Implement:
1. An explicit edit transaction/history record model.
2. Central history recording for meaningful user edits already supported by Studio 4.
3. Multi-step Undo and Redo for supported edits.
4. A bounded Workspace History surface that lists meaningful recent changes.
5. Restore-to-entry capability for an earlier in-session Workspace state.
6. History attribution metadata sufficient for future user attribution, using a local/system actor placeholder in this milestone.
7. Clear separation between transient Workspace UI state and meaningful document/site state.
8. Tests proving history correctness across content, presentation, responsive and structural edits.

## Required Transaction Coverage
History must cover meaningful changes to canonical Studio document state that already exist:
- structured component content edits;
- global Design Settings edits;
- component variant changes;
- responsive override changes/clears;
- reorder;
- insert;
- duplicate;
- hide/show;
- delete/restore through Undo/Redo.

Pure Workspace navigation/UI state must not create history entries:
- selecting a component;
- changing Desktop/Tablet/Mobile preview device;
- switching Edit/Preview mode;
- opening/closing panels/choosers.

## Transaction Model
Each history entry must have a stable identity and enough metadata to support:
- action/type;
- human-readable label;
- timestamp;
- actor identity placeholder;
- affected object/instance where applicable;
- before/after or equivalent reversible operation data;
- deterministic Undo and Redo.

Builder may use state patches, commands with inverse operations, bounded document snapshots, or another clear transaction representation. Architecture does not require event sourcing.

However, do not keep extending the Milestone 03 `workspace.undo` one-off snapshot mechanism. The new history service/boundary becomes authoritative for Undo/Redo.

## Document State Boundary
History should track the meaningful editable document state: Website/Page structure, Component Instances/content/variant/responsive state, and Design Settings as appropriate.

Transient Workspace state such as current selection, active preview device, open dialogs and Edit/Preview mode should generally remain outside historical document restoration. Restoring an entry may safely clear/reconcile selection if the selected object no longer exists.

## Edit Grouping
Avoid generating unusably granular history.

For this milestone:
- a Context Panel field commit may be one transaction;
- an inline text edit should become one transaction when the edit is committed (for example blur), not one entry per keystroke;
- a color/range control interaction should be coalesced or committed so one user adjustment does not create dozens of history entries;
- each structural action is one transaction;
- each variant/responsive selection is one transaction.

Builder owns the exact interaction technique but must demonstrate sensible grouping.

## Undo / Redo
Provide visible Undo and Redo actions in Edit Mode.

Requirements:
- multiple sequential Undo operations;
- multiple sequential Redo operations;
- making a new meaningful edit after Undo clears the incompatible Redo branch;
- Undo/Redo must preserve structured content and identity correctly;
- no history entry should be generated merely because Undo or Redo was executed;
- Preview mode remains clean of editing/history chrome.

## Workspace History Surface
Add a compact History surface/lens/panel appropriate to the current Workspace.

It must:
- show recent meaningful entries newest-first or in another clearly understandable order;
- display label and timestamp;
- optionally show affected component/object;
- identify the current point in history;
- allow restoring to a selected earlier entry/state with an intentional action.

This is an internal Studio editing tool, not yet the client-facing review/version history system.

## Restore Semantics
Restoring to a prior history point changes the current in-session document state to that point through the same history architecture. It must not create an unrelated second source of truth.

A restore may itself be represented as a new transaction/checkpoint if that produces cleaner branch semantics, or may move the history cursor. Builder must document the chosen behavior.

## History Bounds
Because persistence is still out of scope, in-memory history may be bounded to a reasonable number of entries. If bounded, document the limit and behavior. Do not use browser `localStorage` as the final history authority.

## Explicitly Out of Scope
Do not implement:
- database/server persistence;
- cross-session history;
- named releases or publish versions;
- Workspace vs Production version promotion;
- client Review Sessions or approvals;
- comments/conversations;
- production rollback;
- diff visualization beyond simple metadata;
- per-user authentication/real actor accounts;
- audit/compliance logs;
- Library versioning;
- Starter Packages;
- multi-page management;
- Organizations/Projects/Portal/Discovery;
- deployment/hosting;
- AI/recommendations;
- later roadmap systems.

## Success Criteria
1. Existing Milestone 01–05 behavior remains intact.
2. The Milestone 03 one-level structural Undo is replaced by the new transaction/history boundary.
3. Content, Design Settings, variants, responsive overrides and structural actions create sensible meaningful history entries.
4. Selection/device/mode/panel changes do not create document-history entries.
5. Undo works across at least five mixed sequential edit types.
6. Redo replays those changes correctly.
7. New edits after Undo clear incompatible Redo history.
8. Inline editing produces one committed transaction rather than per-keystroke entries.
9. Design-setting controls do not flood history with uncontrolled input-event entries.
10. Structural identity/content remain correct through Undo/Redo.
11. Hidden/deleted/duplicated instances restore correctly.
12. Variant and responsive state restore correctly.
13. History entries contain stable ID, label, timestamp, actor placeholder and useful affected-object metadata.
14. Workspace History lists recent meaningful changes and indicates current history position.
15. User can intentionally restore to an earlier in-session history point.
16. Preview mode remains free of editing/history chrome.
17. Automated tests cover transaction recording, exclusion of UI-only state, Undo/Redo branching, mixed edits, restore, and regression of prior milestones.
18. No persistence/review/deployment/later-stage system is partially implemented.

## Validation
Validation level: **functional**.

Builder must run automated tests and manually validate a mixed workflow such as:
- edit Hero heading;
- change Hero variant;
- set Mobile responsive exception;
- move Hero;
- add/duplicate/hide/delete another section;
- change a global design setting;
- Undo repeatedly through the sequence;
- Redo repeatedly;
- Undo partway and make a new edit to prove Redo branch invalidation;
- restore from History;
- confirm canonical content and component identities remain valid.

Also validate startup/assets, no new runtime errors, Framework integrity, and Studio v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 06 implementation note;
3. transaction/history model documentation;
4. grouping/coalescing behavior documentation;
5. Undo/Redo/restore semantics;
6. tests and validation results;
7. known limitations;
8. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is in-session transaction history for existing Studio 4 editing capabilities. It establishes the seam for future Version History but does not implement persisted versions, client review history, production rollback, or deployment.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 06 — Edit Transactions & Workspace History** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Replace the temporary one-level structural Undo with a coherent transaction/history boundary covering existing meaningful edits, add multi-step Undo/Redo and a compact Workspace History surface, preserve Milestones 01–05 architecture, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.

## Builder Implementation Result

- Status: Implemented; pending Architecture review.
- Functional validation: eighteen automated transaction/state/regression tests, JavaScript parsing, live HTTP startup/assets, Framework integrity, and v3 baseline preservation passed.
- Release note: Replaced one-level structural Undo with a bounded 50-entry document transaction history, multi-step Undo/Redo, branch invalidation, restore-to-entry, actor/timestamp/object metadata, and an Edit-mode History drawer. See `docs/implementation/studio-4-m06.md`.
