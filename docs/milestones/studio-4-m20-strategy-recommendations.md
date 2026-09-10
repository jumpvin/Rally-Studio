---
milestone-id: studio-4-m20-strategy-recommendations
mode: implementation
status: implemented
baseline: 03b026bdfa8a5619c9822c0324c5f29fdcea2fa2
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m20-strategy-recommendations.md
  - package.json
affected-surfaces:
  - Strategy recommendation records
  - Recommendation evidence and rationale
  - Recommendation inspection and apply flow
  - Strategy Packet recommendation step
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 20

## Title
Strategy Recommendations

## Stage
Stage 6 — Interactive Strategy Packet & Discovery

## Objective
Introduce an explainable recommendation layer that consumes normalized Discovery + Strategy outputs and proposes existing Library/design decisions without mutating the Website until a human explicitly applies a recommendation.

## Architectural Principle
Recommendations are proposals, not actions.

Generation may suggest a Starter Package, Page Template, Composition, Component/variant, or bounded Design Setting change, but canonical Website state must remain unchanged until Apply is invoked.

## Scope
Implement:
1. Structured Recommendation records with stable identity and lifecycle.
2. Deterministic recommendation generation from current Discovery + Strategy outputs.
3. Recommendation categories covering at minimum:
   - Starter Package;
   - Page Template;
   - Component/Composition;
   - Component variant;
   - Design Settings.
4. Evidence/provenance on every recommendation, including source semantic keys and human-readable rationale.
5. Recommendation status such as `proposed`, `applied`, `dismissed`, `stale`.
6. Read-only inspection of the proposed target before Apply.
7. Explicit Apply and Dismiss actions.
8. Apply behavior routed through existing canonical Website transaction boundaries.
9. Undo/Redo support for applied Website-changing recommendations.
10. Stale detection when relevant Discovery/Strategy inputs change after recommendation generation.
11. A compact Recommendations surface plus a Recommendations step inside the Strategy Packet.
12. Tests covering generation, explainability, stale behavior, dismissal, application and state separation.

## Recommendation Model
Each Recommendation must include at minimum:
- stable ID;
- Website/working-context ID;
- category/type;
- target reference or bounded target payload;
- status;
- title;
- concise rationale;
- evidence/source semantic keys;
- source Discovery response-set ID/version when applicable;
- source Strategy record ID/update timestamp when applicable;
- createdAt/createdBy;
- appliedAt/appliedBy when applied;
- dismissedAt/dismissedBy when dismissed;
- staleness metadata.

Recommendation records are not part of canonical Website document state.

## Deterministic Generation
This milestone must not introduce AI generation.

Use documented deterministic rules against current normalized Discovery/Strategy values and Certified Library inventory. Rules may be simple, but they must be explainable and testable.

Examples:
- lead-generation goal + service-business context may prefer a Certified service-business Starter Package;
- required `contact` page may recommend a Certified Contact Page Template if absent;
- strong proof availability may recommend a Services/Proof-oriented Composition or Component;
- brand direction such as minimal/premium may recommend a compatible bounded Design Settings preset or component variant.

The Builder may refine the rule set based on current Library inventory, but should prefer a small number of high-confidence recommendations over noisy output.

## Inspection
Before Apply, the user must be able to inspect:
- what is being proposed;
- why it is being proposed;
- the source evidence;
- the exact target Library item/version or Design Setting values;
- what scope of Website state would change if applied.

Do not require a full simulated Website branch in this milestone.

## Apply Semantics
Apply must be explicit.

Depending on category:
- Starter Package uses the existing whole-site assembly boundary and replacement protection;
- Page Template uses existing Page creation/instantiation behavior;
- Composition uses existing atomic composition insertion;
- Component/variant uses existing Component Registry/variant boundaries;
- Design Settings uses existing canonical Design Settings transaction behavior.

Applied recommendations must not create parallel runtime wrappers.

If an existing apply boundary cannot safely satisfy a recommendation, the recommendation should remain inspectable but non-applicable with a clear reason rather than silently invent a new mutation path.

## History
Generating, inspecting, dismissing or marking stale recommendations creates no Website Undo/Redo entries.

Applying a recommendation that changes canonical Website state must use the existing transaction/history system and be undoable according to the underlying operation semantics.

Undoing the Website change does not erase the Recommendation record. The record should remain historical evidence that an apply occurred; current-state mismatch may be surfaced separately.

## Staleness
Recommendations must become stale when the inputs materially used to generate them no longer match current Discovery/Strategy state.

Do not automatically rewrite or replace an existing Recommendation. Regeneration should create/update a new proposal set intentionally and preserve prior applied/dismissed evidence where practical.

