# Studio 4 Milestone 01 — Implementation Note

## Outcome

The new `/studio4/` entry point proves a durable Website → Page → Component Instance → Component Definition boundary in a minimal Website Workspace. Studio v3 remains unchanged and is linked from the workspace as reference material.

## Run and test

- `node index.js`, then open `http://localhost:4173/`.
- `node --test studio4/tests/*.test.mjs` runs model, ordering, registry, and state-boundary tests.
- The equivalent package shortcuts are `npm start`, `npm test`, and `npm run validate` when npm is available.

## Object shapes

- `Website`: stable identity, display name, and ordered Page identities.
- `Page`: Website identity plus ordered Component Instance identities.
- `ComponentInstance`: stable identity, registered definition type, and structured content owned independently from rendering.
- `DesignSettings`: shared colors, radius, spacing, and typography values.

The seed is data, not generated HTML. `createStudioStore()` owns the mutable application-state boundary, validates updates, publishes snapshots to subscribers, and exposes a serialization seam for a future persistence adapter. It does not use `localStorage`.

## Registry contract and migration seam

`createComponentRegistry()` accepts definitions with a unique `type`, metadata such as `name` and `contentSchema`, and a `render(content, designSettings)` function. Pages reference instances; instances reference definition types. Rendering resolves every instance through the registry in Page order.

Future v3 adoption should use adapters that transform known v3 component/pattern content into `ComponentInstance.content`, then register equivalent definitions. Presentation variants can therefore reuse stored content without changing the Page or requiring re-entry. The v3 `sectionMarkup()` switch is not used by Studio 4.

## Validation and limitations

The slice includes Hero, Services, and CTA definitions. Primary color, secondary color, radius, and spacing controls update connected components immediately. It intentionally omits persistence infrastructure, editing, variants, page management, library UI, review, deployment, and later-roadmap systems. The in-memory store is the application boundary; a persistence adapter is future scope.

Milestone 02 subsequently adds bounded selection and structured-content editing while preserving this foundation.
