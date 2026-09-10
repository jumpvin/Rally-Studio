---
milestone-id: studio-4-m21-stage-6-integration-usability-checkpoint
mode: implementation
status: active
baseline: 4039cd6e6c16b4ce0a49535867a575a99f307495
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m21-stage-6-integration-usability-checkpoint.md
  - package.json
affected-surfaces:
  - End-to-end Stage 6 workflow
  - Studio navigation and workflow handoffs
  - Strategy Packet coherence
  - Recommendation apply feedback
  - UX integration regression
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 21

## Title
Stage 6 Integration & Usability Checkpoint

## Stage
Stage 6 — Interactive Strategy Packet & Discovery

## Objective
Turn the individually proven Stage 6 systems into one coherent, testable product workflow before introducing Stage 7 Organizations/Projects.

This milestone does not introduce a new major domain. It validates and improves the complete Stage 6 journey:

**Discovery → Strategy → Recommendations → Design Direction → Website → Review readiness**

The goal is to eliminate broken handoffs, confusing duplicated entry points, stale visual state, dead ends, unclear next actions, and obvious usability defects that arise only when the systems are exercised together.

## Architectural Principle
Integration fixes may simplify navigation and presentation, but must not collapse established domain boundaries.

Discovery remains Discovery. Strategy remains Strategy. Recommendations remain proposals. Website remains canonical. Review remains collaboration state. This milestone improves how the user moves between them; it does not merge their stores into one monolith.

## Scope
Implement and validate:
1. A coherent Stage 6 primary workflow path from Discovery through Strategy Packet and Website.
2. Clear next-action affordances between Discovery, Strategy, Recommendations, Design Direction, and Website Preview.
3. Consistent return-to-previous-context behavior so users do not feel lost when leaving Packet/Discovery/Strategy/Recommendations surfaces.
4. Elimination of obvious duplicated or contradictory controls where the same action appears in multiple places without a clear reason.
5. Accurate live state synchronization across all Stage 6 surfaces.
6. Clear loading/empty/not-ready/stale/applied/dismissed/unavailable states using existing in-memory architecture.
7. Recommendation application feedback that makes the resulting Website change understandable and discoverable.
8. Packet navigation that remains coherent after a recommendation changes page/site structure.
9. Robust active Page reconciliation after whole-site or page-level recommendation application.
10. A concise Stage 6 readiness/summary indicator based on existing Discovery, Strategy, Recommendation, Website and Review state.
11. Keyboard/basic focus behavior for major dialogs/drawers/packet navigation where feasible without a framework rewrite.
12. End-to-end integration tests that exercise the full Stage 6 workflow rather than only isolated stores.

## Primary Workflow
The preferred internal flow should be understandable as:

1. **Discovery** — collect/complete client/business inputs.
2. **Strategy** — draft/refresh, resolve required strategic decisions, preserve human overrides.
3. **Recommendations** — generate, inspect, dismiss/apply intentional proposals.
4. **Strategy Packet** — walk through Discovery understanding, Strategy, Recommendations, Design Direction and real Website Preview.
5. **Website** — continue deeper editing using the normal Studio workspace.
6. **Review** — existing Review Session workflow remains available when the Website is ready for formal client review.

The UI may expose shortcuts, but this progression should be legible without requiring users to understand the internal store architecture.

## Navigation / Context Requirements
Builder should refine navigation so that:
- opening Discovery/Strategy/Recommendations remembers enough transient context to return sensibly;
- leaving the Strategy Packet returns to the Studio workspace rather than an arbitrary drawer state;
- "Edit in Discovery" / equivalent paths are reversible and understandable;
- Strategy Packet step state does not become invalid when a recommendation changes the Website;
- Page navigation inside Packet Preview and normal Workspace remains intentionally separate but reconciles valid identities;
- if the active/preview Page is removed by site replacement, select a deterministic valid Page instead of leaving broken state;
- stale/invalid recommendation selections do not crash the surface.

## State Synchronization
All visible Stage 6 summaries must derive from current source stores.

Examples:
- Discovery progress updates Strategy/Packet readiness immediately;
- Strategy edits update Recommendation staleness and Packet summary immediately;
- recommendation lifecycle updates Recommendations drawer and Packet step immediately;
- applied Design Settings update normal Website and Packet preview immediately;
- applied Starter Package/Page Template/Composition/variant recommendations update preview/page navigation immediately;
- Website Undo/Redo reflects in the Packet preview and current-state indicators without erasing recommendation evidence.

Do not introduce manually maintained duplicate summary state where derivation is possible.

## Recommendation Apply Feedback
Applying a recommendation must provide clear immediate feedback, appropriate to its scope, such as:
- applied state visibly changes;
- affected Website/page becomes current or easily reachable where reasonable;
- exact change scope remains inspectable after application;
- whole-site replacement confirmation remains protected;
- failure messages explain why a stale/unavailable/non-applicable recommendation cannot be applied;
- Undo/Redo remains the Website rollback mechanism rather than a recommendation-specific rollback system.

Do not automatically navigate in a way that breaks the user's current task unless the resulting target would otherwise be impossible to find.

## Stage 6 Readiness Summary
Expose a compact derived summary for Rally staff using existing state, such as:
- Discovery: draft / in progress / complete;
- Strategy: draft / in progress / ready;
- Recommendations: not generated / proposed / partially applied / stale;
- Website: current Page count / presence;
- Review: whether a formal review session exists/is active/approved where existing APIs make this straightforward.

