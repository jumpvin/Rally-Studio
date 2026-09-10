# Rally Site Studio 4.0 — Milestone 20 Architecture Review

Milestone: `studio-4-m20-strategy-recommendations`
Implementation commit: `a7be7c896511a149ecd9a5b850a30ee68606b348`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 20 satisfies the frozen Strategy Recommendations architecture.

The implementation introduces a separate Recommendation domain that deterministically consumes normalized Discovery and Strategy outputs and proposes existing Certified Library/design targets without mutating canonical Website state during generation, inspection, selection, dismissal or stale evaluation.

Recommendation records retain stable identity, category, target, rationale, semantic evidence keys, source identities/versions, timestamps, change scope, applicability and an input signature used to derive staleness. The initial rule set remains intentionally bounded and explainable across Starter Package, Page Template, Composition, Component variant and Design Settings proposals.

Lifecycle behavior is correct: recommendations begin proposed, may become applied or dismissed, and read as stale when material Discovery/Strategy inputs no longer match their captured signature. Regeneration is explicit and preserves older recommendation records as evidence rather than silently rewriting them.

Apply semantics preserve the existing architecture. Starter Package, Page Template, Composition, Component variant and Design Settings recommendations route through their existing canonical transaction boundaries. Invalid, unavailable, non-applicable or stale proposals fail before mutation. Website-changing applies enter normal Undo/Redo history while the Recommendation record remains independent evidence even if that Website change is later undone.

The standalone Recommendations surface and Strategy Packet Recommendations step share the same underlying records and support Generate, Inspect, Apply and Dismiss. Inspection exposes rationale, evidence, exact target, change scope and non-applicability reasons before action.

State separation remains sound. Recommendation operations do not modify Discovery answers, Strategy fields, Review Versions, Review Sessions, Conversations, Tasks, questionnaires or Approval evidence. Website changes only occur through explicit Apply.

## Scope discipline
No AI generation, automatic application, adaptive regeneration, persistence, recommendation approval/versioning, Organizations/Projects, Portal or later-roadmap systems were introduced.

## Forward architecture notes
1. Stage 6 now has the full conceptual chain: Discovery → Strategy → Recommendation → explicit Website change → live Strategy Packet preview.
2. Before moving into Stage 7, Architecture should complete a deliberate Stage 6 usability/integration checkpoint so the user can test the end-to-end flow as a coherent product rather than only isolated milestone mechanics.
3. Future AI assistance should generate candidate Recommendation records/evidence, never bypass the explicit proposal/apply boundary.
4. Project/Portal layers should reference Recommendation identities where useful rather than create a parallel recommendation model.

## Decision
Approved. Architecture may create the next milestone.