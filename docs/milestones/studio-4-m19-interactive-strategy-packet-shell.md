---
milestone-id: studio-4-m19-interactive-strategy-packet-shell
mode: implementation
status: active
baseline: 50f751e98869214c53bf683b6940709900d0ffbb
validation-level: functional
affected-paths:
  - studio4/**
  - docs/implementation/**
  - docs/milestones/studio-4-m19-interactive-strategy-packet-shell.md
  - package.json
affected-surfaces:
  - Interactive Strategy Packet shell
  - Discovery and Strategy presentation
  - Canonical Design Settings controls
  - Live Website-in-packet preview
retained-evidence: []
---

# Rally Site Studio 4.0 — Milestone 19

## Title
Interactive Strategy Packet Shell

## Stage
Stage 6 — Interactive Strategy Packet & Discovery

## Objective
Create the first real Interactive Strategy Packet experience: a guided client-facing sequence that presents Discovery understanding, Rally Strategy/Vision, canonical Design Settings, and the actual Studio Website together in one coherent flow.

The packet must not create presentation-only copies of Website or Design Settings. Where the packet exposes design controls or Website preview, it must read from and write to the existing canonical Studio boundaries.

## Architectural Principle
The Strategy Packet is a view/workflow over real Studio state, not a second website builder or slide deck.

Discovery and Strategy remain separate semantic records. Design controls operate on canonical Design Settings. Website preview renders the real current Website. The packet may coordinate these systems but must not duplicate their sources of truth.

## Scope
Implement:
1. A structured Strategy Packet session/view model for the current Website context.
2. An ordered guided sequence with at least these stages:
   - Discovery Summary;
   - Strategy / Vision;
   - Design Direction;
   - Website Preview.
3. Read-only Discovery summary sourced from Milestone 17.
4. Editable Strategy presentation sourced from Milestone 18, reusing existing Strategy editing/provenance semantics rather than copying fields.
5. A focused Design Direction surface bound directly to canonical Design Settings.
6. A Website Preview surface that renders/navigates the actual current Website/Page state.
7. Clear packet navigation/progress so a client or Rally staff member understands where they are in the sequence.
8. Responsive behavior suitable for desktop-first use without obscuring the Website preview.
9. State separation tests proving packet navigation itself does not create Website history entries.
10. Functional tests proving Design Direction changes use normal Website history and are visible immediately in the Website preview.

## Packet Session / View State
The packet may maintain transient UI/session state such as:
- current packet step;
- expanded/collapsed summaries;
- current preview Page;
- whether Strategy details are being edited.

This state is Workspace/UI state only and must not enter Website Undo/Redo or become a second Strategy/Discovery record.

A lightweight stable packet/view identity may be introduced if useful, but persistence, client sharing, formal packet approval, and versioning are out of scope.

## Discovery Summary
Present a concise interpretation-friendly summary from the existing Discovery Response Set / normalized recommendation inputs.

Show useful categories such as:
- business / organization;
- primary audience;
- primary Website goal;
- primary visitor action;
- required content/pages;
- brand direction;
- functional needs / constraints.

Do not let this surface edit Discovery answers in M19. Provide a clear path/link back to Discovery if editing is needed.

## Strategy / Vision
Present the existing Strategy record in client-readable grouped sections.

Requirements:
- show readiness/progress;
- expose provenance subtly where useful to Rally staff;
- allow Strategy edits using the existing Strategy store/boundary;
- retain human-edit protection and stale-Discovery indicators;
- do not create a packet-owned duplicate Strategy object.

## Design Direction
Expose a deliberately small, high-value subset of canonical Design Settings appropriate to a Strategy conversation.

At minimum include controls for existing supported global concepts such as:
- primary/accent color(s) where available;
- typography selection/scale where available;
- spacing/density or equivalent supported global setting;
- radius/style treatment or another currently supported global visual token.

Builder must use the actual existing Design Settings schema. Do not invent unsupported production settings merely to fill the packet.

Design Direction edits must:
- mutate canonical Design Settings through the existing document transaction boundary;
- create sensible Website history entries;
- support Undo/Redo;
- immediately update the Website preview;
- not create a separate packet-specific design state.

## Website Preview
The Website is the star of the packet.

Provide a substantial preview area that renders the actual current Website using existing Component Registry/Page rendering behavior.

Requirements:
- allow switching among existing Pages;
- reflect canonical Design Settings and Website content immediately;
- remain read-only for normal content/structure editing inside the packet in this milestone;
- provide a clear path back to the main Studio editor for deeper Website edits;
- avoid screenshot/static-copy implementations.

The preview may use the same rendering functions/components already used by Studio. Do not fork a new rendering model.

## Navigation / UX
The packet should feel like a guided working session rather than four unrelated drawers.

Provide:
- visible step navigation;
- current-step indication;
- simple previous/next movement;
- a compact overall readiness/progress summary based on existing Discovery and Strategy readiness plus presence of a Website.

Do not require arbitrary “complete step” toggles. Readiness should be derived where possible from existing state.

The Website preview should receive the largest visual emphasis, especially in Design Direction and Website Preview stages.

## History / State Boundaries
Packet-only navigation and inspection must not create Website history.

Strategy edits remain Strategy state and outside Website history, exactly as in M18.

Design Settings edits are Website document edits and must use normal Website transaction history.

Discovery remains unchanged/read-only in the packet.

Review Sessions, Conversations, Tasks, Approvals and Review Versions remain independent and unchanged.

## Explicitly Out of Scope
Do not implement:
- formal Strategy Packet approval/sign-off;
- Strategy Packet version history;
- client authentication or Portal exposure;
- share links;
- comments specifically on packet steps;
- recommendation engine;
- automatic Starter Package/Page Template/Component selection;
- automatic Website assembly/adaptation from Strategy;
- AI generation;
- Discovery editing inside the packet;
- deep Website content/structure editing inside the packet;
- custom packet authoring/reordering;
- Organizations/Projects;
- persistence/database;
- notifications/email;
- deployment/hosting;
- later roadmap systems.

## Success Criteria
1. Milestones 01–18 remain intact.
2. One coherent Interactive Strategy Packet shell exists for the current Website context.
3. Packet has ordered Discovery Summary, Strategy/Vision, Design Direction and Website Preview stages.
4. Discovery Summary reads existing Discovery state without copying or mutating it.
5. Strategy stage reads/edits the existing Strategy record rather than a duplicate.
6. Human Strategy provenance/override behavior remains intact.
7. Design Direction controls are bound directly to existing canonical Design Settings.
8. Design changes create normal Website history transactions and support Undo/Redo.
9. Website preview updates immediately after Design Settings changes.
10. Website preview renders the real canonical Website, not a screenshot/static clone.
11. Preview can navigate existing Pages.
12. Packet navigation itself creates no Website history entries.
13. Packet UI state does not leak into canonical Website/Discovery/Strategy data.
14. Deep Website editing remains in the main Studio editor and is reachable from the packet.
15. The Website remains visually primary in Design Direction/Preview steps.
16. Review/Conversation/Task/Approval/Version state is unaffected by packet navigation and Strategy/Discovery inspection.
17. Automated tests cover cross-store sourcing, navigation-state separation, canonical Design Settings mutation, Undo/Redo, live preview updates and prior-milestone regression.
18. No recommendation, automatic site adaptation, Portal, Project or persistence system is partially implemented.

## Validation
Validation level: **functional**.

Builder must validate at minimum:
- open packet from Studio;
- move through all packet stages;
- verify Discovery values match Discovery store;
- edit Strategy from packet and verify same Strategy record changes;
- change each supported Design Direction setting;
- verify Website history entries are created only for design changes;
- Undo/Redo those design changes;
- verify preview updates immediately;
- switch preview Pages;
- exit/re-enter packet without duplicating state;
- verify packet navigation does not change Website history count;
- verify Review/Conversation/Task/Approval/Version state remains unchanged;
- no new runtime errors;
- Framework integrity;
- Studio v3 preservation.

## Deliverables
Builder returns:
1. implementation changes;
2. Milestone 19 implementation note;
3. Strategy Packet view/session architecture documentation;
4. Discovery/Strategy sourcing behavior;
5. canonical Design Settings integration behavior;
6. Website preview/rendering behavior;
7. functional tests/validation results;
8. known limitations;
9. Architecture questions rather than silent scope expansion.

## Architecture Freeze
The frozen scope is a guided Interactive Strategy Packet shell over existing Discovery, Strategy, canonical Design Settings and the real Website. It must prove shared-source interaction without implementing recommendations, automatic site adaptation, packet approval/versioning, Portal, Projects or persistence.

## Builder Instruction
Implement **Rally Site Studio 4.0 Milestone 19 — Interactive Strategy Packet Shell** from this frozen contract in `jumpvin/Rally-Studio` on `master`. Build a guided packet sequence over the existing Discovery and Strategy records, expose a focused Design Direction step bound directly to canonical Design Settings, render the actual current Website as the primary live preview, keep packet navigation/UI state outside Website history, preserve all Milestones 01–18 boundaries, validate every functional success criterion, and return the completed milestone to Architecture for `Review`.