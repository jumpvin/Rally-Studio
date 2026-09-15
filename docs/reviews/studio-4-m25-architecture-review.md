# Rally Site Studio 4.0 — Milestone 25 Architecture Review

Milestone: `studio-4-m25-project-workspace-foundation`
Implementation commit: `8f5f5971f5b561787f15d365c8c5b97932227943`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 25 satisfies the frozen Project Workspace Foundation and establishes a clean Stage 7 operational wrapper around the existing Studio domains.

Project owns only stable project identity/lifecycle metadata and references. It does not duplicate Website, Discovery, Strategy, Recommendation, Review, Conversation or Task state. The seeded Northstar Advisory Project references the existing working Website and current Discovery/Strategy identities, preserving the user-testing context rather than resetting it.

Project phase, next action and Needs Attention are derived projections over authoritative domain stores. The phase precedence and next-action rules are deterministic and do not introduce a second manually advanced workflow machine. Paused lifecycle states suppress operational next actions without mutating underlying work.

Task and Conversation aggregation preserves exact existing identities. Missing referenced context is surfaced as unavailable rather than silently reassigned. Project lifecycle changes remain isolated from Website history, Task completion, Conversation resolution and approval evidence.

The Project Workspace provides the intended compact Rally-facing overview: lifecycle, current phase, Website identity, prominent next action, Stage 6 readiness, Needs Attention and existing Task/Conversation projections. Navigation routes into the existing Studio surfaces and returns to the Website-first editor rather than embedding a second builder.

Automated evidence reports 99/99 cumulative tests passing, including stable reference resolution, lifecycle isolation, phase progression, next actions, stale/blocked/unresolved attention, exact Task/Conversation aggregation, approval derivation and missing-context behavior. Live browser validation covered Project opening, Discovery-phase next action, Project → Discovery, Project → Website, lifecycle pause/resume and console health.

## Scope discipline
No Organization/Contact CRM, multi-project dashboard, persistence, authentication, Portal, generalized playbook authoring, roadmap authoring, billing, notifications, deployment or AI systems were introduced.

## Forward architecture notes
1. The next Stage 7 slice should introduce Organization and Contact identities plus multiple Projects, so Project can become a true client-work container rather than a single seeded wrapper.
2. Organization should own/reference Projects and Contacts; it should not absorb Website/Discovery/Strategy domain state.
3. Multi-project navigation should surface Project nextAction/Needs Attention summaries rather than create a parallel task/workflow system.
4. Explicit Website reassignment/replacement policy should be designed before multiple Projects can freely switch Website identities.

## Decision
Approved. Architecture may create the next Stage 7 milestone.