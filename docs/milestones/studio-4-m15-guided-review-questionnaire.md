---
milestone-id: studio-4-m15-guided-review-questionnaire
mode: implementation
status: active
baseline: f5937fb48188d17dc802afc7c61f42e35613df9d
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m15-guided-review-questionnaire.md
  - package.json
affected-surfaces:
  - Review Session guided questionnaire
  - Review question definitions
  - Review responses and completion state
  - Review readiness summary
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 15

## Title
Guided Review Questionnaire

## Objective
Add a lightweight guided-review layer inside formal Review Sessions so a client can respond to intentional structured questions in addition to leaving contextual Conversations.

This milestone completes the questionnaire portion of Stage 5 without starting Discovery/Strategy. Review questions are about evaluating the presented Website checkpoint; they are not Discovery questions about business goals, brand strategy, or requirements gathering.

## Scope
Implement:
1. A structured Review Question definition model.
2. A Review Response model owned by Review Session collaboration state.
3. A small default Certified/system questionnaire used when creating or starting a Review Session.
4. Question types sufficient to prove the model: single-choice, yes/no, and free-text.
5. Ordered guided-review UI inside the Review Session surface.
6. Required vs optional questions.
7. Draft/in-progress/completed questionnaire state derived from responses.
8. Save/update responses without touching Website document history.
9. Review Session summary showing questionnaire completion alongside Conversation readiness.
10. Explicit approval gating that can require required questionnaire questions to be answered, while remaining independent from Conversation resolution.
11. Functional tests covering response lifecycle, required questions, approval gating, Website-history separation, and prior milestones.

## Question Definition Model
A Review Question must have stable structured metadata, at minimum:
- `id`;
- `label`/prompt;
- `type`;
- ordered position;
- `required` boolean;
- optional choices for choice-based questions;
- optional helper text.

Definitions may be code-seeded/system-owned in this milestone. Do not build questionnaire authoring, Library promotion, or arbitrary form-builder infrastructure.

## Review Response Model
Responses belong to one Review Session and must include, at minimum:
- stable response/question identity association;
- `reviewSessionId`;
- `questionId`;
- answer value;
- actor placeholder;
- created/updated timestamps.

Responses are collaboration/review state, not Website document state.

Changing an answer must not alter Website Undo/Redo history, Task state, Conversation status, or Approval records already created.

## Default Guided Review
Provide a concise questionnaire appropriate to Website V1 review. It should focus on questions such as:
- Does the overall direction feel right?
- Is the primary message clear?
- Does the visual style feel appropriate?
- Is anything important missing?

Exact wording is Builder-owned, but questions must evaluate the presented Website rather than drift into Discovery.

At least one question must be required and at least one must allow free-text feedback.

## Review Session Integration
A Review Session owns/references one questionnaire definition/version and its responses.

Starting a Review Session must make the questionnaire available alongside its existing checkpoint and Conversations. The questionnaire must not copy or replace the Website checkpoint.

Questionnaire progress should be visible in the Review Session summary, for example answered required questions / total required questions.

A completed Review Session remains inspectable with its responses.

## Approval Semantics
Approval remains explicit and append-only as established in Milestone 13.

For this milestone:
- required questionnaire questions must be answered before normal approval;
- unresolved Conversations continue to use the existing override-reason behavior;
- unanswered required review questions should block approval unless an explicit questionnaire override reason/equivalent intentional override is supplied;
- questionnaire completion does not automatically approve a Review Session;
- answering all questions does not resolve Conversations;
- resolving all Conversations does not answer questionnaire questions.

Builder may use one combined approval override field if it clearly communicates which blockers are being overridden, or separate blocker reasons if cleaner.

## Guided Review UX
Keep the Website visually primary.

The Review Session surface should provide a compact guided-review section or stepper that:
- shows one question at a time or a short ordered list;
- clearly marks required questions;
- preserves entered responses while navigating;
- shows completion/progress;
- lets the reviewer update answers before session completion;
- does not cover the Website with persistent chrome.

Contextual Conversations remain available separately through the existing Comments experience.

## Separation Rules
Review questionnaire operations must remain independent from:
- Website document transactions/Undo/Redo;
- Conversation status and replies;
- Task status and assignment;
- existing Approval record history.

Website edits after questionnaire answers do not silently erase responses. The Review Session checkpoint still identifies what was presented when the session began.

## Explicitly Out of Scope
Do not implement:
- Discovery questionnaires;
- business/brand intake forms;
- Strategy Packet;
- arbitrary form/questionnaire builder;
- branching/conditional questions;
- attachments/uploads;
- client authentication/permissions;
- Portal exposure;
- notifications;
- database persistence;
- legal e-signature;
- review/version history UI beyond the existing Review Session checkpoint;
- deployment/publishing;
- later Stage 6+ systems.

## Success Criteria
1. Milestones 01–14 remain functional.
2. Review Questions and Responses are structured collaboration objects separate from Website document state.
3. Review Sessions expose an ordered guided questionnaire.
4. At least three useful Website-review questions exist using at least three supported response types across the seed set.
5. Required and optional questions are supported.
6. Responses retain actor and timestamp metadata.
7. Responses may be edited without creating Website history entries.
8. Questionnaire progress/completion is correctly derived.
9. Review Session summary shows questionnaire progress separately from Conversation readiness.
10. Completing the questionnaire does not alter Conversation states.
11. Conversation changes do not alter questionnaire answers.
12. Task changes do not alter questionnaire answers.
13. Normal approval is blocked when required questions are unanswered.
14. Intentional approval override for unanswered required questions is possible and recorded as evidence.
15. Existing unresolved-Conversation approval gating continues to work.
16. Questionnaire completion never automatically creates approval.
17. Existing Approval records remain append-only and are not rewritten when answers later change.
18. Completing a Review Session leaves questionnaire responses inspectable.
19. Website Undo/Redo does not undo questionnaire answers.
20. Automated tests cover response CRUD/update, required completion, approval blockers/override, independence from Conversations/Tasks/Website history, and prior regression.
21. No Discovery/Strategy/Portal/persistence/later-stage system is partially implemented.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- create/start a Review Session;
- answer yes/no, single-choice and free-text questions;
- update a previous answer;
- observe progress change;
- leave one required question unanswered and verify normal approval is blocked;
- intentionally override and verify evidence is retained;
- prove questionnaire completion alone does not approve;
- create/resolve/reopen Conversations and verify answers are unchanged;
- create/update Tasks and verify answers are unchanged;
- edit/Undo Website content and verify responses are unchanged;
- complete the Review Session and verify responses remain inspectable;
- no runtime regressions;
- Studio v3 remains preserved.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 15 implementation note;
3. Review Question/Response model documentation;
4. questionnaire progress/completion semantics;
5. approval-gating/override semantics;
6. functional tests and validation results;
7. known limitations;
8. Architecture questions instead of silent scope expansion.

## Architecture Freeze
The frozen scope is a guided Website-review questionnaire inside Review Sessions, with structured answers and explicit approval gating. Discovery questionnaires, Strategy Packet, Portal, persistence and later-stage systems remain deferred.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 15 — Guided Review Questionnaire** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Add structured Review Question/Response state inside existing Review Sessions, provide a concise guided Website-review flow with required/optional questions and progress, integrate required-question completion into explicit approval gating without conflating it with Conversations or Tasks, keep questionnaire state outside Website Undo/Redo, preserve Milestones 01–14, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.