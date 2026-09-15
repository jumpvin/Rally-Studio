# Rally Site Studio 4.0 — Milestone 26 Architecture Review

Milestone: `studio-4-m26-organizations-contacts-multiple-projects`
Implementation commit: `f1e90c725fb22f6e1c8b22e8ec7a4956adf1fba9`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 26 satisfies the frozen Organizations, Contacts & Multiple Projects architecture and advances Stage 7 from a single seeded Project into a clean multi-client operational shell.

Organization and Contact are distinct stable metadata domains. Organization relationships to Contacts and Projects are derived through `organizationId` rather than duplicated mutable arrays. Contact primary semantics are scoped correctly: selecting a primary clears the previous marker, and archived Contacts cannot remain primary. Organization lifecycle does not cascade into Contact or Project lifecycle.

Project now requires Organization ownership while preserving Milestone 25 domain-reference semantics. Northstar retains the exact canonical Website, Discovery and Strategy identities. The second Summit Works Project is legitimately unassigned and does not clone or borrow Northstar Website/domain state.

Website assignment semantics are appropriately explicit. A Website identity may belong to at most one non-archived Project; replacement/unassignment requires intentional confirmation; assignment mutates only Project metadata and creates no Website transaction or domain migration. Runtime-unavailable/unassigned Website Projects derive a setup phase, Assign Website next action and blocking attention rather than fabricated Discovery/Strategy progress.

The Rally-wide Projects workspace and Organization Workspace provide the intended hierarchy and operational scanability. Project summaries reuse Milestone 25 phase/next-action/Needs-Attention derivation when domain context exists, while Organization views expose exact related Contacts and Projects. Selecting Northstar continues through the existing Project Workspace into the real Stage 6/Website domains.

Automated evidence reports 105/105 cumulative tests passing, including Organization/Contact identity/isolation, primary-contact behavior, non-cascading lifecycle, exact Organization→Project filtering, Project-shell separation, setup derivation, assignment conflict prevention, confirmed reassignment and Website/history immutability. Live browser validation covered the multi-project overview, Northstar Organization/primary Contact, Organization → Project → Discovery, and Summit's unassigned setup state with zero console warnings/errors.

## Scope discipline
No persistence, authentication/permissions, Portal identities, invitations, generalized CRM, billing, playbooks, notifications, deployment or simulated multi-Website persistence was introduced.

## Forward architecture notes
1. Stage 7 now has the core client/project hierarchy. The next valuable slice should add reusable Project Playbooks/Roadmaps that describe expected phases/actions without replacing derived Project phase or existing Tasks.
2. Playbook definitions should be reusable templates; Project application should create/reference explicit Project milestone/checkpoint records only where operational history is needed.
3. Existing Tasks should remain the execution primitive. A playbook step may derive/propose next work or reference Tasks, but should not introduce a second competing task model.
4. Persistence remains deferred until the operational model is sufficiently complete to persist Organizations, Contacts, Projects and workflow records coherently.

## Decision
Approved. Architecture may create the next Stage 7 milestone.