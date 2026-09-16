# Rally Site Studio 4.0 — Milestone 30 Architecture Review

Milestone: `studio-4-m30-stage-7-integration-usability-checkpoint`
Implementation commit: `e66263adf8cecf10734ac681f9540bba4aa81d71`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 30 satisfies the frozen Stage 7 Integration & Usability Checkpoint and establishes the intended serious operational user-testing boundary before persistence/authentication/Portal work.

The new Rally operational home is a derived overview over existing Project, Work Queue and Team projections rather than a new dashboard authority. Operational navigation now has a clearer hierarchy among Home, Work Queue, Projects, Organization, Project, Team and Website Studio.

Transient operations context correctly coordinates handoffs without duplicating ownership state. Project/source navigation re-resolves the intended Website and exact Discovery/Strategy/Task/Conversation/Review references before opening a domain. Organization selection clears Project identity, direct Website entry clears operational return context, and unassigned/unavailable Projects are guarded from leaking the currently loaded Northstar Website context.

Project/Website handoffs now provide an owning-Project return strip that remains reachable above workflow drawers. Work Queue source opening preserves queue-origin return behavior and filters where appropriate. Competing operational/editor surfaces are made inert while overlays are active, reducing accidental interaction with unrelated Website controls.

Project Workspace preserves the semantic distinction between domain-derived Next Action and delivery-process Roadmap checkpoint, with clearer labeling. Roadmap expansion survives projection rerenders. Project-default responsibility remains Suggested rather than being mistaken for explicit Task/checkpoint assignment.

Team integration now prioritizes operational workload/navigation while keeping member management secondary. Archived ownership remains visible with reassignment guidance. Queue owner-filter navigation and source reassignment correctly update projections without changing Task identity/status.

The implementation adds restrained Stage 7 layout normalization and validated metadata Save/error behavior without redesigning the Stage 6 Website canvas or introducing a new product domain.

Functional evidence reports 127/127 cumulative automated tests passing, including six M30 integration regressions. Live browser validation completed the required Northstar Monday-morning, Summit setup/isolation and Team ownership scenarios. Northstar Discovery advancement updated Project, Roadmap and Queue coherently; Summit remained Website-unassigned without Northstar domain exposure; Team reassignment preserved queue filters and Task identity. Desktop 1440×900 and laptop 1024×768 layouts were inspected with zero console warnings/errors.

## Scope discipline
No persistence, authentication, permissions, Client Portal, capacity planning, deployment or new domain model was introduced.

## Stage 7 exit assessment
Stage 7 now has a coherent internal operating layer: Organizations/Contacts, Projects, Roadmaps, cross-project Work Queue and Team ownership, integrated with the existing Website/Discovery/Strategy/Review workflow. The architecture is sufficiently coherent for serious day-to-day operational user testing before committing to persistence schemas.

## Required next step
Do not create a persistence milestone immediately. Conduct serious user testing using a realistic multi-client operating scenario. Treat findings as product feedback and create targeted stabilization milestones for meaningful issues before persistence.

Recommended focus:
- Monday-morning prioritization;
- whether Home vs Work Queue vs Projects roles are intuitive;
- Organization/Project switching;
- Next Action vs Roadmap checkpoint comprehension;
- Assigned vs Suggested ownership comprehension;
- Task/manual-checkpoint reassignment;
- waiting-on-client versus waiting-on-Rally expectations;
- new Project setup expectations;
- return paths between operations and Website work;
- information density and missing operational context.

## Decision
Approved. Stage 7 is integrated and ready for serious operational user testing. Architecture should create targeted usability/fix milestones from findings before persistence.