## Strategy Packet Integration
Add a Recommendations step to the existing Interactive Strategy Packet, positioned after Strategy/Vision and before Design Direction or Website Preview as appropriate.

The step should summarize proposed recommendations, rationale, evidence and status, and allow inspection/apply/dismiss without turning the Packet into a second builder.

The Website remains the visual star when recommendation inspection involves Website/design context.

## State Separation
Recommendation operations must not directly mutate:
- Discovery answers;
- Strategy fields;
- Review Versions;
- Review Sessions;
- Conversations;
- Tasks;
- Approval records.

Applying Website changes may naturally affect what later Reviews/Versions capture, but no review/workflow record is modified as a side effect.

## Explicitly Out of Scope
Do not implement:
- AI recommendations;
- automatic recommendation application;
- adaptive whole-site regeneration;
- conditional questionnaires;
- packet approval/versioning;
- Blueprint execution;
- Library authoring/promotion/version publishing;
- Organizations/Projects;
- Client Portal;
- authentication/permissions;
- persistence/database;
- notifications;
- deployment/hosting;
- later roadmap systems.

## Success Criteria
1. Milestones 01–19 remain intact.
2. Recommendations exist as a separate structured domain.
3. Generation consumes normalized Discovery + Strategy outputs deterministically.
4. Every recommendation has clear rationale and evidence semantic keys.
5. Certified Library objects are preferred for production recommendations.
6. At least one recommendation can target each currently feasible major category among Starter Package, Page Template, Composition/Component, variant and Design Settings.
7. Generating recommendations does not mutate Website state.
8. Inspecting/dismissing recommendations does not mutate Website state.
9. Applying a recommendation is explicit.
10. Applied Website changes use existing canonical mutation boundaries.
11. Applied Website changes participate correctly in Undo/Redo.
12. Undoing an applied Website change does not delete Recommendation history.
13. Relevant Discovery/Strategy changes mark recommendations stale.
14. Human-edited Strategy values are used as authoritative current Strategy inputs.
15. Recommendations step integrates into the Strategy Packet without duplicating Website/Strategy/Discovery state.
16. Recommendation operations remain independent from Review/Conversation/Task/Approval state.
17. Invalid/unavailable Library targets fail safely before mutation.
18. Automated tests cover generation, evidence, stale detection, dismiss, apply, history and cross-store separation.
19. Studio v3 remains preserved.
20. No later Stage 6/7+ system is partially implemented.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- recommendation generation from representative Discovery/Strategy inputs;
- rationale/evidence shape;
- Certified target resolution;
- zero Website mutation on generation/inspection/dismissal;
- stale detection after Discovery/Strategy edits;
- explicit regeneration behavior;
- apply at least one Library-based recommendation;
- apply a Design Settings recommendation;
- Undo/Redo after Apply;
- Recommendation record retention after Undo;
- unavailable/invalid target failure-before-mutation;
- Strategy Packet recommendation-step behavior;
- Review/Conversation/Task/Approval independence;
- Framework integrity;
- no new runtime errors;
- Studio v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 20 implementation note;
3. Recommendation record/rule documentation;
4. evidence/rationale contract;
5. apply semantics by category;
6. stale/regeneration semantics;
7. Strategy Packet integration behavior;
8. functional tests/validation results;
9. known limitations;
10. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is deterministic, explainable Strategy Recommendations against existing Library/Design Settings boundaries with explicit human Apply/Dismiss, staleness, and Strategy Packet integration. AI generation, automatic application, adaptive regeneration, persistence, Projects and Portal remain deferred.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 20 — Strategy Recommendations** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Add a separate explainable Recommendation domain that deterministically consumes Discovery + Strategy outputs, proposes existing Certified Library/design targets, supports inspect/dismiss/stale/apply behavior, routes all applied Website changes through existing canonical transaction boundaries, integrates Recommendations into the Strategy Packet, preserves Milestones 01–19 and all state-separation boundaries, validates every functional success criterion, and returns the completed milestone to Architecture for `Review`.

## Implementation Evidence

- Separate stable Recommendation store and deterministic five-category rule set: `studio4/recommendation-store.js`.
- Compact Recommendations drawer and shared Strategy Packet Recommendations step: `studio4/app.js`, `studio4/recommendations.css`, and `studio4/strategy-packet-store.js`.
- Functional coverage for generation, provenance, certified targets, lifecycle, staleness, safe application, Undo/Redo, packet behavior, and workflow separation: `studio4/tests/foundation.test.mjs`.
- Detailed record, rule, apply, regeneration, and limitation documentation: `docs/implementation/studio-4-m20.md`.
