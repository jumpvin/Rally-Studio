---
milestone-id: studio-4-m08-executable-compositions
mode: implementation
status: active
baseline: 2785fb9607197dcd52851d698da867bbc2cc9742
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m08-executable-compositions.md
  - package.json
affected-surfaces:
  - Executable Library compositions
  - Composition-to-component instantiation
  - Add Composition workflow
  - Composition transaction/history integration
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 08

## Title
Executable Compositions

## Objective
Make Library Composition objects executable as declarative reusable groups of existing Component Definitions. Instantiating a Composition must create ordinary Component Instances in the current Page, preserving the single Studio page/runtime/history model established in Milestones 01–07.

A Composition is not a second renderer, nested page tree, or live linked group. It is a reusable recipe that expands into normal page Component Instances at insertion time.

## Scope
Implement:
1. An executable Composition payload contract in the Library.
2. At least two Certified executable Composition seeds built from existing registered components.
3. Validation that composition members reference valid executable Component Definitions and valid variants where specified.
4. Definition/default-content resolution for each composition member.
5. Optional composition-provided content overrides/templates layered onto definition defaults without changing the Component Definition itself.
6. An Add Composition workflow in Edit Mode, discoverable from the existing Library or Add Section experience.
7. Instantiation at a requested Page insertion index.
8. Unique stable Component Instance IDs for every expanded member.
9. One transaction/history entry for the composition insertion as a single user action.
10. Undo/Redo restoring/removing the whole inserted composition atomically.
11. After instantiation, every generated Component Instance behaves exactly like manually inserted instances: selectable, editable, reorderable, variant-aware, responsive-aware, duplicable, hideable and deletable.
12. No persistent runtime grouping dependency is required after insertion.

## Composition Payload Contract
A Composition Library item must carry an ordered declarative member list. Each member requires at minimum:
- `definitionType`;
- optional `variantId`;
- optional structured `content` override/template;
- optional responsive override seed only if already valid under the referenced definition/variant capabilities.

The concrete shape is Builder-owned, but Library validation must be able to distinguish malformed composition payloads from valid executable ones.

Example conceptual shape:

```js
{
  members: [
    { definitionType: 'hero', variantId: 'split', content: { eyebrow: '...' } },
    { definitionType: 'services' },
    { definitionType: 'cta' }
  ]
}
```

Do not store pre-rendered HTML or renderer functions in the Composition Library item.

## Runtime Resolution
At insertion time:
1. Resolve the Composition from the Library.
2. Validate it is executable and allowed by lifecycle rules.
3. Resolve each member through the Component Registry.
4. Select explicit member variant if provided; otherwise use the definition default variant.
5. Deep-clone definition default structured content.
6. Deep-merge or otherwise safely apply composition member content overrides without mutating registry defaults or Library records.
7. Create normal Component Instances with fresh stable IDs.
8. Insert their IDs into `Page.componentInstanceIds` in declared order at the requested insertion position.

## Lifecycle Rules
For this milestone:
- Certified compositions are available by default in Add Composition.
- Specialty compositions may be discoverable only through explicit filtering/library browsing.
- Experimental/Deprecated/Archived compositions must not appear in the default insertion workflow.
- Deprecated/Archived compositions remain inspectable in the Library but are not insertable through normal production flow.

No promotion/editing workflow is implemented here.

## Content Ownership
Once instantiated, generated Component Instance content belongs to the Page/project. Later changes to the originating Composition Library item must not retroactively change already-instantiated instances.

The Composition may optionally stamp non-authoritative provenance metadata such as `sourceLibraryItemId` / `sourceLibraryVersion` on generated instances or history metadata, but page rendering/editing must not depend on the source composition remaining present.

## UX
Provide a simple `Add Composition` path that does not clutter the default single-section Add flow.

Acceptable approaches include:
- a second tab in the Add chooser (`Sections | Compositions`), or
- an `Add Composition` action inside the Library drawer.

The chooser/card should show Composition name, description, lifecycle/status, and a concise preview of included section types/order. Selecting it inserts the full group immediately at the chosen position.

After insertion, select the first generated instance or otherwise place the user in a sensible editing state.

## Transaction / History Integration
Composition insertion is one meaningful user action and therefore one history transaction, even though it creates several Component Instances.

