# Rally Site Studio 4.0 — Milestone 09 Architecture Review

Milestone: `studio-4-m09-multi-page-website-management`
Implementation commit: `daebc85592e5aee4e5c70da368cea61e1a539335`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 09 satisfies the frozen multi-page Website architecture.

The canonical document model now has `website.pageIds`, a `pages` collection, site-level `componentInstances`, and global `designSettings`. `workspace.activePageId` remains transient navigation state and does not create history when changed.

Each Page owns an ordered list of exclusively referenced Component Instance IDs. Validation rejects missing/duplicate Page references, duplicate slugs, orphaned instances, multiply owned instances, and empty Websites. Existing singleton state is migrated without rewriting existing Page or Component Instance identities.

Page lifecycle operations are implemented through the shared transaction/history boundary: create, rename/slug update, duplicate, reorder, and protected delete are meaningful document edits; switching Pages is not. Duplication deep-copies component state with fresh identities. Deletion requires explicit confirmation and cannot remove the final Page. Undo/Redo restores Page order, Page records, owned Component Instances, and a valid active Page atomically.

Existing component content editing, variants, responsive overrides, structural editing, composition insertion, and global Design Settings correctly operate within the multi-page model.

## Scope discipline
No Page Templates, Starter Packages, Blueprint execution, shared/global sections, navigation-menu authoring, SEO routing, redirects, persistence, deployment, or later service systems were introduced.

## Forward architecture notes
1. Page Templates can now be made executable using the same principle as Compositions: one-time declarative recipes that instantiate ordinary Page + Component Instance state.
2. Starter Packages should compose multiple executable Page Templates/Compositions into a complete Website in a later milestone, once Page Template behavior is proven.
3. Shared/global section behavior should remain separate from Page ownership; do not introduce cross-page shared mutable Component Instances by accident.
4. Future persistence/history may need more efficient snapshots once complete multi-page sites become larger.

## Decision
Approved. Architecture may create the next Studio 4 milestone.