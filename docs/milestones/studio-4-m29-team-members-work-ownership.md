---
milestone-id: studio-4-m29-team-members-work-ownership
mode: implementation
status: active
baseline: cf669dfd71135bb8d8887d84e1a44aae9a3de739
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m29-team-members-work-ownership.md
  - package.json
affected-surfaces:
  - Rally Team Member records
  - Task ownership
  - Manual Roadmap checkpoint ownership
  - Project default ownership
  - Work Queue ownership filtering/grouping
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 29

## Title
Rally Team Members & Work Ownership

## Stage
Stage 7 — Organizations, Projects & Operational Workflow

## Objective
Introduce lightweight internal Rally Team Member identities and explicit ownership semantics so Rally can answer not only what needs attention across Projects, but who is responsible for explicit execution work.

Team Members are internal operational identities only. They are distinct from client Contacts, Conversation actors and future authenticated user accounts.

## Architectural Principle
Ownership belongs on authoritative work records, not on the Work Queue projection.

`Team Member → referenced by Project / Task / manual Roadmap checkpoint`

The Work Queue reads that ownership and may derive suggested/default ownership for non-owning projections, but it does not persist its own assignee.

## Scope
Implement:
1. Rally Team Member store/model with stable identity and lifecycle.
2. Seed a small internal Rally team suitable for prototype validation.
3. Project-level default owner/lead reference.
4. Explicit Task assignee migration/normalization to Team Member identity where compatible with existing Task semantics.
5. Explicit owner reference on manual Roadmap checkpoints.
6. Assignment/reassignment UI for Tasks and manual Roadmap checkpoints.
7. Project default-owner assignment UI.
8. Ownership projection into Work Queue items.
9. Work Queue filtering/grouping by Team Member and unassigned work.
10. Suggested/default ownership for Project Next Action / Project Needs Attention / other derived items where no authoritative assignee exists.
11. Team Member workload summary based on projected actionable Work Queue items and explicit Tasks/checkpoints.
12. Team Member archive behavior that preserves historical references and surfaces unassigned/archived-owner conditions honestly.
13. Tests proving ownership reference integrity, reassignment, default/suggested ownership, archive behavior and no permission/auth semantics.

## Team Member Model
At minimum:
- stable `id`;
- `name`;
- optional `email`;
- optional `role/title`;
- status: `active`, `archived`;
- `createdAt`;
- `updatedAt`;
- optional avatar initials/metadata derived for display.

Do not store passwords, login provider IDs, permission roles, sessions or authentication metadata.

## Seed Team
Seed a small neutral Rally team for prototype behavior, for example:
- `Rally Lead`;
- `Designer`;
- `Builder`.

Names may be role-like placeholders rather than real people. Builder should avoid coupling seeded Team Member identity to Framework Builder/Architecture roles; these are product-level operational records.

## Project Ownership
Extend Project with optional `ownerId` / `leadId` referencing an active or historically archived Team Member.

Project owner means default internal responsibility for coordinating that Project. It does not grant permissions.

Rules:
- assignment is explicit;
- changing owner changes Project metadata only;
- no Website history;
- no automatic Task reassignment;
- no automatic Roadmap checkpoint reassignment;
- archived owner reference remains historically visible until explicitly changed;
- a Project may be unassigned.

## Task Assignment
Normalize Task assignment to Team Member identity.

Existing Task `assignedTo` semantics may currently contain actor placeholders/strings. M29 should establish a forward contract such as `assigneeId` referencing Team Member while preserving backward compatibility/migration for existing seeded/test Tasks where necessary.

Requirements:
- Task may be unassigned;
- assign/reassign to active Team Member;
- existing Task identity/status/history semantics remain intact;
- archived Team Member cannot receive new assignments;
- existing Task assigned to a now-archived Team Member retains the reference and surfaces that owner as archived;
- Task completion/status changes remain independent of assignment.

Do not create a second Task model.

## Manual Roadmap Checkpoint Ownership
Manual Roadmap checkpoints may carry optional `ownerId`.

Derived checkpoints do not need persisted ownership because they are state conditions, not explicit execution records.

