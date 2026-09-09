---
milestone-id: studio-4-m03-page-structure-actions
mode: implementation
status: implemented
baseline: a23661d84b0098402a40377ced84a5abb5e0d835
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m03-page-structure-actions.md
  - package.json
affected-surfaces:
  - Website Workspace page structure
  - Component instance ordering
  - Add Section workflow
  - Duplicate Hide Delete section actions
  - Reversible structural mutations
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 03

## Title
Page Structure Actions

## Ownership
- Architecture owner: Rally Site Studio Architecture Chat
- Implementation owner: Rally Site Studio Build Chat
- Repository: `jumpvin/Rally-Studio`
- Authorized branch: `master`
- Release target: `4.0.0`
- Approved foundation: Milestones 01–02

## Objective
Extend the approved Website Workspace from content editing into safe page composition by allowing Rally staff to change the ordered Component Instance structure of the current Page without abandoning the structured Studio 4 model.

Milestone 03 introduces the first structural editing actions: reorder existing sections, insert a registered component using its recommended/default content, duplicate an instance, hide/show an instance, and reversibly delete/restore an instance.

This milestone does not introduce the full Library, component variants, multi-page management, or Version History.

## Scope
Implement a functional vertical slice containing:
1. Reordering current-page Component Instances through the Page-first Explorer.
2. Reordering current-page Component Instances directly from the website canvas using a simple bounded interaction appropriate to the current implementation; full drag-and-drop polish is not required.
3. An Add Section affordance between/around page sections.
4. An Add Section chooser sourced from the existing Component Registry rather than a hard-coded page-specific list.
5. Inserting a selected registered Component Definition as a new Component Instance using definition-provided recommended/default structured content.
6. Duplicate action for a selected Component Instance.
7. Hide/Show action for a selected Component Instance.
8. Reversible Delete action for a selected Component Instance without a blocking confirmation dialog.
9. Immediate Undo for the most recent authorized structural action, sufficient to recover reorder/add/duplicate/hide/delete mistakes in this milestone.
10. Store/state validation for structural mutations and stable instance identity.
11. Functional validation across the existing Hero, Services and CTA definitions.

## Required Architecture
### Page order remains authoritative
`Page.componentInstanceIds` remains the authoritative order for the current page. Reordering changes structured state; it must not reorder only DOM nodes or persist order in markup.

### Registered definitions provide insertion defaults
The Component Registry/Definition contract must be extended as needed so a definition can provide recommended/default structured content for a new instance. The Add Section chooser must discover available definitions through the registry.

Do not build the future Library architecture inside this milestone. The registry is the source available today; later Library milestones can wrap/extend it.

### Stable instance identity
New and duplicated instances receive unique stable identities. Duplicate must clone structured content rather than share mutable content references with the source instance.

### Hidden state
Hide/Show is instance-level state. A hidden component remains in the Page structure and Explorer, is clearly marked as hidden in Edit Mode, and is omitted from clean Preview rendering.

### Reversible delete
Delete should preserve editing flow and therefore must not require a confirmation modal for sections. Deleting removes the instance from the active Page structure but keeps enough bounded undo information to restore it immediately.

This milestone's Undo is intentionally local and shallow. It is not the future Version History system.

### Structural action path
All page-structure mutations must pass through explicit store/state methods or an equivalent centralized command boundary. UI code must not independently mutate arrays/DOM and then attempt to reconcile state afterward.

### Content preservation
Reorder, hide/show and delete/restore must not alter Component Instance content. Duplicate must copy content faithfully. Add Section creates content from definition defaults.

## Required UX Behavior
### Reordering
Provide both:
- Explorer-based reorder controls; and
- canvas-based reorder controls.

The interaction may use Move Up/Move Down or similarly bounded controls for this milestone. Do not spend the milestone implementing sophisticated drag-and-drop infrastructure unless it is genuinely simpler and robust.

### Add Section
A visible `+`/Add Section affordance appears at sensible insertion points while in Edit Mode. Activating it opens a compact chooser of registered component types. Selecting a type inserts its recommended/default variant/content immediately at the requested position and selects the new instance.

This follows the approved Studio philosophy: **default first, alternatives later**. Variant cycling is explicitly deferred.

### Instance actions
When a component is selected, contextual actions include:
- Duplicate
- Hide / Show
- Delete

These actions should remain secondary to normal content editing.

### Undo
After a structural action, provide a clear immediate Undo affordance. One-level Undo is sufficient for this milestone, but the action representation should not make later history/version work unnecessarily difficult.

### Preview
Preview Mode renders the current Page order cleanly, omits hidden/deleted instances, and hides structural editing controls.

