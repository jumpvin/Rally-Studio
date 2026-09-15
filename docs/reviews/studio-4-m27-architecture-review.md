# Rally Site Studio 4.0 — Milestone 27 Architecture Review

Milestone: `studio-4-m27-project-playbooks-roadmaps`
Implementation commit: `6bf9555fc8f02237f2c6a823d47c6d9fcf932d7a`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 27 satisfies the frozen Project Playbooks & Roadmaps architecture while preserving the separate authorities established earlier in Stage 7.

The system-owned `standard-website@1.0.0` Playbook is immutable/versioned and provides six ordered phases with fourteen stable checkpoints across Setup, Discovery, Strategy, Build, Client Review and Launch Readiness. Applying it snapshots definition identity/version and checkpoint metadata into a stable Project Roadmap, so future definition changes cannot silently rewrite historical Project process records.

Derived checkpoint conditions read authoritative Project/Website/Discovery/Strategy/Recommendation/Review state without writing to those domains. Manual checkpoints record only Roadmap actor/timestamp evidence, become ready in sequence, can be reopened, and cannot override derived reality. Already-satisfied later derived conditions remain truthfully complete even when earlier manual operational work remains incomplete.

The implementation correctly keeps three concepts separate: Project domain phase, Project Next Action, and Roadmap current/next checkpoint. Roadmap supports the operational process but does not replace domain-derived next work. Existing Tasks remain the execution primitive; only a Task-reference seam is modeled, with no automatic or competing Task behavior.

Project Workspace keeps domain-derived Next Action prominent and adds Playbook/version, Roadmap progress, current checkpoint/reason, ordered checkpoint state, manual completion controls and target navigation. Multi-project cards expose compact Roadmap progress/current checkpoint while Projects without Roadmaps remain valid.

Applying the Playbook to Northstar recognizes already-satisfied work. Applying it to Summit preserves the honest Website-assignment blocker rather than fabricating downstream progress.

Automated evidence reports 110/110 cumulative tests passing, including frozen topology/versioning, snapshot independence, one-Roadmap enforcement, Northstar/Summit condition resolution, derived override rejection, manual complete/reopen, progress/current/next derivation, navigation metadata, Project-action independence and Website-history separation. Live browser validation covered Playbook application, derived progress, manual Discovery-review completion, Roadmap → Strategy navigation, multi-project progress and Summit's Website blocker with zero console warnings/errors.

## Scope discipline
No Playbook authoring, version migration, Gantt scheduling, automatic Task generation, persistence, Portal/authentication, notifications, deployment or later-stage systems were introduced.

## Forward architecture notes
1. Stage 7 now has Organizations, Contacts, Projects, derived operational summaries and Roadmaps. The next slice should focus on a unified Rally work queue / Needs Attention experience across Projects rather than adding another project-local planning model.
2. The work queue should aggregate existing Project next actions, Roadmap ready/manual checkpoints, existing Tasks and unresolved collaboration signals by reference, with clear provenance for why an item appears.
3. Avoid converting every derived next action/checkpoint into a Task. Tasks remain explicit execution records; the queue is a projection of work requiring attention.
4. Assignment/ownership of operational work may be introduced carefully using actor placeholders, but authentication/permissions remain deferred.

## Decision
Approved. Architecture may create the next Stage 7 milestone.