This is an internal orientation aid, not a new Project dashboard and not a manually advanced project status.

## UX Integration Pass
Builder is authorized to make small-to-medium presentation and interaction refinements needed to make the Stage 6 workflow coherent, including:
- naming consistency;
- button hierarchy;
- spacing/layout fixes;
- drawer/overlay sizing;
- empty states;
- disabled-state explanations;
- basic responsive usability of Studio controls;
- reducing obviously overcrowded top-level controls by grouping Stage 6 entry points if that improves clarity.

Do not perform an unrelated visual redesign of Studio 4. Preserve the Page-first Website editing direction already established.

## Regression / Product-Test Scenarios
Add end-to-end/integration coverage for at least:

### Happy path
1. Begin with a Website.
2. Complete required Discovery answers.
3. Draft Strategy from Discovery.
4. Fill unresolved required Strategy decisions.
5. Generate Recommendations.
6. Inspect and apply at least one Design Settings recommendation.
7. Apply at least one Library-backed recommendation.
8. Open Strategy Packet and verify all steps show current shared state.
9. Change Design Direction in Packet and verify Website/history.
10. Navigate Website Preview across pages.
11. Return to Studio and verify canonical Website state.

### Staleness path
1. Generate Recommendations.
2. Change material Discovery/Strategy input.
3. Verify recommendation staleness appears everywhere.
4. Verify stale apply fails before mutation.
5. Regenerate and verify new proposals without deleting historical records.

### Site replacement path
1. Start from meaningful multi-page work.
2. Apply Starter Package recommendation with required confirmation.
3. Verify active/preview Page reconciliation.
4. Verify Packet remains usable.
5. Undo and verify exact prior site state and usable Packet/navigation.
6. Redo and verify assembled state and usable Packet/navigation.

### Cross-domain separation
Verify integration refinements do not cause Discovery/Strategy/Recommendation UI navigation to mutate Review Versions, Conversations, Tasks, Review questionnaires or Approval records.

## Explicitly Out of Scope
Do not implement:
- Organizations;
- Contacts;
- Projects;
- project dashboards;
- project milestones/playbooks;
- Client Portal;
- authentication/roles;
- persistence/database;
- notifications;
- AI recommendations;
- automatic recommendation application;
- Strategy Packet approval/versioning;
- deployment/hosting;
- analytics;
- Library authoring/version publishing;
- broad visual redesign;
- later roadmap systems.

## Success Criteria
1. Milestones 01–20 remain intact.
2. A user can move through Discovery → Strategy → Recommendations → Strategy Packet → Website without dead ends or needing knowledge of internal architecture.
3. Stage 6 surfaces expose obvious, consistent next actions.
4. Return navigation behaves consistently and predictably.
5. Visible summaries are derived from current stores and stay synchronized.
6. Discovery edits immediately affect Strategy staleness/readiness where appropriate.
7. Strategy edits immediately affect Recommendation staleness and Packet state.
8. Recommendation apply/dismiss/stale state is consistent in both Recommendations and Packet surfaces.
9. Applied Website changes immediately render in normal Studio and Packet Preview.
10. Whole-site/page-structure changes reconcile active/preview Page IDs safely.
11. Undo/Redo after applied recommendations leaves Stage 6 surfaces usable and synchronized.
12. Stale/unavailable recommendation apply fails without Website mutation and communicates why.
13. Recommendation application gives clear feedback about what changed.
14. Stage 6 readiness summary accurately reflects current existing-domain state.
15. Page-first Website editing remains visually primary outside the intentional Packet experience.
16. No domain-store boundaries are collapsed for UX convenience.
17. Collaboration/Review/Task/Approval state remains independent.
18. No Stage 7+ product domain is partially implemented.
19. Automated integration tests cover happy path, staleness, replacement+Undo/Redo and cross-domain separation.
20. Studio v3 remains preserved and no new runtime errors are introduced.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- cumulative automated tests;
- new end-to-end Stage 6 integration tests;
- live browser walkthrough of the primary flow;
- browser walkthrough of stale recommendations;
- browser walkthrough of Starter Package replacement and Undo/Redo;
- active/preview Page reconciliation;
- drawer/Packet return behavior;
- no console/runtime errors through the walkthrough;
- Framework integrity;
- Studio v3 preservation.

## Deliverables
Builder returns:
1. integration/usability implementation changes;
2. Milestone 21 implementation note;
3. documented primary Stage 6 workflow;
4. navigation/context behavior notes;
5. recommendation feedback/reconciliation behavior;
6. functional + end-to-end validation results;
7. known UX limitations that should be evaluated during user testing;
8. Architecture questions instead of silent scope expansion.

## Architecture Freeze
The frozen scope is integration and usability hardening of the already-built Stage 6 Discovery, Strategy, Recommendation, Strategy Packet, Design Settings and Website flow. It adds no new major product domain and exists specifically to create a coherent checkpoint for serious user testing before Stage 7.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 21 — Stage 6 Integration & Usability Checkpoint** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Exercise the complete Discovery → Strategy → Recommendations → Strategy Packet → canonical Website workflow, repair confusing or broken handoffs, keep all visible state derived and synchronized, reconcile navigation safely across recommendation-driven site/page changes and Undo/Redo, improve obvious interaction/empty/error states without redesigning the product or collapsing domain boundaries, add end-to-end integration coverage, preserve Milestones 01–20 and Studio v3, and return the completed milestone to Architecture for `Review`.