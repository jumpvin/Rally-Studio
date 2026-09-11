---
milestone-id: studio-4-m24-testing-ux-consolidation
mode: implementation
status: active
baseline: f253fa0e22d984df7020460fc351e8db4976b8c9
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m24-testing-ux-consolidation.md
  - package.json
affected-surfaces:
  - Immersive Preview mode
  - Strategy Packet Website preview parity
  - Add Section chooser placement
  - Explorer and component inspector usability
  - Component rendering cleanup
  - Project-style Studio accents
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 24

## Title
Testing UX Consolidation

## Stage
Post-Stage-6 User Testing / Stabilization

## Trigger
User acceptance testing of Milestone 23 confirmed the Add Section flow is now functional, but exposed remaining presentation/integration defects that prevent the editor and preview experience from feeling coherent.

Observed findings:
1. Add Section now opens and inserts from Library inventory, but the chooser is placed as a large detached region below the workspace rather than a focused insertion surface.
2. Explorer is improved but Page/component actions and hierarchy still do not work cleanly together at the user's viewport.
3. Component delete exists in the right inspector, but destructive/component actions are not discoverable enough from the editing experience.
4. Preview mode is not immersive; too much editor/workflow/utility chrome remains visible.
5. Strategy Packet Website Preview does not present the Website with the same quality/layout as the primary Studio Website canvas.
6. The right component inspector has excessive empty space before content and then cramped, weakly grouped controls.
7. A stray `N` is rendered below the Hero `Get started` button on the Contact Page, indicating leaked/orphan component content.
8. The user proposed allowing the selected project/Website style to subtly influence Rally Studio so the editing experience feels connected to the Website rather than switching to an unrelated color system.

Milestone 23 remains in acceptance-testing; M24 is a targeted follow-on stabilization milestone rather than pretending those findings passed.

## Objective
Consolidate the Website editing and preview experience so the canvas, Explorer, inspector, Library insertion and Strategy Packet feel like coordinated views of the same canonical Website. Remove concrete rendering defects and make Preview genuinely presentation-focused, while preserving existing domain/history architecture.

## Architectural Principles
### One Website renderer contract
Normal canvas, immersive Preview and Strategy Packet Website Preview must render the same canonical Website/Page/Component state through the same Component Registry/variant semantics and Design Settings. Presentation containers may differ, but content/layout should not diverge because of duplicated rendering logic.

### Edit chrome disappears in Preview
Preview is for evaluating the Website, not editing it. Only controls needed to choose viewport and return to Edit/Preview may remain prominent.

### Inspector is contextual editing, not a second workflow
The right inspector should begin near the selected component context, group component actions/settings coherently and avoid large dead regions. It continues to operate on the selected ordinary Component Instance.

### Project styling may accent Studio, not replace Studio identity
Canonical project Design Settings may provide restrained accent cues to Studio chrome. Core application readability, control semantics and Rally identity remain consistent across projects.

## Scope
Implement:
1. Move Add Section inventory into a focused chooser surface tied to the action that opened it.
2. Remove the large detached below-workspace insertion region.
3. Preserve existing Certified Library inventory and canonical insertion transaction semantics.
4. Further repair Explorer Page/component layout and action grouping at the user's tested viewport.
5. Improve component action discoverability while retaining protected delete semantics and existing inspector ownership.
6. Restructure the right component inspector for immediate contextual content, clearer action grouping and better use of width/vertical space.
7. Implement immersive Preview mode that hides editing/workflow chrome while preserving Desktop/Tablet/Mobile and Edit/Preview controls.
8. Ensure exiting Preview restores the prior Edit workspace/context.
9. Bring Strategy Packet Website Preview to visual/rendering parity with the primary Website canvas.
10. Remove the stray `N`/orphan content rendering defect and trace its source so equivalent leaked values do not remain.
11. Add restrained project-style accent inheritance from canonical Design Settings to selected/active Studio chrome where safe.
12. Keep Studio controls legible and semantically consistent regardless of project colors.
13. Add/extend regression coverage for preview state, shared rendering assumptions, component render cleanup and insertion/inspector behavior where practical.
14. Validate the affected experience in the user's browser acceptance loop if Builder browser access remains unavailable.

## Add Section Chooser
The chooser must feel attached to `+ Add section from Library`.

