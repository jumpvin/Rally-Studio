# Rally Site Studio 4.0 — Milestone 22 Architecture Review

Milestone: `studio-4-m22-testing-usability-stabilization`
Implementation commit: `b7d11b8ace6533edd9db99a2ac64a8bbaccef5f0`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 22 satisfies the frozen first user-testing stabilization contract.

The Discovery focus blocker was corrected at the rendering boundary rather than masked with delayed persistence or timeout-based focus restoration. Text inputs/areas persist on input while store notifications originating from the active Discovery text control update derived progress/section/recommendation summaries without replacing the active question DOM. Native focus, caret, selection, Backspace/Delete and editing behavior therefore remain intact while the Discovery store remains the immediate in-memory source of truth.

The baseline Studio chrome pass remains appropriately restrained. Shared control styling now normalizes buttons, inputs, selects, textareas, hover/focus-visible/disabled states and compact actions. Canvas view controls and utilities are grouped separately, duplicate Stage 6 shortcuts were removed in favor of the ordered workflow bar, Explorer targets were enlarged/clarified, and drawers received common spacing/header/close-control treatment. Discovery received a wider, more usable form surface with scrollable section navigation.

The Website remains the dominant normal Studio surface. Narrower layouts intentionally wrap/stack controls rather than overlap, without introducing a new information architecture or Project dashboard.

Live browser validation covered continuous short/long text entry, progressive summaries, caret movement/backspace, editing existing answers, choice controls, repeated Discovery operation, major Studio drawers, Strategy Packet, Edit/Preview and Explorer. Wide desktop and 900x700 validation reported no document-width overflow and the final browser session had no console warnings/errors.

Cumulative automated validation, JavaScript syntax, Framework integrity, HTTP assets and Studio v3 preservation pass.

## Scope discipline
No final visual redesign, drag-and-drop, new editor actions, Stage 7 domain, Portal, persistence/authentication, deployment, AI, full mobile design or accessibility certification was introduced.

## User-testing assessment
The specific blocker that stopped the first serious test session is resolved, and the prototype chrome has been normalized enough that continued findings should now be treated as genuine product/UX feedback. Remaining older drawer patterns and button-based reorder are known prototype limitations and should be evaluated through actual user testing rather than redesigned speculatively.

## Decision
Approved. Resume serious user testing. Architecture should create targeted stabilization/usability milestones from meaningful findings rather than automatically advancing to Stage 7.