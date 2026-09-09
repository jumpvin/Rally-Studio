---
milestone-id: studio-4-m09-multi-page-website-management
mode: implementation
status: active
baseline: 2e84910632710ec51c3728ec17d1cb401e10f0b6
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m09-multi-page-website-management.md
  - package.json
affected-surfaces:
  - Website to Page collection model
  - Page switching and page-first navigation
  - Page creation duplication rename ordering and deletion
  - Multi-page transaction/history integration
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 09

## Title
Multi-Page Website Management

## Objective
Expand Studio 4 from one current Page into a real multi-page Website model so the Website Workspace can create, navigate, rename, duplicate, reorder, and safely delete Pages while preserving the existing structured Component Instance, Library, Composition, responsive, and history architecture.

This milestone establishes the Website/Page foundation required before Page Templates and Starter Packages can assemble complete sites.

## Scope
Implement:
1. A Website-owned ordered Page collection with stable Page identities.
2. Migration of the current single-page state into the multi-page shape without losing existing page/component data.
3. Explicit current/active Page selection as Workspace UI state.
4. Page-first Website navigation that lists all Pages and clearly identifies the active Page.
5. Create Page from a simple blank-page/default path.
6. Rename Page.
7. Duplicate Page with deep-copied Component Instances and fresh identities.
8. Reorder Pages.
9. Reversible Delete Page with stronger protection than section deletion.
10. Multi-page-aware Component Instance lookup, page rendering, composition insertion, selection, responsive editing, and history.
11. Multi-page state validation.
12. Functional tests proving isolation between Pages and correct transaction behavior.

## Required Model
### Website owns Page order
The Website must become the authoritative owner of Page identity/order, using a shape equivalent to:
- `website.pageIds: string[]`
- `pages: Record<pageId, Page>`

Exact names are Builder-owned, but one globally embedded `state.page` must no longer be the architectural source of truth.

Each Page retains its own ordered `componentInstanceIds`.

### Component Instance ownership
Component Instances must remain independently identified structured objects. Their relationship to Pages must be unambiguous.

Builder may retain a site-level `componentInstances` record referenced by Page IDs, or move instances under Pages if that can be done without breaking the established registry/history/composition model. Architecture prefers minimal migration and one clear source of truth.

An instance must not accidentally belong to two Pages unless a future explicit shared-component architecture authorizes that behavior. Shared/global sections are out of scope.

### Active Page is Workspace state
The current Page selection is transient Workspace navigation state and must not create a document history transaction merely because the user switches Pages.

The active Page identity must remain valid after document mutations. If the active Page is deleted/restored, Studio must deterministically select/reconcile a valid Page.

## Page Creation
Provide a simple `+ Page` flow.

For this milestone, creation may accept:
- Page name;
- slug/path derived automatically from the name, with optional simple editing if already easy to support.

A new blank Page should contain no arbitrary generated content. Builder may optionally seed a minimal known-safe default if the existing architecture requires it, but do not implement Page Template recommendation yet.

Create Page is one meaningful history transaction.

## Rename and Slug
Page name is editable. Page slug/path must be unique within the Website.

If slug derives automatically from rename, document that behavior. If slug stops auto-following after manual editing, document that behavior. Keep the rule simple and deterministic.

Do not build advanced redirects, SEO routing, nested URL hierarchies, or deployment routing in this milestone.

## Duplicate Page
Duplicating a Page must:
- create a fresh Page ID;
- create fresh Component Instance IDs for every copied instance;
- deep-copy structured content, variant state, responsive overrides, hidden state, and non-authoritative source-library metadata;
- preserve component order;
- not share mutable object references with the source Page;
- produce a unique name/slug;
- be one transaction.

History Undo/Redo must remove/restore the duplicated Page atomically.

## Page Reorder
Allow Pages to be reordered in the Page-first navigation using bounded controls or another simple interaction. Sophisticated drag/drop polish is not required.

Reorder mutates Website page order only; it must not alter component order inside Pages.

## Delete Page
Page deletion is higher risk than section deletion and should receive stronger protection.

Use an intentional confirmation dialog or equivalent explicit protected action before deleting a Page.

Constraints:
- the Website must not be left with zero Pages unless Architecture explicitly authorizes an empty Website in the future;
- deleting a Page removes it from active Website order and its exclusively owned Component Instances from active document state;
- deletion must be fully reversible through transaction Undo/Redo;
- if the active Page is deleted, select a deterministic remaining Page.

## Navigation / Explorer UX
The existing page-first Explorer should evolve so Pages are the first structural layer.

A suitable hierarchy is:
- Website
  - Home
    - Hero
    - Services
    - CTA
  - About
    - ...
  - Contact
    - ...

The active Page's Component Instances remain the detailed editing list. Builder may use collapsible navigation or a page selector plus component list; final visual polish is not required.

The canvas must always render the active Page.

