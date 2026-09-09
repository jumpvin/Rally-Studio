---
milestone-id: studio-4-m07-library-registry-lifecycle
mode: implementation
status: active
baseline: 14284f1ac986687a32a1558fff2957ed56a2e5aa
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m07-library-registry-lifecycle.md
  - package.json
affected-surfaces:
  - Studio Library registry
  - Library object typing
  - Library lifecycle/maturity state
  - Component-definition/library integration seam
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 07

## Title
Library Registry & Object Lifecycle

## Objective
Begin Stage 3 by introducing a typed Studio Library that can organize reusable design/build objects without replacing the approved Component Definition/Instance architecture from Milestones 01–06.

Milestone 07 establishes the Library as a catalog/knowledge layer over reusable Studio objects. It does not yet implement Starter Package assembly, Page Templates, Blueprints, save-from-project promotion workflows, or full library authoring.

## Scope
Implement a functional Library foundation containing:
1. A typed Library Item contract.
2. Library item types for at least `token`, `component`, `composition`, `blueprint`, and `starter-package`.
3. Lifecycle/maturity state supporting at least `certified`, `specialty`, `experimental`, `deprecated`, and `archived`.
4. Stable Library item identity and version identity metadata sufficient for future versioning.
5. Search/filter/list operations by type, lifecycle state, tags/categories, and text/name.
6. A small internal Library browser surface that demonstrates browsing/filtering without becoming a full authoring application.
7. Registration/adaptation of the existing Hero, Services, and CTA Component Definitions as Library `component` items while keeping the existing Component Registry as the runtime rendering authority.
8. At least one representative seed object for each non-component type so the type hierarchy is exercised without yet making those objects executable.
9. Visibility rules so normal/default browsing prioritizes Certified items while Specialty/Experimental/Deprecated/Archived items remain discoverable intentionally.
10. Functional tests for typing, lifecycle validation, filtering/search, stable identities, and Component Definition integration.

## Required Architecture
### Library is not runtime rendering
The existing Component Registry remains responsible for resolving executable Component Definitions and variants at runtime.

The Library is a higher-level catalog/knowledge layer. A Library component item may reference/adapt a registered Component Definition by stable type/definition identity, but it must not duplicate or fork the renderer/content/variant contract into a second implementation source of truth.

### Library item contract
Each Library item must have structured metadata equivalent to:
- stable `id`;
- `type`;
- display `name`;
- lifecycle/maturity `status`;
- version identity/version number or equivalent future-compatible field;
- tags/categories;
- short description/purpose;
- provenance/source metadata sufficient to distinguish seeded/default knowledge from future project-derived objects;
- type-specific payload/reference.

Exact field names are Builder-owned.

### Object types
The Library must recognize the approved hierarchy:
- Token
- Component
- Composition / Page Template
- Blueprint
- Starter Package

For Milestone 07 only Component items need to be executable/integrated with the current Workspace. Other types may use clearly structured placeholder payloads that prove the future contract without implementing assembly behavior.

### Lifecycle semantics
Support these states:
- `certified`: default/proven objects appropriate for common workflow exposure;
- `specialty`: useful niche/custom objects intentionally kept out of the default workflow;
- `experimental`: not yet approved for normal production use;
- `deprecated`: retained for compatibility/history but should not be offered by default;
- `archived`: retained but normally hidden from active discovery.

The system may support aliases/display labels such as “Default/Certified” or “Specialty/Custom,” but machine state should be stable and explicit.

### Default workflow hygiene
The architecture must preserve the principle that expanding the Library should not clutter normal Studio workflow.

Therefore:
- the default Library view should prioritize/show Certified active items;
- Specialty and Experimental require intentional filtering/discovery;
- Deprecated and Archived are excluded from normal Add Section discovery;
- current Add Section behavior should continue to expose appropriate production-ready registered components without suddenly listing every Library object.

### Component integration
Adapt the current registered Hero, Services, and CTA definitions into Library Component items.

Requirements:
- Library identity remains distinct from Component Instance identity;
- runtime rendering still uses the Component Registry;
- Library metadata may reference the component definition type;
- Add Section may read Certified Library component metadata if that can be done cleanly, but must ultimately resolve insertion through the existing registry/default-content contract;
- changing Library metadata must not silently alter existing Component Instance content.

