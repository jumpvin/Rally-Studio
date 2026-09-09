---
milestone-id: studio-4-m10-executable-page-templates
mode: implementation
status: implemented
baseline: 1aa46a471dd112798877424eb969925cbb745f31
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m10-executable-page-templates.md
  - package.json
affected-surfaces:
  - Executable Library Page Templates
  - Page Template resolution and instantiation
  - Create Page from Template workflow
  - Page-template transaction/history integration
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 10

## Title
Executable Page Templates

## Objective
Make the Page Template level of the Studio composition hierarchy executable by allowing a Certified Library Page Template to create one complete ordinary Page containing normal Component Instances.

This milestone builds directly on executable Compositions and multi-page Website ownership. A Page Template is a reusable page recipe, not a persistent runtime wrapper or alternate Page model.

## Scope
Implement:
1. A clear executable Page Template Library contract.
2. At least three Certified executable Page Templates representing useful page purposes.
3. Page Template resolution/validation before mutation.
4. Create Page from Template from the Page-first Workspace flow.
5. Optional template selection when creating a new Page, while preserving Blank Page as an explicit option.
6. Template instantiation into one normal Page plus normal Component Instances with fresh identities.
7. Template members that may reference executable Compositions and/or individual Component Definitions.
8. Deterministic Page name/slug creation using the existing Milestone 09 rules.
9. One atomic document transaction for creating a Page from a template.
10. Undo/Redo that removes/restores the entire generated Page and its Component Instances atomically.
11. Provenance metadata sufficient to identify the source Page Template/version without creating a live dependency.
12. Tests covering template validation, expansion, identity, history and independence.

## Page Template Contract
A Library item representing an executable Page Template must be a `composition`-family/page-template object using the existing Library type model or a clearly compatible refinement of it. Do not introduce a second unrelated Library registry.

The payload must declaratively define, at minimum:
- executable page-template intent/type;
- default/recommended page name or purpose;
- ordered members;
- each member as either:
  - a Component Definition reference with optional variant/content/responsive seed overrides; or
  - an executable Composition reference.

Builder may refine the existing `composition` payload with a `kind: 'page-template'`/equivalent discriminator if that preserves the established Library hierarchy. Do not add a new top-level Library type solely because the current enum used `composition` for both compositions and page templates.

## Resolution Rules
Template resolution must happen completely before document mutation.

Resolver must validate:
- Library item exists;
- item is Certified;
- item is executable as a Page Template;
- every direct component reference resolves through the Component Registry;
- every referenced Composition is Certified and executable;
- all explicit variants are valid;
- content overrides can be safely applied to cloned defaults;
- nested Composition expansion is flattened into the Page's final ordered Component Instance recipe;
- malformed/cyclic template/composition references fail safely before mutation.

Composition nesting beyond Page Template -> Composition -> Component is not required. If recursive composition references are unsupported, reject them clearly rather than silently partially expanding.

## Instantiation Semantics
Creating a Page from a template must:
1. resolve the entire template first;
2. create one fresh Page ID;
3. create fresh Component Instance IDs for every expanded member;
4. deep-clone content/responsive data;
5. create a unique slug through the existing slug rule;
6. append or insert the Page at the intended Website position;
7. set the new Page active after successful creation;
8. record the whole operation as one meaningful history transaction.

After creation, the Page and its Component Instances are ordinary Studio document objects. They must not require the source template to continue rendering/editing.

## Provenance
Generated Page metadata may retain non-authoritative source information such as:
- `sourceLibraryItemId`;
- `sourceLibraryVersion`.

Generated Component Instances may retain their existing composition/component provenance where useful.

Editing the generated Page must not mutate the Library template. Future changes to the template must not automatically rewrite existing Pages.

## Seed Page Templates
Provide at least three Certified templates with distinct purposes, for example:
- Home / Service Business Home;
- About / Company Story;
- Contact / Lead Capture.

Use the component/composition inventory currently available. The templates need to prove architecture, not represent the final Rally production template catalog.

At least one template must reuse an executable Composition and at least one must combine a Composition with an additional direct Component Definition reference.

## Create Page UX
Evolve the existing `+ Page` flow so the user can choose:
- **Blank Page**; or
- a Certified Page Template.

