---
milestone-id: studio-4-m26-organizations-contacts-multiple-projects
mode: implementation
status: implemented
baseline: 49f136a1454decc22b9ccd29504d0872a8931164
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m26-organizations-contacts-multiple-projects.md
  - package.json
affected-surfaces:
  - Organization records
  - Contact records and organization relationships
  - Multiple Project records and organization ownership
  - Client/project workspace navigation
  - Multi-project operational summary
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 26

## Title
Organizations, Contacts & Multiple Projects

## Stage
Stage 7 — Organizations, Projects & Operational Workflow

## Objective
Expand the single-Project operational foundation into a small multi-client Rally workspace by introducing stable Organization and Contact identities and allowing multiple Projects to coexist under Organizations while preserving each Project's references to the existing Studio domains.

This milestone establishes the client/project hierarchy and multi-project navigation. It does not yet introduce persistence, authentication, a Client Portal, generalized CRM, playbooks or billing.

## Architectural Principle
Organization organizes people and Projects; Project coordinates work; existing Studio domains remain authoritative.

Hierarchy:
`Organization → Contacts + Projects`
`Project → references Website / Discovery / Strategy / Recommendations / Review / Conversations / Tasks`

Organization must not absorb Website/Discovery/Strategy state, and Contacts must not become user/authentication records in this milestone.

## Scope
Implement:
1. Organization store/model with stable identity and lifecycle.
2. Contact store/model with stable identity and Organization relationship.
3. Explicit Project `organizationId` ownership/reference.
4. Support multiple Project records in the existing Project store.
5. Preserve the current Northstar Advisory Project and place it under a seeded Northstar Advisory Organization.
6. Add at least one additional seeded Organization/Project context sufficient to validate multi-project behavior without duplicating the Northstar Website identity.
7. Organization Workspace showing Organization details, Contacts and Projects.
8. Multi-project Rally Workspace/dashboard showing Projects across Organizations with derived phase, next action and Needs Attention summaries from Milestone 25.
9. Project switching/navigation that changes operational context explicitly and safely.
10. Contact create/edit/archive basics appropriate to an in-memory prototype.
11. Organization create/edit/lifecycle basics appropriate to an in-memory prototype.
12. Project create basics that can create an operational Project shell without inventing Website/domain records.
13. Explicit Website assignment/reassignment policy for Projects.
14. Tests proving identity isolation, Organization/Project relationships, multi-project summaries and no cross-project leakage.

## Organization Model
At minimum:
- stable `id`;
- `name`;
- lifecycle/status: `active`, `inactive`, `archived`;
- optional internal description/notes field for lightweight context;
- `createdAt`;
- `updatedAt`;
- `createdBy` actor placeholder.

Organization should derive/reference its Contacts and Projects through their `organizationId`; avoid storing mutable duplicate arrays if not necessary.

Organization lifecycle changes do not automatically archive Projects or Contacts.

## Contact Model
At minimum:
- stable `id`;
- `organizationId`;
- `name`;
- optional `email`;
- optional `phone`;
- optional `role/title`;
- status: `active`, `archived`;
- optional `isPrimary` or equivalent primary-contact marker scoped to the Organization;
- `createdAt`;
- `updatedAt`.

Contacts are business/client records only. They are **not** authenticated Portal users, Rally staff users, permission principals or Conversation actors in this milestone.

If primary-contact semantics are implemented, at most one active primary Contact should be derived/enforced per Organization, with a documented fallback when none exists.

## Project Extension
Extend Milestone 25 Project with:
- required `organizationId`;
- optional lightweight project description/label remains allowed;
- existing lifecycle/status and domain references remain intact.

Multiple Projects may belong to one Organization.

Changing a Project's Organization relationship is allowed only as explicit Project metadata editing; it must not change Website/domain identities.

## Seed Data
Preserve existing user-testing context:
- Organization: `Northstar Advisory`;
- existing Project: `Northstar Advisory Website`;
- existing Northstar Website/Discovery/Strategy references remain unchanged.

