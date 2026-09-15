# Studio 4 Milestone 25 — Implementation Note

Milestone 25 introduces Project as a stable operational wrapper around the existing Studio Website and workflow domains. It does not create a second Website builder or duplicate Discovery, Strategy, Recommendation, Review, Conversation or Task records.

## Project model and references

`project-store.js` owns stable Project identity, name/description, lifecycle (`active`, `on-hold`, `completed`, `archived`), actor/timestamps, `websiteId`, `discoveryResponseSetId` and `strategyId`. The seeded `Northstar Advisory Website` Project references the existing Northstar Website and current Discovery/Strategy identities. Resolver functions read Recommendation, Review, Conversation and Task records directly from their authoritative stores by Website identity. Missing stable references are returned as unavailable and are never silently reassigned.

Project lifecycle changes update only Project metadata. They do not create Website history, mutate Website content, complete Tasks, resolve Conversations or affect approval evidence. On-hold and archived Projects derive a paused next action while underlying domain state remains unchanged.

## Derived phase and next action

The deterministic phase projection uses this precedence: explicit Review approval → `approved`; active/existing Review → `review`; incomplete Discovery → `discovery`; non-ready Strategy → `strategy`; absent, proposed or stale Recommendations → `recommendations`; otherwise → `build`.

The derived `nextAction` contains a stable `kind`, human label, reason, target surface, optional reference identity and priority. Representative actions route to existing Discovery, Strategy, Recommendations, Website editor, Tasks or Review surfaces. Review derivation distinguishes unresolved Conversations, required questionnaire answers, explicit approval readiness and the need to start a formal Review. No Project Task is created for this projection.

## Needs Attention and aggregation

Needs Attention is derived from unavailable references, stale Discovery-backed Strategy fields, stale Recommendations, unresolved Conversations, blocked Tasks, incomplete required questions in an active Review and approval-ready Reviews. Items preserve and navigate with existing identities. Task and Conversation summaries likewise reference the exact authoritative records rather than copying them.

## Project Workspace

The new Rally-facing Project utility opens a compact full-workspace overview showing Project lifecycle, derived phase, Website identity, prominent next action, Stage 6 readiness, Needs Attention, existing Tasks and unresolved Conversations. Next actions open the corresponding existing Studio surface. `Return to Website editor` restores the Website-first editing experience.

## Functional validation

- Automated: 99/99 cumulative tests passed. Project coverage proves stable identity/reference resolution, lifecycle isolation, complete phase progression, representative next actions, stale/blocked/unresolved attention, exact Task/Conversation identity aggregation, approval derivation and missing-context behavior.
- Live browser: Project open; derived Discovery phase and next action; Project → Discovery navigation; Project return; Project → Website return; lifecycle active → on-hold → active with paused/resumed next action; empty initial Task/Conversation/attention projections; zero console warnings/errors.
- JavaScript syntax, installed Framework integrity, HTTP assets, diff hygiene and Studio v3 preservation passed.

## Known Stage 7 seams

The current milestone intentionally supports one seeded in-memory Project. Organization/Contact ownership, multi-project dashboards, persistence, generalized playbooks, richer roadmaps, Portal, authentication and final Stage 7 visual design remain later milestones. When a Website is deliberately replaced with a new identity, the Project reports its prior Website reference as unavailable; future explicit reassignment policy belongs to Architecture rather than being inferred here.
