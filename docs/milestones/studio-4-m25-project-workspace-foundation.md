---
milestone-id: studio-4-m25-project-workspace-foundation
mode: implementation
status: implemented
baseline: fcbcb2e7a350fa1ccaee7aeb812c552a7adb1ba8
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m25-project-workspace-foundation.md
  - package.json
affected-surfaces:
  - Project records and lifecycle
  - Project-to-Website/domain references
  - Project workspace overview
  - Project next-action derivation
  - Stage 7 navigation foundation
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 25

## Title
Project Workspace Foundation

## Stage
Stage 7 — Organizations, Projects & Operational Workflow

## Context
Stage 6 and the subsequent user-testing stabilization passes are now solid enough to proceed. Stage 7 should wrap operational project management around the working Website/Discovery/Strategy/Recommendation/Review system without duplicating those domains.

## Objective
Introduce Project as the operational container that references the existing Studio 4 domain records and provides Rally staff with a compact project workspace showing project identity, lifecycle, readiness, current phase and the next meaningful action.

This milestone deliberately starts Stage 7 with **Projects**, not the full Organization/CRM model. Organization/Contact ownership, generalized playbooks, project roadmaps, richer dashboards and persistence remain later slices.

## Architectural Principle
A Project coordinates existing domain identities; it does not own duplicate copies of them.

Existing Website, Discovery Response Set, Strategy, Recommendations, Review Sessions, Conversations, Tasks and Review Versions remain authoritative in their existing stores. Project records hold references and derive operational status from them.

## Scope
Implement:
1. A Project store/model with stable Project identity.
2. Project lifecycle sufficient for current workflow: `active`, `on-hold`, `completed`, `archived`.
3. One seeded/current Project wrapping the existing Northstar Advisory working Website context.
4. Stable references from Project to the current Website and applicable existing domain identities.
5. A derived Project phase/readiness summary based on existing Stage 6/Review state.
6. A derived `nextAction` contract identifying the next meaningful operational step and target surface.
7. A compact Project Workspace/Overview surface accessible from Studio 4.
8. Navigation from Project next actions into existing Discovery, Strategy, Recommendations, Strategy Packet, Website editing and Review surfaces.
9. Project-level aggregation of existing Tasks and unresolved Conversations by reference, not copying.
10. A small Needs Attention summary based on existing unresolved/stale/blocking states.
11. Project lifecycle controls that do not mutate Website or collaboration domain state.
12. Tests proving Project derivation/reference behavior and cross-domain separation.

## Project Model
At minimum:
- `id` stable Project identity;
- `name`;
- `status`: active/on-hold/completed/archived;
- `createdAt`;
- `updatedAt`;
- `createdBy` actor placeholder;
- `websiteId`;
- optional/reference identities for current Discovery Response Set and Strategy record where applicable;
- lightweight metadata needed for display such as internal project label/description if useful.

Do not copy Website document data, Discovery answers, Strategy fields, Recommendation records, Conversations or Tasks into Project.

## Domain Reference Resolution
Provide explicit resolver/summary functions so Project can discover or reference:
- Website;
- Discovery Response Set;
- Strategy;
- Recommendations;
- Review Sessions/current review state;
- unresolved Conversations;
- Tasks;
- Review Versions/approval state where useful.

If a referenced object is unavailable, Project should surface that as unavailable/missing context rather than inventing a replacement identity.

Because persistence does not yet exist, Builder may use current in-memory store APIs and stable Website identity to resolve the active records.

## Project Phase
Derive a coarse operational phase rather than storing a second workflow machine.

Suggested phase vocabulary:
- `discovery`;
- `strategy`;
- `recommendations`;
- `build`;
- `review`;
- `approved`.

Builder may refine names if documented, but derivation must be deterministic from existing domain state.

Examples:
- incomplete Discovery → discovery;
- Discovery complete but Strategy not ready → strategy;
- Strategy ready with no/current recommendations needing action → recommendations;
- Website work/recommendation application before formal review → build;
- active Review Session or unresolved review blockers → review;
- completed/approved review state → approved.

Do not manually advance Project phase with a button in this milestone.

## Next Action Contract
Provide a derived object such as:
- `kind` stable action type;
- `label` human-readable instruction;
- `reason` concise explanation;
- `target` existing Studio surface;
- optional target/reference ID;
- priority/severity where appropriate.

Examples:
- Complete Discovery;
- Resolve Strategy decisions;
- Review recommendations;
- Continue Website editing;
- Start Review;
- Resolve review Conversations;
- Complete required review questions;
- Approve Website.

The Project Workspace should make the next action prominent and allow the user to open the relevant existing surface.

Do not create a second task just to represent the derived next action.

## Needs Attention
Derive a compact list/count from existing states, for example:
- stale Strategy inputs;
- stale Recommendations;
- unresolved Review Conversations;
- blocked Tasks;
- incomplete required review questions during an active review;
- review awaiting approval.

Needs Attention is a projection, not a new issue record system.

Items should navigate to the relevant existing domain where possible.

## Project Tasks & Conversations
Project Workspace may show compact lists/counts of:
- existing Tasks associated with the Project Website/Review Sessions;
- unresolved/waiting Conversations associated with the Project Website.

These remain the exact existing Task and Conversation identities. Updating them continues through their existing stores/surfaces.

Do not introduce a duplicate Project Task model.

