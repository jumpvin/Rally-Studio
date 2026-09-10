# Rally Site Studio 4.0 — Milestone 18 Architecture Review

Milestone: `studio-4-m18-strategy-vision-records`
Implementation commit: `e20c00165b9c45150fd9c4210dfb2607518a9dbe`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 18 satisfies the frozen Strategy / Vision Records architecture.

Strategy is implemented as a distinct human-owned semantic layer between Discovery evidence and future Website recommendations. The model carries stable Strategy identity, Website-context identity, optional Discovery response-set identity, actor/timestamps, structured semantic fields and field-level provenance.

Draft/Refresh behavior correctly consumes only normalized Discovery inputs and maps available values deterministically. Unsupported strategic decisions remain unresolved rather than invented. Discovery-backed fields retain provenance including semantic source key and source questionnaire/response-set identity where applicable.

Human edits correctly change provenance to `human` and are protected from later Discovery refresh. When underlying Discovery values change, eligible Strategy fields surface stale-input state until an explicit refresh updates them. This preserves Rally's editorial ownership and avoids silent overwrites.

Strategy readiness is derived from required strategic decisions, and the compact Strategy surface exposes missing decisions, provenance, stale inputs and direct editing without displacing the Website-first workspace.

`getStrategyOutput()` provides a normalized semantic downstream seam without choosing Starter Packages, Page Templates, Components, variants or Design Settings and without mutating Website state.

State separation remains correct. Strategy changes stay outside Website Undo/Redo and remain independent from Discovery answers, Review Versions, Review Sessions, Review questionnaires, Conversations, Tasks, Approvals, Website content and Design Settings. Website Undo/Redo and Review Version restore retain Strategy state.

Functional evidence reports 77 automated tests passing across Milestones 01–17 plus Strategy drafting, provenance, human override protection, stale refresh, readiness, normalized output and state separation. JavaScript syntax, Framework integrity, HTTP assets and Studio v3 preservation also passed.

## Scope discipline
No AI generation, recommendation engine, automatic Website changes, Strategy Packet approval, Organizations/Projects, Portal, persistence or later-stage systems were introduced.

## Forward architecture notes
1. The next Stage 6 slice should begin the Interactive Strategy Packet itself, presenting Discovery-derived understanding, Strategy/Vision, canonical Design Settings and the actual Website in one client-facing sequence.
2. The Strategy Packet must reference canonical Website/Design Settings state rather than copying presentation-only substitutes.
3. Any packet-side controls that change design direction must write through the existing canonical Design Settings boundary and therefore participate in normal Website transaction/history semantics.
4. Recommendation logic should remain a later slice and consume both normalized Discovery inputs and Strategy output, with explicit human acceptance before applying changes.

## Decision
Approved. Architecture may create the next Stage 6 milestone.