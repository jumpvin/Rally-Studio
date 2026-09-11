---
milestone-id: studio-4-m23-guided-workflow-form-editor-stabilization
mode: implementation
status: implemented
baseline: eac49b971ab0f52e2dde94241e812ef1c9adeeab
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m23-guided-workflow-form-editor-stabilization.md
  - package.json
affected-surfaces:
  - Discovery select and guided completion flow
  - Strategy input stability and completion guidance
  - Add Section insertion workflow
  - Explorer layout and component/library clarity
  - User-testing regression
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 23

## Title
Guided Workflow, Form-State & Editor Stabilization

## Stage
Post-Stage-6 User Testing / Stabilization

## Trigger
Second serious user-testing pass after Milestone 22.

Observed findings:
1. Discovery section tabs work, but there is no obvious Previous/Next/Complete action at the bottom, leaving the user unsure how to finish Discovery and proceed to Strategy.
2. Discovery select controls close immediately during interaction and can persist a value without reflecting it reliably in the visible select. This was observed for primary Website goal and testimonial/case-study availability.
3. Strategy text fields including Primary Offering / value, Audience needs / context, and Core message direction lose stable editing behavior and/or display one action behind the user's input.
4. Strategy has no obvious Complete/Continue affordance even when required decisions are ready.
5. The Explorer layout has overlapping/misaligned Page controls and unclear hierarchy.
6. The relationship between components already on the active Page, component selection, and available Library components is not sufficiently clear.
7. `+ Add Section` is a dead control during testing: clicking it does nothing, breaking the core Website editing/insertion loop.

## Objective
Repair the remaining reactive form-state defects, make Discovery and Strategy visibly guided through completion without inventing duplicate lifecycle state, and restore/clarify the core Add Section → choose Library item → insert → select/edit workflow so user testing can proceed through actual Website editing.

## Architectural Principles
### Guidance is derived, not new workflow state
Previous/Next/Complete/Continue controls must route through existing section selection and Stage 6 navigation/readiness. Do not introduce manually stored completion flags for Discovery or Strategy.

### Active form controls must retain native interaction
Store updates may update derived summaries, but must not rebuild an active select/input/textarea in a way that closes it, loses focus/caret, shows stale value, or becomes one keystroke behind.

### Explorer is current state; Library is available inventory
The UI should communicate:
- Explorer/Page tree = what currently exists on the Website/Page.
- Library/add-section chooser = what may be inserted/created.
- selecting an existing Component Instance = editing that existing instance.

Do not merge Library definitions with canonical Website instances.

## Scope
Implement:
1. Fix Discovery select re-render/visible-value defects.
2. Extend the Milestone 22 stable-render approach to all Discovery control types as needed.
3. Fix Strategy active-input rendering so current text is visible immediately and focus/caret remain stable.
4. Ensure Strategy store persistence remains immediate/in-memory and human-edit provenance semantics remain intact.
5. Add bottom Discovery navigation with Previous/Next and a final Complete Discovery/Continue to Strategy affordance.
6. Add Strategy Complete/Continue guidance based on existing Strategy readiness.
7. Repair `+ Add Section` so it opens a meaningful insertion chooser.
8. Populate the insertion chooser from appropriate Certified insertable Library inventory/Component definitions already supported by the architecture.
9. Allow a user to choose an insertable section/component and insert it into the active Page through the existing canonical transaction boundary.
10. After insertion, make the new Component Instance visibly present in Explorer/canvas and selected or otherwise clearly discoverable for editing.
11. Verify Undo/Redo for insertion.
12. Provide a meaningful empty state if no insertable items are available rather than a dead/blank control.
13. Clarify labels/microcopy so existing Page components are distinguishable from available Library items.
14. Repair Explorer Page/action overlap and basic hierarchy/spacing visible in user testing.
15. Smoke-test Library opening and its relationship to Add Section without changing Library architecture.
16. Preserve the restrained prototype styling approach; only polish what is necessary for clarity/usability.

## Discovery Guided Navigation
At the bottom of the Discovery form provide contextual navigation:
- Previous section when not on the first section.
- Next section when not on the final section.
- On the final section, show a completion-oriented action.

