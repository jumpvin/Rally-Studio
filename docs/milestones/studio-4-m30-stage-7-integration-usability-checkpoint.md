---
milestone-id: studio-4-m30-stage-7-integration-usability-checkpoint
mode: implementation
status: active
baseline: f982a93ad1e9f9c7365c008eb60f41f4adbbb946
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m30-stage-7-integration-usability-checkpoint.md
  - package.json
affected-surfaces:
  - Rally operational home and navigation
  - Organization and Project workspace integration
  - Roadmap / Work Queue / Team ownership coherence
  - Cross-project context safety
  - Stage 7 usability regression
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 30

## Title
Stage 7 Integration & Usability Checkpoint

## Stage
Stage 7 — Organizations, Projects & Operational Workflow

## Context
Milestones 25–29 introduced the core internal operating system around the Website workflow:
- Projects;
- Organizations and Contacts;
- multiple Project contexts;
- Playbooks and Project Roadmaps;
- Rally-wide Work Queue;
- Team Members and work ownership.

These domains are individually functional. Before persistence, authentication/permissions or Client Portal architecture is added, Rally needs an intentional integration pass so serious operational user testing evaluates one coherent product rather than accumulated prototype surfaces.

## Objective
Harden the Stage 7 operational experience into a coherent Rally-facing workflow that supports a realistic day-to-day sequence:

**Rally Home → Work Queue / Projects → Organization → Project → Roadmap / Task / Next Action → Website workflow → return to operational context**

Fix broken handoffs, ambiguous navigation, duplicated controls, context leakage, confusing ownership presentation and obvious accumulated layout/usability problems without adding a new major product domain.

## Architectural Principle
Integrate existing authorities; do not merge or duplicate them.

Stage 7 surfaces may coordinate and navigate among existing domains, but must preserve:
- Organization as client grouping;
- Contact as client-person record;
- Project as operational work container/reference layer;
- Project phase/Next Action as derived domain truth;
- Roadmap as instantiated process record;
- Task as explicit execution work;
- Work Queue as cross-project projection;
- Team Member as internal ownership identity;
- Website/Discovery/Strategy/etc. as their existing authoritative domains.

## Scope
Implement:
1. Establish a clear Rally operational home/default entry experience around existing Rally Workspace data.
2. Clarify primary navigation among Work Queue, Projects, Organizations/Projects context, Team and Website editor.
3. Remove or consolidate duplicate Stage 7 navigation controls that accumulated across M25–M29.
4. Preserve explicit Organization/Project context while moving between operational surfaces.
5. Make returning from Website/Discovery/Strategy/Recommendations/Review to the owning Project/Rally context predictable.
6. Ensure Work Queue Open actions land in the exact intended Project/source context.
7. Ensure Roadmap target actions land in the correct domain and provide a clear route back.
8. Clarify Project Next Action vs Roadmap Next Checkpoint in Project Workspace.
9. Clarify Assigned vs Suggested ownership throughout Project/Work Queue/Task/Roadmap surfaces.
10. Improve unassigned/archived-owner states so they are actionable and understandable.
11. Normalize Stage 7 headings, spacing, action placement and empty/error states enough for serious user testing.
12. Verify Organization → Project relationships remain legible when several Projects/Contacts exist.
13. Verify multiple Project switching never leaks Northstar Website/domain context into an unavailable/unassigned Project.
14. Add a compact current-context indicator/breadcrumb where necessary so the user knows which Organization/Project/Website they are operating on.
15. Add end-to-end integration tests for realistic operational scenarios.
16. Perform live browser walkthroughs of the full Stage 7 operational loop.
17. Do not add persistence, authentication, Portal or another major domain.

## Rally Operational Home
The Rally-facing entry experience should answer quickly:
- What needs attention now?
- What Projects are active?
- Is anything high priority/blocking?
- Who owns the work?
- How do I get back into a specific client Project/Website?

Use the existing Work Queue, Project summaries and Team ownership projections. Do not create a second dashboard data model.

A restrained home/overview may surface:
- actionable Work Queue total/high count;
- top actionable items;
- active Project count;
- Projects with blockers;
- Team ownership/workload signal;
- navigation to full Work Queue, Projects and Team.

Do not attempt executive analytics or business reporting.

## Navigation Hierarchy
Create a coherent internal navigation model using existing surfaces.

The user should be able to understand the distinction between:
- **Rally Home / Operations** — cross-client overview;
- **Work Queue** — what needs action now;
- **Projects** — all client work;
- **Organization** — one client/business and its Contacts/Projects;
- **Project** — one operational website engagement;
- **Website Studio** — actual Website/Stage 6 work;
- **Team** — internal ownership/workload.

Avoid placing every destination as an equally prominent button everywhere. Use hierarchy and context-sensitive return paths.