## Store / State Contract
Extend the existing Studio store as needed with centralized operations equivalent to:
- `moveComponent(instanceId, targetIndex)` or bounded move methods;
- `insertComponent(definitionType, index)`;
- `duplicateComponent(instanceId)`;
- `setComponentHidden(instanceId, hidden)`;
- `deleteComponent(instanceId)`;
- `undoLastStructuralAction()`.

Exact names are Builder-owned. Architecture requires the behavior and central mutation boundary, not these literal APIs.

State validation must reject invalid page references/order and unknown definition types where the registry/state boundary can reasonably enforce them.

## Explicitly Out of Scope
Do not implement in Milestone 03:
- Component variant cycling or variant selection.
- Full Library UI, library maturity/status, save-to-library or promotion.
- Starter Packages, Page Templates, Compositions or Blueprints.
- Multi-page creation, duplication, deletion or page navigation management.
- Full drag-and-drop framework if simpler bounded reorder controls satisfy the milestone.
- Persistent multi-step Undo/Redo stack.
- Version History, snapshots or rollback UI.
- Responsive overrides.
- Comments/review/approval.
- Full Design Lens redesign.
- Organizations, Projects, Discovery, Strategy Packet or Client Portal.
- Deployment, hosting or production editing.
- Authentication/capability system.
- Final persistence/database infrastructure.
- Automatic implementation of later roadmap work.

## Success Criteria
Milestone 03 is successful when all of the following are true:
1. Milestones 01–02 architecture and editing behavior remain intact.
2. Current Page order is driven by `componentInstanceIds` structured state.
3. A component can be moved from the Explorer and the canvas, with both surfaces reflecting the same resulting order.
4. Add Section discovers available types through the Component Registry.
5. Selecting a component type inserts a new uniquely identified Component Instance at the requested position using definition-provided default structured content.
6. The newly inserted instance renders correctly and becomes selected for editing.
7. Duplicate creates an independent instance with copied content and a unique identity.
8. Hide preserves the instance in structured page state/Explorer but omits it from clean Preview Mode; Show restores rendering.
9. Delete removes the instance from the active page without a blocking confirmation dialog.
10. Immediate Undo correctly restores the most recent structural action, including content/order/hidden state as applicable.
11. Reorder/hide/delete/restore do not corrupt structured component content.
12. Preview Mode contains no Add/Move/Duplicate/Hide/Delete/Undo editing chrome.
13. Structural mutations occur through the centralized state/store boundary rather than DOM-only manipulation.
14. Existing global Design Settings inheritance and content editing remain functional after structural changes.
15. Studio v3 reference material remains preserved.
16. Builder supplies functional tests/validation for ordering, insertion, duplication, hidden state, deletion and Undo.
17. No out-of-scope Library, variants, multi-page, history or later-roadmap systems are partially implemented.

## Validation
Validation level: **functional**.

Builder must verify at minimum:
- application startup and primary Workspace flow;
- Explorer reorder and canvas reorder;
- ordered rendering after reorder;
- Add Section at multiple insertion positions;
- registry-driven component choices;
- unique identity/default content on insertion;
- duplicate independence;
- hide/show behavior in Edit and Preview;
- delete + immediate Undo;
- Undo after reorder/add/duplicate/hide where supported by the common structural action model;
- content editing still works after structural mutations;
- global design settings still propagate;
- no new runtime/console errors;
- automated state/store tests for structural actions;
- Studio v3 reference remains available.

Architecture Review will prioritize structured-state correctness, recoverability, workflow simplicity and scope discipline over polished drag-and-drop animation.

## Deliverables Expected After Implementation
1. Repository implementation changes.
2. Milestone 03 implementation note.
3. Files changed list.
4. Updated Page/Component Instance/store contract documentation.
5. Component Definition insertion/default-content contract documentation.
6. Structural-action/Undo contract documentation.
7. Functional validation/test results.
8. Known limitations and intentionally deferred capabilities.
9. Architecture questions discovered during implementation rather than silently expanding scope.

## Architecture Freeze
The frozen scope is current-page structural editing only: reorder, registry-driven Add Section, duplicate, hide/show, reversible delete, and immediate one-level Undo. Later Stage 2 and Library capabilities require separate Architecture authorization.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 03 — Page Structure Actions** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Implement only the authorized current-page structural editing actions. Preserve the Milestone 01–02 object, registry, structured-content, selection, Context Panel and Edit/Preview boundaries. Validate every functional success criterion and return the completed milestone to Architecture for `Review`.

## Builder Implementation Result

- Status: Implemented; pending Architecture review.
- Functional validation: eight store/model/registry tests, JavaScript parsing, live HTTP startup/assets, Framework integrity, and v3 baseline preservation passed.
- Release note: Added registry-driven insertion defaults, Explorer/canvas reorder controls, Add Section, Duplicate, Hide/Show, Delete, and immediate one-level Undo through the centralized structural state boundary. See `docs/implementation/studio-4-m03.md`.
