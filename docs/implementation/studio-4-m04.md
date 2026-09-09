# Studio 4 Milestone 04 — Implementation Note

Milestone 04 adds definition-driven presentation variants without coupling content to presentation.

## Variant contracts

- A Component Definition owns `variants[]`, stable variant IDs, display names, render functions, and `defaultVariantId`.
- The registry normalizes legacy single-renderer definitions into one `default` variant and rejects duplicate or invalid default identities.
- A Component Instance stores `variantId` beside `definitionType` and `content`.
- `setComponentVariant()` validates the instance/definition relationship and rejects unsupported variants without touching content.
- Insertion selects the definition default; duplication and structural Undo preserve variant state.

Hero provides Centered Statement, Split Feature, and Editorial Lead presentations. Services provides Card Grid and Editorial List. CTA demonstrates the single-variant path. Every renderer consumes the same content object and inherited CSS design settings.

## Use and validation

Select Hero or Services and use the Context Panel’s previous/next buttons or direct selector. Edit content, cycle variants, and return to confirm content preservation. Run `node --test studio4/tests/*.test.mjs` for registry, selection, invalid identity, default insertion, duplication, content preservation, and structural regression coverage.

## Intentional limits

Variants are code-registered approved presentations. Authoring variants, Library lifecycle, responsive overrides, persistence, multi-page assembly, and later-roadmap systems remain deferred.