Add at least one second Organization and one Project for validation. The second Project should not point at Northstar's Website. It may initially be an unassigned Project shell with `websiteId: null` if the Project model is updated to support explicit unassigned state.

Do not clone the Northstar Website merely to create another Project.

## Website Assignment Policy
Milestone 25 surfaced missing Website references but deferred reassignment policy. M26 must make this explicit.

A Project may be:
- `unassigned` — no Website yet;
- assigned to one stable Website identity.

Rules:
1. A Website identity may belong to at most one active/non-archived Project in this prototype unless Architecture later authorizes shared Website ownership.
2. Assigning a Website is explicit; never infer based on names.
3. Reassignment requires an explicit user action and should warn/confirm if replacing an existing Project Website reference.
4. Reassignment changes only the Project reference. It does not move/copy/delete Website, Discovery, Strategy, Recommendations, Review, Conversations or Tasks.
5. Domain resolution after reassignment follows stable Website/context identity; prior referenced records remain historical/unavailable to the new Project unless separately linked by future architecture.
6. Assignment/reassignment creates no Website Undo/Redo transaction.

For the current in-memory prototype, the assignment UI may be compact and Rally-internal.

## Project Creation
Allow Rally staff to create a Project shell with:
- Organization;
- name;
- lifecycle default active;
- optional Website assignment from currently unassigned Website identities if available.

Creating a Project must not automatically create a Website, Discovery, Strategy or Review records. A later workflow may create/assign Website work intentionally.

## Organization Workspace
Provide a compact Organization view showing:
- Organization name/status;
- primary Contact if available;
- Contact list;
- Projects belonging to the Organization;
- each Project's status/phase;
- next action;
- Needs Attention count;
- ability to open a Project Workspace;
- basic create/edit Contact and create Project actions.

Do not turn this into a full CRM record screen.

## Multi-Project Rally Workspace
Provide an internal Rally-facing Projects overview across Organizations.

At minimum show/filter enough to answer:
- What active Projects exist?
- Which Organization owns each?
- What phase is each Project in?
- What needs attention?
- What is the next action?
- Which Projects are on hold/completed/archived?

A compact table/card/list is acceptable. Prioritize operational scanability over final visual polish.

Selecting a Project opens the existing Milestone 25 Project Workspace, from which Website/Discovery/etc. navigation continues normally.

## Context Switching
Switching Projects must be explicit and must not mutate the currently referenced Website/domain data.

The operational shell may maintain a transient selected Organization/Project ID. Opening a Project with an assigned Website should allow navigation into that Website's Studio context if that Website exists in the current in-memory document model.

Because the current prototype document store may only hold one canonical Website at a time, Builder must not fake multi-Website persistence. If an additional Project's Website is unavailable in the current runtime, the Project Workspace should clearly show `Website unassigned` or `Website unavailable` and disable Website-specific navigation while preserving Project identity.

Do not duplicate or overwrite Northstar state to simulate multi-project switching.

## Multi-Project Summaries
Reuse Milestone 25 derivation for Projects whose referenced domain context is available.

For unassigned/unavailable Website Projects, derive a clear operational state such as:
- phase: `setup` or documented equivalent;
- next action: `Assign Website`;
- Needs Attention: Website unassigned/unavailable.

Builder may extend phase vocabulary with `setup` specifically for this need, documenting precedence.

Do not invent Discovery/Strategy completion for Projects whose Website/domain context is unavailable.

## Contact / Organization Editing
Basic in-memory CRUD-lite is authorized:
- create Organization;
- edit Organization name/description/status;
- create Contact under Organization;
- edit Contact fields;
- archive/unarchive Contact;
- choose/change primary Contact if implemented;
- create Project shell.

Hard delete is not required. Prefer archive semantics for Organization/Contact records in this milestone.

These operations create no Website history.

## State Separation
Organization/Contact/Project metadata operations must not:
- mutate Website documents;
- create Website history;
- alter Discovery/Strategy/Recommendations;
- resolve Conversations;
- alter Tasks;
- alter Review/Approval evidence;
- create Portal/authentication identities.

