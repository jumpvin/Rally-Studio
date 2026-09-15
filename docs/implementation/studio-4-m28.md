# Studio 4 Milestone 28 — Implementation Note

M28 adds a non-persisted Rally Work Queue over existing authoritative Project, Roadmap, Task and collaboration/review signals. The queue has no mutable records or completion API.

## Projection, identity and provenance

`work-queue.js` computes queue items on demand. Each item carries deterministic Project-scoped identity, Organization/Project ownership, source type/identity, kind, title, why, priority, target/reference, sourced status/actor metadata, context availability and all contributing provenance descriptors. Changing presentation text does not change exact-record identity.

Active Project Next Actions and Needs Attention are aggregated alongside non-done Tasks, unresolved/waiting Conversations and ready manual Roadmap checkpoints. Derived Roadmap conditions are not duplicated as ordinary queue work. Archived, on-hold and completed Projects are omitted from the active queue. Projects without Roadmaps remain valid.

## Deduplication and priority

Exact Task/Conversation IDs take precedence: attention projections merge into those items with combined provenance. Setup action/attention merges by Project setup condition. Required Review-question and approval-ready projections merge by exact Review identity/condition. Ready manual Roadmap checkpoints remain distinct. Distinct domain conditions are not collapsed by similar titles.

Blocked Tasks, setup blockers, blocking attention and approval-ready work are high priority; ordinary Project Next Actions, open Tasks/Conversations and ready manual checkpoints are normal. Waiting-for-Rally Conversations are high. No deadlines or unsupported urgency are invented.

## Resolution and navigation

Source subscriptions recompute UI counts/items immediately. Task completion, Conversation resolution, manual Roadmap completion and domain readiness changes remove/change projected work only through their own authoritative APIs. Filtering and opening work are transient. Unavailable runtime Website sources open the owning Project for inspection rather than redirecting into unrelated Website data.

## Rally workspace UX

Projects remain a separate overview. A Work Queue entry point shows total/high-priority counts; Project cards show exact per-Project counts. Queue rows show ownership, title, explanation, source/status, priority and merged provenance. Organization, Project, source, priority and actionability filters are supported. The filtered empty state reads `Nothing currently needs attention`. There is no Complete Queue Item action.

## Functional validation

- Cumulative automated suite: 116/116 passed, covering every source type, setup/Task/Conversation/Review dedupe, provenance, stable identity after title edits, priority, lifecycle exclusion, manual Roadmap completion disappearance, unavailable context and Website/history isolation.
- Live browser: Northstar Discovery action and merged Summit setup blocker scanned; priority/Organization/Project/source filters passed; Summit exact Project and Northstar Discovery navigation passed; setting Summit on hold immediately reduced total/high counts and its Project count to zero, with meaningful filtered empty state; console warnings/errors: zero.
- JavaScript syntax, installed Framework integrity, HTTP assets, diff hygiene and Studio v3 preservation passed.
- Selected validation: Functional. Presentation/Structural groups were not independently selected; no prior test evidence was reused.

## Limitations and next seams

The queue is an in-memory projection with no persistence, notification delivery, permissions, automatic assignment, independent issue model, deadline/SLA or AI prioritization. Completed Projects are excluded from the active operations view; their retained domain records are unchanged. Architecture retains review, acceptance and completion ownership.