## Project Workspace UX
Add a compact internal Rally-facing Project workspace/overview.

It should communicate at a glance:
- Project name/status;
- current phase;
- Website identity/context;
- next action;
- Stage 6 progress/readiness summary;
- Needs Attention;
- Task/Conversation counts or compact lists;
- navigation back to the Website editor.

The Project Workspace is an operational overview, not a replacement Website builder. Website editing should still open the Website-first Studio experience built through Milestone 24.

Keep the initial surface restrained enough that future Organization/Project dashboard design can evolve through testing.

## Lifecycle
Allow Rally staff to change Project status between active/on-hold/completed/archived.

Changing Project status:
- updates only Project metadata;
- does not delete/archive Website state;
- does not complete Tasks;
- does not resolve Conversations;
- does not approve Reviews;
- does not create Website history.

If status is on-hold/archived, nextAction may communicate that operational work is paused rather than pretending the underlying domains changed.

## Seed / Current Project
Create one current Project around the existing Studio 4 seeded working context so current user-testing data remains usable.

Suggested seed:
- Project name: `Northstar Advisory Website`;
- websiteId: existing Northstar Advisory Website identity;
- status: active.

Do not reset or replace the current Website/Stage 6 records merely to create the Project wrapper.

## State Separation
Project operations must not:
- create Website Undo/Redo entries;
- duplicate/mutate Discovery answers;
- duplicate/mutate Strategy fields;
- apply/dismiss Recommendations;
- resolve Conversations;
- change Tasks except through existing Task actions;
- create/revoke Approvals;
- rewrite Review Versions.

Navigation into an existing surface is allowed; the action performed there follows that domain's existing semantics.

## Explicitly Out of Scope
Do not implement:
- Organization records;
- Contact/CRM records;
- multiple-client dashboard;
- persistence/database;
- authentication/permissions;
- Client Portal;
- generalized playbook authoring;
- roadmap/milestone authoring;
- billing/contracts/invoices;
- notifications/email;
- AI automation;
- deployment/hosting;
- duplicate Project-owned Tasks/Conversations;
- final Stage 7 dashboard visual design;
- later roadmap systems.

## Success Criteria
1. Milestones 01–24 remain intact.
2. Project has stable identity and lifecycle metadata.
3. Existing Northstar Advisory Website is wrapped by a Project without being copied/reset.
4. Project resolves the existing Website by stable identity.
5. Project can reference/resolve current Discovery and Strategy records without copying them.
6. Project can aggregate existing Recommendations/Review state by reference/context.
7. Project can aggregate existing Tasks and unresolved Conversations without duplicate records.
8. Project phase is derived deterministically from existing domain state.
9. Project nextAction is derived deterministically and includes a useful target/reason.
10. Next-action navigation opens the correct existing Studio surface.
11. Needs Attention reflects meaningful stale/blocking/unresolved states from existing domains.
12. Needs Attention navigation uses existing identities/surfaces.
13. Project Workspace communicates project/status/phase/next action/progress/attention at a glance.
14. Website editing remains Website-first and is not embedded into a second project builder.
15. Changing Project lifecycle status does not mutate Website/domain state.
16. Project operations create no Website history entries.
17. Missing referenced context is surfaced rather than silently reassigned.
18. Existing Stage 6 and Review workflows continue functioning independently.
19. Automated tests cover Project identity/lifecycle, derivation, next action, aggregation and state separation.
20. Live browser validation covers Project Workspace → next action → existing surface → return to Project/Website.
21. No new console errors/warnings attributable to this milestone.
22. Studio v3 remains preserved.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- seeded Project creation/resolution;
- Project status changes;
- Discovery incomplete/complete phase derivation;
- Strategy incomplete/ready derivation;
- Recommendation state derivation;
- Website/build fallback;
- active Review derivation;
- approval derivation where current stores support it;
- next-action targets for representative phases;
- stale Strategy/Recommendation attention items;
- unresolved Conversation aggregation;
- blocked Task aggregation;
- no duplicate Task/Conversation identities;
- Project Workspace navigation into Discovery/Strategy/Recommendations/Website/Review;
- return/navigation behavior;
- Website Undo/Redo unaffected by Project operations;
- cumulative automated suite;
- JavaScript syntax;
- Framework integrity;
- HTTP assets;
- console health;
- Studio v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 25 implementation note;
3. Project model/reference documentation;
4. Project phase derivation rules;
5. nextAction contract/rules;
6. Needs Attention derivation rules;
7. Project Workspace UX summary;
8. automated/browser validation results;
9. known limitations and Stage 7 follow-up seams;
10. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is the Stage 7 Project foundation: stable Project records referencing existing Studio domains, derived operational phase/next action/Needs Attention, and a compact Rally-facing Project Workspace. Organizations, Contacts, generalized playbooks, persistence, Portal and other later Stage 7+ systems remain deferred.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 25 — Project Workspace Foundation** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Introduce Project as a stable operational wrapper around the existing Website and Stage 6/Review domain identities without copying them, derive Project phase, next action and Needs Attention from authoritative existing stores, provide a compact Rally-facing Project Workspace with navigation into the existing Website/Discovery/Strategy/Recommendations/Review surfaces, aggregate existing Tasks and Conversations by reference, preserve all Milestones 01–24 and Website-first/history boundaries, validate functional derivation/navigation/state separation plus the cumulative suite, and return the completed milestone to Architecture for `Review`.
