# Rally Site Studio 4.0 — Milestone 04 Architecture Review

Milestone: `studio-4-m04-component-variants`
Implementation commit: `0f1c2cf17089548543f65adcabf8fdb0109a92c0`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 04 satisfies the frozen component-variant architecture and remains within scope.

The implementation establishes a clean presentation/content boundary: Component Definitions own stable variant metadata/renderers and a default variant identity, while Component Instances store only the selected `variantId` beside their existing structured content. Variant changes therefore change presentation without rewriting content.

The registry normalizes legacy single-renderer definitions into a one-variant contract and validates default/selected variant identities. Hero provides three meaningful presentations, Services provides multiple presentations, and CTA exercises the single-variant path.

The Context Panel supports both direct selection and previous/next cycling. Canvas rendering resolves the active presentation through the registry. New insertion uses the definition's default variant; duplication and bounded structural Undo preserve instance variant state.

Automated tests cover content preservation, invalid variant rejection, default insertion, duplicate independence, single-variant normalization, and prior structural/state behavior.

## Scope discipline
No Library authoring/lifecycle, multi-page assembly, responsive override system, persistence architecture, comments/review, or later-roadmap system was introduced.

## Forward architecture notes
1. Variant compatibility with optional/variant-specific fields should eventually be expressed through structured schema capability rather than renderer assumptions. Do not solve this by making content variant-owned.
2. Variant definitions are currently code-registered. The future Library should wrap/promote this contract rather than replace the stable definition/instance separation.
3. Keep the principle that changing a variant is an instance presentation decision. Site-wide promotion/default changes require a separate explicit architecture path.

## Decision
Approved. Architecture may create the next Studio 4 milestone.