## Context Preservation
Track transient operational navigation context safely.

When entering Website/Stage 6 from a Project, Rally should know which Project launched that context and provide an appropriate return path such as `Back to Northstar Advisory Website`.

Requirements:
- navigation context is transient UI state, not duplicate Project/domain ownership;
- direct Website editor entry remains valid even without a Project-return context;
- switching to another Project explicitly replaces operational context;
- unassigned/unavailable Project never inherits current Website merely because it is loaded in memory;
- returning from Stage 6 must not mutate Project/Website/domain state.

## Project Workspace Coherence
Project Workspace should clearly separate:

### Domain truth
- current domain phase;
- Next Action;
- Needs Attention.

### Process guidance
- applied Playbook;
- Roadmap progress;
- current/next checkpoint.

### Execution/ownership
- Project owner;
- Tasks;
- manual checkpoint ownership;
- unresolved Conversations.

The UI should explain enough that a tester does not reasonably assume Next Action and Next Roadmap Checkpoint are duplicates.

Suggested microcopy:
- `Next action — based on the current project state`
- `Next roadmap checkpoint — based on Rally's delivery process`

Builder may improve wording through testing, but semantic separation must remain.

## Ownership Coherence
Across Stage 7:
- explicit Task/checkpoint assignment displays as `Assigned`;
- Project-default responsibility on derived work displays as `Suggested`;
- no owner displays as `Unassigned`;
- archived owner displays as archived and offers an obvious route to authoritative reassignment where practical.

Do not make suggested ownership look persisted.

Project owner changes must not silently reassign Tasks/checkpoints.

## Work Queue Integration
Validate Work Queue as the practical morning entry point.

Requirements:
- Open goes to exact authoritative source/context;
- return path from source to Work Queue/Rally Home is understandable;
- filters survive ordinary queue row opening/return within the current session where practical;
- ownership display/filter remains correct;
- resolving source work updates the queue without manual refresh;
- Project cards/counts remain synchronized;
- no duplicate completion/assignment actions are introduced at queue level.

## Roadmap Integration
Roadmap should be usable from Project Workspace without feeling like a separate application.

Requirements:
- current/next checkpoint is obvious;
- derived vs manual distinction is understandable;
- manual Complete and owner controls are grouped with the relevant checkpoint;
- target/open actions navigate correctly;
- returning to Project preserves the Roadmap context reasonably;
- Roadmap progress updates immediately after source/manual changes.

Do not redesign the Playbook model.

## Organization / Multi-Project Integration
With Northstar and Summit plus created test records:
- Organization Workspace should make Contacts and owned Projects easy to distinguish;
- opening a Project should preserve Organization relationship/context;
- returning to Organization/Projects should be predictable;
- Project status/phase/attention/owner/Roadmap signal should be scanable without overwhelming the list;
- unassigned Summit should remain clearly setup-blocked and never expose Northstar Website actions.

## Team Integration
Team view should remain lightweight but operationally connected:
- workload counts should link/filter into relevant Work Queue work where practical;
- Project-led count should make owning Projects discoverable where practical;
- archived Team Members with unresolved ownership should be visibly separated/flagged;
- Team management actions should not visually compete with daily operational work.

No capacity planning is authorized.

## Visual / Interaction Stabilization
This is not final visual design, but Stage 7 must be testable.

Builder may normalize:
- headers/navigation bars;
- breadcrumbs/context labels;
- card/list spacing;
- button hierarchy;
- filter placement;
- owner/status badges;
- empty states;
- dialogs/forms;
- scroll behavior;
- obvious overlap/clipping;
- narrower desktop/laptop wrapping.

Do not substantially redesign the Website editor/Stage 6 canvas except for return/context navigation necessary for Stage 7 integration.

## Required End-to-End Scenarios
Automated and/or browser validation must cover at least:

### Scenario A — Monday morning / Northstar
1. Open Rally operational home.
2. Identify Northstar work in Work Queue.
3. Open exact next action/source.
4. Navigate into Project and Roadmap.
5. Assign/inspect owner where applicable.
6. Enter Website/Discovery/Strategy work.
7. Return to Northstar Project or Work Queue.
8. Resolve/advance an underlying condition.
9. Confirm queue/project/roadmap projections update coherently.

### Scenario B — Summit setup
1. Open Summit from Projects/Organization.
2. Confirm Website unassigned/setup blocker.
3. Confirm no Northstar Website/Discovery/Strategy data is shown as Summit work.
4. Inspect suggested owner/unassigned behavior.
5. Return to Rally Home/Work Queue.

### Scenario C — Team ownership
1. Open Team.
2. Inspect a Team Member workload.
3. Navigate/filter to their Work Queue items.
4. Reassign a Task/manual checkpoint.
5. Confirm queue ownership updates without changing item identity/status.
6. Archive a Team Member with retained work and confirm archived-owner presentation.

