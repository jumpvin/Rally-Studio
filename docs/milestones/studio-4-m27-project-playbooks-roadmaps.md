---
milestone-id: studio-4-m27-project-playbooks-roadmaps
mode: implementation
status: active
baseline: e6c5840fdb8d77cefb4b5480ecc2f1745c1b76dd
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m27-project-playbooks-roadmaps.md
  - package.json
affected-surfaces:
  - Project Playbook definitions
  - Project Roadmap/checkpoint records
  - Playbook-to-Project application
  - Roadmap progress and next checkpoint
  - Project Workspace roadmap integration
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 27

## Title
Project Playbooks & Roadmaps

## Stage
Stage 7 — Organizations, Projects & Operational Workflow

## Objective
Introduce reusable Project Playbook definitions and Project-specific Roadmap/checkpoint records so Rally can describe the expected delivery path for a website project, track intentional operational checkpoints, and show what is expected next without replacing the existing derived Project phase, Next Action, or Task system.

## Architectural Principle
Playbook is the reusable plan. Roadmap is the Project's instantiated operational record. Tasks remain execution. Derived Project phase remains truth about current domain state.

`Playbook Definition → Project Roadmap → Checkpoints`

A Roadmap may guide and record the process, but it must not fabricate completion of Discovery, Strategy, Website, Review or Approval domains.

## Scope
Implement:
1. Versioned system-owned Playbook Definition model.
2. One seeded `standard-website` Playbook aligned to the current Rally workflow.
3. Ordered Playbook phases and checkpoint definitions with stable identities.
4. Project Roadmap records instantiated from a Playbook version.
5. Stable Project Roadmap checkpoint records preserving source-definition identity/version.
6. Checkpoint status lifecycle sufficient for operational tracking.
7. Derived checkpoint readiness/blocking from existing Project/domain state where appropriate.
8. Explicit completion for genuinely manual operational checkpoints.
9. Automatic satisfaction/derived completion for checkpoints tied directly to authoritative domain conditions, without writing fake domain state.
10. Roadmap progress and current/next checkpoint derivation.
11. Project Workspace Roadmap section/timeline.
12. Multi-project summary support for Roadmap progress/current checkpoint.
13. Apply Playbook to Project flow.
14. Preserve exact existing Tasks; optional checkpoint→Task references are allowed but no duplicate task model.
15. Tests proving Playbook versioning, Roadmap independence, derived/manual checkpoint semantics and domain separation.

## Playbook Definition Model
At minimum:
- stable `id`;
- `version`;
- `name`;
- optional description;
- system-owned/read-only flag;
- ordered phase definitions.

Each phase definition includes:
- stable `id`;
- title;
- description optional;
- order;
- ordered checkpoint definitions.

Each checkpoint definition includes:
- stable `id`;
- title;
- optional description/helper text;
- order;
- completion mode: `derived` or `manual`;
- optional condition key for derived checkpoints;
- optional target Studio surface/action key;
- optional recommended Task template metadata, but do not automatically create Tasks unless explicitly authorized below.

Definitions are immutable/versioned once applied. Editing/authoring Playbooks is out of scope; Builder seeds one system definition.

## Standard Website Playbook
Seed a concise standard website delivery Playbook matching the architecture already built. Suggested structure:

### Setup
- Project created / Organization assigned (derived from Project identity/context).
- Website assigned (derived).

### Discovery
- Discovery completed (derived).
- Discovery reviewed internally (manual checkpoint).

### Strategy
- Strategy ready (derived).
- Strategy direction confirmed internally (manual).

### Build
- Recommendations reviewed (derived or manual based on available semantics; document choice).
- Initial Website assembled (derived from Website availability/content baseline where practical).
- Internal build review completed (manual).

### Client Review
- Review Session started (derived).
- Required review feedback completed (derived).
- Review blockers resolved (derived).
- Website approved (derived).

### Launch Readiness
- Final pre-launch check completed (manual).

Do not add deployment/hosting itself; Launch Readiness is only an operational checkpoint in this milestone.

Builder may refine wording/condition granularity if it remains aligned with existing domains and documented.

## Project Roadmap Model
Applying a Playbook creates a Roadmap with:
- stable `id`;
- `projectId`;
- `playbookId`;
- `playbookVersion`;
- createdAt/createdBy;
- ordered instantiated phase/checkpoint records.

Each instantiated checkpoint must retain:
- stable Roadmap checkpoint ID;
- source Playbook phase/checkpoint IDs;
- title/description snapshot sufficient for historical stability;
- order;
- completion mode;
- condition key where applicable;
- target surface where applicable;
- status/progress metadata;
- completion timestamp/actor for manual completion;
- optional linked Task IDs.

