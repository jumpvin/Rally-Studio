# Studio 4 Milestone 26 — Implementation Note

Milestone 26 expands the operational shell into a small multi-client Rally workspace. Organization, Contact and Project metadata remains in-memory and separate from the Website document/history and every existing Discovery, Strategy, Recommendation, Review, Conversation and Task authority.

## Organization and Contact models

`organization-store.js` owns stable Organization identity, name, internal description, `active` / `inactive` / `archived` lifecycle, timestamps and actor placeholder. Contacts carry stable identity, required `organizationId`, name, optional email/phone/role, `active` / `archived` status, timestamps and an Organization-scoped primary marker. Relationship lists are derived by `organizationId`; mutable duplicate arrays are not stored. Selecting a primary Contact clears the prior marker, and archived Contacts cannot remain primary. Organization lifecycle changes do not cascade.

## Project ownership and Website assignment

Every Project now requires `organizationId`. Northstar retains the canonical Website, Discovery and Strategy identities under the seeded Northstar Advisory Organization. Summit Works supplies a second Organization and an unassigned Project shell without cloning any Website or domain state.

An unassigned or runtime-unavailable Website derives phase `setup`, next action `Assign Website`, and one blocking attention item. Website assignment is explicit. One Website identity can belong to at most one non-archived Project. Replacement and unassignment require explicit confirmation. Assignment changes only Project references and creates no Website transaction; it never moves, copies or deletes domain records.

## Rally and Organization workspaces

The Projects utility opens a Rally-wide operational list with Organization, lifecycle filter, phase, next action and Needs Attention count. Organization Workspace shows lifecycle, description, primary Contact, exact related Contacts and Projects, plus compact Organization/Contact/Project creation and editing. Selecting a Project opens the existing Project Workspace. Assigned Northstar navigation continues into existing Website domains; unassigned/unavailable Projects disable Website-specific next action while preserving identity.

## Functional validation

- Automated: 105/105 cumulative tests passed. M26 coverage proves Organization/Contact identity and isolation, primary behavior, non-cascading lifecycle, exact Organization-to-Project filtering, Project shell separation, setup derivation, Website assignment conflict prevention, confirmed reassignment, and Website/history immutability.
- Live browser: multi-project overview displayed Northstar and Summit; Northstar Organization displayed its primary Contact and exact Project; Organization → Project → Discovery navigation passed; Summit Project displayed setup, Website unassigned and Assign Website; zero console warnings/errors.
- JavaScript syntax, diff hygiene, installed Framework integrity, HTTP assets and Studio v3 preservation passed.

## Known seams

State remains an in-memory prototype. Production multi-Website persistence, authentication/permissions, Portal identities, invitations, generalized CRM, billing, playbooks, notifications and deployment remain deferred. Only the canonical runtime Website can resolve domain context; a stable reference to another Website is shown as unavailable rather than simulated.

Architecture must review and accept this implementation; Builder has not promoted or completed the milestone.