## State and Architecture Boundaries
This milestone must not change authority semantics for:
- Organization/Contact;
- Project lifecycle/phase/Next Action;
- Playbook/Roadmap;
- Tasks;
- Work Queue projection;
- Team Members;
- Website/Discovery/Strategy/Recommendations;
- Review/Conversation/Approval;
- Website Undo/Redo.

Transient navigation/filter/context state may be added where needed, but no duplicate business/domain state.

## Explicitly Out of Scope
Do not implement:
- persistence/database;
- authentication/login;
- permissions/authorization;
- Client Portal;
- invitations;
- notifications/email;
- billing/contracts;
- deployment/hosting;
- analytics/reporting;
- time/capacity planning;
- AI;
- Playbook authoring;
- new major product domain;
- final visual redesign;
- production mobile design;
- later roadmap systems.

## Success Criteria
1. Milestones 01–29 remain intact.
2. Rally has a clear cross-client operational entry experience derived from existing data.
3. Work Queue, Projects and Team have understandable primary navigation roles.
4. Organization → Project → Website/Stage 6 → Project return flow is predictable.
5. Work Queue → exact source → return flow is predictable.
6. Roadmap → exact target → Project return flow is predictable.
7. Operational context never causes Website/domain reassignment or mutation.
8. Summit/unassigned Project never displays Northstar Website/Stage 6 data as its own.
9. Current Organization/Project context is visible where needed.
10. Project Next Action and Roadmap Next Checkpoint remain semantically distinct and visually understandable.
11. Assigned vs Suggested vs Unassigned ownership is consistently distinguishable.
12. Archived-owner work is visible and offers authoritative reassignment path where practical.
13. Project owner changes do not cascade into Task/checkpoint ownership.
14. Work Queue filters/ownership remain coherent across navigation/return.
15. Resolving source work recomputes Work Queue/Project/Roadmap summaries immediately.
16. Organization Workspace remains usable with multiple Contacts/Projects.
17. Multi-project overview remains scanable with phase/attention/owner/Roadmap signals.
18. Team workload navigation/filter integration works without capacity semantics.
19. Stage 7 accumulated controls do not visibly overlap/collapse at primary desktop viewport.
20. Narrower laptop viewport has intentional wrapping/scroll behavior rather than destructive overlap.
21. Website Studio remains Website-first once entered.
22. No new major domain or duplicate state is introduced.
23. Stage 7 operations create no unintended Website Undo/Redo entries.
24. End-to-end tests cover Northstar, Summit and Team scenarios.
25. Cumulative automated suite remains green.
26. Live browser walkthrough completes the three required scenarios with no blocking UX defect.
27. No new console errors/warnings attributable to this milestone.
28. Studio v3 remains preserved.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- Rally operational home/default entry;
- Work Queue ↔ exact source ↔ return;
- Projects ↔ Organization ↔ Project;
- Project ↔ Website/Discovery/Strategy ↔ return;
- Project Next Action vs Roadmap checkpoint presentation;
- Roadmap manual/derived ownership/actions;
- Northstar context preservation;
- Summit no-cross-project leakage;
- Team → workload/queue integration;
- Task/checkpoint reassignment;
- archived-owner presentation;
- Project owner no-cascade behavior;
- live recomputation after source resolution;
- wide desktop and narrower laptop viewport;
- cumulative automated suite;
- JavaScript syntax;
- Framework integrity;
- HTTP assets;
- console health;
- Studio v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 30 implementation note;
3. Stage 7 navigation/context model summary;
4. operational home/workspace integration summary;
5. Project Next Action vs Roadmap UX treatment;
6. ownership UX treatment;
7. Northstar/Summit/Team end-to-end validation results;
8. automated/browser validation results;
9. known remaining Stage 7 usability limitations;
10. recommended user-testing focus areas before persistence;
11. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is a Stage 7 integration/usability checkpoint over Organizations, Contacts, Projects, Roadmaps, Work Queue and Team ownership: coherent operational entry/navigation, safe context preservation/return paths, semantic clarity, ownership clarity, cross-project isolation and baseline usability. No persistence, authentication, Portal or new major domain is authorized.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 30 — Stage 7 Integration & Usability Checkpoint** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Integrate the existing Stage 7 operational domains into one coherent Rally-facing workflow with a clear operations entry point, hierarchical navigation, safe Organization/Project/Website context and return paths, exact Work Queue/Roadmap target navigation, clear Project Next Action versus Roadmap guidance, consistent explicit/suggested/unassigned ownership presentation, cross-project isolation and restrained usability/layout normalization; preserve all Milestones 01–29 and domain/history authorities, validate the required Northstar Monday-morning, Summit setup and Team ownership scenarios plus the cumulative suite, and return the completed milestone to Architecture for `Review`.