## Existing Feature Integration
Every existing page-scoped feature must operate on the active Page only:
- select Component Instance;
- content editing;
- variant selection;
- responsive overrides;
- reorder/add/duplicate/hide/delete sections;
- Add Composition;
- canvas and Explorer rendering.

Global Design Settings remain Website/site-level and affect every Page.

Library and History drawers remain Website Workspace tools.

## History Contract
Meaningful Page operations participate in the existing transaction system:
- Create Page;
- Rename Page / slug change;
- Duplicate Page;
- Reorder Pages;
- Delete Page.

Switching active Page is Workspace UI state and does not create history.

Existing component edits continue creating history regardless of which Page is active. History metadata should identify the affected Page where useful.

Undo/Redo must correctly restore Page collections, page order, instances, and a usable active-page selection.

## Composition Integration
`insertComposition()` or equivalent must target the active Page (or an explicit Page ID at the state/service boundary) rather than an implicit global singleton Page.

A composition inserted on Page A must not affect Page B.

## Validation Contract
Extend structured validation to detect at minimum:
- Website references unknown Page IDs;
- duplicate Page IDs in Website order;
- zero-page Website if disallowed;
- Page references unknown Component Instance IDs;
- duplicate Component Instance IDs within a Page order;
- a Component Instance referenced by multiple Pages if shared ownership is not supported;
- duplicate slugs/paths;
- invalid active Page selection can be reconciled or rejected appropriately at the Workspace boundary.

## Explicitly Out of Scope
Do not implement:
- Page Templates / executable Page Template Library objects;
- Starter Package assembly;
- Blueprint execution;
- recommendations based on page names;
- nested routes or page folders;
- global/shared sections such as one Header instance reused across Pages;
- navigation menu authoring;
- SEO metadata beyond a simple page slug/path if needed;
- redirects;
- publishing/deployment routing;
- persisted database state;
- collaboration/comments/review;
- Organizations/Projects/Portal/Discovery;
- authentication/permissions;
- later roadmap systems.

## Success Criteria
1. The Website owns an ordered collection of at least one Page and no longer depends architecturally on one singleton `state.page`.
2. Existing seed content migrates into the multi-page model without losing behavior.
3. User can switch between Pages without creating a history entry.
4. Canvas and Component Explorer always represent the active Page.
5. User can create a new Page with stable unique identity and unique name/slug behavior.
6. User can rename a Page with deterministic slug behavior.
7. User can duplicate a populated Page and receive independent copied Component Instances with fresh IDs.
8. Editing the duplicate does not alter the source Page.
9. User can reorder Pages without changing sections inside them.
10. Page Delete uses stronger intentional protection than section Delete.
11. Website cannot accidentally end with zero Pages.
12. Delete/Undo/Redo restores Page and instance state atomically.
13. Active-page selection is reconciled correctly after Page delete/undo/redo.
14. Existing content/variant/responsive/structural editing remains scoped to the active Page.
15. Add Composition inserts only into the intended active Page.
16. Global Design Settings continue affecting every Page.
17. History records Page document changes but not Page navigation.
18. Validation rejects broken Page/instance ownership and duplicate slug/order conditions.
19. Automated functional tests cover create, switch, rename, duplicate independence, reorder, protected delete, Undo/Redo, composition isolation, and prior milestone regression.
20. No Page Template, Starter Package, deployment, shared-section, or later-stage capability is partially implemented.

## Validation
Validation level: **functional**.

Builder must validate a mixed scenario:
- start on Home with existing components;
- create About;
- switch between Home/About and confirm no navigation history entry;
- insert a Composition on About only;
- rename About and validate slug behavior;
- duplicate About;
- edit duplicate content/variant and prove About is unchanged;
- reorder Pages;
- delete one non-final Page through protected flow;
- Undo and Redo the deletion;
- attempt to delete the final remaining Page in an isolated test and verify protection;
- edit Design Settings and confirm all Pages inherit them;
- run automated regression tests for Milestones 01–08.

Also validate startup/assets, no new runtime errors, Framework integrity, and v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 09 implementation note;
3. updated Website/Page/Component Instance model documentation;
4. active-page Workspace state/navigation contract;
5. page operation/history semantics;
6. slug/name rule documentation;
7. validation and automated test results;
8. known limitations;
9. Architecture questions instead of silent scope expansion.

## Architecture Freeze
The frozen scope is multi-page Website identity, navigation, and safe Page lifecycle operations. Page Templates, Starter Packages, shared/global sections, route/deployment infrastructure, and later systems require separate Architecture authorization.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 09 — Multi-Page Website Management** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Evolve the single-page state into an ordered multi-page Website model, add active-page navigation plus create/rename/duplicate/reorder/protected-delete operations, integrate all existing page-scoped editing/composition/history behavior with the active Page, preserve Milestones 01–08 architecture, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.