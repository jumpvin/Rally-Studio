# Studio 4 Milestone 17 — Implementation Note

Milestone 17 introduces Discovery as a semantic domain separate from Website Review, Website document state, and all collaboration/workflow records.

## Definition and response model

The system-owned `website-discovery` questionnaire version `1.0.0` contains five ordered sections: Business & Audience, Goals & Actions, Content & Proof, Brand & Direction, and Practical Requirements. Eleven stable questions cover short text, long text, yes/no, single choice, and multi choice. Definitions include stable IDs, section identity, position, required status, bounded choices where applicable, and semantic recommendation keys.

A Discovery response set is associated with a lightweight Website working-context ID and retains questionnaire identity/version, actor and timestamps, plus response records keyed by question. Each response has stable identity, normalized scalar or array answer, actor, and creation/update timestamps. Updating preserves identity and creation time; clearing removes the response cleanly.

## Progress and recommendation-input boundary

Progress is derived for every section and overall. No answers is `draft`, partial required completion is `in-progress`, and all required answers is `completed`; optional answers do not block completion. The compact Discovery drawer provides section navigation, required progress, immediate in-memory editing, all five control types, and a small human-readable input preview while keeping the Website primary.

`getRecommendationInputs()` deterministically maps responses through semantic keys into grouped inputs such as `business.summary`, `audience.primary`, `goals.primary`, `actions.primary`, `content.requiredPages`, `brand.direction`, and `requirements.features`. It makes no recommendation and applies no Website changes.

## Separation and validation

Discovery create/edit/navigation/export operations create no Website history and do not alter Review Versions, Review Sessions, questionnaires, Conversations, Tasks, approvals, Website content, or Design Settings. Website Undo/Redo and Review Version restore leave Discovery answers intact; the original Website context is merely reported unavailable when identities differ.

Functional validation passed 72 automated tests covering Milestones 01–16 plus definition topology, all answer types, response identity/timestamps, clearing, section and overall progress, semantic export, Website-history independence, version restore, and cross-store separation. JavaScript syntax, Framework integrity, HTTP assets, Studio v3 preservation, and live Discovery drawer/section navigation passed.

Strategy records, recommendations, automatic Website changes, questionnaire authoring, branching, attachments, Organizations/Projects, Portal access, authentication, persistence, notifications, and later-stage systems remain intentionally out of scope.
