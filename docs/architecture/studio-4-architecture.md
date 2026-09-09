# Rally Site Studio 4.0 — Architecture Lock

Status: Approved architecture baseline
Release target: 4.0.0
Current product build: 3.0.0

## Product boundary
Rally Site Studio is a production platform for designing, assembling, deploying, and maintaining Rally websites. The Rally Website is a website produced by Studio, not Studio itself. Studio is optimized first for Rally's own small service team and customers; broader agency/developer use is secondary.

## Architectural principles
1. Opinionated by default; flexible by exception.
2. Automation prepares; people approve customer-facing communication and consequential actions.
3. One clear next action.
4. Progressive disclosure over information overload.
5. Assets persist; meaningful work happens through projects.
6. The relationship continues after launch.
7. The website is the workspace; panels and lenses change how it is viewed.
8. Everything starts local; shared/library changes are intentional.
9. Simple changes should be immediate; safe changes should be reversible.
10. Protection scales with risk.
11. Responsive behavior is the system's responsibility; responsive exceptions belong to designers.
12. Content survives presentation changes.
13. Make common edits effortless, advanced edits discoverable, and mistakes recoverable.

## Primary system boundaries
### Service Platform
Persistent: Organization, Contact, Brand/Brand Version, Website, Asset, Portal.
Workflow: Project, Playbook, Roadmap, Milestone, Task, Action, Review Session, Approval, Launch.
Organizations are long-lived customer records. Websites are long-lived assets. Projects record meaningful work performed on those assets.

### Discovery and Strategy Packet
Questionnaire -> Discovery Meeting -> Client Homework -> Internal Research -> Strategy -> Interactive Strategy Packet.
The packet presents vision, goals, recommendations, branding, typography, colors, spacing, radius, shadows, site structure, and the live deployable website workspace. Packet design controls and website controls read/write the same project design settings.

### Design System
Project/site design defaults include typography, colors, spacing, radius, shadows, widths and other approved global rules. Components inherit these defaults. Local overrides remain explicit and local.

### Composition hierarchy
Token -> Component -> Composition/Page Template -> Blueprint -> Starter Package.
A token is the smallest reusable UI/design object. A component is a meaningful section assembled from tokens. A composition/page template is a reusable arrangement of components. A blueprint describes page/section structure without requiring a specific presentation. A starter package is a complete proven site foundation assembled from smaller objects.

### Library and knowledge system
Library objects are organized by type and maturity. Default/Certified objects remain intentionally curated; Specialty/Custom objects preserve useful niche work without cluttering normal workflows. Experimental, Deprecated and Archived lifecycle states are supported. Project modifications remain local until explicitly saved/promoted. Repeated custom solutions can be promoted to defaults after review/versioning.

### Recommendation and Assembly Engine
Studio does not invent arbitrary websites or generate unknown production code. It recommends proven Starter Packages and assembles existing Rally-theme building blocks. Discovery may adapt page/component selection, ordering, content and defaults. High-confidence, low-risk choices can be automatic; lower-confidence choices are recommendations requiring lightweight confirmation.

### Website Workspace
The website is the primary editing canvas. Default navigation is page-first. Additional lenses/explorers include Components, Assets, Forms, Comments and future SEO/Accessibility/Analytics views. The contextual panel changes based on selection/mode rather than exposing every setting at once.

Editing depth:
1. Quick content edit — inline, near-zero chrome.
2. Component edit — content, approved variants/options, local behavior.
3. Page edit — add/remove/reorder/duplicate/hide sections and create pages.
4. Design System — global typography/colors/spacing/radius/shadows/etc.

Adding a component inserts its recommended/default variant immediately; alternatives can be cycled live using the project's real content. Reordering works both directly on canvas and through page structure Explorer. Section actions include Duplicate, Hide and reversible Delete. Page deletion receives stronger protection.

### Structured content
Repeatable content such as team members, testimonials, FAQs, services, pricing plans and galleries is structured independently from presentation. Switching compatible component variants must preserve content. Variants may expose optional fields without destroying existing records.

### Responsive model
Certified components carry strong responsive behavior by default. Desktop/tablet/mobile preview is available. Advanced users may apply constrained overrides such as visibility, stacking/order, alignment, approved spacing changes, shorter content and image crop/focal point. Normal Studio UI does not encourage independent device-specific redesigns.

### Comments, Review and Approval
Comments/conversations are managed primarily in a sidebar. When Comments mode is active, temporary pins identify commented sections. Selecting either a pin or sidebar conversation navigates to the associated section. Users can start a conversation from the canvas or sidebar. Conversations support replies, state (open/waiting on Rally/waiting on client/resolved), task creation, resolution and review-session history.

### Version history
Small authorized live content edits publish immediately and create history. Website/page/component/design changes are attributable and recoverable. Immediate Undo handles accidental local edits; Version History supports longer-term inspection and rollback.

### Capabilities and editing access
Editing is capability-based rather than one fixed client role. Standard clients receive safe content editing and approved component choices. Advanced customers may receive page/component capabilities. Rally/design users can access the full Studio design and composition system.

### Workspace vs Production
New sites and major changes are performed in a deployable Workspace. Review and approval promote approved work to Production; there is no rebuild after client approval. Small safe client edits may occur directly on Production with history. Hosting may be Rally-managed or external.

### Client Portal
The Portal belongs to the Organization and persists beyond individual projects. During onboarding it emphasizes welcome and one next action while keeping roadmap/resources/assets/conversations/documents accessible. After launch it becomes the customer's home for support, documentation, resources, website information, analytics/health where available, and maintenance/change requests.

## Studio v3 disposition
Keep/Evolve: foundations, experience principles, design-token philosophy, presets, component knowledge, patterns as seeds for compositions, Playground UX experiments, desktop/mobile preview, Decision Journal.
Replace implementation: localStorage state, hard-coded section markup switch, static HTML composition model, HTML export as deployment.
Missing/new for 4.0: durable object model, organization/project/website state, structured library registry, structured content, workspaces, versions, comments/reviews, permissions, packet/discovery, portal, recommendation/assembly, deployment/publishing.

## Validated directional UX
Directional mockups validated the Website Workspace, Design Lens, Component Editing, Comments/Review, Interactive Strategy Packet, Client Portal, and Internal Organization/Project Workspace. These validate architecture and interaction direction, not final visual specifications.

## Architecture lock
This document is the baseline architecture for the 4.0 roadmap. Changes to these boundaries should be treated as Architecture decisions rather than incidental implementation choices.