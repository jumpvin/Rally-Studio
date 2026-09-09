# Rally Site Studio 4.0 — Milestone 05 Architecture Review

Milestone: `studio-4-m05-responsive-preview-overrides`
Implementation commit: `97135ff6682517e6ce67d92baf62142a1afeb867`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 05 satisfies the frozen responsive-preview and constrained-override architecture and remains within scope.

Desktop, Tablet and Mobile are Workspace preview contexts over one canonical page and component tree. Responsive exceptions are stored per Component Instance under explicit device-scoped `responsiveOverrides`, while canonical structured content and page structure remain shared.

Responsive controls are capability-driven from Component Definition and active Variant metadata. The store validates device identity, supported capability keys and approved values instead of exposing arbitrary CSS/breakpoints. Mobile shortened headings are layered onto a rendering copy and do not mutate canonical content.

Per-device visibility preserves the instance in structured state and editing surfaces while omitting it from clean Preview. New instances begin with no overrides. Duplication deep-copies responsive overrides, and bounded structural Undo restores them with the rest of the instance/page state.

The implementation therefore preserves the architectural principle that Studio owns responsive behavior by default and users create bounded exceptions rather than independent device-specific designs.

## Scope discipline
No arbitrary breakpoint editor, raw CSS override surface, independent device page tree, media/crop tooling, persistence architecture, Version History, Library, multi-page management, comments/review, deployment, or later roadmap system was introduced.

## Forward architecture notes
1. Image crop/focal-point overrides remain an approved future responsive capability, but should be added only once the Asset/media model exists rather than encoded as ad-hoc strings now.
2. The current capability merge between definition and variant is acceptable. As the Library matures, capabilities should have an explicit merge/override contract so variants can safely narrow or extend supported responsive behavior.
3. Responsive override changes should eventually participate in the same transaction/history model as content, variant and structural changes.

## Decision
Approved. Architecture may create the next Studio 4 milestone.