The final action should derive from existing Discovery progress. Suggested behavior:
- if required questions remain unanswered, label/state should communicate that completion is blocked and guide the user toward missing required answers rather than silently claiming completion;
- when required questions are complete, show `Complete Discovery` or `Continue to Strategy`;
- activating it closes/leaves Discovery through the existing Stage 6 navigation and opens Strategy.

Section tabs remain directly clickable.

Do not create a new persisted `completedByButton` flag. Discovery completion remains derived from required answers.

## Discovery Select Stability
A select must:
- remain open until the browser/user naturally completes or dismisses selection;
- show the selected value immediately;
- persist the selected value to Discovery state;
- update derived progress/recommendation inputs;
- not be replaced by a render during its own interaction;
- show the persisted value when returning to the section.

Validate at minimum primary Website goal and testimonials/case-studies selects plus another select/choice if available.

## Strategy Input Stability
For Strategy text/list controls:
- the character just typed must appear immediately;
- no one-keystroke lag;
- focus/caret must remain stable;
- Backspace/Delete/caret movement must behave normally;
- the underlying Strategy record must receive the current value;
- human-edit provenance must be applied correctly;
- Strategy progress/readiness may update without replacing the active control.

Explicitly validate Primary Offering / value, Audience needs / context, and Core message direction.

Draft / Refresh from Discovery remains available and must preserve its existing human-override/stale-source semantics.

## Strategy Completion Guidance
Add a visible bottom action based on existing `strategy.progress` readiness.

Suggested behavior:
- unresolved required decisions: communicate remaining required decisions and do not falsely complete;
- ready: `Complete Strategy` / `Continue to Recommendations` routes to Recommendations through existing Stage 6 navigation.

No new Strategy lifecycle state is authorized.

## Add Section Workflow
`+ Add Section` must no longer be inert.

Expected minimum flow:
1. User clicks `+ Add Section`.
2. A chooser/drawer/popover/dialog opens and clearly says these are available sections/components to add.
3. It shows supported insertable Certified Library/Component inventory with human-readable names and, where practical, type/variant/category context.
4. User chooses one.
5. A new ordinary Component Instance is inserted into the active Page using existing canonical insertion semantics.
6. The Explorer and canvas update immediately.
7. The inserted instance can be selected/edited with existing controls.
8. Undo removes the insertion; Redo restores it with the existing history semantics.

Use existing Library/Component Registry architecture. Do not create a second ad-hoc component catalog.

If both Component Definitions and Compositions are supported as insertion targets by existing architecture, the chooser may expose both with clear grouping. Do not expand executable Library semantics beyond what prior milestones already authorize.

## Component / Library Clarity
Clarify existing surfaces so a tester can answer:
- What components are already on this Page?
- Which one am I editing?
- Where do I go to add another section?
- What does Library contain?

This may include headings, helper copy, grouping, selected-state treatment and empty states.

Do not duplicate Library items into the Explorer as though they already exist on the Website.

## Explorer Repair
Repair the concrete overlap/misalignment shown in testing:
- Page reorder/action buttons must not obscure Page names/status.
- Page actions should remain readable/clickable.
- Component rows should preserve name, variant/type context and reorder controls without collision.
- selected Page/component state should be visually clear.
- `+ Page` and `+ Add Section` remain obvious primary structural actions.

This does not authorize drag-and-drop or final Explorer redesign.

## State and History Boundaries
This milestone must preserve:
- canonical Website/Page/Component Instance ownership;
- Library definitions as reusable inventory;
- Discovery/Strategy semantic stores;
- Strategy provenance/staleness behavior;
- Recommendation lifecycle;
- Website Undo/Redo boundaries;
- Review/Conversation/Task/Approval semantics;
- Strategy Packet shared-source behavior.

Only actual Website structural insertion should create a Website history transaction. Navigation/completion guidance and form edits remain in their existing domains.

## Explicitly Out of Scope
Do not implement:
- final visual redesign;
- drag-and-drop;
- new Library authoring/promotion;
- new recommendation rules;
- AI;
- Organizations/Projects/Stage 7;
- Portal;
- persistence/authentication;
- deployment;
- new Discovery/Strategy semantic fields except if strictly required to repair a defect;
- major Strategy Packet redesign;
- full responsive/mobile redesign;
- later roadmap systems.

