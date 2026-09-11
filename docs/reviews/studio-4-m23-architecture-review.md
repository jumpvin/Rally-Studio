# Rally Site Studio 4.0 — Milestone 23 Architecture Review

Milestone: `studio-4-m23-guided-workflow-form-editor-stabilization`
Implementation commit: `6b47bf45f3ad3c1d23a574a0a022f5591ed49d2e`
Validation level: functional
Decision: **Implementation accepted pending user browser acceptance**

## Review summary
Milestone 23 implementation satisfies the frozen architecture at code/test level, but the required live browser walkthrough could not be completed by Builder because its managed browser blocked the localhost preview. Because this milestone exists specifically to repair user-observed browser interaction defects, Architecture will not treat automated evidence alone as final acceptance for those interaction criteria.

The implementation addresses the reported defects at appropriate boundaries. Discovery stable rendering now includes active selects as well as text controls, preventing a select from being detached during its own change notification. Strategy text fields now persist on `input` with existing human-edit provenance while active-field notifications update derived summary/output/readiness without rebuilding the active control.

Discovery now has derived Previous/Next guidance and a final required-completion action that either routes to the first incomplete section or continues through the existing Stage 6 Strategy route. Strategy similarly exposes readiness-based guidance and continues to Recommendations only when the existing Strategy progress is ready. No duplicate completion lifecycle state was introduced.

`+ Add Section` is now connected to a chooser backed by Certified `component` Library records and resolved through the existing Component Registry. Insertion uses canonical `insertComponent`, selects the new ordinary Component Instance and participates in existing Undo/Redo. No second component catalog/runtime was introduced.

Explorer copy/layout now distinguishes existing Website structure from available Library inventory and moves Page actions away from Page labels/status to prevent the tested collision.

Automated evidence reports 93 passing tests, including Strategy consecutive input edits/human provenance and Certified Library insertion/selection/Undo/Redo. JavaScript syntax, Framework integrity, HTTP assets and Studio v3 preservation pass.

## Required user acceptance
Before final approval, the user should verify in their working browser:
1. Discovery primary-goal and testimonial selects stay usable and visibly retain the selected value.
2. Discovery Previous/Next/final Continue behavior feels correct.
3. Strategy Primary Offering, Audience needs/context and Core message direction type normally with no one-action lag or focus loss.
4. Strategy completion/continue guidance is visible and routes correctly.
5. `+ Add Section` opens the chooser, shows understandable available inventory, inserts a section, and the inserted instance appears in Explorer/canvas.
6. Undo/Redo works on that insertion.
7. Explorer Page/component controls no longer overlap at the user's viewport.

## Decision
Conditionally accepted. Resume the exact user test that produced the defects. If the browser acceptance checks pass, Architecture may finalize M23 as approved without another implementation milestone. If any fail, return the concrete browser finding and repair M23 before advancing.