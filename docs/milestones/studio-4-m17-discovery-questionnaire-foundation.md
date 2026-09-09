---
milestone-id: studio-4-m17-discovery-questionnaire-foundation
mode: implementation
status: implemented
baseline: 2d9975e15dcf110ee489ed22bfd269b8b7cdc834
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m17-discovery-questionnaire-foundation.md
  - package.json
affected-surfaces:
  - Discovery questionnaire definitions
  - Discovery response records
  - Discovery progress and sections
  - Discovery-to-recommendation input boundary
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 17

## Title
Discovery Questionnaire Foundation

## Stage
Stage 6 — Interactive Strategy Packet & Discovery

## Objective
Introduce Discovery as its own structured semantic domain for collecting client/business understanding before Strategy and Website recommendations.

This milestone deliberately begins Stage 6 with the information model and a compact internal Discovery experience. It does not yet build the complete Interactive Strategy Packet, recommendation engine, Organizations/Projects, or Client Portal.

## Architectural Principle
Discovery is not Website Review.

The Review Questionnaire primitives from Milestone 15 may inform implementation technique, but Discovery definitions/responses must have distinct identities, lifecycle and meaning. A Discovery answer describes the client/business/project context; it does not evaluate a Website Review Version.

## Scope
Implement:
1. A Discovery Questionnaire definition model with stable questionnaire/version identity.
2. Ordered Discovery Sections and ordered Question definitions.
3. Structured Discovery Response records with stable identity and actor/timestamps.
4. Required and optional questions.
5. Question types sufficient for the initial workflow:
   - short text;
   - long text;
   - yes/no;
   - single choice;
   - multi choice.
6. A system-owned initial Website Discovery questionnaire with useful sections/questions.
7. Derived section and overall completion/progress.
8. Draft/in-progress/completed Discovery response-set lifecycle derived from answers.
9. A compact internal Discovery surface that lets Rally/client-placeholder actors answer and inspect the questionnaire.
10. Explicit export of normalized recommendation inputs from completed/partial Discovery answers without actually recommending components/templates/packages yet.
11. Tests proving state separation from Website, Review Sessions, Conversations, Tasks, Approvals and Website Undo/Redo.

## Initial Discovery Structure
Seed one versioned system questionnaire, for example `website-discovery` version `1.0.0`, with concise sections such as:

### Business & Audience
Capture items such as:
- what the business/organization does;
- primary audience/customer;
- primary service/product/offering;
- geographic/service-area context where relevant.

### Goals & Actions
Capture items such as:
- primary Website goal;
- most important visitor action;
- secondary actions;
- what success should look like.

### Content & Proof
Capture items such as:
- services/offers that must be represented;
- credibility/proof available;
- testimonials/case studies availability;
- important content/pages the client already knows they need.

### Brand & Direction
Capture items such as:
- existing brand identity availability;
- desired personality/direction using bounded choices plus optional explanation;
- visual preferences/avoidances at a high level.

### Practical Requirements
Capture items such as:
- contact/lead requirements;
- scheduling/ecommerce/other functional needs as bounded options;
- known deadlines or launch constraints as text for now.

Builder may refine wording and exact question count, but the questionnaire should be concise enough to be realistically completed and rich enough to feed later Strategy/Recommendation work.

## Definition Model
Discovery Questionnaire definitions must include at minimum:
- stable questionnaire ID;
- semantic domain/type (`discovery` or equivalent);
- version;
- title/description;
- ordered Section definitions.

Each Section includes:
- stable ID;
- title;
- optional description;
- position/order;
- ordered Question IDs or definitions.

Each Question includes:
- stable ID;
- section ID;
- prompt/label;
- type;
- required flag;
- position/order;
- optional helper text;
- choices where applicable;
- optional semantic key suitable for later recommendation input mapping.

Definitions are system-owned/read-only in this milestone. Questionnaire authoring is out of scope.

## Response Model
Create a Discovery Response Set for the current working context with:
- stable response-set ID;
- questionnaire ID/version;
- createdAt/createdBy;
- updatedAt;
- response records keyed/referenced by Question identity.

Each response record must include:
- stable response ID;
- response-set ID;
- question ID;
- normalized answer appropriate to type;
- answeredBy actor placeholder;
- createdAt;
- updatedAt.

Updating an answer preserves response identity/createdAt. Clearing an answer removes/unsets that answer cleanly.

## Context Identity
Organizations/Projects do not exist yet and must not be partially introduced solely to host Discovery.

For this milestone, Discovery may be associated with the current Website/workspace context using a lightweight `websiteId`/working-context reference. Architect the store so a future Project can own/reference the Discovery Response Set without changing the Question/Response model.

Do not make Discovery part of canonical Website document state.

## Progress
Derive, do not manually toggle:
- answered / total;
- required answered / required total;
- per-section progress;
- overall state:
  - `draft` — no answers;
  - `in-progress` — some but not all required/overall answers;
  - `completed` — all required questions answered (optional questions may remain unanswered).

The UI should make unfinished required sections obvious without overwhelming the user.

