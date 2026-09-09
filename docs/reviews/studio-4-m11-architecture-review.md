# Rally Site Studio 4.0 — Milestone 11 Architecture Review

Milestone: `studio-4-m11-starter-package-site-assembly`
Implementation commit: `799bfee65e404c7b2c045d7969e0c17cf2470a95`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 11 satisfies the frozen whole-site Starter Package architecture.

Certified `starter-package` Library items resolve through the established hierarchy of Page Templates, Compositions and Component Definitions. Resolution validates the complete package before mutation, including lifecycle, duplicate Page Template references, Page Template expansion, page naming/slug uniqueness, and supported Design Settings seeds.

Assembly produces the canonical Studio document shape only: one ordinary Website, ordered ordinary Pages, ordinary Component Instances and global Design Settings. Fresh identities are assigned at every generated level. Starter Package and Page Template provenance are retained as non-authoritative metadata; no live package wrapper or second site runtime remains after assembly.

The replacement workflow is intentionally protected before meaningful current work is replaced. The complete replacement is one document-history transaction. Undo restores the exact prior Website/document state and Redo restores the exact assembled identities/state.

The default Start Website chooser presents Blank/Custom plus Certified packages while non-production lifecycle states remain outside the normal production flow.

## Scope discipline
No Discovery-driven adaptation, Blueprint execution, selective reassembly, Library authoring/promotion, persistence, deployment, shared/global sections, navigation authoring, Organizations/Projects/Portal or later roadmap systems were introduced.

## Forward architecture notes
1. The reusable hierarchy is now proven end-to-end: Component -> Composition -> Page Template -> Starter Package -> ordinary Website. Future assembly work should extend recommendation/adaptation rather than introduce new runtime wrappers.
2. Blueprint semantics should remain structural/advisory. If made executable later, Blueprints should recommend/select/order existing Library objects rather than become another rendered runtime layer.
3. Before Discovery-driven Starter adaptation, define an explicit recommendation input/output contract and confidence/approval rules so automation can change package selection, page inclusion/order, content seeds and design defaults without silently overriding approved local work.
4. Library authoring/version promotion remains a separate concern from site assembly and should not be coupled to normal client-site editing.

## Decision
Approved. Architecture may create the next Studio 4 milestone.