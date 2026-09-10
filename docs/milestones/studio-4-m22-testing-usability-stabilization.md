---
milestone-id: studio-4-m22-testing-usability-stabilization
mode: implementation
status: implemented
baseline: 555523efb4c03eecc46770bfbcaec2b0e9de522d
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m22-testing-usability-stabilization.md
  - package.json
affected-surfaces:
  - Discovery form input stability
  - Studio top-level chrome and workflow layout
  - Common button/control styling
  - Explorer and drawer baseline usability
  - Testing usability regression
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 22

## Title
Testing Usability Stabilization

## Stage
Post-Stage-6 User Testing / Stabilization

## Trigger
First serious user-testing finding after Milestone 21 approval.

Observed in the Stage 6 Discovery workflow:
1. Discovery text inputs lose focus too quickly while typing, preventing normal completion of the questionnaire.
2. Studio prototype chrome is visually/structurally dense enough to interfere with product testing: top controls overlap/crowd, workflow controls are compressed, browser-default buttons remain inconsistent, small controls are difficult to parse, and drawers lack sufficient baseline spacing/hierarchy.

The user explicitly requested that the focus bug be fixed and that a modest structure/styling pass make the current product usable enough for continued testing. This milestone is not authorization for a final visual redesign.

## Objective
Remove the immediate interaction blocker in Discovery and establish a coherent baseline visual/control structure across the existing Studio 4 interface so serious user testing can continue without prototype chrome itself dominating the feedback.

## Architectural Principle
Stabilize the existing product; do not redesign it.

Existing domain boundaries, workflows and interaction semantics remain authoritative unless a change is strictly necessary to fix an identified usability defect. The purpose is to make the current architecture legible and operable enough to evaluate.

## Scope
Implement:
1. Fix Discovery input focus/caret loss during normal typing/editing.
2. Audit Discovery rendering so store updates do not unnecessarily replace the actively edited control.
3. Preserve the active field/caret/focus through relevant derived-progress updates, or update the DOM incrementally so replacement is unnecessary.
4. Verify all Discovery answer types remain editable continuously.
5. Establish a baseline Studio control style for buttons, icon buttons, inputs, selects and textareas.
6. Reorganize/space the existing top-level Studio chrome so controls no longer overlap or visually collapse into each other at the primary desktop testing viewport.
7. Give the Stage 6 workflow bar a readable hierarchy and sufficient spacing without turning it into a Project dashboard.
8. Improve Explorer Page/section action legibility and hit targets while preserving the existing actions and architecture.
9. Improve drawer/panel spacing, headings, tabs, form fields and close controls sufficiently for testing.
10. Ensure the Discovery drawer remains usable at common desktop widths and does not make its section navigation/forms unnecessarily cramped.
11. Add basic hover/focus-visible/disabled states for interactive controls.
12. Preserve Website-first visual priority.
13. Add regression coverage for the Discovery focus issue where practical and browser validation for continuous typing.
14. Perform a live browser walkthrough of the major current surfaces to catch obvious overlap/clipping/default-control regressions introduced by accumulated milestones.

## Discovery Focus Requirement
This is a functional blocker, not cosmetic polish.

A tester must be able to:
- click a Discovery short-text input and type a full sentence continuously;
- click a long-text textarea and type multiple words/lines continuously;
- use Backspace/Delete and move the caret without the control unexpectedly losing focus;
- switch between fields intentionally;
- make select/yes-no/multi-choice changes normally;
- see progress/recommendation-input summaries update without interrupting active text entry;
- edit an existing answer without the form being rebuilt out from under the user.

Do not solve this by delaying all persistence until the drawer closes. Discovery should still update its in-memory source of truth during normal interaction.

Builder should prefer preserving DOM/control identity or targeted rendering over brittle focus-restoration hacks. If focus restoration is necessary, preserve selection/caret where possible and document the tradeoff.

## Baseline Visual Structure
This milestone may create/refine a shared Studio UI stylesheet or equivalent common primitives.

### Top-level chrome
Provide clear visual separation between:
- Rally Studio/product identity;
- current Website/Page context;
- Edit/Preview and Library controls;
- supporting tools such as Tasks/Versions;
- Stage 6 workflow navigation.

Controls must not overlap at the primary desktop viewport. Wrapping/overflow behavior should be intentional at narrower widths.

### Buttons and controls
Replace obvious browser-default appearance with a consistent baseline system:
- primary action;
- secondary action;
- quiet/ghost action;
- destructive action where already semantically destructive;
- compact icon/action controls;
- disabled state;
- focus-visible state.

Do not invent new actions or change confirmation semantics solely for styling.

### Explorer
Existing Page and Component actions remain available. Improve:
- spacing;
- grouping;
- button hit targets;
- selected Page/component clarity;
- distinction between hierarchy labels and actions.

Do not redesign reorder behavior or introduce drag/drop in this milestone unless needed to repair an existing regression. Tiny reorder controls may be made more legible, but their long-term interaction design remains open to user feedback.

