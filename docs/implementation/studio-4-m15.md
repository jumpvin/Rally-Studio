# Studio 4 Milestone 15 — Implementation Note

Milestone 15 adds a compact guided Website-review questionnaire to formal Review Sessions. Questionnaire definitions and responses are collaboration state: they do not enter the Website document, its snapshots, or Undo/Redo history.

## Definitions, responses, and progress

The system-owned `website-v1-review` questionnaire is versioned `1.0.0` and contains four ordered questions: required yes/no direction feedback, required single-choice message clarity, optional yes/no visual-style feedback, and optional free-text missing-content feedback. Definitions carry stable IDs, prompt, type, position, required status, choices, and helper text.

Each response retains a stable ID, Review Session and question IDs, answer, actor placeholder, and created/updated timestamps. Updating an answer preserves its creation identity and timestamp. Clearing an answer removes that response. Responses become available after the Review Session captures its checkpoint and become read-only when the session is completed.

Progress is derived rather than manually set: no answers is `draft`, a partial set is `in-progress`, and all questions answered is `completed`. Required progress is reported separately as answered required questions over total required questions.

## Review and approval semantics

The existing Review Session panel presents the ordered questions, entered values, helper text, required markers, and progress alongside—without conflating it with—Conversation readiness. Questionnaire completion never resolves Conversations and never creates approval.

Normal approval now requires both resolved Conversations and all required questionnaire answers. A single explicit override reason may intentionally override either or both blockers. Approval evidence records the exact blocker categories overridden, while the append-only approval/revocation history remains unchanged by later response edits.

## Separation and validation

Questionnaire answers remain independent from Website edits and Undo/Redo, Conversations, Tasks, and Approval history. Completed sessions retain inspectable answers. Functional validation passed 61 automated tests covering Milestones 01–14 plus definition structure, response create/update metadata, derived progress, required-answer approval gating and override evidence, cross-store independence, Website-history separation, and completed-session retention. Live browser validation passed for session start, questionnaire presentation, response persistence, and required progress.

Questionnaire authoring, branching, attachments, Discovery intake, Strategy, Portal access, authentication, persistence, notifications, and deployment remain intentionally out of scope.
