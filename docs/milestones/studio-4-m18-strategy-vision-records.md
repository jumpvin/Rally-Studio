---
milestone-id: studio-4-m18-strategy-vision-records
mode: implementation
status: active
baseline: 8bb98c963c02e31f6335b6330fb78e96e804291c
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m18-strategy-vision-records.md
  - package.json
affected-surfaces:
  - Strategy and Vision record model
  - Discovery-to-Strategy synthesis seam
  - Strategy editing and provenance
  - Strategy readiness summary
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 18

## Title
Strategy / Vision Records

## Stage
Stage 6 — Interactive Strategy Packet & Discovery

## Objective
Introduce a structured, editable Strategy/Vision layer that represents Rally's synthesized understanding of the client and intended Website direction.

Discovery captures raw client/business inputs. Strategy interprets those inputs into concise working decisions that can later drive recommendations, Design Settings, content planning, Starter Package adaptation, and the Interactive Strategy Packet.

This milestone does **not** make those downstream decisions automatically. It establishes the human-owned strategy record and the provenance seam between raw Discovery and later Website recommendations.

## Core Architectural Principle
**Discovery is evidence. Strategy is interpretation.**

Do not copy the Discovery questionnaire into a second form. Strategy must summarize and synthesize the important decisions Rally needs to design the Website.

Strategy is also not canonical Website document state. Editing Strategy does not directly change Website content, Design Settings, Page structure, Review Versions, or Website history.

## Scope
Implement:
1. A structured Strategy Record model with stable identity and lifecycle.
2. One Strategy Record associated with the current Discovery/Website working context.
3. Explicit Strategy sections covering:
   - Business Understanding;
   - Audience;
   - Website Goals & Primary Action;
   - Positioning / Message Direction;
   - Content & Page Priorities;
   - Brand / Design Direction;
   - Functional Requirements;
   - Constraints / Risks / Open Questions.
4. A deterministic **Draft from Discovery** operation that uses normalized Discovery recommendation inputs to prefill Strategy fields.
5. Provenance metadata showing which Strategy fields were initially informed by which Discovery semantic keys.
6. Human editing of every Strategy field after drafting.
7. A clear distinction between generated/prefilled values and human-edited values.
8. Derived Strategy readiness/completeness.
9. A compact Strategy surface that remains secondary to the Website.
10. A normalized Strategy Output contract for later recommendation/adaptation milestones.
11. Tests proving Discovery independence, human override behavior, provenance, and state separation from Website and Review systems.

## Strategy Record Model
A Strategy Record must include at minimum:
- stable `id`;
- working-context / `websiteId` reference;
- optional `discoveryResponseSetId`;
- status/lifecycle;
- createdAt / createdBy;
- updatedAt / updatedBy;
- structured sections/fields;
- provenance metadata;
- field-level source state sufficient to distinguish discovery-drafted vs human-edited values.

Recommended lifecycle for this milestone:
- `draft` — no meaningful Strategy content yet;
- `in-progress` — some required Strategy decisions exist;
- `ready` — the required Strategy decisions are populated.

The lifecycle should be **derived from required fields**, not manually toggled.

Do not implement formal Strategy approval/sign-off in this milestone.

## Required Strategy Fields
Builder may refine names while preserving semantics. Required decisions should include at least:

### Business Understanding
- concise business/organization summary;
- primary offering/value being represented.

### Audience
- primary audience/customer;
- optional audience needs/context.

### Goals & Action
- primary Website goal;
- primary visitor action;
- optional secondary action.

### Positioning / Message Direction
- concise core message or positioning direction;
- tone/message notes.

### Content & Page Priorities
- required/priority pages;
- proof/credibility priorities;
- important content notes.

### Brand / Design Direction
- desired brand/personality direction;
- visual preferences/avoidances;
- existing brand constraints where known.

### Functional Requirements
- known Website features/functions;
- lead/contact/scheduling/ecommerce needs where relevant.

### Constraints / Risks / Open Questions
- deadlines or launch constraints;
- unresolved questions;
- known risks/dependencies.

Not every field must be required. Keep readiness focused on the minimum decisions needed to move into Website recommendation/assembly.

## Draft from Discovery
Add an explicit action such as **Draft Strategy from Discovery**.

Rules:
1. The operation reads the normalized semantic output from Milestone 17, not raw DOM/form labels.
2. It deterministically maps available Discovery inputs into appropriate Strategy fields.
3. It must not invent unsupported facts.
4. Missing Discovery data leaves Strategy fields blank or explicitly unresolved.
5. It may perform light deterministic formatting/combination, but no AI generation is authorized.
6. The operation must never mutate Discovery responses.
7. Drafting creates/updates Strategy state only.

### Protection of human edits
A critical requirement:

**Re-drafting from Discovery must not silently overwrite Strategy fields that a human has edited.**

Builder must implement one of these safe semantics and document it:
- fill only blank/unmodified fields by default; or
- preview proposed refresh changes and require explicit acceptance.

For this milestone, the preferred simple path is: **fill only blank or still-discovery-drafted fields; preserve human-edited fields unless an explicit per-field reset/refresh is chosen.**

## Field Provenance
Each strategy field should be able to report, where applicable:
- source type: `discovery`, `human`, or `unresolved`/equivalent;
- source semantic key(s), e.g. `goals.primary`, `brand.direction`;
- source questionnaire/version and response-set identity where useful;
- source response update timestamp or draft timestamp;
- whether the current Strategy value has been human-edited since drafting.

Do not store a live binding. Provenance explains where the value came from; later Discovery edits do not automatically rewrite Strategy.

## Discovery Change Semantics
Discovery and Strategy remain independent records.