The flow should remain opinionated and fast. Certified templates are the normal curated choices; Specialty/Experimental/Deprecated/Archived templates are not shown in the default production chooser.

When a template is selected, show enough information to understand its purpose and section structure before creation. Do not build a full visual template marketplace in this milestone.

## History
Create Page from Template is one transaction.

Undo must remove:
- the generated Page;
- every Component Instance created for it;
- Website Page reference/order changes.

Redo must restore the same generated Page/Component identities and content.

Page switching caused by successful creation remains transient Workspace navigation and should reconcile safely after Undo/Redo.

## Explicitly Out of Scope
Do not implement:
- Starter Package execution;
- whole-site assembly;
- Blueprint execution;
- Discovery/recommendation-driven template selection;
- Library authoring/promotion/version publishing;
- live-linked Page Templates;
- updating existing Pages from template changes;
- nested/global/shared sections;
- navigation-menu authoring;
- SEO metadata/routing beyond existing slug behavior;
- redirects;
- persistence/database infrastructure;
- Organizations/Projects/Portal/Strategy Packet;
- deployment/hosting/production editing;
- AI/recommendation engine;
- later roadmap systems.

## Success Criteria
1. Milestones 01–09 behavior remains intact.
2. Library can distinguish executable Page Templates from ordinary executable Compositions without introducing a parallel Library system.
3. At least three Certified Page Templates exist.
4. Template resolver validates the complete recipe before mutation.
5. Template may reuse an executable Composition.
6. Template may include direct Component Definition members.
7. Invalid component/composition/variant/template references fail before mutation.
8. Creating from template produces one normal Page and ordered normal Component Instances with fresh stable identities.
9. Page name and slug follow existing deterministic rules and avoid collisions.
10. New Page becomes active after successful creation.
11. Generated content/variant/responsive state matches resolved template defaults/overrides.
12. Generated Page remains fully editable with existing content, variant, responsive, structural and history tools.
13. Editing generated Page does not mutate Library source objects.
14. Generated Page can render/edit after source template is unavailable in a test fixture, proving no live runtime dependency.
15. Create Page from Template is one history transaction.
16. Undo/Redo atomically removes/restores the Page and all generated instances.
17. Blank Page creation remains available.
18. Default chooser shows Certified templates without clutter from non-production lifecycle states.
19. Automated tests cover resolution, flattening, invalid references, identity independence, slug collision, atomic history and prior milestone regression.
20. No Starter Package/site assembly/later-stage system is partially implemented.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- Blank Page creation still works;
- create each Certified Page Template;
- template using Composition expansion;
- template mixing Composition + direct Component;
- resulting page order and content;
- unique Page and Component identities across repeated instantiation;
- duplicate template creation with slug collision resolution;
- edit generated content/variant/responsive state;
- structural edits on generated Page;
- Undo/Redo atomic page creation;
- failure-before-mutation for malformed template/member/variant;
- no Library mutation from generated-page editing;
- no runtime dependency on source template after instantiation;
- global Design Settings remain shared across generated Pages;
- transaction history remains coherent;
- no new runtime errors;
- Studio v3 remains preserved.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 10 implementation note;
3. Page Template Library contract documentation;
4. resolver/flattening semantics;
5. instantiation/provenance semantics;
6. Create Page chooser behavior;
7. functional tests/validation results;
8. known limitations;
9. Architecture questions instead of silent scope expansion.

## Architecture Freeze
The frozen scope is Certified executable Page Templates that instantiate one independent normal Page from declarative Component/Composition recipes. Starter Packages and whole-site assembly remain explicitly deferred.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 10 — Executable Page Templates** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Add Certified declarative Page Templates, resolve/flatten them through the existing Library/Composition/Component Registry boundaries, evolve Create Page to offer Blank or curated templates, instantiate one ordinary independent Page atomically with history, preserve Milestones 01–09 architecture, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.

## Implementation Evidence

- Status: `implemented`; Architecture acceptance is not claimed.
- Functional suite: 37/37 automated tests passed.
- Framework integrity: passed with no failures.
- Live scenario: Company Story resolved Composition plus direct Component members into one active Page with one history entry and no runtime errors.
- Implementation note: `docs/implementation/studio-4-m10.md`.
- Release note: Added three Certified executable Page Templates, bounded recipe flattening, curated Blank/Template Page creation, independent provenance, and atomic template-page history.
