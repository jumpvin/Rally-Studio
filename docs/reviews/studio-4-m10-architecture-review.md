# Rally Site Studio 4.0 — Milestone 10 Architecture Review

Milestone: `studio-4-m10-executable-page-templates`
Implementation commit: `55df2f75f9f58f1ae3461e82d39c7ace3845870e`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 10 satisfies the frozen executable Page Template architecture.

Page Templates are represented within the existing Library `composition` family using a `payload.kind: 'page-template'` discriminator rather than introducing a parallel registry/type system. Certified templates resolve completely before mutation and may flatten both executable Composition references and direct Component Definition members.

Resolution remains bounded to Page Template -> Composition -> Component. Page Template references from Page Templates and nested Composition references are rejected, preventing ambiguous recursive runtime behavior.

Instantiation creates one ordinary Page with fresh Component Instance identities, uses existing deterministic name/slug collision behavior, and records non-authoritative source template/version provenance. Generated Pages and Component Instances are deep-cloned ordinary document state and remain editable/renderable without the source Library template.

The Create Page flow preserves Blank Page and adds curated Certified template choices with purpose and section structure. Non-production lifecycle states remain outside the normal chooser.

Template Page creation is one transaction; Undo/Redo atomically removes/restores the generated Page and all owned Component Instances with stable identities.

## Scope discipline
No Starter Package execution, whole-site assembly, Blueprint execution, live template dependency, template update propagation, navigation/SEO/deployment infrastructure, persistence, service workflow, or later-stage systems were introduced.

## Forward architecture notes
1. Starter Packages can now be implemented as declarative whole-site recipes over executable Page Templates plus site-level Design Settings/default metadata.
2. Starter Package resolution should fully validate every referenced Page Template before mutating the Website and should instantiate all generated Pages in one atomic transaction.
3. Site assembly must decide explicit semantics for applying Starter Package Design Settings to an existing Website versus a new/empty Website; do not silently overwrite customized site defaults.
4. Blueprint execution can remain deferred until Starter Package assembly is proven; Blueprints should describe structure/recommendation and not become a second runtime page model.

## Decision
Approved. Architecture may create the next Studio 4 milestone.