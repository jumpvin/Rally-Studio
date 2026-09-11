# Studio 4 Milestone 24 — Implementation Note

Milestone 24 consolidates the tested Website editing and preview experience around one canonical Component Registry rendering path while preserving all Website, Library, workflow and history boundaries.

## Focused Add Section and editing surfaces

The existing chooser remains backed exclusively by Certified `component` Library records and their registered Component Definitions, but is now a high-layer centered overlay with bounded scrolling and a focused card surface. It no longer participates in workspace layout or shifts content. Insertion still calls the canonical `insertComponent` transaction, closes the chooser, selects the new ordinary Component Instance and supports existing Undo/Redo.

Explorer Page rows now neutralize the legacy floated reorder placement, reserve a separate grouped action row and keep component labels separate from reorder controls. The inspector starts closer to the top, uses a compact empty state, groups Comment / Duplicate / Hide / Delete in a visible action block, identifies Delete with established destructive styling, and separates variant, responsive, inherited-setting and content controls.

## Immersive Preview

Preview preserves the active Page, selected Component Instance and preview device as transient workspace context without creating Website history. It hides Explorer, inspector, utilities, Stage 6 workflow, browser chrome, insertion affordances, component selection and reorder controls. A restrained top surface retains Desktop / Tablet / Mobile, Edit / Preview and Website Page navigation. Returning to Edit restores the prior Page and selected Component context.

## Shared Website rendering and Packet parity

Main canvas and Strategy Packet now call the same `renderCanonicalComponent` helper for registry variant resolution, canonical content cloning, mobile heading overrides and responsive data attributes. They also share Design Settings application. The Packet preview therefore renders the same Hero, Services and CTA markup/content as the main canvas, omits editing enhancements, follows the selected preview device, and retains its own Page navigation shell.

## Stray `N` root cause

The literal `N` was hard-coded as text inside the split Hero's decorative `variant-art` element. It was neither Website content nor responsive metadata. The renderer now emits an empty, `aria-hidden` decorative gradient node, preserving the legitimate visual region while preventing placeholder/editor text from leaking into Website output. A targeted renderer regression asserts that the split Hero art has no text.

## Project-derived Studio accent

Selected Page/component borders and active device/Page controls derive a restrained `--studio-accent` from canonical Website Design Settings. The primary color is used only when it reaches a 3:1 contrast threshold against white; otherwise the secondary color is tested, then the stable Rally accent is used. The derived value is recomputed during normal store rendering, requires no separate theme state or transaction, and never changes destructive/warning colors.

## Functional validation

- Live browser: focused Add Section open/close/insertion; inserted instance in Explorer/canvas; selected inspector and component action visibility; mobile and desktop immersive Preview; editing/workflow chrome absent from Preview; Edit restoration; multi-Page creation; Strategy Packet Home and Contact previews; Contact split Hero without the literal `N`; representative Hero/Services/CTA canonical content.
- Automated: 94/94 tests passed, including Preview selection/history preservation and split-Hero metadata-leak regression. Existing insertion selection/Undo/Redo and Packet identity/parity boundaries remain green.
- JavaScript syntax, installed Framework integrity, HTTP assets, diff hygiene and Studio v3 HTTP preservation passed.

## Known limitations

This remains a restrained prototype stabilization pass. Explorer reorder remains button-based, the Packet retains its independent workflow shell, project accents are intentionally limited to small active/selected cues, and full responsive/accessibility certification remains outside this milestone.
