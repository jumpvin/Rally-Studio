# Rally Site Studio 4.0 — Milestone 07 Architecture Review

Milestone: `studio-4-m07-library-registry-lifecycle`
Implementation commit: `9cbb5ee7e1498d04c5098a3e34e48c2847b518f4`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 07 satisfies the frozen Library foundation and preserves the runtime/library boundary.

The implementation introduces stable typed Library items for token, component, composition, blueprint, and starter package, with the approved lifecycle states Certified, Specialty, Experimental, Deprecated, and Archived. Items carry stable IDs, version metadata, tags, descriptions, provenance, and typed payload/reference metadata.

Certified-default query behavior correctly keeps normal production discovery curated while explicit lifecycle filters expose Specialty, Experimental, Deprecated, and Archived knowledge. Search/type/status filtering is implemented in the Library registry rather than only in presentation code.

Most importantly, executable Component Definitions remain owned by the existing Component Registry. Library component records reference `definitionType` and startup validates those references. The Library does not duplicate renderers, variants, insertion defaults, or structured content contracts. Non-component seeds remain metadata-only and non-executable, as required.

The browse-only Library drawer is Edit-mode UI state and does not pollute document transaction history.

## Scope discipline
No Library authoring/promotion, executable compositions, blueprints, Starter Package assembly, usage inventory, persistence, multi-page assembly, or later-stage service systems were introduced.

## Forward architecture notes
1. The next Library slice should make compositions executable while keeping them declarative: compositions should reference component definitions/default variants/content templates rather than own renderer logic.
2. Composition insertion/instantiation should produce normal Component Instances and participate in the existing transaction history rather than create a parallel page representation.
3. Before project-to-Library promotion is implemented, Library version/provenance rules need an explicit immutable-version vs mutable-draft policy.
4. Starter Packages should remain deferred until page/composition execution and multi-page identity are proven.

## Decision
Approved. Architecture may create the next Studio 4 milestone.