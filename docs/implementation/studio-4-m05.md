# Studio 4 Milestone 05 — Implementation Note

Milestone 05 adds Desktop, Tablet, and Mobile preview contexts plus constrained responsive exceptions. Device selection is Workspace UI state; it never creates a separate page or content tree.

## Responsive contracts

- Definitions and variants declare `responsiveCapabilities` with predefined allowed values.
- Instances store only explicit exceptions under `responsiveOverrides.<device>`. Empty devices are removed on reset.
- The store validates device names, capability membership, allowed values, and Mobile-only shortened headings.
- Canonical content remains unchanged; Mobile heading text is layered into a rendering copy.
- New sections start with no overrides. Duplication deep-copies overrides and structural Undo restores them.
- Per-device visibility leaves an Edit-mode placeholder and Explorer marker but omits the instance from clean Preview.

## UX and validation

The toolbar switches stable Desktop, Tablet, and Mobile canvas widths independently from Edit/Preview mode. The selected component exposes only its declared visibility, alignment, spacing, layout, and optional Mobile-heading controls, with Automatic and Reset paths.

Run `node index.js`, then open `http://localhost:4173/`. Run `node --test studio4/tests/*.test.mjs` for device state, constrained mutation, clearing, canonical-content preservation, duplication, Undo, default insertion, variants, and prior behavior.

## Intentional limits

Preview widths are representative rather than emulator-accurate. Overrides are intentionally constrained; arbitrary breakpoints, CSS, device-specific page trees, media tooling, persistent history, and later-roadmap systems remain deferred.
