# Rally Site Studio 4.0 — Milestone 15 Architecture Review

Milestone: `studio-4-m15-guided-review-questionnaire`
Implementation commit: `a1135ab7196411d76fa44943b82993d1edcaa84e`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 15 satisfies the frozen Guided Review Questionnaire architecture and remains correctly bounded to Website review rather than Discovery.

The implementation introduces a versioned system-owned Website review questionnaire with stable ordered question definitions supporting required/optional yes-no, single-choice and free-text responses. Responses retain stable identity, Review Session/question references, actor placeholder, answer and creation/update timestamps.

Questionnaire progress is derived rather than manually stored. Required-question progress is separately available for approval gating. Responses are available only after the Review Session checkpoint exists and become read-only when the session is completed, preserving the meaning of the completed review record.

The Review Session UI presents guided questions alongside Conversation readiness without conflating the two systems. Questionnaire answers neither resolve Conversations nor create approval records.

Approval gating correctly requires both Conversation readiness and required questionnaire completion. A single intentional override reason may override either blocker, and approval evidence records the blocker categories that were overridden. Existing append-only approval/revocation semantics remain intact.

Questionnaire state remains outside canonical Website state and Website Undo/Redo, and remains independent from Tasks and Conversation lifecycle.

Functional evidence reports 61 automated tests passing across Milestones 01–14 and the new questionnaire behavior, plus live browser verification of Review Session start, question presentation, answer persistence and required progress.

## Scope discipline
No questionnaire authoring, branching/conditional logic, Discovery intake, Strategy Packet, Portal access, authentication, persistence, notifications, attachments or deployment systems were introduced.

## Forward architecture notes
1. Stage 5 now has one major roadmap gap remaining: Review/version history. That should be completed before moving into Stage 6 Discovery/Strategy Packet.
2. Future Discovery questionnaires should reuse compatible definition/response primitives where useful, but remain a separate semantic domain from Website review questions.
3. Persisted Review Sessions should freeze the questionnaire definition version used by the session so later system-question revisions cannot reinterpret historical answers.
4. Approval evidence should continue recording explicit overridden blocker categories as new readiness dimensions are added later.

## Decision
Approved. Architecture may create the final Stage 5 Review/version-history milestone.