## Library Browser UX
Add a compact internal Library surface reachable from Studio Edit Mode.

It should demonstrate:
- search;
- type filtering;
- lifecycle/status filtering;
- tags/category display or filtering;
- item cards/rows with name, type, lifecycle, version and short description;
- clear distinction between normal Certified objects and less-common states.

This is a browsing/inspection milestone. Do not build a complex editor or publishing workflow.

## Seed Data
At minimum seed:
- Hero as Certified Component;
- Services as Certified Component;
- CTA as Certified Component;
- one representative Token;
- one representative Composition/Page Template;
- one representative Blueprint;
- one representative Starter Package;
- at least one Specialty or Experimental item to prove default filtering behavior;
- at least one Deprecated or Archived item to prove suppression/discovery rules.

Seeds are contract examples, not final production library breadth.

## Explicitly Out of Scope
Do not implement:
- project-to-library save/promote workflow;
- Certified promotion approval/version workflow;
- Library item editing/authoring UI beyond any minimal seed/debug controls absolutely required;
- executable Composition/Page Template assembly;
- executable Blueprint behavior;
- Starter Package site assembly;
- recommendation engine;
- usage/instance inventory across sites;
- selective library upgrades on existing sites;
- multi-page site management;
- persisted database Library;
- remote/shared team library sync;
- comments/review/approval;
- Organizations/Projects/Discovery/Portal;
- deployment/hosting;
- AI/recommendations;
- later roadmap systems.

## Success Criteria
1. Milestones 01–06 behavior remains intact.
2. Studio has one explicit typed Library registry/catalog boundary.
3. Library validates supported types and lifecycle states.
4. Library items have stable IDs plus future-compatible version/provenance metadata.
5. Search and filters work by text/name, type, lifecycle, and tags/categories.
6. Default browsing exposes Certified active items without clutter from Specialty/Experimental/Deprecated/Archived objects.
7. Specialty/Experimental objects are discoverable intentionally.
8. Deprecated/Archived objects remain inspectable but are excluded from normal production discovery/default Add Section behavior.
9. Hero, Services, and CTA exist as Library Component items that reference/adapt the current Component Definitions without duplicating runtime renderer/content logic.
10. Existing Add Section remains registry-safe and only inserts appropriate executable component definitions.
11. Non-component seed types exist as structured Library items but do not accidentally become executable builder objects.
12. Library metadata changes do not mutate existing Component Instance content/state.
13. Library Browser demonstrates search/filter/status/type browsing in Edit Mode.
14. Preview remains free of Library editing chrome.
15. Transaction/history architecture does not record mere Library browsing/filtering as document edits.
16. Automated tests cover type/status validation, search/filtering, default visibility, stable identity, component-definition linking, and prior milestone regression behavior.
17. No Starter Package/composition assembly or promotion workflow is partially implemented.

## Validation
Validation level: **functional**.

Builder must validate:
- Studio startup;
- Library seed registration;
- default Certified view;
- intentional Specialty/Experimental discovery;
- Deprecated/Archived suppression and explicit inspection;
- type/status/tag/text filtering;
- Hero/Services/CTA linkage to existing registry definitions;
- Add Section still inserts executable components through the existing registry/default contract;
- Library browsing does not create Workspace document-history entries;
- Preview hides Library UI;
- automated tests and no new runtime errors;
- Framework integrity and Studio v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 07 implementation note;
3. Library Item/type/lifecycle contract documentation;
4. Component Registry ↔ Library integration seam documentation;
5. seed inventory;
6. validation/test results;
7. known limitations;
8. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is a typed, browsable Library catalog and lifecycle model plus safe linkage of existing executable Component Definitions. Composition execution, Starter Package assembly, project promotion and library version workflows require later milestones.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 07 — Library Registry & Object Lifecycle** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Introduce the typed Library catalog/lifecycle boundary, adapt existing component definitions into Certified Library items without duplicating runtime logic, add the compact internal Library browser, preserve Milestones 01–06 architecture and history behavior, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.