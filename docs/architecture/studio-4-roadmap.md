# Rally Site Studio 4.0 — Architecture Roadmap

Release target: 4.0.0
Architecture status: Locked
Roadmap principle: grow outward from the website while preserving v3 knowledge.

## Roadmap strategy
Do not build the service/CRM shell first and wait months for a useful builder. Establish a durable Studio 4 application foundation and prove it through a thin website vertical slice, then expand composition/library/editing capabilities before wrapping the complete client-service lifecycle around them.

## Stage 1 — Studio 4 Foundation
Goal: replace prototype-only state with a durable application/object boundary while preserving v3 as reference and seed knowledge.

Deliverables:
- Studio 4 application shell and durable state boundary.
- Core Website, Page, Design Settings, Component Definition, Component Instance and structured-content identities.
- Component registry replacing hard-coded section switch logic.
- CSS/design-token bridge to the Rally theme.
- One thin vertical slice: one Website -> one Page -> registered components -> design defaults -> Website Workspace render.
- v3 remains available as reference during migration.

Exit criterion: a page can be represented as structured Studio objects and rendered from registered Rally components without localStorage/hard-coded page HTML being the architectural source of truth.

## Stage 2 — Website Workspace Core
Goal: make the website the primary workspace.

Deliverables:
- Page-first Explorer.
- Context Panel.
- Edit/Preview modes.
- Inline safe content editing.
- Component selection and local options.
- Direct and Explorer section reordering.
- Add section using default-first variant workflow.
- Duplicate/Hide/reversible Delete.
- Desktop/tablet/mobile preview and constrained responsive overrides.
- Version/history foundation for edits.

Exit criterion: Rally can create and meaningfully edit a structured page through the website canvas without using the v3 composer controls.

## Stage 3 — Library and Composition System
Goal: productize the Lego hierarchy and migrate reusable v3 knowledge.

Deliverables:
- Typed Library for Tokens, Components, Compositions/Page Templates, Blueprints and Starter Packages.
- Object maturity/status: Certified/Default, Specialty/Custom, Experimental, Deprecated, Archived.
- Component variants and compatibility metadata.
- Usage/instance inventory and component Explorer.
- Save local custom work to library; explicit promotion/versioning to Certified.
- Seed initial library from v3 components/patterns and proven Rally Website structures.

Exit criterion: Studio can assemble pages/sites from curated reusable objects and show where objects are used.

## Stage 4 — Site Assembly and Starter Packages
Goal: make proven site assembly the default path.

Deliverables:
- Website tab empty-state choices: recommended Starter Package, Starter Library, Build Custom Website.
- Starter Package assembly into structured website/page/component objects.
- Page creation by name with recommended page template/options.
- Blueprint support for structural plans.
- Adaptive assembly hooks driven by project/discovery inputs.
- Selective reassembly/recommendation without destroying local approved work.

Exit criterion: Rally can rapidly assemble a production-ready multi-page workspace from a Starter Package and customize it at any hierarchy level.

## Stage 5 — Review, Collaboration and Approval
Goal: make client review native to the website.

Deliverables:
- Review Sessions.
- Conversations sidebar and temporary page pins.
- Start conversation from canvas/sidebar.
- Replies, waiting states, resolve/reopen, task conversion.
- Guided review questionnaire.
- Approval records.
- Review/version history.

Exit criterion: a client can review Website V1, provide structured/contextual feedback, and approve without email-based ambiguity.

## Stage 6 — Interactive Strategy Packet and Discovery
Goal: connect client understanding, design defaults and the deployable website.

Deliverables:
- Discovery questionnaire definitions/responses.
- Discovery meeting notes and client homework.
- Strategy/vision records.
- Interactive packet flow: understanding/goals -> brand -> design defaults -> website -> feedback/approval.
- Shared settings between packet controls and Website Workspace.
- Recommendation inputs derived from discovery, with human override.

Exit criterion: Rally can move from collected discovery to a coherent client presentation containing the real deployable Website V1.

## Stage 7 — Organization, Projects and Workflow
Goal: wrap website production in the small-team service workflow.

Deliverables:
- Organization, Contacts, Brands/Brand Versions, Websites, Assets.
- Projects and project types.
- Playbooks, Roadmaps, Milestones, Tasks, Actions.
- Automatic task/work preparation on project creation.
- Intentional customer communication: prepared/ready-to-send rather than forced automatic sending.
- Internal Needs Attention and next-action views.

Exit criterion: Rally staff can manage multiple clients/projects while Studio continuously surfaces the next meaningful work.

## Stage 8 — Client Portal
Goal: create the persistent client relationship surface.

Deliverables:
- Organization-level portal.
- Welcome/next-action home.
- Roadmap, assets, conversations, documents/resources and support.
- Project-specific onboarding/review entry points.
- Post-launch transition to website ownership/maintenance surface.

Exit criterion: clients can participate without relying on scattered email/text/file-sharing workflows and without being overwhelmed by internal project complexity.

## Stage 9 — Deployment, Production Editing and Maintenance
Goal: complete the website lifecycle.

Deliverables:
- Workspace -> Review -> Approval -> Publish/Deploy boundary.
- Rally-hosted and external-hosting deployment adapters as separate capabilities.
- Launch date/checklist workflow.
- Safe direct production content editing with capability controls and history.
- Maintenance/change request intake from Portal/live-site comment mode.
- Quick-change and major-change workflows.
- Backup/rollback hooks for Rally hosting.

Exit criterion: an approved workspace can move into production without rebuilding, and the same Studio relationship continues through maintenance.

## Stage 10 — Continuous Improvement
Goal: make Rally's accumulated work improve future sites without bombarding clients.

Deliverables:
- Internal opportunity suggestions.
- Usage and consistency signals.
- Suggestions to review/promote frequently reused custom objects.
- Package improvements for client approval only when Rally chooses to present them.
- Future analytics/SEO/accessibility lenses plug into the same website-workspace model.

## Milestone sequencing rule
Stages are architectural dependency groups, not necessarily one Builder milestone each. Architecture should authorize small vertical milestones with explicit acceptance criteria. Builder must not infer later-stage scope from this roadmap.

## First implementation recommendation
The first authorized Builder milestone should be Stage 1's thin vertical slice: establish the durable Studio 4 website/page/component/design-settings model and render one structured page through a component registry in a minimal Website Workspace shell. Do not implement Organizations, Portal, Discovery, comments, deployment, AI/recommendations or the full Library in the first milestone.