## Success Criteria
1. Milestones 01–22 remain intact.
2. Discovery select controls behave normally and show current selected values.
3. Discovery select changes update progress/semantic inputs without prematurely closing/rebuilding the active select.
4. Discovery bottom Previous/Next navigation works across all sections.
5. Discovery final completion/continue affordance reflects derived required completion and routes to Strategy.
6. Discovery tabs remain directly usable.
7. Strategy Primary Offering / value shows current keystrokes immediately.
8. Strategy Audience needs / context shows current keystrokes immediately.
9. Strategy Core message direction shows current keystrokes immediately.
10. Strategy focus/caret/edit-existing behavior is stable.
11. Strategy human-edit provenance and Draft/Refresh semantics remain correct.
12. Strategy completion/continue guidance derives from readiness and routes to Recommendations.
13. `+ Add Section` opens an insertion chooser every time it is available.
14. Chooser clearly distinguishes available inventory from existing Page instances.
15. At least one supported Component/section can be inserted into the active Page.
16. Inserted instance appears in canonical Page order, Explorer and canvas.
17. Inserted instance can be selected/edited using existing mechanisms.
18. Insertion creates one coherent Website history transaction; Undo/Redo works.
19. No-inventory state is meaningful rather than inert.
20. Explorer Page controls no longer overlap names/status at the tested desktop width.
21. Component rows/actions no longer visibly collide at the tested desktop width.
22. Library remains a reusable-inventory surface and does not become canonical Website state.
23. Discovery/Strategy guidance creates no Website history entries.
24. Cumulative tests remain green and targeted regression tests are added.
25. Live browser walkthrough covers Discovery → Strategy → Add Section → edit/select → Undo/Redo.
26. No new console errors/warnings attributable to this milestone.
27. Studio v3 remains preserved.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- Discovery primary-goal select interaction;
- Discovery testimonial/case-study select interaction;
- switching Discovery sections via tabs and bottom navigation;
- incomplete final Discovery state;
- completed Discovery → Strategy routing;
- Strategy typing in all three explicitly reported fields;
- Strategy caret/backspace/edit-existing behavior;
- Draft/Refresh after human edits and Discovery changes;
- incomplete vs ready Strategy continuation;
- `+ Add Section` opening;
- chooser inventory and empty state;
- insertion of a supported Component/section;
- Explorer/canvas synchronization;
- selection/editability after insertion;
- insertion Undo/Redo;
- Library smoke test;
- Explorer Page/component layout at the primary testing viewport;
- Stage 6 workflow navigation;
- cumulative automated suite;
- JavaScript syntax;
- Framework integrity;
- HTTP assets;
- console health;
- Studio v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 23 implementation note;
3. root-cause/fix explanation for Discovery select instability;
4. root-cause/fix explanation for Strategy one-action-behind/focus behavior;
5. guided Discovery/Strategy navigation behavior;
6. Add Section insertion flow and inventory source documentation;
7. Explorer/Library clarity changes;
8. automated/browser validation results;
9. known remaining UX limitations;
10. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is the second user-testing stabilization pass: repair Discovery select state, Strategy active-input state, add derived completion guidance to Discovery/Strategy, restore the dead Add Section insertion workflow, and clarify/repair Explorer versus Library presentation enough for continued testing. No new product domain or final redesign is authorized.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 23 — Guided Workflow, Form-State & Editor Stabilization** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Fix Discovery select replacement/value behavior and Strategy one-action-behind/focus defects at their render/state boundaries, add derived Previous/Next/Complete/Continue guidance without duplicate lifecycle state, repair `+ Add Section` into a real chooser backed by existing insertable Library/Component inventory and canonical insertion/history semantics, repair the tested Explorer overlap and clarify existing Page components versus available Library inventory, preserve Milestones 01–22 and all domain/history boundaries, validate the complete Discovery → Strategy → Add Section/edit/Undo/Redo path in a live browser plus the cumulative suite, and return the completed milestone to Architecture for `Review`.