Project navigation into those domains remains allowed and follows existing semantics.

## Explicitly Out of Scope
Do not implement:
- persistence/database;
- authentication/permissions;
- Client Portal;
- invitation/email flows;
- full CRM pipelines/leads/opportunities;
- billing/contracts/invoices;
- generalized playbooks;
- project roadmap/milestone authoring;
- resource/time tracking;
- notifications;
- AI automation;
- deployment/hosting;
- multi-tenant security;
- production multi-Website persistence;
- final dashboard visual design;
- later roadmap systems.

## Success Criteria
1. Milestones 01–25 remain intact.
2. Organization records have stable identity/lifecycle.
3. Contact records have stable identity and Organization relationship.
4. Project records have explicit Organization ownership/reference.
5. Existing Northstar Project retains its existing Website/Discovery/Strategy context under Northstar Organization.
6. Multiple Projects can coexist without sharing/copying domain state accidentally.
7. A second Project can exist unassigned without cloning Northstar Website state.
8. Organization Workspace lists exact related Contacts and Projects.
9. Multi-project Workspace lists Projects across Organizations with operational summaries.
10. Available-context Projects reuse derived phase/nextAction/Needs Attention from Milestone 25.
11. Unassigned/unavailable Projects clearly derive setup/assign-Website behavior rather than fake workflow progress.
12. Project switching does not mutate Website/domain state.
13. Project → Project Workspace → existing Studio navigation remains functional for Northstar.
14. Website assignment is explicit and prevents accidental active sharing of one Website identity across Projects.
15. Reassignment does not move/copy/delete domain records or create Website history.
16. Creating Organization/Contact/Project metadata creates no Website history.
17. Contact editing/archive does not affect Project/domain records.
18. Organization lifecycle changes do not silently change Project/Contact lifecycle.
19. No cross-Organization Contact/Project leakage occurs.
20. Automated tests cover identity, relationships, multiple Projects, setup state, assignment conflict/reassignment and state separation.
21. Live browser validation covers multi-project overview → Organization → Project → Northstar Website workflow and an unassigned Project state.
22. No new console errors/warnings attributable to this milestone.
23. Studio v3 remains preserved.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- seeded Northstar Organization/Project relationship;
- second Organization/Project creation/seed;
- Organization create/edit/status;
- Contact create/edit/archive/primary behavior if implemented;
- Project create under Organization;
- multi-project list/filter/selection;
- Northstar phase/nextAction derivation unchanged;
- unassigned Project setup/Assign Website derivation;
- Website assignment conflict prevention;
- explicit reassignment behavior;
- Project/Organization switching without Northstar Website mutation;
- Organization Workspace relationships;
- Project Workspace navigation to Northstar Discovery/Website;
- metadata operations outside Website Undo/Redo;
- cumulative automated suite;
- JavaScript syntax;
- Framework integrity;
- HTTP assets;
- console health;
- Studio v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 26 implementation note;
3. Organization model documentation;
4. Contact model documentation;
5. Project organization/assignment extension documentation;
6. Website assignment/reassignment rules;
7. multi-project/Organization workspace UX summary;
8. setup/unavailable Project derivation rules;
9. automated/browser validation results;
10. known limitations and next Stage 7 seams;
11. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is Organization and Contact identity plus multiple Projects, explicit Organization→Project/Contact relationships, a multi-project operational overview, Organization workspace and explicit Website assignment semantics. Persistence, Portal/authentication, generalized CRM/playbooks and later Stage 7+ systems remain deferred.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 26 — Organizations, Contacts & Multiple Projects** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Add stable Organization and Contact stores, extend Project with Organization ownership and explicit unassigned/assigned Website semantics, preserve the existing Northstar Project/domain identities, support multiple Projects without faking multi-Website persistence or copying domain state, provide Organization and multi-project Rally workspaces with Milestone 25 operational summaries, enforce explicit Website assignment/reassignment rules, preserve all Milestones 01–25 and Website/history/domain boundaries, validate multi-client identity/navigation/isolation plus the cumulative suite, and return the completed milestone to Architecture for `Review`.
