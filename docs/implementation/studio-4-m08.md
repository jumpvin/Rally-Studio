# Studio 4 Milestone 08 — Implementation Note

Milestone 08 makes Certified Library compositions executable as one-time declarative recipes. They expand into ordinary independent Component Instances; there is no nested renderer or persistent group dependency.

## Composition and resolution contract

An executable Composition payload contains ordered `members` with `definitionType`, optional `variantId`, optional structured content overrides, and optional responsive seed metadata. `resolveComposition()` verifies item type/lifecycle, validates every member through the runtime Component Registry, resolves explicit/default variants, deep-clones definition defaults, and safely layers content overrides before any Page mutation.

## Instantiation and history

`insertComposition()` assigns fresh stable IDs and inserts all resolved members into `Page.componentInstanceIds` at the requested index in one document transaction. Undo removes the group atomically; Redo restores the same identities and state. Generated instances carry non-authoritative source ID/version metadata but render and edit without the source item.

Two Certified seeds are executable: Service Business Home Core (Hero → Services → CTA) and Lead Generation Intro (Split Hero → CTA). Default variants, an explicit variant, and content overrides are demonstrated.

## UX and limits

Certified executable Composition cards in the Edit-mode Library show their section order and an Add Composition action. Specialty, Experimental, Deprecated, and Archived compositions are excluded from this default production flow.

Composition authoring, live grouping, Starter Package/Blueprint execution, multi-page assembly, promotion/version publishing, and later roadmap systems remain deferred.
