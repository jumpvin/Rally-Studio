# Studio 4 Milestone 18 — Implementation Note

Milestone 18 adds Strategy/Vision as a human-owned interpretation layer between Discovery evidence and future Website recommendations.

`createStrategyStore()` owns stable Strategy and Website-context identities, optional Discovery response-set identity, actor/timestamps, seventeen structured fields across eight semantic sections, and field-level provenance. Lifecycle is derived: no content is `draft`, partial required decisions are `in-progress`, and all required decisions are `ready`.

Draft / Refresh consumes only normalized Discovery inputs, maps available facts deterministically, and leaves unsupported decisions unresolved. Discovery-backed fields retain semantic keys, questionnaire/version, response-set, and source/draft timestamps. Human edits switch provenance to `human` and are never overwritten. Later Discovery changes produce stale indicators until explicit refresh updates eligible Discovery-backed fields.

The compact Strategy drawer shows readiness, missing decisions, provenance, stale inputs, direct editing, and explicit refresh. `getStrategyOutput()` exports populated semantic values without choosing or changing Website artifacts.

Strategy remains outside Website history and independent from Discovery answers, Review Versions, Review Sessions, questionnaires, Conversations, Tasks, approvals, Website content, and Design Settings. Undo/Redo and Review Version restore retain Strategy state.

Functional validation passed 77 automated tests covering Milestones 01–17 plus drafting, provenance, human override protection, stale refresh, readiness, normalized output, and state separation. JavaScript syntax, Framework integrity, HTTP assets, and Studio v3 preservation passed. AI generation, recommendations, automatic Website changes, Strategy Packet approval, persistence, Portal, and later systems remain out of scope.
