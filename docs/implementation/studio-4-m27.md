# Studio 4 Milestone 27 — Implementation Note

Milestone 27 adds immutable versioned Playbook definitions and Project-specific Roadmaps while preserving Project phase, Project Next Action, Tasks and every Website/domain store as separate authorities.

## Playbook definition and version model

`roadmap-store.js` exports a deeply frozen system-owned `standard-website@1.0.0` definition. It contains six ordered phases and fourteen stable checkpoint definitions covering Setup, Discovery, Strategy, Build, Client Review and Launch Readiness. Applied definitions are cloned into Roadmap snapshots; callers receive copies, so later external mutation cannot rewrite historical Roadmaps. Playbook authoring and migration are intentionally absent.

## Roadmap and checkpoint model

Explicit application creates one stable Roadmap per Project and snapshots Playbook ID/version/name plus ordered phases and checkpoints. Each checkpoint retains source phase/checkpoint IDs, title/description, order, completion mode, condition/target metadata, manual completion actor/timestamp and an empty seam for exact existing Task IDs. A second active Roadmap for the same Project is rejected.

## Derived conditions and manual semantics

Derived resolvers read Project/domain summaries for Project context, available Website, completed Discovery, ready Strategy, reviewed current Recommendations, assembled Website content, started Review, required feedback, resolved Review blockers and explicit Approval. They return deterministic completion and reasons without writing domain state. Already-satisfied later derived conditions remain visibly complete even when an earlier operational checkpoint is incomplete.

Manual checkpoints become `ready` only after preceding checkpoints complete. Explicit completion records Rally actor/time solely on the Roadmap. Derived checkpoints reject manual completion. Manual checkpoints can be reopened, clearing only their Roadmap evidence. None of these actions enters Website Undo/Redo, alters Project phase/Next Action, resolves collaboration state or fabricates Approval.

## Workspace UX

Project Workspace keeps domain-derived Next Action prominent and adds a separate Roadmap area with Playbook/version, progress, current checkpoint/reason, ordered phases, derived/manual status, completion controls and target navigation. Projects with no Roadmap show a valid Apply Playbook empty state. Rally’s multi-project cards show `No playbook` or compact Roadmap percent/current checkpoint and blocker count.

## Functional validation

- Automated: 110/110 cumulative tests passed. M27 coverage proves frozen topology/version, snapshot independence, one-Roadmap enforcement, Northstar/Summit condition resolution, derived override rejection, manual completion/reopen, progress/current/next derivation, navigation metadata, Project action independence and Website-history separation.
- Live browser: applied Standard Website Playbook to Northstar; observed immediately derived progress; completed required Discovery inputs; explicitly completed the ready manual Discovery-review checkpoint; opened Strategy from the Roadmap target; observed compact multi-project Roadmap progress; applied the Playbook to Summit and observed the deterministic Website-assignment blocker; zero console warnings/errors.
- JavaScript syntax, installed Framework integrity, HTTP assets, diff hygiene and Studio v3 preservation passed.

## Known seams

State remains in-memory. Playbook editing, version migration/replacement, persistence, Gantt dates/dependencies, automatic task generation, Portal/authentication, notifications and deployment remain deferred. Task-link storage is modeled but no automatic or competing Task behavior is introduced.

Architecture must review and accept this implementation; Builder has not promoted or completed the milestone.