Rules:
- owner assignment/reassignment changes only Roadmap checkpoint metadata;
- owner must be active for new assignment;
- archived existing owner reference remains visible;
- manual completion actor remains evidence of who completed the checkpoint and is distinct from assigned owner;
- completion does not automatically reassign ownership;
- reopening preserves owner unless explicitly changed.

## Default / Suggested Ownership
For Work Queue projections that do not originate from an explicitly assigned Task/manual checkpoint, expose a non-authoritative `suggestedOwnerId` derived from Project `ownerId` where available.

Examples:
- Project Next Action → suggested Project owner;
- Project Needs Attention → suggested Project owner unless merged into an explicitly assigned Task/Conversation record;
- Conversation/Review item with no explicit internal assignee → suggested Project owner;
- setup blocker → suggested Project owner.

If a queue item merges provenance with an explicitly assigned Task, explicit Task assignee wins as `ownerId`; Project owner may remain as suggestion/provenance only if useful.

Suggested ownership is not persisted back to source records and must be visually distinguished from explicit assignment.

## Conversation Ownership
Do **not** add persisted Conversation assignment in M29 unless an existing Conversation model already safely supports it. Conversations remain collaboration records. Their Work Queue items may inherit Project suggested ownership.

Future Architecture may add explicit Conversation/review responsibility after testing.

## Work Queue Contract Extension
Queue items may expose:
- `ownerId` when the authoritative source has an explicit Team Member assignment;
- `suggestedOwnerId` when responsibility is only derived from Project default owner;
- owner source/provenance such as `task-assignee`, `roadmap-owner`, `project-default`;
- `ownerStatus` if the referenced Team Member is archived/unavailable.

Queue identity must not change solely because ownership changes unless existing identity semantics require it. Ownership is presentation/responsibility metadata, not the identity of the underlying work.

## Work Queue UX
Extend Work Queue with:
- owner display;
- clear distinction between `Assigned to` and `Suggested` where relevant;
- Team Member filter;
- `Unassigned` filter;
- optional grouping by Team Member;
- archived-owner warning/state.

Do not add queue-level assignment controls unless they route to the authoritative source record's assignment API. Preferred M29 UX is assignment within Task/Roadmap/Project surfaces, with queue reflecting the result.

If Builder adds an assignment shortcut from a queue row, it must delegate directly to Task/manual Roadmap/Project assignment and must not store queue state.

## Team Workload Summary
Provide a compact Rally-facing Team view or summary showing each active Team Member:
- explicitly assigned open Tasks count;
- owned ready manual Roadmap checkpoints count;
- projected actionable Work Queue count including suggested Project-owned work;
- high-priority Work Queue count;
- Projects led count;
- optionally a small list of top items.

This is operational visibility, not capacity planning. Do not calculate hours/utilization without source data.

Archived Team Members may be shown in a separate inactive/historical section if they still own unresolved records.

## Team Member Management UX
Provide lightweight internal management sufficient to:
- list active/archived Team Members;
- create Team Member;
- edit name/email/role;
- archive/unarchive Team Member;
- inspect current ownership counts before archive where practical.

Archiving must not silently unassign historical/open work. Instead, Work Queue/Task/Roadmap surfaces should show that the assigned owner is archived and allow explicit reassignment.

Hard delete is out of scope.

## Assignment Validation
Centralize Team Member reference validation where practical:
- active member required for new assignment;
- null/unassigned allowed;
- archived references allowed only as existing historical state, not new assignment;
- unknown Team Member IDs rejected.

Do not infer assignments from names or email strings.

## State Separation
Team/ownership operations must not:
- mutate Website state;
- create Website Undo/Redo entries;
- alter Discovery/Strategy/Recommendations;
- resolve Conversations;
- complete Tasks;
- complete Roadmap checkpoints;
- change Project derived phase;
- create Approval;
- alter Organization/Contact lifecycle;
- create authentication/permission state.

Assignment changes only the owning authoritative metadata record.

## Explicitly Out of Scope
Do not implement:
- authentication/login;
- authorization/permissions;
- invitations;
- staff SSO;
- time tracking;
- capacity/utilization planning;
- working hours/calendars;
- automatic load balancing;
- automatic assignment;
- persisted Conversation assignment unless already supported safely;
- notifications/email;
- persistence/database;
- Client Portal;
- payroll/HR records;
- AI assignment;
- final dashboard visual design;
- later roadmap systems.

