---
milestone-id: studio-4-m05-responsive-preview-overrides
mode: implementation
status: active
baseline: fc7fcd7c03b190928a078edf42b0c48f6c3b62c1
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m05-responsive-preview-overrides.md
  - package.json
affected-surfaces:
  - Responsive preview modes
  - Component responsive behavior
  - Constrained instance-level responsive overrides
  - Context Panel responsive controls
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 05

## Title
Responsive Preview & Constrained Overrides

## Ownership
- Architecture owner: Rally Site Studio Architecture Chat
- Implementation owner: Rally Site Studio Build Chat
- Repository: `jumpvin/Rally-Studio`
- Authorized branch: `master`
- Release target: `4.0.0`
- Approved foundation: Milestones 01–04

## Objective
Complete the first responsive-editing slice of the Website Workspace by making responsive behavior system-owned by default while allowing bounded instance-level exceptions where designers genuinely need them.

Studio should not encourage building three independent versions of a page. Certified/registered components remain responsible for their responsive presentation; the user previews the page at Desktop, Tablet and Mobile sizes and may apply only approved local exceptions.

## Scope
Implement a functional vertical slice containing:
1. Explicit Desktop, Tablet and Mobile preview controls in the Website Workspace.
2. Responsive canvas sizing that visually represents each device class without rebuilding page/component state.
3. Definition/variant responsive behavior that works by default with no instance override required.
4. A structured `responsiveOverrides` boundary on Component Instances or an equivalent explicit structured representation separate from normal content and variant identity.
5. Context Panel responsive controls for a bounded set of approved override types.
6. At minimum support these responsive exception classes where the selected definition declares them valid:
   - visibility/hide on a device class;
   - stack/order preference or equivalent layout direction choice;
   - alignment choice;
   - one approved spacing adjustment;
   - optional shorter heading/text override for Mobile;
   - image crop/focal-point metadata only if the current seed component has an image surface that can support it without inventing a media system.
7. Component Definition metadata declaring which responsive override capabilities are supported by each definition/variant.
8. A clear distinction in the Context Panel between inherited automatic responsive behavior and explicit local overrides.
9. Ability to clear an override and return to automatic/default responsive behavior.
10. Functional validation showing content, variants, structural actions and global Design Settings continue to work across all preview sizes.

## Architecture Principles
### Automatic first
Responsive behavior belongs primarily to registered Component Definitions/Variants and CSS/layout rules. A newly inserted component must look reasonable at Desktop, Tablet and Mobile without any user intervention.

### Overrides are exceptions, not alternate designs
`responsiveOverrides` must contain only explicit deviations from default behavior. Do not copy entire content/design state into per-device blobs.

Desktop, Tablet and Mobile are preview/device classes, not three independent page documents.

### Capability-driven controls
Responsive controls should be driven by definition/variant metadata where practical. A component should expose only override categories that make sense for it.

Do not build a generic unrestricted CSS editor or arbitrary breakpoint property editor.

### Content integrity
Normal structured content remains authoritative. A Mobile-shortened heading, where supported, is an explicit override layered on top of the normal heading and must not destroy the normal content value.

### Variant integrity
Responsive overrides belong to the Component Instance. Where an override is incompatible with a selected variant, the system should either ignore/disable it clearly or validate compatibility. Do not silently reinterpret incompatible override values.

## Required UX Behavior
### Device preview
Provide clear Desktop / Tablet / Mobile controls in the Workspace toolbar. Switching device class changes only the preview viewport/context; it does not duplicate state, create new pages, or change Edit/Preview mode.

Recommended approximate preview widths may be chosen by Builder; Architecture requires stable named device classes, not exact pixel values.

### Context Panel
When a component is selected in Edit Mode, a Responsive section should:
- state that responsiveness is automatic by default;
- show only allowed overrides for the selected definition/variant;
- identify which override values are currently explicit;
- provide a straightforward Reset/Clear action per override or for the selected device class.

### Visibility
If hidden for the currently previewed device, the component should remain discoverable/manageable in Edit Mode through the Explorer and an editing placeholder/marker, but should be omitted from clean Preview Mode for that device.

### Mobile content override
Where supported, a shorter Mobile heading/text can be supplied without modifying the canonical content. Clearing it returns rendering to canonical content.

### Layout overrides
Stack/order/alignment/spacing controls must use predefined allowed values. No freeform CSS strings.

## State / Definition Contract
Builder may choose exact names, but the architecture should support concepts equivalent to:

