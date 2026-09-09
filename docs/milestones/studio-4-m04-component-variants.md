---
milestone-id: studio-4-m04-component-variants
mode: implementation
status: active
baseline: 65d89d39d131b52bd79f7849b87d4c9b8cb99fa4
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m04-component-variants.md
  - package.json
affected-surfaces:
  - Component Definition variant contract
  - Component Instance variant state
  - Context Panel variant controls
  - Live variant switching with content preservation
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 04

## Title
Component Variants

## Ownership
- Architecture owner: Rally Site Studio Architecture Chat
- Implementation owner: Rally Site Studio Build Chat
- Repository: `jumpvin/Rally-Studio`
- Authorized branch: `master`
- Release target: `4.0.0`
- Approved foundation: Milestones 01–03

## Objective
Add safe presentation variants to registered components while preserving the Studio 4 principle that content is independent from presentation.

Milestone 04 proves that a selected Component Instance can switch among approved variants in the Context Panel and live canvas without losing or re-entering content, changing the Component Definition type, or breaking global Design Settings inheritance.

This milestone implements variants only. It does not implement the full Library, responsive overrides, or multi-page/site assembly.

## Scope
Implement a functional vertical slice containing:
1. A Component Definition variant contract.
2. A selected/default variant identity for each Component Instance where variants are supported.
3. At least two meaningful variants for Hero and one additional registered component.
4. Context Panel controls for previous/next and direct variant selection.
5. Live variant switching on the canvas using the existing instance content.
6. Content preservation across repeated variant switches.
7. Design Settings inheritance across every supported variant.
8. Default-variant behavior for newly inserted components from Milestone 03.
9. Safe handling when a definition has only one variant.
10. Functional tests for variant selection, content preservation, and invalid variant rejection.

## Required Architecture
### Content remains presentation-independent
Component Instance `content` remains the canonical content payload. Variants must render from the same structured content rather than maintain separate copies of content per variant.

Switching variants must not rewrite or discard content merely because a field is not shown by a particular variant.

### Variant identity
A Component Instance may hold a `variantId` or equivalent presentation-selection field separate from its `definitionType` and `content`.

The Component Definition owns the list of supported variants and the default/recommended variant.

### Registry/definition contract
Extend the existing Component Definition contract so each supported variant has stable metadata sufficient to:
- identify the variant;
- label it in the UI;
- render the same structured content using that presentation;
- optionally declare which existing content fields it uses.

Exact API shape is Builder-owned, but variant support must remain definition-driven rather than hard-coded in the page UI.

### Rendering
The renderer resolves:
`Component Instance -> Component Definition -> selected Variant -> render(content, designSettings)`.

Do not duplicate component definitions merely to simulate variants.

### Default-first behavior
Newly inserted components continue to use the recommended/default presentation automatically. The user should not be forced into a variant chooser before insertion.

### State boundary
Variant changes must go through a centralized Studio state/store method or equivalent command boundary and validate that the selected variant belongs to the instance's definition.

## Required UX Behavior
### Context Panel
For a selected component with multiple variants, show a compact Variant area containing:
- current variant name;
- previous/next controls;
- direct selection from available variants.

This control should be visually secondary to content editing but easy to discover.

### Live cycling
Changing variant updates the actual website canvas immediately using the current project content and Design Settings.

The expected flow is:
**insert/use recommended variant -> edit real content -> cycle alternatives -> choose preferred presentation**.

### Single-variant components
Definitions with one variant must continue rendering normally without awkward disabled controls. The Variant area may be omitted or shown as read-only.

### Preview Mode
Preview renders the selected variant cleanly with no variant-editing chrome.

## Representative Variant Coverage
At minimum:
- Hero: at least 3 total presentations, including the existing default.
- One additional component (Services or CTA): at least 2 total presentations.

Variants should be meaningfully different compositions, not tiny cosmetic differences that belong in Design Settings.

## Explicitly Out of Scope
Do not implement in Milestone 04:
- Full Library UI or library lifecycle/maturity.
- Save custom variant to Library or promote to Certified.
- User-authored arbitrary variants.
- Starter Packages, Page Templates, Compositions or Blueprints.
- Multi-page management.
- Responsive per-device overrides.
- Full Version History or persistent Undo/Redo.
- Comments/review/approval.
- Full Design Lens redesign.
- Organizations, Projects, Discovery, Strategy Packet or Client Portal.
- Deployment, hosting or production editing.
- Authentication/capability system.
- Final persistence/database infrastructure.
- Automatic implementation of later roadmap work.

## Success Criteria
Milestone 04 is successful when all of the following are true:
1. Milestones 01–03 behavior remains intact.
2. Component Definitions expose stable variant metadata through the registry contract.
3. Component Instances can persist a valid selected variant independently from content.
4. Hero supports at least three meaningful presentations.
5. At least one additional component supports at least two meaningful presentations.
6. Variant controls are driven by definition metadata rather than hard-coded per seed instance.
7. Changing a variant immediately re-renders the selected instance.
8. Repeated variant switching preserves all structured content values.
9. Content edited before switching is still present when returning to a prior variant.
10. Global Design Settings continue to apply across every supported variant.
11. Newly inserted components use the definition's recommended/default variant automatically.
12. Invalid/unknown variant identities are rejected by the centralized state boundary.
13. Single-variant components continue to function without broken UI.
14. Preview Mode renders the chosen variant without editing controls.
15. Add/duplicate/hide/delete/reorder/Undo from Milestone 03 remain functional with variant-aware instances.
16. Duplicate preserves the source variant while remaining an independent instance.
17. Undo of structural actions restores variant state as part of the instance snapshot where applicable.
18. Studio v3 reference material remains preserved.
19. No out-of-scope Library, responsive, multi-page, history, or later-roadmap systems are partially implemented.

## Validation
Validation level: **functional**.

Builder must verify at minimum:
- startup and Workspace render;
- Hero variant cycling and direct selection;
- secondary-component variant switching;
- content preservation through repeated switches;
- Context Panel content editing before/after switches;
- Design Settings propagation across variants;
- Add Section inserts default variant;
- Duplicate preserves variant and content independently;
- structural reorder/hide/delete/Undo still works;
- invalid variant rejection;
- Preview Mode cleanliness;
- automated state/registry tests for variant contracts;
- no new runtime/console errors;
- Studio v3 reference remains available.

Architecture Review will prioritize content/presentation separation, registry correctness, and interaction simplicity over final variant visual polish.

## Deliverables Expected After Implementation
1. Repository implementation changes.
2. Milestone 04 implementation note.
3. Files changed list.
4. Updated Component Definition/Registry variant contract documentation.
5. Updated Component Instance/state contract documentation.
6. Functional validation/test results.
7. Known limitations and intentionally deferred variant/library capabilities.
8. Architecture questions discovered during implementation rather than silently expanding scope.

## Architecture Freeze
The frozen scope is approved presentation variants for existing registered components: definition-driven variant metadata, instance variant selection, live cycling/direct selection, default variant insertion, and content preservation. Later Library and responsive capabilities require separate Architecture authorization.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 04 — Component Variants** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Implement only approved definition-driven component variants and preserve the Milestone 01–03 object, registry, content, selection, structural editing and Undo boundaries. Validate every functional success criterion and return the completed milestone to Architecture for `Review`.