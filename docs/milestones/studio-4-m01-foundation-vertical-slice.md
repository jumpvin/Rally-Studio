# Rally Site Studio 4.0 — Milestone 01

## Title
Studio 4 Foundation Vertical Slice

## Ownership
- Architecture owner: Rally Site Studio Architecture Chat
- Implementation owner: Rally Site Studio Build Chat
- Repository: `jumpvin/Rally-Studio`
- Authorized branch: `master`
- Release target: `4.0.0`
- Starting product build: `3.0.0`

## Objective
Establish the durable architectural foundation for Rally Site Studio 4 by replacing the v3 composer's prototype-only page state with a structured Website -> Page -> Component Instance -> Design Settings model and rendering one page through a component registry inside a minimal Website Workspace shell.

This milestone proves the Studio 4 object/component boundary. It is not a feature-complete website builder milestone.

## Scope
Implement one thin vertical slice containing:
1. One Website object.
2. One Page object belonging to that Website.
3. Project/site Design Settings used by the rendered page.
4. Component Definitions registered through a component registry.
5. Component Instances referenced by the Page in ordered structure.
6. At least three representative registered components rendered from structured data (recommended seed set: Hero, Services/feature section, CTA).
7. A minimal Website Workspace shell that renders the structured page as the primary canvas.
8. Live global design-setting changes sufficient to prove that registered components inherit shared settings.
9. Durable application state boundary suitable for future persistence. Do not make browser `localStorage` or hard-coded HTML strings the architectural source of truth.
10. Preserve Studio v3 as reference/seed material during this milestone rather than deleting it.

## Requirements
### Object boundary
The implementation must make Website, Page, Design Settings, Component Definition, and Component Instance explicit structured concepts. The Page must store/order component instances by identity rather than store one giant HTML document.

### Component registry
Rendering must resolve a component instance through a registry/definition mechanism. Do not extend the v3 `sectionMarkup()` switch as the Studio 4 architecture. Component definitions must expose enough metadata/schema to identify their type and render structured content.

### Design settings
The vertical slice must demonstrate shared design settings flowing into multiple registered components. At minimum prove global primary/secondary color and one additional system setting such as radius, typography, or spacing. A change to a shared setting must visibly update all connected components without editing each instance.

### Structured content
Representative component content must be stored separately from its rendering markup. The architecture must allow a future variant to reuse the same content without re-entry, even though full variant switching is not required in this milestone.

### Website Workspace shell
Create only enough Workspace UI to prove the architecture:
- Website/page identity is visible.
- The website/page canvas is the dominant area.
- The structured page renders through the new registry/model.
- A small design-settings control area may be present to prove inheritance.

Do not attempt to implement the complete directional mockup in Milestone 01.

### v3 preservation
Existing v3 files remain available as reference unless a specific file must be adapted to provide the new entry point. Avoid destructive rewrites that erase the current foundations, tokens, component documentation, patterns, experiences, Playground, or Decision Journal before equivalent Studio 4 functionality exists.

### Migration seam
Document how v3 component/pattern knowledge can later be migrated into the registry/library without requiring the Milestone 01 code to be rewritten. The seam can be an explicit registry API, data shape, adapter boundary, or equivalent clear contract.

## Implementation Guidance
The Builder may choose the concrete implementation technology and file organization that best fits the existing repository, but must preserve the architecture above. Prefer the simplest durable structure that proves the object model and registry rather than introducing infrastructure for later stages prematurely.

Use existing Studio v3 visual/design knowledge where useful, especially token concepts and representative component styling. Studio 4 should feel like an evolution of v3, not an unrelated visual reset.

## Do Not Implement
Explicitly out of scope for Milestone 01:
- Organizations, Contacts, Brands/Brand Version management.
- Projects, Playbooks, Roadmaps, Milestones, Tasks or service workflow UI.
- Client Portal.
- Discovery questionnaires or meeting workflows.
- Interactive Strategy Packet.
- Recommendation Engine or AI behavior.
- Starter Package assembly.
- Blueprint system beyond any minimal type placeholders absolutely required by the model.
- Full Library UI or Certified/Specialty lifecycle.
- Comments, conversations, review sessions or approvals.
- Deployment, hosting, publishing, migration or production-site integration.
- Full version history/rollback UI.
- Full inline editing experience.
- Component usage inventory.
- Full component variant cycling UI.
- Page creation, multi-page navigation management, or page-template recommendation.
- Full desktop/tablet/mobile override system.
- SEO, accessibility or analytics lenses.
- Authentication, client roles, or full capability/permission system.
- Automatic future milestone work.

## Success Criteria
Milestone 01 is successful when all of the following are true:
1. Studio opens/runs successfully using the Builder's documented method.
2. A structured Website contains a structured Page.
3. That Page contains ordered Component Instances referencing registered Component Definitions.
4. At least three registered component types render correctly from structured content.
5. Component content is not architecturally embedded as one hard-coded page HTML blob.
6. Shared Design Settings visibly affect multiple components at once.
7. Changing the demonstrated design settings updates the page immediately in the Workspace preview/canvas.
8. The new rendering path does not depend on the v3 `sectionMarkup()` switch as its component architecture.
9. v3 reference material remains intact/available.
10. The Builder documents the new object shapes, registry contract, state boundary, run/test procedure, files changed, known limitations, and recommended migration seam for later v3 library adoption.
11. No later roadmap systems are partially implemented merely to anticipate future milestones.
12. Existing applicable Studio behavior outside the new slice is not knowingly broken.

## Validation
Builder must verify:
- application startup/execution;
- representative page rendering;
- ordered component rendering;
- global design-setting inheritance across multiple components;
- structured-content updates do not require editing component rendering markup;
- no new console/runtime errors in the primary Milestone 01 workflow;
- existing v3 reference pages remain accessible or are preserved in a clearly documented location.

Architecture Review will evaluate boundary correctness first and visual polish second.

## Deliverables
Builder returns:
1. Implemented repository changes.
2. Build/release note for Milestone 01.
3. Files changed list.
4. Object/model documentation.
5. Component registry contract/documentation.
6. Validation/test results.
7. Known issues/limitations.
8. Any Architecture questions discovered during implementation rather than silently deciding product scope.

## Copyable Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 01 — Studio 4 Foundation Vertical Slice** from `docs/milestones/studio-4-m01-foundation-vertical-slice.md` in `jumpvin/Rally-Studio` on the authorized `master` branch. Follow the milestone exactly. Build only the durable Website -> Page -> Component Instance -> Design Settings vertical slice, component registry, structured content boundary, and minimal Website Workspace needed to prove the architecture. Preserve Studio v3 as reference. Do not implement later roadmap systems. Validate the success criteria, document the model/registry/state seam, and return the completed work to Architecture for `Review`.