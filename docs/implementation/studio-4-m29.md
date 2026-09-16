# Studio 4 Milestone 29 — Implementation Note

M29 introduces internal Team Members and ownership on Project, Task and manual Roadmap records. Builder implementation is ready for Architecture Review; acceptance and milestone completion are not claimed.

## Identity and source contracts

`team-store.js` owns stable member IDs, name, optional email and descriptive role, active/archived status and creation/update timestamps. The neutral seed is Rally Lead, Designer and Builder. Roles are product metadata, not Framework roles or permissions. Team does not share identity with client Contacts, Conversation/audit actors or authentication accounts. Management supports create, edit, archive and unarchive; archiving never clears existing references.

The shared `validateAssignment(id,currentId)` accepts explicit null, rejects unknown identities and rejects new assignments to archived members. An unchanged retained archived assignment is valid. Projects record `ownerId`; Tasks record `assigneeId`; manual checkpoints record `ownerId`. Assignment writes change operational metadata only and never mutate Website history, domain readiness, Task status, linked Conversations or completion actors. Project defaults never cascade into Tasks or checkpoints. Derived checkpoint assignment is rejected. Manual reopening preserves ownership while clearing completion evidence.

Existing Task `assignedTo` actor-placeholder fields remain compatible and separate from forward Team assignment. Newly created records normalize `assigneeId` to null unless explicitly assigned. No automatic actor-to-member mapping is inferred, and UI assignments now use Team IDs exclusively. There is no persisted/imported operational dataset to migrate in this runtime.

## Queue ownership and workloads

Queue records remain pure projections. Exact Task/checkpoint ownership supplies `ownerId`, with `ownerSource: explicit`. Other Project, attention, Conversation and Review projections may expose `suggestedOwnerId` from the Project default (`project-default`). Suggestions never persist onto source records, and unassigned Tasks/checkpoints remain unassigned. Deduplication retains explicit source identity/ownership; reassignment does not change queue identity. Effective owner status exposes archived ownership without hiding work.

Queue owner filtering includes all members, archived members and Unassigned, combined with existing filters. Rows distinguish Assigned, Suggested (Project default), Unassigned and archived-owner warnings. Team workload summaries derive open explicitly assigned Tasks, owned ready manual checkpoints, actionable queue work including suggestions, high-priority actionable work and led Projects. Waiting-on-client monitoring and unavailable context are not counted as actionable workload. Archived members remain inspectable with still-owned work; raw records and counts are not capacity estimates.

## UI and validation

Team is available from Projects. Each member card shows editable metadata, source workload titles/counts and separate Archive/Unarchive actions. Project default owner, Task creation/detail assignee and manual checkpoint owner selectors offer active Team members and null; retained archived values are visible but cannot be newly selected. Member display uses safe text/Option APIs, with escaped Task-list member names.

- Functional selected; Presentation and Structural not independently selected. No prior evidence reused.
- Cumulative automated suite: 121/121 passing. New coverage includes Team CRUD/validation, identity separation, legacy Task actors, assignment rejection and archive retention, Project no-cascade/history isolation, manual-only checkpoint ownership, reopen/actor independence, explicit queue precedence, stable IDs, owner/unassigned filtering and derived workload changes.
- Live browser: Team create/edit/archive/unarchive; Project default assignment; Task creation and reassignment; manual checkpoint assignment; owner/suggestion/unassigned filtering; archived Task and ready-checkpoint queue warnings; ready-checkpoint workload count. Browser found overlapping Team Save/Archive hit targets from queue styling; dedicated Team styling and explicit Save handling were added and retested successfully. Console warning/error count: zero.
- JavaScript syntax, installed Framework integrity and HTTP checks passed. Studio 4 entry is `/studio4/index.html` (or `/`); `/studio4/` is not a server directory-index route. Studio v3 `/index.html` remains available and its files unchanged.
- Packaging operations are explicitly not applicable in `repository.operations.json`; no production package/deployment was created. Source plus this note form the development handoff.

## Synchronization and limits

Preflight clean `master` moved safely from `1d155c432ae1dc7756e95c57337155cfddb88a1f` to fetched `e08200eb293ab094c0ae01d62699c3cf9f91158e` (0 ahead / 4 behind). Final pre-commit fetch retained equality at `e08200e` (0/0); dirty paths were solely M29 implementation. Framework lock remains `0.3.13-dev.24.3`, package SHA256 `16817e55c786955d5870b9f2db7d3b6ed17a5cba94f3c11f8aed19a28747ec75`, product build `3.0.0`, target `4.0.0`.

Operational data remains in memory and resets on reload. No authentication, permissions, invitations, scheduling, capacity balancing, automatic assignment, Conversation assignment, notifications, persistence, Portal, HR or deployment is introduced. Architecture owns Review, acceptance and completion.
