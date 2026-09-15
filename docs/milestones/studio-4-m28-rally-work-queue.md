---
milestone-id: studio-4-m28-rally-work-queue
mode: implementation
status: active
baseline: 843b928a1c249b3a1bc1fede5610ac1e8540a28b
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m28-rally-work-queue.md
  - package.json
affected-surfaces:
  - Rally Work Queue projection
  - Cross-project Needs Attention
  - Work-item provenance and priority
  - Work Queue filtering/navigation
  - Rally Workspace operational overview
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 28

## Title
Rally Work Queue & Unified Needs Attention

## Stage
Stage 7 — Organizations, Projects & Operational Workflow

## Objective
Create a Rally-wide operational Work Queue that answers: **What actually needs attention across all active client Projects right now?**

The queue aggregates existing authoritative signals by reference — Project Next Actions, Project Needs Attention, ready Roadmap checkpoints, explicit Tasks and unresolved collaboration/review work — without converting those signals into a new Task model or manually maintained issue list.

## Architectural Principle
The Work Queue is a projection, not a new work authority.

Each queue item must preserve:
- where it came from;
- why it exists;
- which Organization/Project it belongs to;
- the exact existing identity when one exists;
- where the user should go to act on it.

Resolving an underlying condition makes the projected item disappear/change on recomputation. Queue items themselves are not independently completed.

## Scope
Implement:
1. A deterministic Work Queue projection/service over all non-archived Projects.
2. Queue items from Project domain-derived Next Action.
3. Queue items from Project Needs Attention signals.
4. Queue items from ready manual Roadmap checkpoints requiring Rally action.
5. Queue items from existing open/blocked Tasks.
6. Queue items from unresolved/waiting Conversations relevant to Project work.
7. Review-specific blocker/approval-ready signals where not already represented cleanly by Project Needs Attention.
8. Deduplication/merging rules so the same underlying need is not shown several times without reason.
9. Stable projected queue-item identity derived from source type + source identity/project context.
10. Priority/severity derivation with documented deterministic rules.
11. Provenance metadata and human-readable `why` explanation.
12. Rally Work Queue UI integrated into the Rally-wide workspace.
13. Filters for at least Project/Organization, source/type, priority and status/actionability where useful.
14. Navigation from each item to the authoritative existing surface/record.
15. Compact per-Project queue counts in the multi-project overview.
16. Optional lightweight actor/owner placeholder filtering only if it can reuse existing Task/actor metadata without inventing permissions.
17. Tests proving aggregation, deduplication, identity stability, disappearance after underlying resolution and state separation.

## Queue Item Contract
A projected item should expose at minimum:
- stable derived `id`;
- `projectId`;
- `organizationId`;
- `sourceType`;
- optional `sourceId` for authoritative records;
- `kind`;
- `title`;
- `why` / reason;
- `priority`;
- `target` surface/action;
- optional `referenceId`;
- optional status/age metadata when available from source;
- optional `actorId`/assignee only when sourced from an existing record;
- provenance descriptor sufficient to explain the projection.

Do not persist these items as independent mutable records.

## Source Types
At minimum support:

### Project Next Action
One item per actionable non-paused Project where the derived Next Action represents real work.

Examples:
- Assign Website;
- Complete Discovery;
- Resolve Strategy decisions;
- Review Recommendations;
- Continue Website editing;
- Start Review;
- Resolve Review blockers;
- Approve Website.

Paused/on-hold/archived Projects should not flood the active queue with normal next-action work. Archived Projects are excluded. On-hold Projects may expose a low-priority paused indicator only if useful, but default behavior should omit actionable work until resumed.

### Project Needs Attention
Project attention items from Milestone 25/26 remain projections and may be lifted into the Work Queue with their exact reason/target/reference.

Examples:
- Website unassigned/unavailable;
- stale Strategy input;
- stale Recommendation;
- blocked Task;
- unresolved Conversation;
- incomplete required Review answers;
- approval ready.

### Roadmap
Include ready **manual** checkpoints that require an explicit Rally action. Derived checkpoints that merely report domain truth should not become redundant queue items unless they are blocked and the blocked reason represents actionable work not already covered by Project Next Action/Needs Attention.

Roadmap item should reference the exact Roadmap/checkpoint identity and Project.

