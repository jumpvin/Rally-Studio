# Studio 4 Milestone 22 — Implementation Note

Milestone 22 removes the first serious user-testing blocker and normalizes the accumulated Studio prototype chrome sufficiently for continued product testing without changing domain or history semantics.

## Discovery focus root cause and fix

Every Discovery `respond()` notification previously called the full renderer, which replaced the entire active question section. Normal input persistence therefore detached the focused text control and discarded its caret. Text controls now persist on `input`, while notifications originating from an active Discovery text control update only derived progress, section counts, and recommendation-input summaries. The question DOM is rebuilt only for deliberate section/context changes. Because the active control is retained rather than recreated, native focus, selection, caret movement, Backspace, and Delete behavior remain intact without a focus-restoration timeout.

Select, yes/no, and multi-choice controls retain the existing immediate store boundary. All answers remain in-memory source-of-truth updates rather than being deferred until drawer close.

## Baseline Studio structure

A shared UI baseline now normalizes buttons, inputs, selects, textareas, hover, focus-visible, disabled states, and compact actions. Device and Edit/Preview controls form one canvas-view group. Library, History, Website replacement, Comments, Tasks, and Versions form a separate utility row; duplicate Stage 6 top-level shortcuts were removed in favor of the ordered workflow bar.

The workflow bar has clearer hierarchy and intentional horizontal overflow/wrapping. Explorer rows use larger selection/action targets and stack Page actions at narrower widths. Drawers share padded, sticky headers, larger close controls, consistent form spacing, and usable full-width behavior. Discovery uses a wider drawer, scrollable section navigation, structured fieldsets, and larger choice targets. The central Website canvas remains the dominant normal-mode surface.

## Validation

The browser pass verified continuous long-text and short-text entry, progressive summary updates, preserved textarea focus and caret through Arrow/Backspace editing, editing existing content, multi-choice and yes/no controls, and repeated Discovery operation. It also smoke-tested Library, Tasks, Versions, Comments, Strategy, Recommendations, Strategy Packet, Edit/Preview, and Explorer selection.

Wide desktop and 900×700 viewport checks showed no document-width overflow; the narrow layout intentionally wraps workflow/top controls and stacks Page actions. The final browser session reported no console warnings or errors. The cumulative suite, JavaScript syntax, Framework integrity, HTTP assets, and Studio v3 preservation pass.

## Known limitations

This remains a prototype baseline rather than a final visual system. Some domain-specific drawers still inherit older internal layout patterns, reorder remains button-based, mobile design and accessibility certification remain deferred, and broader hands-on testing is still required before production readiness.
