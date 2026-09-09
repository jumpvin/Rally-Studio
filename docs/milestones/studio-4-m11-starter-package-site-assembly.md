---
milestone-id: studio-4-m11-starter-package-site-assembly
mode: implementation
status: implemented
baseline: 504177c58cb0844e1365e2853a601afa53e0750d
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m11-starter-package-site-assembly.md
  - package.json
affected-surfaces:
  - Executable Starter Package Library items
  - Whole-site Starter Package resolution
  - New Website from Starter Package workflow
  - Starter Package transaction/history integration
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 11

## Title
Starter Package Whole-Site Assembly

## Objective
Make the Starter Package level of the Studio hierarchy executable by allowing a Certified Starter Package to assemble a complete ordinary Website containing multiple ordinary Pages and Component Instances from existing Certified Page Templates.

A Starter Package is a reusable site recipe used once to create normal Studio document objects. It must not remain as a separate runtime wrapper, live synchronization layer, or second site representation after assembly.

## Scope
Implement:
1. An executable Starter Package Library contract using the existing `starter-package` Library type.
2. At least two Certified executable Starter Packages representing useful website foundations.
3. Starter Package resolution/validation before any Website mutation.
4. Whole-site assembly from ordered Certified Page Template references.
5. Optional Starter Package-level Website metadata/defaults such as recommended site name and safe Design Settings seeds.
6. A Website start/replace workflow with explicit choices appropriate to the current Studio prototype, including Starter Package assembly and a simple empty/custom-site path.
7. Assembly into normal Website/Page/Component Instance state using fresh stable identities.
8. Deterministic page names/slugs with collision-free output.
9. Whole-site assembly as one atomic meaningful transaction/checkpoint in the current in-session history architecture.
10. Undo/Redo or equivalent bounded restoration that atomically restores the pre-assembly Website state and the assembled Website state.
11. Non-authoritative source Starter Package/version provenance on the Website and existing Page Template provenance on generated Pages.
12. Tests proving resolution, independence, atomicity, design-setting behavior and source detachment.

## Starter Package Contract
Executable Starter Packages remain Library items of type `starter-package`.

The payload must declaratively define at minimum:
- `executable: true` or equivalent;
- recommended Website name/purpose;
- ordered Page Template references;
- optional safe Website-level Design Settings seed/overrides;
- optional metadata useful for later recommendation logic, without implementing that recommendation engine now.

Do not introduce a separate Starter Package registry.

## Resolution Rules
Resolve the complete package before mutating the current document.

Resolver must validate:
- Library item exists;
- item type is `starter-package`;
- lifecycle is Certified for normal production assembly;
- item is explicitly executable;
- at least one Page Template is referenced;
- every referenced Page Template is Certified and executable;
- every Page Template fully resolves through the Milestone 10 Page Template resolver;
- all nested Composition/Component/variant references therefore resolve successfully;
- Page names/slugs can be generated deterministically and uniquely within the assembled Website;
- optional Design Settings seeds only use supported settings/values;
- duplicate/cyclic/invalid recipe structures fail before mutation.

Starter Package nesting is not supported. A Starter Package may reference Page Templates; Page Templates may reference Compositions/components according to the already-approved bounded hierarchy.

## Assembly Semantics
Successful assembly must create ordinary Studio document state:
- one Website identity;
- ordered `website.pageIds`;
- one normal Page record per resolved template;
- normal Component Instances per Page;
- existing global Design Settings;
- transient Workspace `activePageId` set to the first/recommended page after assembly.

Every generated Page and Component Instance receives fresh stable IDs.

After assembly:
- existing page management works normally;
- all pages can be renamed/duplicated/reordered/deleted under current rules;
- all components support normal editing/variants/responsive/structural actions/history;
- Compositions can still be inserted;
- additional Pages can still be created blank or from Page Templates;
- no runtime access to the source Starter Package is required.

## Existing Website / Replacement Safety
Because the current Studio prototype already has a Website document, Starter Package assembly must not silently destroy it.

Provide an intentional action such as `Start from Starter Package` / `Replace current workspace from Starter Package` with clear confirmation when meaningful current document content exists.

This confirmation is appropriate because whole-site replacement is materially higher risk than deleting a single section.

The complete current document must be captured through the existing transaction/history architecture before replacement so immediate Undo/restore is possible.

Do not implement account/project-level site creation yet; this is the Website document assembly architecture inside Studio.

## Design Settings
A Starter Package may provide optional Design Settings seeds using the existing canonical Design Settings model.

Rules:
- package settings are copied into Website document state at assembly;
- they do not remain linked to the package;
- only supported existing design settings are permitted;
- page templates/components continue inheriting global settings normally;
- package assembly must not invent a second theme/settings system.

At least one Certified Starter Package should demonstrate non-default Design Settings seeds so the architecture is exercised.

## Provenance
Website may retain non-authoritative metadata such as:
- `sourceLibraryItemId`;
- `sourceLibraryVersion`.

Pages retain Page Template provenance and generated Component Instances retain existing relevant provenance.

Provenance is informational. Editing assembled objects does not mutate Library items, and future Library changes do not rewrite assembled sites.

## Seed Starter Packages
Provide at least two Certified executable packages with distinct site purposes, for example:
- **Service Business Starter** — Home, About, Contact;
- **Lead Generation Starter** — focused Home/Landing plus Contact or supporting Page.

