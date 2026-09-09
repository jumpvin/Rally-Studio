# Rally Site Studio 4.0 — Milestone 06 Architecture Review

Milestone: `studio-4-m06-edit-transactions-history`
Implementation commit: `8acefa95c08fad4c134a7236832458b28d7f53c7`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 06 satisfies the frozen transaction/history architecture and remains within scope.

The implementation retires the Milestone 03 one-level structural Undo path in favor of one coherent in-session transaction history covering meaningful Studio document edits. Tracked document state includes Website/Page structure, Design Settings, and Component Instances with content, variant and responsive state. Workspace-only state such as selection, device preview and Edit/Preview mode remains outside history.

History entries carry stable identity, action metadata, ISO timestamp, a local actor placeholder, affected-object identity, and reversible before/after document state. History is bounded to 50 entries. Undo/Redo move the cursor without creating new entries, and a new edit after Undo truncates the incompatible Redo branch.

Edit grouping is appropriate for the current UI: context/inline content commits once, design controls commit rather than record every input event, and variant/responsive/structural actions each produce one meaningful transaction. The History drawer provides recent entries, current-point indication, Undo/Redo, and intentional restore to an earlier in-session state.

## Scope discipline
No database persistence, cross-session versions, named releases, review sessions, production rollback, deployment, authentication/audit, Library versioning, Organizations/Projects/Portal/Discovery, or later roadmap system was introduced.

## Forward architecture notes
1. The current snapshot-based transaction payload is acceptable for this bounded in-session phase. Before persistent multi-page Version History, evaluate a storage-efficient patch/delta or checkpoint strategy.
2. Future actor attribution should extend the existing metadata contract rather than alter transaction semantics.
3. Client Review history and Production rollback should consume a persisted version/checkpoint layer above this edit transaction model; they should not overload the in-session history cursor.

## Decision
Approved. Architecture may create the next Studio 4 milestone.