## Normalized Recommendation Inputs
Provide a read-only derivation/export boundary such as `getRecommendationInputs(responseSetId)`.

It should return stable semantic values derived from Discovery answers, for example:
- `business.summary`;
- `audience.primary`;
- `goals.primary`;
- `actions.primary`;
- `content.requiredPages`;
- `brand.direction`;
- `requirements.features`.

The exact shape may be refined by Builder if documented, but it must be deterministic and must reference semantic keys rather than UI labels.

This milestone must **not** choose Starter Packages, Page Templates, Components, variants or Design Settings automatically. It only establishes the input contract future recommendation/adaptation milestones can consume.

## UX
Add a compact internal Discovery surface accessible from Studio 4.

It should:
- show sections and progress;
- allow section navigation;
- render the supported question types appropriately;
- save answers immediately/in-memory;
- show required vs optional clearly;
- allow editing existing answers;
- show an overall summary/progress state;
- optionally show a small normalized-input preview for Rally staff, but not as client-facing technical JSON.

Keep the Website visually primary; Discovery is a supporting workflow surface, not a replacement application shell.

## State Separation
Discovery operations must not:
- create Website edit-history entries;
- alter Review Versions;
- alter Review Session readiness;
- resolve/reopen Conversations;
- change Tasks;
- create/revoke Approvals;
- mutate canonical Website content or Design Settings.

Later milestones may intentionally use Discovery inputs to propose/apply Strategy or Website changes, but that connection is not authorized here.

## Explicitly Out of Scope
Do not implement:
- Interactive Strategy Packet;
- Strategy/vision records;
- Discovery meeting notes;
- client homework objects;
- recommendation engine;
- automatic Starter Package/Page Template/Component selection;
- automatic Design Settings changes;
- conditional/branching questionnaire logic;
- questionnaire authoring/editor;
- file uploads/attachments;
- Organizations/Contacts/Projects;
- Client Portal;
- authentication/permissions;
- persistence/database;
- notifications/email;
- AI generation;
- deployment/hosting;
- later roadmap systems.

## Success Criteria
1. Milestones 01–16 remain intact.
2. Discovery has a separate semantic store/model from Review Questionnaire state.
3. One versioned system-owned Website Discovery questionnaire exists.
4. Questionnaire has ordered sections and stable ordered questions.
5. Short text, long text, yes/no, single-choice and multi-choice answers work.
6. Required/optional semantics are represented correctly.
7. Responses have stable identity, actor and created/updated timestamps.
8. Updating an answer preserves response identity and creation timestamp.
9. Clearing an answer updates derived progress correctly.
10. Per-section progress is derived correctly.
11. Overall draft/in-progress/completed state is derived correctly, with completion based on required questions.
12. Discovery UI supports navigation, answering and editing without obscuring the Website-first workspace.
13. Discovery state remains outside Website Undo/Redo.
14. Website Undo/Redo does not alter Discovery answers.
15. Review Version restore does not erase Discovery state; Website-context availability may be reconciled by stable identity.
16. Discovery changes do not affect Conversations, Tasks, Review readiness or Approval evidence.
17. Normalized recommendation inputs are deterministic and semantic-key based.
18. No recommendation or automatic Website mutation occurs from those inputs.
19. Automated tests cover definitions, all answer types, identity/timestamps, progress, clearing, recommendation-input export and cross-store separation.
20. No Stage 6 later-slice or Stage 7+ system is partially implemented.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- questionnaire/section/question structure;
- initial draft state;
- answer each supported question type;
- edit existing answers;
- clear answers;
- required completion semantics;
- section progress;
- normalized recommendation input output;
- Website editing before/after Discovery answers;
- Website Undo/Redo independence;
- Review Version capture/restore independence;
- Review/Conversation/Task/Approval independence;
- no new runtime errors;
- Framework integrity;
- Studio v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 17 implementation note;
3. Discovery definition/response model documentation;
4. initial questionnaire structure;
5. progress/completion semantics;
6. normalized recommendation-input contract;
7. functional tests/validation results;
8. known limitations;
9. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is structured Website Discovery questionnaire definitions/responses, progress, a compact internal answering experience and a normalized recommendation-input seam. Strategy Packet, recommendations, automatic Website changes, Organizations/Projects, Portal and persistence remain deferred.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 17 — Discovery Questionnaire Foundation** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Introduce Discovery as a semantic domain separate from Website Review, add one concise versioned Website Discovery questionnaire with structured sections/questions/responses and derived progress, provide a compact Website-supporting Discovery surface, expose deterministic normalized recommendation inputs without making recommendations or mutating the Website, preserve Milestones 01–16 and all state-separation boundaries, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.

## Implementation Evidence

- Separate versioned Discovery domain with five sections, eleven questions, and all five required answer types.
- Stable normalized responses with actor and creation/update metadata.
- Derived per-section and overall required progress plus compact sectioned UI.
- Deterministic semantic recommendation-input export with no recommendation or Website mutation.
- 72 passing functional tests plus live browser verification of drawer and section navigation.
