# Studio 4 Milestone 11 — Implementation Note

Milestone 11 makes Certified `starter-package` Library items executable as one-time whole-site recipes. A Starter Package resolves existing Page Templates and produces the canonical Website, Page, Component Instance, and Design Settings document shape; it does not introduce a live package wrapper or second site model.

## Starter Package contract and resolution

An executable package declares a recommended Website name, an ordered non-empty set of Page Template references, and optional supported Design Settings seeds. `resolveStarterPackage()` verifies item identity/type, Certified lifecycle, executable intent, duplicate references, every Page Template and its bounded Composition/Component expansion, deterministic names/slugs, and Design Settings keys/value types before mutation.

The hierarchy remains Starter Package → Page Template → Composition/Component. Starter Package nesting and deeper Composition nesting are unsupported and rejected by the existing resolution boundaries.

## Certified packages

- Service Business Starter assembles Home, About, and Contact and seeds blue site styling.
- Lead Generation Starter assembles Campaign and Contact and seeds a purple campaign theme.

Both packages reuse the three Certified Page Templates from Milestone 10. The existing non-production Consulting foundation remains Specialty and is not offered by the default chooser.

## Assembly, replacement, and history

`replaceWebsiteFromStarter()` requires explicit confirmation when a Website exists. It assigns fresh Website, Page, and Component Instance IDs; preserves Starter Package provenance on Website and Page Template provenance on Pages; copies package settings into the canonical global Design Settings; replaces the document; and reconciles Workspace selection to the first new Page.

Assembly is one history transaction. Undo restores the exact prior Website identity, metadata, Page order, instances/content, and Design Settings. Redo restores the exact assembled identities and state. Generated objects remain ordinary independent Studio objects and support all existing Page creation/management, component editing, Composition insertion, and history operations without Library access.

## Website start UX

The Start Website surface presents Blank/Custom Website plus the two Certified packages with purpose and ordered Page summaries. Replacement requires a dedicated acknowledgement before the action is enabled. Blank/Custom creates one empty Home Page while retaining the canonical Design Settings model.

## Validation evidence and limitations

Functional validation passed 42 automated tests covering Milestones 01–10 plus full package resolution, multi-page assembly, design settings, fresh identities, protected replacement, exact Undo/Redo, source detachment, post-assembly editing/Page Template creation, invalid references, and Blank/Custom replacement. JavaScript syntax, Framework integrity, HTTP assets, Studio v3 preservation, and the live protected chooser passed without runtime errors.

Discovery-driven adaptation, Blueprints, selective reassembly, package authoring/promotion, persistence, deployment, shared sections, navigation authoring, and later service-platform systems remain intentionally out of scope.