If Discovery answers change after Strategy is drafted:
- Strategy does not silently update;
- the Strategy surface should be able to indicate that newer Discovery input exists for one or more discovery-backed fields, if reasonably implementable within scope;
- Rally can explicitly refresh eligible discovery-drafted fields while preserving human overrides.

A full diff/reconciliation engine is out of scope. A deterministic stale/source-changed indicator is sufficient.

## Strategy Editing UX
Add a compact Strategy surface accessible from Studio 4.

It should:
- show Strategy readiness/state;
- organize fields into concise sections;
- support direct editing;
- show source/provenance subtly, not as noisy technical metadata;
- show which fields came from Discovery vs were manually changed;
- provide **Draft/Refresh from Discovery**;
- indicate missing required decisions;
- keep the Website visually primary.

This is an internal Rally working surface in this milestone. Do not build the client-facing Strategy Packet presentation yet.

## Normalized Strategy Output
Provide a deterministic read-only output boundary such as `getStrategyOutput(strategyId)` for later systems.

The output should expose stable semantic values, for example:
- `business.summary`;
- `business.primaryOffering`;
- `audience.primary`;
- `goals.primary`;
- `actions.primary`;
- `message.positioning`;
- `message.tone`;
- `content.requiredPages`;
- `content.proofPriorities`;
- `brand.direction`;
- `brand.avoidances`;
- `requirements.features`;
- `constraints.launch`;
- `openQuestions`.

This output is the future input to recommendation/adaptation logic. It must not itself choose or mutate Starter Packages, Page Templates, Components, variants, content, or Design Settings.

## State Separation
Strategy operations must not directly:
- create Website edit-history entries;
- mutate canonical Website content;
- mutate Design Settings;
- create or restore Review Versions;
- alter Review Session readiness;
- resolve/reopen Conversations;
- change Tasks;
- create/revoke Approvals;
- modify Discovery answers.

Website Undo/Redo and Review Version restore must not erase Strategy state. Context availability may reconcile through stable Website identity.

## Explicitly Out of Scope
Do not implement:
- AI-generated strategy copy;
- recommendation engine;
- automatic Starter Package selection;
- automatic Page Template or Component selection;
- automatic content generation;
- automatic Design Settings mutation;
- Interactive Strategy Packet;
- Strategy client approval/sign-off;
- Discovery meeting-note objects;
- client homework objects;
- Brand Version system;
- Organizations/Contacts/Projects;
- Client Portal;
- authentication/permissions;
- persistence/database;
- notifications/email;
- deployment/hosting;
- Stage 7+ systems.

## Success Criteria
1. Milestones 01–17 remain intact.
2. Strategy is represented by a separate structured store/model from Discovery and Website Review.
3. Strategy has stable record identity, working-context identity, timestamps, lifecycle and structured fields.
4. Strategy contains the required semantic sections/decisions.
5. `Draft Strategy from Discovery` consumes normalized Discovery semantic outputs rather than UI labels.
6. Drafting is deterministic and does not invent facts.
7. Missing Discovery information remains blank/unresolved rather than fabricated.
8. Field provenance identifies Discovery-backed values and semantic source keys.
9. Human edits are distinguishable from untouched Discovery-drafted values.
10. Re-drafting/refreshing does not silently overwrite human-edited fields.
11. Discovery changes do not automatically rewrite Strategy.
12. Strategy can indicate stale/newer Discovery-backed inputs or otherwise expose a safe refresh path.
13. Strategy readiness is derived from required decisions.
14. Strategy UI supports direct editing and clearly surfaces missing required decisions.
15. Strategy output is deterministic and semantic-key based.
16. Strategy output makes no recommendation and mutates no Website state.
17. Strategy edits remain outside Website Undo/Redo.
18. Website Undo/Redo and Review Version restore do not erase Strategy state.
19. Strategy changes do not affect Review Sessions, Conversations, Tasks, Approvals or Discovery responses.
20. Automated tests cover draft mapping, provenance, human override protection, Discovery-change independence, readiness, normalized output and cross-store separation.
21. No Interactive Strategy Packet/recommendation/Stage 7+ system is partially implemented.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- create/ensure Strategy for current working context;
- initial draft state;
- populate representative Discovery answers;
- Draft Strategy from Discovery;
- verify deterministic field mapping;
- verify provenance/source metadata;
- manually edit drafted Strategy fields;
- change underlying Discovery answers;
- verify Strategy does not silently change;
- refresh and confirm human-edited values are preserved;
- verify missing required fields/readiness;
- inspect normalized Strategy output;
- Website editing before/after Strategy changes;
- Website Undo/Redo independence;
- Review Version capture/restore independence;
- Review/Conversation/Task/Approval independence;
- no runtime errors;
- Framework integrity;
- Studio v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 18 implementation note;
3. Strategy record/field model documentation;
4. Discovery-to-Strategy mapping rules;
5. provenance and human-override semantics;
6. Strategy readiness rules;
7. normalized Strategy Output contract;
8. functional tests/validation results;
9. known limitations;
10. Architecture questions instead of silent scope expansion.

## Architecture Freeze
The frozen scope is an editable, human-owned Strategy/Vision record synthesized deterministically from Discovery, with field provenance, protected human overrides, readiness, and a normalized downstream-output seam. Recommendations, automatic Website changes, Interactive Strategy Packet, Organizations/Projects, Portal and persistence remain deferred.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 18 — Strategy / Vision Records** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Add a structured Strategy domain separate from Discovery and Website state, implement deterministic Draft/Refresh from normalized Discovery inputs with field provenance and protection of human edits, provide a compact Strategy editing/readiness surface and normalized Strategy output seam, preserve Milestones 01–17 and all state-separation boundaries, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.