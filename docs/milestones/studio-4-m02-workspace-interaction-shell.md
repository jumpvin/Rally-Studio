---
milestone-id: studio-4-m02-workspace-interaction-shell
mode: implementation
status: active
baseline: cfa17990936622cece01f3bfac3e02d992f60e41
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m02-workspace-interaction-shell.md
  - package.json
affected-surfaces:
  - Website Workspace shell
  - Page-first Explorer
  - Component selection and Context Panel
  - Edit and Preview modes
  - Safe inline structured-content editing
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 02

## Title
Website Workspace Interaction Shell

## Ownership
- Architecture owner: Rally Site Studio Architecture Chat
- Implementation owner: Rally Site Studio Build Chat
- Repository: `jumpvin/Rally-Studio`
- Authorized branch: `master`
- Release target: `4.0.0`
- Approved foundation baseline: Milestone 01

## Objective
Turn the Milestone 01 structured rendering proof into the first genuinely interactive Website Workspace while preserving the Studio 4 object and registry boundaries.

This milestone establishes the normal editing posture: the website remains the dominant canvas, Pages are the default Explorer lens, selecting a rendered component opens contextual controls, and safe text content can be edited without exposing global design-system controls or mutating rendering definitions.

This is an interaction-shell milestone. It does not implement the full Website Workspace Core roadmap stage.

## Scope
Implement one functional vertical slice containing:
1. A persistent Workspace shell around the existing Milestone 01 page canvas.
2. A page-first Explorer showing the current Website/Page structure and the ordered component instances on the current page.
3. Selection of a component instance from either the website canvas or Explorer.
4. A Context Panel that reflects the selected Component Instance and exposes only content controls appropriate to that component.
5. Explicit Edit Mode and Preview Mode.
6. Safe inline editing for representative text content on the rendered page while in Edit Mode.
7. Context-panel editing of the same structured content fields.
8. One shared state update path so inline edits and Context Panel edits update the Component Instance content rather than rendering markup.
9. Clear visual selection state that identifies the selected component without permanently cluttering Preview Mode.
10. Functional validation showing that selection and editing work across the existing Hero, Services and CTA seed components where applicable.

## Required UX Behavior
### Website remains primary
The rendered website/page canvas must remain the visually dominant surface. Explorer and Context Panel support the website rather than becoming the main content area.

### Page-first Explorer
Pages are the default navigation lens. Because Milestone 01 currently contains one page, the Explorer may show one Website -> Home page -> ordered component instances. Do not build multi-page creation or management merely to make the Explorer look fuller.

### Selection
A Component Instance can be selected by:
- clicking/selecting the component on the canvas; or
- selecting its instance in the Explorer.

Both paths must resolve to the same selected instance identity and update the Context Panel.

### Context Panel
The Context Panel must be instance-aware. At minimum:
- show component type/name;
- expose editable structured content fields supported by the selected definition;
- show that design-system values are inherited rather than expose arbitrary local styling;
- provide a clear way to close/deselect the component.

The panel should use component definition/schema metadata where practical rather than hard-code one completely separate editing form per seed instance.

### Edit and Preview modes
Edit Mode exposes selection affordances and permits authorized content editing.
Preview Mode hides editing chrome/selection affordances and presents the page as a clean website preview.
Switching modes must not duplicate or rebuild content state.

### Inline editing
At minimum, representative heading/body/button-label text should be editable directly on the page for supported components while Edit Mode is active.
Inline editing must update the underlying Component Instance structured content through the same Studio state boundary used by Context Panel editing.
Preview Mode must not allow editing.

### Structured-content integrity
Editing content must not require modifying Component Definition render functions or page HTML. Component renderers continue to receive structured content and Design Settings from state.

### State boundary
Extend the Milestone 01 store only as needed to support:
- selected component identity;
- edit/preview UI state if appropriate;
- validated Component Instance content updates;
- subscriber updates.

Do not introduce a final persistence/database architecture in this milestone. Preserve a clean future persistence seam.

## Implementation Guidance
Keep the Workspace visually calm and evolutionarily consistent with Studio v3 and the approved directional mockups. Visual polish is secondary to interaction clarity and architectural correctness.

