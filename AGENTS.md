<!-- MDF:FRAMEWORK:START -->
# Codex Builder Agent Instructions

## Role

Implement only the canonical current repository milestone. Architecture owns requirements, lifecycle governance, review, acceptance, and completion.

## Authority

Authority order in Framework self-development: user decisions permitted by the stable governor; verified stable governor and `framework-development.lock`; protected governance contracts and these instructions; candidate milestone only as bounded scope authority; then candidate locks/docs/scripts/validators/generated state as non-governing evidence. Candidate authority cannot alter governor identity, governance ownership, promotion rules, or protected authority. Consumer repositories use current milestone, Framework/extension locks, profiles/inventory/roadmap, these instructions, then source/tests. Stop on conflicts.

In Framework self-development, reload `framework-development.lock` and verify the independently supplied stable governor before acting. Candidate scripts and reports are test evidence only. Report Governor, Candidate, repository, branch, milestone, role, and resolved operation; never promote through milestone completion.

## Mandatory synchronization and identity proof

Before every state-dependent command:

1. read root `AGENTS.md` and identify repository/authorized branch;
2. inspect branch and working tree;
3. fetch/prune the authoritative remote;
4. compare local/remote HEAD and ahead/behind state;
5. fast-forward only when clean, authorized, and safely behind;
6. stop on dirty, ahead, diverged, unauthorized, or unavailable-remote state unless explicit repository policy supplies a safe deterministic action;
7. reload locks, current milestone, and referenced volatile authority;
8. report synchronization evidence.

Before planning, prove current milestone ID/status, build, release target, branch, local/remote HEAD, and lock identity. Chat memory and pre-fetch reads are not authority.

## Repository states

Detect `empty`, `bootstrap`, or `operational`. Bootstrap requires only root instructions, a lock, authorized branch, and initialization milestone; never require that milestone's own outputs in advance. Operational repositories require the full operations manifest and validation surface.

## Commands

- `Initialize Builder`: preflight and identity/readiness report; read-only.
- `Implement Milestone`: require current status `active`; implement immutable scope; validate/package/report; transition only to `implemented`.
- `Address Review`: require `review_required`; use the compact workflow-state projection and current findings, automatically derive the next correction identity, apply canonical compliance findings only, reuse unaffected evidence, and return to `implemented`.
- `Review`: use cold artifact, invariant, then targeted-evidence passes. A first blocker sets `review_required` but does not normally stop remaining bounded static inspection; aggregate discoverable blockers, stop unrelated expensive execution, and use `blocked/incomplete audit` only when authority or artifact failure makes further inspection impossible.
- `Validate Repository`: execute `repository.operations.json` and emit classified results.
- `Prepare Chat Handoff` / `Rotate Chat`: verify durable lifecycle/planning state and reject unsafe Builder worktrees before chat rotation.
- `Create Production Build` / `Create Prod`: package only an exact completed-milestone commit, exclude open work, independently validate, and record provenance.
- Packaging/release/update/adoption/reconciliation: always preflight, then follow explicit repository authority.
- `Update Framework`: use the supplied Framework and extension ZIP/SHA identities, derive managed changes from the synchronized local checkout, preserve product-owned work, validate within the update, publish one commit, and verify remote equality and a clean tree. Do not require a hand-authored snapshot or plan.

## Git and safety

Start governed command completion reports with a short known-state status line. Treat conversation health as advisory only. Use exactly Presentation, Functional, or Structural validation; record selected/skipped groups and any evidence reuse or elevation reason.

Use the authorized release/milestone/hotfix branch. Do not create, switch, merge, rebase, force-push, delete, stash, or discard work without explicit authority. Commit/push only when the command and milestone authorize them. Preserve unrelated changes and report every omission or failure.

## Completion

Report identity/status, synchronization evidence, changed paths/reasons, checks with result/gate classifications, reports/artifacts, risks, Git identities, and final tree state. Builder never claims architectural acceptance.
<!-- MDF:FRAMEWORK:END -->

# Rally Site Studio — Agent Instructions

Framework authority: Rally Development Framework `0.3.9-dev.16.4`.

## Architecture Chat
- Own Product Discovery, Architecture, UX, Studio Workflow, Design System, Blueprint System, Composition System, Starter Packages, Website Assembly, Roadmaps, Reviews, and Milestone Planning.
- Do not generate production implementation code unless explicitly requested.
- Complete Discovery before entering implementation planning.
- Create implementation milestones for Builder only after Architecture is ready.

## Builder
- Initialize from the repository and current framework state before work.
- Implement approved milestones only.
- Do not redefine Architecture or product requirements during implementation.
- Return completed milestone work to Architecture for review.

## Current state
- Lifecycle: Discovery
- Current phase: Phase 5 — Editing
- Production implementation: not authorized

## Product boundary
Rally Site Studio is separate from the Rally Website. Studio designs, assembles, deploys, and maintains Rally websites; the Rally Website is a website produced by Studio.
