# Rally Site Studio 4.0 — Milestone 28 Architecture Review

Milestone: `studio-4-m28-rally-work-queue`
Implementation commit: `1d155c432ae1dc7756e95c57337155cfddb88a1f`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 28 satisfies the frozen Rally Work Queue & Unified Needs Attention architecture.

The Work Queue is correctly implemented as an on-demand projection rather than a persisted issue/task authority. Queue items retain deterministic Project-scoped identity, Organization/Project ownership, source type/identity, kind, title/reason, priority, target/reference, sourced status/actor metadata, context availability and provenance descriptors.

Aggregation covers active Project Next Actions, Project Needs Attention, non-done Tasks, unresolved/waiting Conversations and ready manual Roadmap checkpoints. Derived Roadmap conditions are not redundantly emitted as ordinary queue work. Archived, completed and on-hold Projects are excluded from the active queue as intended.

Deduplication preserves source truth: exact Task/Conversation identities win and related attention projections merge into those items with combined provenance. Setup, Review-question and approval-ready conditions similarly merge by stable Project/Review condition identity. Ready manual Roadmap checkpoints remain distinct unless future explicit linking semantics justify combination. Similar titles alone do not collapse separate work.

Priority is deterministic and bounded to supported semantics. Blocked Tasks, setup blockers, blocking attention, approval-ready work and waiting-for-Rally Conversations receive high priority; ordinary next actions, Tasks, Conversations and ready manual checkpoints remain normal. No unsupported deadlines or urgency are invented.

Resolution behavior is correct: there is no queue-item completion API. Source-domain changes — Task completion, Conversation resolution, Roadmap manual completion or workflow readiness changes — recompute the queue immediately. Filtering and navigation remain transient. Unavailable Website context routes to the owning Project rather than unrelated current Website state.

The Rally Workspace keeps Projects and Work Queue distinct while adding total/high-priority summaries and exact per-Project counts. The Work Queue supports Organization, Project, source, priority and actionability filtering with a meaningful empty state.

Automated evidence reports 116/116 cumulative tests passing across all source types, setup/Task/Conversation/Review dedupe, provenance, stable identity across presentation edits, priority, lifecycle exclusion, Roadmap disappearance, unavailable context and Website/history isolation. Live browser validation covered Northstar and Summit queue items, filters, exact navigation, on-hold recomputation and empty-state behavior with zero console warnings/errors.

## Scope discipline
No queue-owned completion state, generic issue model, deadlines/SLA, notifications, automatic assignment, authentication/permissions, persistence, Portal, CRM, billing, AI prioritization or deployment was introduced.

## Forward architecture notes
1. Stage 7 now has a coherent internal operations layer: Organizations → Projects → Roadmaps plus a cross-project Work Queue. The next slice should add lightweight Rally staff ownership/assignment semantics to explicit Tasks and manual operational checkpoints/work signals, without introducing authentication yet.
2. Staff identity should be an internal actor/team-member record distinct from client Contacts and future authenticated accounts.
3. Assignment should remain attached to authoritative records (Task, manual Roadmap checkpoint where appropriate), while derived Project Next Actions can expose suggested/default ownership rather than persisted queue assignment.
4. The Work Queue can then filter/group by responsible Rally team member using source assignment metadata.

## Decision
Approved. Architecture may create the next Stage 7 milestone.