Prefer generic editing contracts driven from definition metadata/schema where reasonable. The Builder does not need to build a fully generic form engine in this milestone; avoid both extremes of overengineering and seed-instance-specific one-off logic.

The existing Design Settings controls from Milestone 01 may remain available, but they are not the focus of Milestone 02 and should not dominate the Context Panel when a component is selected.

## Explicitly Out of Scope
Do not implement in Milestone 02:
- Adding new components/sections.
- Component variant cycling.
- Drag-and-drop or Explorer reordering.
- Duplicate, Hide or Delete actions.
- Undo or Version History.
- Responsive device overrides.
- Multi-page creation, duplication, deletion or page-template recommendation.
- Full Component Explorer/usage inventory across the site.
- Comments, conversations, review sessions or approvals.
- Full Design Lens redesign.
- Library, Starter Packages, Blueprints or recommendation engine.
- Organizations, Projects, Discovery, Strategy Packet or Client Portal.
- Deployment, hosting, production editing or maintenance workflows.
- Authentication or full capability/permission system.
- Persistence/database infrastructure beyond maintaining the existing seam.
- Any automatic work from later roadmap stages.

## Success Criteria
Milestone 02 is successful when all of the following are true:
1. The Milestone 01 structured Website/Page/Component registry foundation remains intact.
2. The Website Workspace renders with the website as the primary visual surface.
3. The default Explorer represents Website -> Page -> ordered Component Instances from structured state.
4. Selecting an instance on the canvas selects the same identity represented in Explorer and opens the correct Context Panel.
5. Selecting an instance in Explorer highlights/navigates to that same instance on the canvas and opens the same Context Panel state.
6. Edit Mode and Preview Mode are explicit and functionally distinct.
7. Preview Mode removes editing/selection affordances and prevents inline editing.
8. Supported inline text edits update Component Instance structured content through the Studio store/state boundary.
9. Context Panel content edits update the same underlying Component Instance content.
10. Inline and Context Panel edits remain synchronized because there is one authoritative structured-content state path.
11. Editing does not modify Component Definition render code, hard-coded page HTML, or the v3 composer switch.
12. Hero, Services and CTA remain correctly rendered after editing representative supported fields.
13. No out-of-scope Workspace features are partially implemented merely in anticipation of later milestones.
14. Existing Studio v3 reference material remains preserved.
15. Builder provides functional validation evidence and documents any limitations or schema/editor contracts introduced.

## Validation
Validation level: **functional**.

Builder must verify at minimum:
- Studio starts/runs through the documented method;
- page and component instance ordering still render correctly;
- canvas -> Context Panel selection;
- Explorer -> canvas/Context Panel selection;
- Edit -> Preview -> Edit transitions;
- inline structured-content edit for representative Hero text;
- Context Panel edit for representative Hero text;
- representative editable content for Services and CTA where supported;
- inline and panel edits remain synchronized;
- Preview Mode blocks editing affordances;
- global Design Settings inheritance from Milestone 01 remains functional;
- automated tests cover state updates/selection/editor contracts where practical;
- no new runtime/console errors in the primary workflow;
- v3 reference pages remain available.

Architecture Review will prioritize state/interaction boundary correctness, workflow clarity and scope discipline over final visual polish.

## Deliverables Expected After Implementation
1. Repository implementation changes.
2. Milestone 02 implementation note.
3. Files changed list.
4. Updated state/store contract documentation.
5. Selection/Context Panel/editor contract documentation.
6. Functional validation/test results.
7. Known issues and intentionally deferred Workspace capabilities.
8. Any Architecture questions discovered rather than silently resolving product scope.

## Architecture Freeze
The frozen scope of Milestone 02 is the Website Workspace interaction shell: page-first Explorer, Component Instance selection, Context Panel, Edit/Preview modes, and safe structured-content editing. Later Stage 2 capabilities require separate Architecture authorization.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 02 — Website Workspace Interaction Shell** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Implement only the authorized interaction shell and validate every functional success criterion. Preserve the Milestone 01 architecture and Studio v3 reference material. Do not implement later Stage 2 or roadmap capabilities. Return the completed milestone to Architecture for `Review`.