Acceptable patterns include a right/left drawer, centered dialog or anchored overlay/popover with enough room to browse available sections. Builder should choose the simplest pattern compatible with current architecture.

Requirements:
- opens without shifting the entire workspace vertically;
- clearly labels available Library inventory;
- supports the existing insert action;
- can be dismissed clearly;
- does not obscure context more than necessary;
- insertion still creates one canonical Website history transaction;
- after insertion, chooser closes or provides clear confirmation and the new instance is discoverable/selected.

Do not introduce Library authoring or a second catalog.

## Immersive Preview
When `Preview` is active, hide normal editing chrome including, at minimum:
- Explorer;
- component inspector;
- Library/History/Start Website/Comments/Tasks/Versions utilities;
- Stage 6 workflow bar and next-action controls;
- add-section/page editing controls;
- component selection/reorder controls and canvas insertion affordances.

Keep only a restrained preview control surface containing:
- Desktop / Tablet / Mobile;
- Edit / Preview;
- Website/Page navigation required to preview multiple Pages, if current Website rendering otherwise lacks navigation.

The Website should receive the overwhelming majority of the viewport.

Preview mode must not mutate Website state or create history. Returning to Edit restores the prior active Page, selected component and normal workspace.

## Strategy Packet Website Preview Parity
The Strategy Packet preview must consume the same canonical Website render semantics as the main Website view.

At minimum:
- same Component Registry definitions/variants;
- same canonical Design Settings;
- same Page ordering/content;
- comparable width/responsive framing for the selected preview device/context;
- no editing controls rendered inside the Website;
- no reduced/alternate component markup solely because it is inside the Packet.

If duplicate renderer code currently causes divergence, extract/reuse a shared render function/module rather than maintaining two visually different implementations.

The Packet may keep its own navigation shell/step controls around the Website.

## Explorer Consolidation
Continue the restrained Explorer cleanup based on actual user evidence.

Requirements:
- Page names/status are never obscured by reorder or Rename/Copy/Delete controls;
- Page structural actions have a coherent grouped placement;
- component names/type/variant remain readable;
- reorder controls align consistently and do not collide with labels;
- selected Page and selected Component Instance are visually distinct;
- `+ Page` and `+ Add section from Library` remain obvious structural actions;
- no drag-and-drop is required.

At the primary desktop viewport, the Explorer should be usable without visual collisions.

## Component Inspector Consolidation
When no component is selected, retain a compact useful empty state.

When a component is selected:
- selected component identity/title begins near the top of the inspector rather than after excessive blank space;
- Comment / Duplicate / Hide / Delete are grouped as component actions;
- Delete remains available and visually identifiable as destructive without requiring a new confirmation model beyond existing architecture;
- presentation variant is clearly separated from responsive controls;
- responsive visibility/alignment/spacing controls use the available width coherently;
- inherited Design Settings information is visually subordinate;
- controls should not appear jammed together or ambiguously associated.

Do not add new component-editing capabilities solely for this layout pass.

## Stray `N` Rendering Defect
Trace the literal `N` rendered below the Contact Page Hero CTA in user testing.

Requirements:
- identify whether it originates from content, responsive metadata, variant output, selection/edit controls or malformed DOM assembly;
- remove the unintended visible output;
- ensure legitimate component content is not silently discarded;
- add a regression assertion where practical that rendered component output does not leak editor/internal metadata as text.

Do not simply hide the character with CSS without identifying the source.

## Project-Style Studio Accents
This is authorized as a small experiment because the user explicitly suggested it, not as a full theming system.

Use canonical Design Settings to optionally influence restrained Studio accents such as:
- selected/active borders;
- active workflow/tab underline/highlight;
- small accent indicators;
- possibly primary contextual action emphasis where contrast remains safe.

Do not:
- recolor all Studio surfaces;
- alter destructive/warning semantics;
- allow low-contrast project colors to make controls unreadable;
- replace Rally Studio branding;
- create separate Studio theme state.

Derive accents from current canonical Design Settings and fall back to Rally's neutral/default accent when unsuitable. Website Design Settings remain the only source; changing project style should update these accents automatically without a separate transaction.

## State and History Boundaries
Preserve:
- canonical Website/Page/Component Instance state;
- Library definitions/inventory;
- Website Undo/Redo;
- responsive override semantics;
- Discovery/Strategy/Recommendation state;
- Strategy Packet shared-source behavior;
- Review/Conversation/Task/Approval semantics.