### Tasks
Include existing Tasks that are not complete/cancelled according to current Task semantics. Preserve exact Task identity, title, status, assignee/actor metadata and target context.

Blocked Tasks receive higher priority than ordinary open Tasks.

Do not create a queue-specific Task copy.

### Conversations / Review
Include unresolved/waiting Conversations when they represent work requiring Rally attention. If the same Conversation is already surfaced through Project Needs Attention, deduplicate to one item with combined provenance rather than two identical entries.

Review blockers and approval-ready state should similarly avoid duplicate items when already represented through Project summary.

## Deduplication
Define deterministic dedupe keys/rules.

Preferred approach:
- exact authoritative source identity wins for Task/Conversation records;
- multiple projections pointing to the same source record merge provenance;
- Project Next Action and Needs Attention may merge when they have the same target/reference and substantially same underlying condition;
- Roadmap manual checkpoint remains distinct from a Task unless explicitly linked to that Task and the queue can safely present one combined item with both provenances.

Do not over-deduplicate genuinely distinct work simply because titles are similar.

Merged items retain all source provenance descriptors.

## Priority
Use a small deterministic vocabulary such as:
- `critical` only for truly blocking conditions if current semantics justify it;
- `high`;
- `normal`;
- `low`.

Suggested precedence:
- blocked Task / hard Project setup blocker / active Review blocker → high;
- approval-ready or explicit waiting-for-Rally review work → high or normal, document choice;
- Project Next Action → normal unless its reason is blocking;
- ready manual Roadmap checkpoint → normal;
- informational/paused signals → low.

Do not invent deadline urgency when no due-date semantics exist.

## Actionability
Every actionable queue item should provide a target that opens the correct existing context, such as:
- Organization Workspace;
- Project Workspace;
- Website editor;
- Discovery;
- Strategy;
- Recommendations;
- Roadmap checkpoint in Project Workspace;
- Tasks with exact Task selected;
- Review/Conversation with exact record selected.

Navigation does not complete the item. The item disappears/changes only after the authoritative source condition changes.

If a target context is unavailable, show the item as blocked/unavailable with reason rather than navigating to unrelated current Website state.

## Work Queue UI
Add a Rally-facing Work Queue surface accessible from the Rally Workspace.

At a glance it should show:
- total actionable items;
- high-priority/blocking count;
- Organization;
- Project;
- item title;
- why it needs attention;
- source/type;
- priority;
- optional source status/assignee;
- Open action.

Support practical filtering at minimum by:
- Organization/Project;
- source/type;
- priority.

A compact grouping by priority or Project is acceptable. Prioritize scanability over final visual polish.

Provide meaningful empty state: `Nothing currently needs attention` rather than an empty panel.

## Rally Workspace Integration
The existing Rally-wide Projects overview should gain:
- Work Queue entry point;
- total actionable/high-priority summary;
- per-Project queue item count;
- optional top/high-priority item preview where space permits.

Do not replace the Project list with the queue. They answer different questions:
- Projects = what client work exists;
- Work Queue = what needs action now.

## Identity Stability
Because queue items are projections, stable identity must be deterministic across recomputation when the underlying source/condition is unchanged.

Examples:
- Task item ID derives from Project + Task identity;
- Conversation item ID derives from Project + Conversation identity;
- Roadmap item ID derives from Project + Roadmap checkpoint identity;
- Project Next Action/attention item ID derives from Project + stable kind/reference/target condition.

Changing presentation text alone should not create a new identity when the underlying work is unchanged.

## Resolution Semantics
No `Complete Queue Item` button is authorized.

Examples:
- complete Task in Task domain → Task queue item disappears;
- resolve Conversation → Conversation item disappears;
- complete manual Roadmap checkpoint → Roadmap item disappears/advances;
- answer Discovery → Project next action changes;
- refresh stale Recommendation → stale attention disappears;
- assign Website → setup blocker disappears and new Project next action may appear.

This behavior should be immediate through existing subscriptions/recomputation in the in-memory prototype.

## State Separation
Work Queue operations must not:
- mutate Website state;
- create Website Undo/Redo entries;
- alter Project lifecycle/phase;
- complete Tasks;
- resolve Conversations;
- complete Roadmap checkpoints;
- apply Recommendations;
- change Discovery/Strategy;
- create Approval;
- persist independent queue-item status.

