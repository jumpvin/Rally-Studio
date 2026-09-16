# Rally Site Studio 4.0 — Milestone 29 Architecture Review

Milestone: `studio-4-m29-team-members-work-ownership`
Implementation commit: `8ce50e97c18f4cc7281247f9aa88b8eea635c9b5`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 29 satisfies the frozen Rally Team Members & Work Ownership architecture.

Team Members are implemented as a distinct internal operational identity domain with stable IDs, descriptive metadata and active/archived lifecycle. They remain structurally separate from client Contacts, Conversation/audit actors and future authenticated users/permission principals.

Ownership is correctly attached to authoritative records rather than the Work Queue. Projects carry optional default `ownerId`, Tasks carry forward `assigneeId`, and manual Roadmap checkpoints carry optional `ownerId`. Assignment changes affect only operational metadata: Project defaults do not cascade, Task status is independent, Roadmap completion actor remains distinct from checkpoint owner, reopening preserves owner, and derived checkpoints reject assignment.

Assignment validation is centralized around explicit identity. Null/unassigned is allowed; unknown IDs and new assignments to archived members are rejected; retained archived assignments remain historically valid. Archiving a Team Member does not silently redistribute or clear work.

Task backward compatibility is handled conservatively: legacy `assignedTo` actor-placeholder data remains separate while forward Team assignment uses `assigneeId`. No name/email inference or automatic migration is performed.

Work Queue ownership preserves its projection boundary. Exact Task/manual-checkpoint assignment supplies explicit owner metadata. Project/attention/Conversation/Review projections may expose Project-owner suggested responsibility without persisting it. Explicit source assignment wins over suggestions after deduplication, and ownership changes do not change queue identity. Owner filtering includes active/archived Team Members and Unassigned, while UI distinguishes Assigned, Suggested and archived-owner states.

Team workload summaries are derived operational counts rather than capacity estimates: explicitly assigned open Tasks, owned ready manual checkpoints, actionable queue work including suggestions, high-priority work and Projects led. Waiting-on-client/unavailable context is excluded from actionable workload.

Live browser validation also caught a Team Save/Archive hit-target overlap caused by inherited queue styling; Builder corrected it with dedicated Team styling and retested successfully.

Automated evidence reports 121/121 cumulative tests passing across Team CRUD/identity separation, assignment validation/archive retention, Project no-cascade/history isolation, Task compatibility, manual-only checkpoint ownership, completion actor independence, queue precedence/stable IDs/filtering and workload derivation. Browser validation covered Team management, Project/Task/checkpoint assignment, owner filters and archived-owner behavior with zero console warnings/errors.

## Scope discipline
No authentication, authorization, invitations, staff SSO, time/capacity planning, automatic assignment, persisted Conversation assignment, notifications, persistence, Portal, HR/payroll or deployment was introduced.

## Forward architecture notes
1. Stage 7 now has the major internal operational primitives: client hierarchy, Projects, Roadmaps, Work Queue and Team ownership. The next milestone should be an intentional Stage 7 integration/usability checkpoint before adding persistence or Portal/authentication.
2. Validate Rally Workspace → Work Queue → Project → Roadmap/Task → Website flows as one operational product, including whether ownership and suggested ownership are understandable rather than merely correct.
3. Consolidate accumulated Stage 7 navigation/chrome where necessary, but do not redesign Stage 6 Website editing semantics during that checkpoint.
4. After integration/user testing, persistence is a likely next architectural boundary because Organizations, Contacts, Projects, Team Members and operational records now form a sufficiently coherent graph to persist intentionally.

## Decision
Approved. Architecture may create the Stage 7 integration/usability checkpoint.