Later changes to a future Playbook version must not silently rewrite an existing Project Roadmap.

## Checkpoint Status
Use a small vocabulary such as:
- `upcoming`;
- `ready`;
- `blocked`;
- `complete`;
- `skipped` for manual checkpoints only if useful and documented.

Derived checkpoints compute status from authoritative domain conditions. Manual checkpoints may be marked complete explicitly once prerequisite sequencing/readiness permits.

Do not allow manual completion of a derived checkpoint to override reality.

## Derived Conditions
Provide deterministic condition resolvers for the standard Playbook. Examples:
- project context exists;
- Website assigned/available;
- Discovery completed;
- Strategy ready;
- Recommendations generated/reviewable/current;
- Website has meaningful assembled content;
- active Review Session exists;
- required Review questionnaire complete;
- unresolved Review blockers count is zero;
- explicit Approval exists.

Condition resolver returns structured status/reason rather than only boolean where useful.

Do not mutate the underlying domain to satisfy a condition.

## Manual Checkpoints
Manual checkpoints represent operational work that existing domains cannot prove, such as internal review or pre-launch QA.

Marking one complete:
- changes only Roadmap checkpoint state;
- records actor/timestamp;
- creates no Website history;
- does not alter Project derived phase;
- does not resolve Tasks/Conversations;
- does not create Approval.

Allow reopening/resetting a manual checkpoint if simple and document semantics; otherwise require explicit protected action for correction.

## Roadmap Progress
Derive:
- completed checkpoints / total;
- completed phases / total;
- current phase/checkpoint;
- next ready checkpoint;
- blocked checkpoint reasons.

Ordering should normally prefer the earliest incomplete checkpoint while allowing already-satisfied later derived conditions to display their true status without pretending preceding manual work is done.

Project's Milestone 25 `phase` remains derived from domain truth and may differ from Roadmap's current operational phase. The UI should distinguish them if both are shown.

## Roadmap and Project Next Action
Do not replace Milestone 25 `nextAction` with Roadmap.

Instead provide a coordination seam:
- Project nextAction remains domain-derived operational truth.
- Roadmap exposes `nextCheckpoint` / `nextRoadmapAction`.
- Project Workspace may show both, with Project Next Action more prominent.
- If they differ, show why rather than silently forcing one to match the other.

Future Architecture may unify prioritization after user testing.

## Playbook Application
Allow Rally staff to apply the standard Playbook to a Project that has no Roadmap.

Rules:
- one active Roadmap per Project in this milestone;
- application is explicit;
- application snapshots the selected Playbook version into Roadmap checkpoint records;
- application creates no Website/domain history;
- derived checkpoints immediately resolve against current Project/domain state;
- applying to Northstar should recognize work already completed rather than resetting it;
- applying to an unassigned Summit Project should show setup/Website assignment blockers honestly.

Replacing/migrating an existing Roadmap to another Playbook/version is out of scope.

## Task Relationship
Existing Tasks remain the execution primitive.

Roadmap checkpoints may:
- display linked existing Task IDs;
- optionally provide `Create Task` for a manual checkpoint, using the existing Task store and retaining the resulting Task ID as a reference.

If Builder implements Create Task:
- it must use the existing Task model/store;
- Roadmap completion must not automatically equal Task completion unless Architecture already has a safe derived condition for that relationship;
- completing a Task does not automatically complete an unrelated manual checkpoint unless explicitly defined.

Automatic mass Task generation from Playbook application is **not authorized** in M27.

## Project Workspace UX
Extend Project Workspace with a Roadmap area showing:
- applied Playbook name/version;
- overall progress;
- phases/checkpoints in order;
- derived vs manual distinction where useful;
- current/next checkpoint;
- blocked reason;
- manual Complete action where allowed;
- target/open action to relevant Studio surface where defined;
- Apply Playbook empty state when no Roadmap exists.

Keep Project Next Action and Needs Attention prominent. Roadmap should support them, not bury them.

## Multi-Project Workspace
Add a compact Roadmap signal to Project cards/rows where a Roadmap exists:
- progress;
- current/next checkpoint;
- blocked indicator if relevant.

Projects without Roadmaps should remain valid and may show `No playbook` rather than being treated as broken.

## State Separation
Playbook/Roadmap operations must not:
- mutate Website documents;
- create Website Undo/Redo entries;
- alter Discovery/Strategy/Recommendations;
- resolve Conversations;
- complete Tasks except through explicit existing Task actions;
- create/revoke Approval;
- change Project derived phase manually;
- alter Organization/Contact lifecycle.

