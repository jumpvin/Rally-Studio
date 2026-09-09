# Studio 4 Milestone 09 — Implementation Note

Milestone 09 replaces the singleton Page document with an ordered multi-page Website model. The canonical document shape is `website.pageIds`, `pages`, site-level `componentInstances`, and global `designSettings`. Existing singleton input is migrated at store creation without changing Page or Component Instance identities.

## Page and ownership model

Each Page owns an ordered list of exclusively referenced Component Instance IDs. Validation rejects missing or duplicate Page references, empty Websites, duplicate slugs, missing or multiply owned Component Instances, orphaned instances, and identity mismatches. `workspace.activePageId` is transient navigation state and is reconciled to the first remaining Page after document restoration or deletion.

## Page lifecycle and slug rule

The Explorer lists every Page above the active Page's component tree. Users can create, switch, rename, duplicate, reorder, and delete Pages. Page creation starts blank. Names are required; slugs automatically derive from the current name and receive a deterministic numeric suffix when needed. Rename always updates the slug because manual slug editing is not exposed in this milestone.

Duplication deep-copies every Component Instance with a fresh ID, including content, variant, responsive overrides, hidden state, and source Library metadata. Delete requires an explicit browser confirmation and cannot remove the final Page.

## Transactions and feature integration

Create, rename, duplicate, reorder, and delete are one transaction each. Page switching creates no history entry. Undo/Redo restores Page order, Page records, exclusive instances, and a valid active Page atomically. Component content, variants, responsive overrides, structural actions, and Composition insertion target the active Page; Design Settings remain Website-global.

## Validation evidence

Functional validation passed 31 automated tests covering the prior Milestones 01–08 surface and Milestone 09 create, navigation, rename/slug, duplicate independence, reorder, protected delete, final-Page protection, Undo/Redo, Composition isolation, global settings, and invalid ownership cases. JavaScript syntax checks, installed Framework integrity, HTTP asset startup, and the preserved Studio v3 entry point also passed.

## Known limitations

Page Templates, Starter Packages, Blueprint execution, shared/global sections, nested routes, navigation-menu authoring, SEO routing, redirects, persistence, deployment, and later roadmap systems remain intentionally out of scope.