Requirements:
- one history entry labeled meaningfully (for example `Add composition: Service business home`);
- Undo removes all instances created by that composition insertion and restores prior Page order;
- Redo restores the same logical insertion atomically with valid stable identities according to the existing history semantics;
- no extra history entries are emitted for the internal member creation steps.

Subsequent edits to individual generated instances create normal independent history entries.

## Seed Compositions
At minimum provide two useful Certified examples using existing Hero/Services/CTA capabilities, such as:
1. **Service Business Home Core** — Hero -> Services -> CTA.
2. **Lead Generation Intro** — a different approved Hero variant -> CTA, or Hero -> Services with different content overrides.

They must demonstrate:
- default variant resolution;
- at least one explicit variant selection;
- at least one safe structured content override.

These remain architecture/test seeds, not the final production starter catalog.

## Validation and Failure Handling
Composition execution must fail safely before mutating Page state when:
- Library item does not exist;
- item type is not `composition`;
- lifecycle state is not allowed for normal insertion;
- member references unknown Component Definition;
- member references unknown variant;
- member content shape cannot be safely applied where validation exists.

Do not partially insert the first members and then fail on a later member.

## Explicitly Out of Scope
Do not implement:
- Composition authoring/editing UI;
- saving current page selections as a Composition;
- Library promotion/version publishing workflow;
- live-linked or nested Composition instances;
- per-composition renderer logic;
- composition-level editing after insertion;
- Starter Package execution;
- Page Template execution as a distinct concept beyond Composition metadata;
- Blueprints execution;
- multi-page creation/management;
- Starter Package/site assembly;
- usage inventory across the whole Website;
- persistent database/shared Library;
- Organizations/Projects/Discovery/Portal;
- comments/review/approval;
- deployment/hosting;
- AI/recommendations;
- later roadmap systems.

## Success Criteria
1. Existing Milestones 01–07 behavior remains intact.
2. Library Composition items use an explicit validated declarative member contract.
3. At least two Certified compositions are executable.
4. Composition members resolve exclusively through the Component Registry.
5. No Composition stores executable renderer functions or pre-rendered page HTML.
6. Inserting a Composition creates normal unique Component Instances and inserts them into `Page.componentInstanceIds` in declared order.
7. Definition default content is deep-cloned and composition content overrides do not mutate registry defaults or Library seed data.
8. Explicit member variants are honored; unspecified variants use definition defaults.
9. The default Add Composition flow exposes Certified compositions and does not surface Deprecated/Archived items.
10. A malformed or invalid Composition fails before any partial Page mutation.
11. Composition insertion creates exactly one meaningful history transaction.
12. Undo/Redo removes/restores the whole composition insertion atomically.
13. Generated instances are fully editable through existing Studio controls after insertion.
14. Reorder/variant/responsive/content edits on generated instances work normally and produce normal history entries.
15. Generated instances do not require a persistent live link to the originating Composition.
16. Existing Library browse/filter behavior remains correct.
17. Automated tests cover validation, insertion order, identity uniqueness, content cloning/overrides, variant resolution, lifecycle insertion rules, atomic failure, transaction count, Undo/Redo, and prior milestone regressions.
18. No Starter Package, Blueprint, multi-page or later-stage execution is partially implemented.

## Validation
Validation level: **functional**.

Builder must manually and automatically validate at least:
- insert each Certified composition at beginning, middle and end positions;
- confirm expected section order;
- confirm explicit/default variants;
- confirm content override values and untouched default seed data;
- edit one generated instance after insertion;
- apply responsive override to a generated instance;
- reorder a generated instance independently;
- Undo/Redo the composition insertion as one action;
- attempt invalid composition/definition/variant and confirm zero partial mutation;
- verify Library filtering/lifecycle behavior;
- verify transaction history does not contain one entry per internally created member;
- startup/assets/runtime errors;
- Framework integrity and v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 08 implementation note;
3. executable Composition payload contract documentation;
4. instantiation/resolution algorithm documentation;
5. lifecycle insertion rules;
6. transaction/Undo/Redo semantics;
7. tests and validation results;
8. known limitations;
9. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is declarative executable Library Compositions that expand once into ordinary Component Instances on the current Page. No nested/live Composition runtime, authoring, Starter Package execution, Blueprint execution, or multi-page assembly is authorized.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 08 — Executable Compositions** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Make Certified Library compositions declaratively instantiate normal Component Instances through the existing Component Registry and Page state, integrate the insertion as one transaction with atomic Undo/Redo, preserve Milestones 01–07 architecture, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.