Preview UI state and chooser open/close state are transient and create no Website history. Only actual Website edits use existing transaction boundaries.

## Explicitly Out of Scope
Do not implement:
- final Rally Studio visual redesign;
- drag-and-drop;
- new component actions/fields beyond existing semantics;
- Library authoring;
- new recommendation logic;
- Stage 7 Organizations/Projects;
- Portal;
- persistence/authentication;
- deployment;
- AI;
- full project-specific Studio theming;
- full mobile redesign;
- accessibility certification;
- later roadmap systems.

## Success Criteria
1. Milestones 01–23 behavior remains intact except for intentional UX repairs.
2. Add Section chooser opens in a focused surface without expanding a detached region below the workspace.
3. Certified Library insertion still works and remains Undo/Redo-safe.
4. Explorer has no Page/action collisions at the user's primary viewport.
5. Component rows/actions remain legible and aligned.
6. Selected component inspector content begins near the top and is coherently grouped.
7. Delete is discoverable in the selected-component action group and retains existing semantics.
8. Preview hides Explorer, inspector, utilities, workflow bar and editing affordances.
9. Preview retains Desktop/Tablet/Mobile and Edit/Preview controls.
10. Preview preserves active Page/context and creates no Website history.
11. Returning to Edit restores the normal workspace and selection context.
12. Strategy Packet Website Preview renders canonical Website content/design with visual parity to the main Website renderer.
13. No Packet-only reduced/alternate component rendering remains for the tested components.
14. The stray `N` under the Contact Hero CTA is gone because its source was corrected, not merely hidden.
15. No equivalent internal/editor metadata leaks into rendered Website content in tested components.
16. Studio may use restrained project-derived accent cues while preserving readable/consistent Rally controls.
17. Changing canonical Design Settings updates any derived Studio accent without separate state/history.
18. Project accent inheritance does not alter destructive/warning semantics or make controls unreadable.
19. Cumulative automated tests remain green with targeted regressions added.
20. Browser/user acceptance verifies immersive Preview, Packet preview parity, Explorer/inspector layout, Add Section placement and stray-render cleanup.
21. No new console errors/warnings attributable to this milestone.
22. Studio v3 remains preserved.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- Add Section chooser open/close/insertion;
- insertion Undo/Redo;
- Explorer with multiple Pages and multiple components;
- component selection and right inspector actions;
- Delete discoverability/smoke behavior;
- Edit → Preview → Desktop/Tablet/Mobile → Edit;
- absence of editor chrome in Preview;
- preservation of active Page/selection across Preview;
- Strategy Packet Website Preview for at least Home and Contact;
- parity of representative Hero/Services/CTA variants between main canvas and Packet preview;
- Contact Hero stray-`N` reproduction and fix;
- project accent response to Design Settings change with contrast fallback;
- cumulative automated suite;
- JavaScript syntax;
- Framework integrity;
- HTTP assets;
- console health where browser validation is available;
- Studio v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 24 implementation note;
3. Add Section chooser placement/behavior summary;
4. immersive Preview behavior;
5. shared Website rendering/parity approach;
6. Explorer and inspector consolidation summary;
7. root cause/fix for stray `N`;
8. project-style accent approach and contrast/fallback behavior;
9. automated/browser validation results;
10. known remaining UX limitations;
11. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is a targeted user-testing UX consolidation pass: focused Add Section placement, immersive Preview, Strategy Packet/main Website render parity, Explorer and inspector usability, removal of the stray component-render artifact, and restrained Design-Settings-derived Studio accents. No new product domain or final redesign is authorized.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 24 — Testing UX Consolidation** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Move Add Section inventory into a focused chooser, make Preview genuinely immersive while preserving viewport/Edit controls and context, unify Strategy Packet Website Preview with the canonical main Website renderer, consolidate Explorer and selected-component inspector layout/action discoverability, trace and fix the stray `N` rendering defect at its source, add restrained safe Studio accent cues derived directly from canonical Design Settings without separate theme state, preserve Milestones 01–23 and all domain/history boundaries, validate the affected Website editing/preview flows plus cumulative tests, and return the completed milestone to Architecture for `Review`.