Use the Page Templates already available. Add only minimal new template seeds if absolutely necessary to prove a coherent package; avoid expanding this milestone into a production template catalog.

## Website Start UX
Provide a compact Website-level start/replace surface with options conceptually equivalent to:
- Recommended/Certified Starter Packages;
- Blank/Custom Website.

Because Discovery-driven recommendation is not implemented, do not label a specific package as AI-recommended. Certified packages may simply be presented as curated starting points.

Show enough information to understand:
- package name/purpose;
- pages included and order;
- optionally brief design-default summary.

Do not build a marketplace or elaborate thumbnail system in this milestone.

## History / Atomicity
Whole-site assembly/replacement must be one meaningful history transaction or one equivalent atomic checkpoint compatible with the Milestone 06 architecture.

Undo must restore the complete pre-assembly document:
- Website identity/metadata;
- Pages and order;
- Component Instances and content;
- Design Settings.

Redo must restore the exact assembled document identities/state created by the original transaction.

Workspace-only state such as selection should reconcile safely and is not required to be historical.

## Explicitly Out of Scope
Do not implement:
- Discovery-driven or AI Starter Package recommendations;
- adaptive Starter Package modification from questionnaire answers;
- Blueprint execution;
- selective reassembly of an existing site;
- updating existing sites when Starter Packages change;
- Library authoring/promotion/version publishing;
- account/project/organization creation;
- Strategy Packet;
- Client Portal;
- comments/review/approval;
- deployment/publishing/hosting;
- production editing;
- persistent database/storage;
- shared/global sections;
- navigation-menu authoring beyond page identity/order;
- SEO/redirect/routing infrastructure;
- final authentication/capability system;
- later roadmap systems.

## Success Criteria
1. Milestones 01–10 remain functional.
2. Starter Packages are executable through the existing Library `starter-package` type.
3. At least two Certified executable Starter Packages exist.
4. The complete package/page-template/composition/component recipe is validated before mutation.
5. Invalid Starter Package/Page Template/component/variant references fail before mutation.
6. Successful assembly creates one ordinary Website with multiple ordinary Pages and Component Instances.
7. Generated Website/Page/Component identities are fresh and stable.
8. Page order follows Starter Package order.
9. Names/slugs are deterministic and unique.
10. At least one Starter Package applies valid global Design Settings seeds through the canonical Design Settings model.
11. All generated Pages work with existing page management and editing capabilities.
12. Generated objects remain functional if the source Starter Package is unavailable after assembly.
13. Editing generated Website/Pages/components does not mutate Library source objects.
14. Whole-site replacement requires an intentional protected action when current content exists.
15. Whole-site assembly/replacement is one atomic history transaction/checkpoint.
16. Undo restores the exact pre-assembly document state.
17. Redo restores the same assembled identities and state.
18. Blank/Custom Website path remains available.
19. Default Starter Package chooser surfaces Certified packages without non-production lifecycle clutter.
20. Existing Page Template creation remains available after assembly.
21. Automated tests cover resolution, multi-page expansion, design settings, identity, source detachment, invalid references, replacement protection and atomic Undo/Redo.
22. No Discovery/recommendation/deployment/later-stage system is partially implemented.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- assemble each Certified Starter Package;
- correct Page order/names/slugs;
- Page Template -> Composition -> Component flattening through whole-site assembly;
- unique Website/Page/Component identities across repeated assemblies;
- Starter Package Design Settings seeds;
- edit content/variant/responsive state after assembly;
- add/reorder/delete Pages after assembly;
- create another Page from a Page Template after assembly;
- insert a Composition after assembly;
- protected replacement of an existing edited Website;
- one-step atomic Undo to the complete prior Website;
- Redo to the exact assembled site identities/state;
- failure-before-mutation for malformed packages/references;
- source Library independence and detachment;
- transaction history remains coherent;
- no new runtime/console errors;
- Studio v3 remains preserved.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 11 implementation note;
3. Starter Package contract documentation;
4. whole-site resolution/assembly semantics;
5. replacement/atomic-history semantics;
6. provenance and Design Settings behavior;
7. functional tests/validation results;
8. known limitations;
9. Architecture questions instead of silent scope expansion.

## Architecture Freeze
The frozen scope is Certified Starter Packages that assemble/replace one complete independent Website from existing Page Templates as one atomic operation. Discovery-driven adaptation, Blueprints, publishing and service-platform systems remain deferred.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 11 — Starter Package Whole-Site Assembly** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Make Certified `starter-package` Library items fully resolve existing Page Templates and atomically assemble an independent ordinary multi-page Website, preserve canonical Design Settings and existing object/history boundaries, protect replacement of current work, preserve Milestones 01–10, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.

## Implementation Evidence

- Status: `implemented`; Architecture acceptance is not claimed.
- Functional suite: 42/42 automated tests passed.
- Framework integrity: passed with no failures.
- Live scenario: protected Website chooser displayed Blank/Custom and two Certified packages with ordered Page summaries, required acknowledgement, and no runtime errors.
- Implementation note: `docs/implementation/studio-4-m11.md`.
- Release note: Added two Certified executable Starter Packages, full hierarchy resolution, fresh whole-site assembly, global Design Settings seeds, protected replacement, and atomic Website Undo/Redo.