Filtering/sorting/navigation are transient UI state only.

## Explicitly Out of Scope
Do not implement:
- queue-item manual completion;
- new generic issue/ticket model;
- deadlines/calendar scheduling;
- SLA logic;
- notification/email delivery;
- automatic assignment;
- staff authentication/permissions;
- persistence/database;
- Client Portal;
- generalized CRM;
- billing;
- AI prioritization;
- deployment;
- final dashboard visual design;
- later roadmap systems.

## Success Criteria
1. Milestones 01–27 remain intact.
2. Work Queue is derived and not independently persisted.
3. Active Project Next Actions appear when actionable.
4. Archived Projects are excluded; on-hold Projects do not expose normal active work.
5. Project Needs Attention items appear with exact reason/target/reference.
6. Ready manual Roadmap checkpoints appear as actionable work.
7. Derived Roadmap checkpoints do not create redundant ordinary queue work.
8. Existing open/blocked Tasks appear with exact Task identities.
9. Existing unresolved/waiting Conversations appear with exact identities when actionable.
10. Review blockers/approval-ready signals appear without duplicate noise.
11. Deterministic deduplication merges multiple projections of the same underlying need.
12. Merged items preserve multiple provenance descriptors.
13. Queue item IDs remain stable across recomputation while source work is unchanged.
14. Priority is deterministic and does not invent unsupported urgency.
15. Every actionable item navigates to the appropriate existing authoritative surface/record.
16. Unavailable context is surfaced honestly and never redirects into unrelated Website state.
17. Completing/resolving underlying Task/Conversation/Roadmap/domain condition updates/removes the queue item automatically.
18. There is no Complete Queue Item action.
19. Queue filters do not mutate domain state.
20. Rally Workspace shows total/high-priority queue summary and per-Project counts.
21. Projects and Work Queue remain distinct navigation concepts.
22. Empty queue has a meaningful state.
23. Queue operations create no Website history.
24. Automated tests cover all source types, dedupe, priority, stable identity, resolution recomputation, paused/archived behavior, navigation metadata and state separation.
25. Live browser validation covers Work Queue scan/filter/open, underlying action resolution and queue recomputation across Northstar and Summit.
26. No new console errors/warnings attributable to this milestone.
27. Studio v3 remains preserved.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- Northstar Project next-action queue item;
- Summit Website-assignment blocker;
- Roadmap ready manual checkpoint item;
- existing Task item and blocked priority;
- unresolved Conversation item;
- dedupe of Conversation/Needs Attention projections;
- archived/on-hold behavior;
- stable IDs across repeated summary calls;
- filter by Organization/Project/source/priority;
- open exact Project/Task/Conversation/Roadmap/domain target;
- resolve/complete source and observe queue recomputation;
- Project queue counts;
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
2. Milestone 28 implementation note;
3. Work Queue item/provenance contract documentation;
4. source aggregation rules;
5. deduplication rules;
6. priority rules;
7. resolution/recomputation behavior;
8. Rally Workspace/Work Queue UX summary;
9. automated/browser validation results;
10. known limitations and next Stage 7 seams;
11. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is a Rally-wide derived Work Queue aggregating existing Project Next Actions, Needs Attention, ready manual Roadmap checkpoints, Tasks and actionable collaboration/review signals with deterministic identity, provenance, deduplication, priority, filtering and navigation. The queue is not a Task/issue authority and has no independent completion state. Persistence, notifications, permissions, Portal and later systems remain deferred.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 28 — Rally Work Queue & Unified Needs Attention** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Build a deterministic non-persisted cross-project Work Queue over existing Project Next Actions/Needs Attention, ready manual Roadmap checkpoints, Tasks and actionable Conversation/Review signals; preserve exact source identities and provenance, deduplicate shared underlying needs, derive supported priority without invented urgency, provide Rally-wide scan/filter/navigation plus per-Project counts, make resolution occur only through authoritative source domains and recompute immediately, preserve all Milestones 01–27 and history/domain boundaries, validate functional aggregation/dedupe/resolution/navigation plus the cumulative suite, and return the completed milestone to Architecture for `Review`.