Derived condition evaluation is read-only over authoritative stores.

## Explicitly Out of Scope
Do not implement:
- Playbook authoring/editor;
- custom client-specific Playbook editing;
- Roadmap migration/version upgrade;
- Gantt/timeline dates/dependencies;
- automatic mass Task creation;
- resource assignment/time tracking;
- persistence/database;
- authentication/permissions;
- Client Portal;
- billing/contracts;
- notifications;
- deployment/hosting;
- AI automation;
- final Stage 7 visual design;
- later roadmap systems.

## Success Criteria
1. Milestones 01–26 remain intact.
2. One versioned immutable system `standard-website` Playbook exists.
3. Playbook contains ordered stable phases/checkpoints.
4. Project can explicitly apply a Playbook when no Roadmap exists.
5. Application snapshots Playbook identity/version and checkpoint definitions into a stable Project Roadmap.
6. Existing Roadmap does not mutate when a separate future definition/version object changes in tests.
7. One active Roadmap per Project is enforced.
8. Derived checkpoints reflect authoritative current domain state.
9. Derived checkpoints cannot be manually forced complete.
10. Manual checkpoints can be completed explicitly with actor/timestamp.
11. Manual completion creates no Website history/domain mutation.
12. Northstar Playbook application recognizes already-satisfied domain conditions.
13. Summit/unassigned Project honestly shows setup/Website blockers.
14. Roadmap progress/current/next checkpoint is derived correctly.
15. Blocked reasons are useful and deterministic.
16. Project domain `phase` remains independent from Roadmap current phase.
17. Project `nextAction` remains authoritative and separate from Roadmap `nextCheckpoint`.
18. Project Workspace displays Roadmap without displacing Next Action/Needs Attention.
19. Roadmap target actions navigate to existing Studio surfaces where defined.
20. Multi-project Workspace shows compact Roadmap progress/current checkpoint when present.
21. Projects without Roadmaps remain valid.
22. Optional Task links, if implemented, preserve exact existing Task identities and do not create a competing Task model.
23. Automated tests cover definition/versioning, application, Northstar/Summit condition resolution, manual/derived completion, progress, navigation metadata and state separation.
24. Live browser validation covers applying Playbook to Northstar and Summit, Roadmap display, manual checkpoint completion and target navigation.
25. No new console errors/warnings attributable to this milestone.
26. Studio v3 remains preserved.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- standard Playbook topology/order/version;
- apply to Northstar;
- immediate derived condition resolution on Northstar;
- apply to Summit unassigned Project;
- setup/Website blocker resolution;
- duplicate active Roadmap prevention;
- manual checkpoint complete behavior;
- derived checkpoint manual-completion rejection;
- progress/current/next derivation;
- Project phase vs Roadmap phase independence;
- Project nextAction vs Roadmap nextCheckpoint independence;
- target navigation into Discovery/Strategy/Recommendations/Website/Review as applicable;
- multi-project Roadmap summary;
- Website Undo/Redo unchanged by Roadmap operations;
- cumulative automated suite;
- JavaScript syntax;
- Framework integrity;
- HTTP assets;
- console health;
- Studio v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 27 implementation note;
3. Playbook definition/version model documentation;
4. standard Website Playbook structure;
5. Project Roadmap/checkpoint model documentation;
6. derived condition resolver rules;
7. manual checkpoint semantics;
8. Project/Multi-project Roadmap UX summary;
9. automated/browser validation results;
10. known limitations and next Stage 7 seams;
11. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is reusable immutable Playbook definitions, one standard Website Playbook, Project-specific instantiated Roadmaps/checkpoints, derived/manual checkpoint semantics, progress/next checkpoint and Project/Multi-project Roadmap presentation. Existing Project phase, Next Action and Tasks remain authoritative in their respective roles. Persistence, Portal, playbook authoring and later Stage 7+ systems remain deferred.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 27 — Project Playbooks & Roadmaps** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Add a versioned immutable standard Website Playbook and Project-specific Roadmap/checkpoint records, derive domain-backed checkpoint status read-only from existing authoritative stores, support explicit manual operational checkpoints without fabricating domain completion, preserve Project phase/Next Action and existing Tasks as separate authorities, integrate Roadmap progress/current/next into Project and multi-project workspaces, apply correctly to both the existing Northstar context and unassigned Summit Project, preserve all Milestones 01–26 and history/domain boundaries, validate functional behavior plus the cumulative suite, and return the completed milestone to Architecture for `Review`.