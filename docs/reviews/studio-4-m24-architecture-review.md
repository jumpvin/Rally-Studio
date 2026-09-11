# Rally Site Studio 4.0 — Milestone 24 Architecture Review

Milestone: `studio-4-m24-testing-ux-consolidation`
Implementation commit: `b00b1eef2bb8eceb75cc162b623c7411c974d140`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 24 satisfies the frozen Testing UX Consolidation architecture and resolves the concrete usability defects identified in the previous user-testing pass without introducing a new product domain.

The Add Section chooser is now presented as a focused overlay rather than a detached region that participates in workspace layout. It remains backed by Certified component Library records and uses the existing canonical insertion transaction, selection and Undo/Redo semantics.

Preview is now genuinely presentation-focused. Entering Preview hides Explorer, inspector, utilities, Stage 6 workflow, browser/editing chrome, insertion affordances and component edit controls while preserving Desktop/Tablet/Mobile and Edit/Preview controls plus Page navigation. Preview preserves active Page, selected Component and device as transient context and creates no Website history. Returning to Edit restores the prior context.

Main canvas and Strategy Packet Website Preview now share the same canonical component rendering helper and Design Settings application. Representative Hero, Services and CTA components therefore resolve through the same Component Registry/variant path and responsive metadata rather than packet-specific reduced markup.

The stray `N` was traced to a hard-coded decorative split-Hero `variant-art` node and removed at the renderer source. The decorative node remains, but is now empty and `aria-hidden`, and regression coverage prevents editor/internal placeholder text from leaking into Website output.

Explorer and inspector layout are materially improved. Page actions no longer occupy the same space as Page labels/status, component labels remain separate from reorder controls, the inspector begins near the selected component context, and Comment / Duplicate / Hide / Delete are grouped visibly with Delete retaining destructive styling. Variant, responsive, inherited-setting and content controls are separated more coherently.

A restrained project-derived Studio accent is implemented directly from canonical Design Settings with contrast checking and fallback. No separate Studio theme state or Website transaction was introduced, and destructive/warning semantics remain unchanged.

Live browser validation covered focused Add Section insertion, Explorer/canvas synchronization, inspector actions, desktop/mobile immersive Preview, Edit restoration, multi-Page preview, Strategy Packet Home/Contact previews and removal of the split-Hero `N`. Automated evidence reports 94/94 tests passing, with JavaScript syntax, Framework integrity, HTTP assets and Studio v3 preservation also passing.

## Scope discipline
No final Studio redesign, drag-and-drop, Library authoring, new component semantics, Stage 7 Organizations/Projects, Portal, persistence/authentication, deployment, AI, full per-project theming, mobile redesign or accessibility certification was introduced.

## User-testing assessment
The specific M24 targets are now sufficiently implemented and browser-validated for continued serious testing. M23's previously failing Explorer/add-section acceptance concerns have been superseded by these repairs; Architecture may treat the combined M23/M24 editing-path stabilization as accepted for continued user testing.

## Forward notes
1. Continue user testing before beginning Stage 7.
2. If the shared Website renderer still diverges visually between contexts, treat that as a regression against this milestone rather than creating another rendering path.
3. Project-derived Studio accents should remain subtle unless future user evidence supports a larger theming system.
4. Explorer reorder remains intentionally button-based until actual testing justifies a different interaction model.

## Decision
Approved. Resume user testing. Architecture should create targeted milestones only from concrete findings before beginning Stage 7.