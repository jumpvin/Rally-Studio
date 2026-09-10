# Studio 4 Milestone 20 — Implementation Note

Milestone 20 adds a separate deterministic Recommendation domain that reads normalized Discovery and Strategy outputs and proposes changes without changing the Website until a person explicitly applies one.

## Recommendation records and rules

`createRecommendationStore()` retains stable recommendation identity, category, target, status, rationale, evidence semantic keys, source identities and versions, actor timestamps, change scope, applicability, and an input signature used for staleness. Generation uses a fixed category order and current certified inventory to propose a Starter Package, a missing Contact Page Template when appropriate, a service-home Composition, a Hero variant, and bounded Design Settings. Generation, inspection, dismissal, selection, and stale derivation remain outside Website history.

The rule set is intentionally small and explainable. Primary goal selects the Starter Package; required Pages and current Website Pages determine the Page Template proposal; current service and proof context supports the Composition; the active Page determines whether a Hero variant is applicable; and brand direction selects bounded radius and spacing values. Each proposal exposes the semantic inputs used as evidence and the exact target or payload.

## Apply and lifecycle semantics

Recommendations begin as `proposed`, may become `applied` or `dismissed`, and are read as `stale` when their material Discovery or Strategy inputs no longer match the captured signature. Regeneration is explicit and creates a new proposal set while preserving prior records as evidence.

Apply routes through the existing canonical boundaries: Starter Package whole-site assembly with replacement confirmation, Page Template creation, atomic Composition insertion, Component variant selection, or Design Settings update. Invalid, stale, unavailable, or non-applicable proposals fail before mutation. Website-changing applies create normal Undo/Redo entries; undoing the Website change does not erase the applied Recommendation record.

## Studio surfaces and separation

The compact Recommendations drawer and the new Strategy Packet Recommendations step share the same Recommendation records and support Generate, Inspect, Apply, and Dismiss. The step sits after Strategy and before Design. Inspection shows rationale, evidence keys, exact target, change scope, status, and non-applicability reasons.

Recommendation operations do not alter Discovery answers, Strategy fields, Review Versions, Review Sessions, Conversations, Tasks, questionnaires, or approvals. Applied Website changes only affect those later workflows if a person subsequently captures or reviews the changed Website.

## Validation and limitations

Functional coverage includes deterministic generation, complete evidence shape, certified target resolution, zero Website mutation during proposal operations, dismissal, staleness, safe failure, Library and Design application, Undo/Redo, record retention, Packet integration, and cross-store separation. The implementation contains no AI generation, automatic application, persistence, adaptive regeneration, approval/versioning, Projects, Portal, or later-roadmap systems.