Component Definition / Variant metadata:
- `responsiveCapabilities`
- allowed values per override category
- default behavior remains inside component/variant rendering/CSS

Component Instance:
- `responsiveOverrides.desktop?`
- `responsiveOverrides.tablet?`
- `responsiveOverrides.mobile?`

Only explicit exceptions should be stored.

Store/state boundary should provide centralized operations equivalent to:
- `setPreviewDevice(device)`;
- `setResponsiveOverride(instanceId, device, key, value)`;
- `clearResponsiveOverride(instanceId, device, key?)`.

Exact APIs are Builder-owned.

## Explicitly Out of Scope
Do not implement in Milestone 05:
- arbitrary custom breakpoints;
- unrestricted CSS/property overrides;
- separate per-device page/component trees;
- a full media/image asset manager solely to support focal-point controls;
- site-wide responsive presets or responsive Library authoring;
- multi-page management;
- full Design Lens redesign;
- persistent Version History or multi-level Undo/Redo;
- Comments/review/approval;
- Library, Starter Packages, Compositions, Blueprints or recommendation engine;
- Organizations, Projects, Discovery, Strategy Packet or Client Portal;
- deployment/hosting/production editing;
- final persistence/database infrastructure;
- authentication/capability system;
- later roadmap work.

## Success Criteria
Milestone 05 is successful when all of the following are true:
1. Milestones 01–04 behavior remains intact.
2. Desktop, Tablet and Mobile preview classes are explicit and switch without rebuilding/duplicating page state.
3. Registered seed components render reasonably at all three device classes before any overrides are applied.
4. Component Definitions/Variants declare supported responsive override capabilities rather than the UI exposing every override to every component.
5. Component Instances store only explicit responsive exceptions in structured state.
6. At least two representative component types demonstrate responsive override capability.
7. Visibility override works per device class while preserving Edit-mode manageability through Explorer/placeholder behavior.
8. At least one bounded layout override (stack/order/alignment/spacing) works and uses predefined allowed values.
9. A Mobile-specific shorter text/heading override works for at least one representative component without altering canonical content.
10. Clearing responsive overrides returns rendering to automatic component behavior.
11. Switching component variants preserves compatible instance responsive overrides and handles incompatible controls clearly rather than corrupting state.
12. Structural actions—move, add, duplicate, hide/show, delete/Undo—continue to work with responsive override state preserved appropriately.
13. Duplicate deep-copies responsive override state rather than sharing mutable references.
14. Preview Mode contains no responsive editing chrome, while device preview selection remains usable as a viewing tool.
15. Global Design Settings inheritance remains functional at all preview sizes.
16. No per-device duplicate page/content trees or unrestricted CSS editor is introduced.
17. Builder supplies functional tests/validation for preview device state, override mutation/clearing, content preservation, visibility behavior, duplication and variant regression.
18. Studio v3 reference material remains preserved.

## Validation
Validation level: **functional**.

Builder must verify at minimum:
- startup and primary Workspace flow;
- Desktop/Tablet/Mobile switching;
- default responsive behavior for Hero, Services and CTA across device classes;
- supported responsive controls appear only where declared;
- per-device visibility override in Edit and Preview;
- one bounded layout override;
- Mobile shortened heading/text override with canonical-content preservation;
- clear/reset behavior;
- variant switching with compatible/incompatible responsive capabilities;
- duplication and one-level structural Undo preserve responsive data correctly;
- Add Section starts with no unnecessary explicit responsive overrides;
- global Design Settings still propagate;
- no new runtime/console errors;
- automated state/contract tests;
- Studio v3 reference remains available.

Architecture Review will prioritize automatic-first responsive architecture, constrained override boundaries, state integrity and UX clarity over pixel-perfect device simulation.

## Deliverables Expected After Implementation
1. Repository implementation changes.
2. Milestone 05 implementation note.
3. Files changed list.
4. Responsive capability metadata contract documentation.
5. Component Instance responsive override state contract documentation.
6. Preview-device/store interaction documentation.
7. Functional validation/test results.
8. Known limitations and intentionally deferred responsive capabilities.
9. Architecture questions discovered during implementation rather than silently expanding scope.

## Architecture Freeze
The frozen scope is responsive preview plus constrained instance-level responsive exceptions. Automatic component responsiveness remains the default. Arbitrary device-specific redesigns and later roadmap systems require separate Architecture authorization.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 05 — Responsive Preview & Constrained Overrides** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Preserve the Milestone 01–04 object, content, variant, structural editing and Undo boundaries. Implement only the authorized responsive preview and constrained override capabilities, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.