### Drawers/panels
Existing Discovery, Strategy, Recommendations, Comments, Tasks, Versions and related surfaces should receive enough shared structure that:
- headers are recognizable;
- close buttons are easy to hit;
- form controls have consistent spacing;
- content is not visually jammed together;
- scroll behavior is usable;
- important actions are distinguishable.

This is a baseline normalization pass, not bespoke final design for every surface.

## Website-First Requirement
The central Website canvas must remain the dominant visual surface in normal Studio mode.

Do not solve chrome crowding by shrinking the Website into a secondary preview. Supporting workflow and editing controls should frame the Website rather than compete with it.

## Responsive Baseline
At minimum validate:
- a wide desktop viewport comparable to the user's current test screenshot;
- a narrower laptop/tablet-width browser where top-level controls may wrap/scroll intentionally.

Mobile production design is not required here. Avoid obvious unusable overflow/clipping, but broader responsive design remains a later usability concern.

## State and Architecture Boundaries
This milestone must not change:
- Website document ownership;
- Page/Component identity semantics;
- Discovery/Strategy/Recommendation store ownership;
- Website Undo/Redo boundaries;
- Review/Conversation/Task/Approval semantics;
- Strategy Packet source-of-truth rules;
- Library hierarchy;
- recommendation application semantics.

Styling/navigation stabilization must not introduce duplicate state.

## Explicitly Out of Scope
Do not implement:
- final Studio visual redesign;
- new information architecture;
- drag-and-drop reordering;
- new editor actions;
- Stage 7 Organizations/Projects;
- Client Portal;
- persistence/authentication;
- deployment;
- AI;
- new Discovery questions/logic unless required to repair a bug;
- major Strategy Packet redesign;
- accessibility certification;
- full mobile design;
- later roadmap systems.

## Success Criteria
1. Milestones 01–21 remain intact.
2. Discovery short-text fields support uninterrupted normal typing.
3. Discovery long-text fields support uninterrupted normal typing.
4. Editing existing Discovery answers does not unexpectedly lose focus/caret.
5. Discovery progress updates during entry without disrupting the active control.
6. All Discovery answer types still persist/update correctly.
7. Top-level controls no longer overlap/collapse at the primary desktop test viewport.
8. Stage 6 workflow controls are readable and distinguishable from utility/editor controls.
9. Browser-default button appearance is removed from the primary Studio/testing surfaces.
10. Common buttons/inputs/selects/textareas have coherent baseline styling and usable focus/disabled states.
11. Explorer Page/component actions are legible and reasonably clickable without changing their semantics.
12. Drawers/panels have usable spacing, headers, form layout and close controls.
13. Discovery section navigation/forms remain usable while the drawer is open.
14. Website remains visually primary in normal Studio mode.
15. Narrower viewport behavior avoids obvious overlap/clipping through intentional wrap/overflow.
16. No domain or history boundaries change.
17. Automated regression tests remain green and new focus/state tests are added where practical.
18. Live browser validation confirms continuous Discovery typing and major-surface usability.
19. No new console errors/warnings attributable to this milestone.
20. Studio v3 remains preserved.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- continuous short-text typing in Discovery;
- continuous long-text typing in Discovery;
- caret/backspace/edit-existing-answer behavior;
- progress updating while typing;
- select/yes-no/multi-choice behavior;
- opening/closing Discovery repeatedly;
- Stage 6 workflow navigation after styling changes;
- Explorer Page/component actions;
- Edit/Preview and Library controls;
- Tasks/Versions/Comments/Strategy/Recommendations drawers at a smoke-test level;
- Strategy Packet open/close after shared styling changes;
- wide desktop viewport;
- narrower viewport;
- cumulative automated suite;
- JavaScript syntax;
- Framework integrity;
- HTTP assets;
- console health;
- Studio v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 22 implementation note;
3. root cause and fix explanation for Discovery focus loss;
4. summary of baseline UI structure/style changes;
5. browser viewport validation notes;
6. automated/browser validation results;
7. known remaining prototype UX limitations;
8. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is the first user-testing stabilization pass: repair Discovery input focus and normalize existing Studio chrome/control/panel presentation enough for serious testing. It is explicitly not a final redesign or authorization to change established product semantics.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 22 — Testing Usability Stabilization** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Fix the Discovery input focus/caret blocker at its rendering/state-update cause, establish a coherent baseline style and spacing system for existing Studio controls/chrome/Explorer/drawers, remove overlap and browser-default-control interference at the primary testing viewport, preserve Website-first priority and all Milestones 01–21 domain/history semantics, validate continuous Discovery typing and the major current surfaces in a live browser plus the cumulative automated suite, and return the completed milestone to Architecture for `Review`.

## Implementation Evidence

- Incremental Discovery rendering and immediate text persistence: `studio4/app.js`.
- Shared Studio controls, chrome, Explorer, drawer, focus, disabled, and responsive baseline: `studio4/ui-baseline.css` and `studio4/stage6.css`.
- Incremental text persistence regression coverage: `studio4/tests/foundation.test.mjs`.
- Root-cause, layout, browser validation, and limitation notes: `docs/implementation/studio-4-m22.md`.