## Success Criteria
1. Milestones 01–28 remain intact.
2. Team Member records have stable identity and active/archived lifecycle.
3. Team Members are structurally distinct from client Contacts and auth users.
4. Project can explicitly reference an optional Team Member owner/lead.
5. Project owner changes create no Website history/domain mutation.
6. Task can be unassigned or assigned/reassigned to an active Team Member.
7. Existing Task identity/status semantics remain intact through assignment.
8. Manual Roadmap checkpoint can be assigned/reassigned independently from completion actor.
9. Derived Roadmap checkpoints do not persist owner assignment.
10. Archived Team Member cannot receive new assignment.
11. Existing work assigned to an archived Team Member retains its reference and visibly surfaces archived ownership.
12. Archiving does not silently redistribute/unassign work.
13. Work Queue exact Task/manual-checkpoint items expose explicit ownerId.
14. Derived Project/attention/review items expose Project-owner suggested ownership where appropriate.
15. Explicit source assignment wins over suggested Project ownership during merged projections.
16. Queue item stable identity survives ownership changes.
17. Work Queue filters correctly by Team Member and Unassigned.
18. Assigned vs Suggested ownership is distinguishable in UI.
19. Team workload summary counts explicit Tasks, manual checkpoints, queue items, high priority and led Projects correctly.
20. Projects may remain unassigned without being invalid.
21. Team Member create/edit/archive/unarchive works in-memory.
22. Unknown Team Member assignment is rejected.
23. Assignment/filter/team operations create no Website history.
24. Automated tests cover Team identity/lifecycle, Project/Task/Roadmap assignment, archive behavior, queue projection precedence, suggested ownership, stable identity, workload summaries and state separation.
25. Live browser validation covers Team management, Project owner assignment, Task/checkpoint assignment, Work Queue owner filtering and archived-owner behavior.
26. No new console errors/warnings attributable to this milestone.
27. Studio v3 remains preserved.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- seeded Team Members;
- create/edit/archive/unarchive Team Member;
- assign/unassign/reassign Project owner;
- assign/unassign/reassign Task;
- assign/reassign ready manual Roadmap checkpoint;
- derived checkpoint assignment rejection/no assignment API;
- manual completion actor remains distinct from owner;
- archive owner with open assigned work;
- reject new assignment to archived/unknown member;
- queue explicit Task owner;
- queue explicit Roadmap owner;
- queue suggested Project owner;
- explicit-over-suggested precedence after dedupe;
- queue identity unchanged after reassignment;
- Team Member/Unassigned filters;
- workload summary counts;
- Website Undo/Redo unaffected;
- cumulative automated suite;
- JavaScript syntax;
- Framework integrity;
- HTTP assets;
- console health;
- Studio v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 29 implementation note;
3. Team Member model/lifecycle documentation;
4. Project/Task/Roadmap ownership contract;
5. migration/backward-compatibility note for Task assignment;
6. Work Queue ownership/suggestion precedence rules;
7. Team workload summary rules;
8. management/assignment UX summary;
9. automated/browser validation results;
10. known limitations and next Stage 7 seams;
11. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is internal Rally Team Member identities, Project default ownership, explicit Task and manual Roadmap checkpoint ownership, Work Queue owner/suggested-owner projection/filtering and a lightweight Team workload/management view. Team Members are not Contacts, authenticated users or permission principals. Assignment remains on authoritative records; Work Queue remains a projection. Persistence, authentication, notifications, capacity planning and later systems remain deferred.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 29 — Rally Team Members & Work Ownership** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Add stable internal Team Member identities distinct from Contacts/auth users, Project default ownership, explicit Team Member assignment on existing Tasks and manual Roadmap checkpoints, archived-owner-safe reference semantics, Work Queue explicit/suggested ownership with deterministic precedence and owner filtering, and a compact Team workload/management view; keep assignments on authoritative records rather than queue state, preserve all Milestones 01–28 and Website/domain/history boundaries, validate assignment/archive/projection/workload behavior plus the cumulative suite, and return the completed milestone to Architecture for `Review`.