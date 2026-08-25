# Commands

- `Initialize Framework`: load and verify repository authority.
- `Create Milestone`: resolve product identity immediately, publish and verify the successor as `active` when implementation begins now, then update workflow state last with `active / Builder / Implement Milestone`. Planned milestones cannot be handed to implementation. Close an eligible predecessor when deterministic and use guarded rollback on failure.
- `Implement Milestone`: Builder implements the one active milestone.
- `Review`: Architecture performs cold and affected-area review.
- `Address Review`: Builder applies the consolidated correction contract as a lightweight transaction: derive the next correction identity from canonical workflow state, read the compact handoff plus frozen scope/findings, and reuse unaffected evidence.
- Governed responses show a short known-state status line. Conversation-health wording is advisory and never a fabricated percentage.
- `Update Framework`: Architecture hands off repository, Framework ZIP/SHA, and extension ZIP/SHA identities. Builder derives and applies the update locally, validates inside the transaction, creates one commit, pushes, and verifies.
- `Create Production Build`: package an accepted release candidate after revalidating target availability from the current artifact ledger immediately before packaging and again before ledger mutation.
- `Promote Framework`: explicit user-authorized promotion transaction. Before authorization, run `scripts/test-framework-promotion-identity.ps1 -RequestedIdentity <target>` against the current ledger; stored preflight state is non-authoritative. A consumed identity is allowed only when the same preflight also receives and verifies the exact existing SHA, milestone, and source commit for idempotent verification. Otherwise allocate a fresh release identity.
