# Rally Site Studio 4.0 — Milestone 17 Architecture Review

Milestone: `studio-4-m17-discovery-questionnaire-foundation`
Implementation commit: `b2f793a39c49550a19330817eff17f8ca4c095bd`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 17 satisfies the frozen Discovery Questionnaire Foundation and correctly begins Stage 6 with Discovery as a semantic domain separate from Website Review.

The implementation provides a versioned system-owned `website-discovery` questionnaire with five ordered sections and eleven stable questions spanning short text, long text, yes/no, single choice and multi choice. Definitions carry stable section/question identities, required semantics, bounded choices and semantic recommendation keys.

Discovery response sets are associated with a lightweight Website working-context identity without introducing premature Organization/Project objects. Individual responses retain stable identity, normalized scalar/array answers, actor placeholders and creation/update timestamps. Updates preserve identity/creation time and clearing removes the answer cleanly.

Progress is correctly derived per section and overall. Completion depends on required questions while optional questions remain optional. The compact Discovery surface keeps the Website primary while exposing section navigation, required progress and immediate editing.

The recommendation-input seam is appropriately bounded: `getRecommendationInputs()` deterministically maps semantic keys into grouped values such as business summary, audience, goals, actions, required pages, brand direction and functional requirements. It makes no recommendation and mutates no Website state.

State separation is correct. Discovery operations remain outside Website history and do not alter Review Versions, Review Sessions, Review questionnaires, Conversations, Tasks, Approvals, Website content or Design Settings. Website Undo/Redo and Review Version restore leave Discovery responses intact, with context availability resolved through stable Website identity.

Functional evidence reports 72 automated tests passing across Milestones 01–16 plus Discovery topology, answer types, identity/timestamps, clearing, progress, semantic export, Website-history independence, Review Version restore and cross-store separation. Framework integrity, assets, Studio v3 preservation and live Discovery navigation also passed.

## Scope discipline
No Strategy records, Interactive Strategy Packet, recommendations, automatic Website mutation, questionnaire authoring/branching, attachments, Organizations/Projects, Portal, authentication, persistence, notifications or later-stage systems were introduced.

## Forward architecture notes
1. The next Stage 6 slice should create explicit Strategy/Vision records derived from or informed by Discovery while preserving human editing/approval of interpretation.
2. Strategy must not simply duplicate raw Discovery answers. It should represent Rally's synthesized understanding: goals, audience, positioning/direction, content priorities and design intent with provenance back to Discovery inputs.
3. Recommendation/adaptation should consume Strategy plus normalized Discovery inputs later; it should not be coupled directly to questionnaire UI controls.
4. The Interactive Strategy Packet should eventually present these Strategy records together with canonical Design Settings and the real Website, not copied presentation-only substitutes.

## Decision
Approved. Architecture may create the next Stage 6 milestone.