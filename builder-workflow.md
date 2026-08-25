# Builder workflow

Begin governed command results with the compact known-state line emitted by `resolve-builder-handoff.ps1`. Conversation health is advisory (`Healthy`, `Getting Long`, or `Rotation Recommended`) and must never claim a precise capacity percentage.

`workflow-state.json` is the sole mutable machine-readable lifecycle authority. Milestone Markdown freezes scope; review reports own findings; the Builder handoff is only a projection. Builder implementation requires baseline, mode, validation level, and non-empty affected paths/surfaces; Address Review additionally requires correction mode and canonical findings. Address Review starts from that compact handoff, automatically uses the canonical correction build, and reuses passed evidence until changed dependencies, contracts, or runtime surfaces invalidate it. Every retained reference is `evidence-id@source-commit` or `evidence-id@artifact-sha256`; missing or mismatched provenance fails closed.

Validation has exactly three levels: Presentation selects parse/lint, affected surface, and package/integrity; Functional selects parse/lint, targeted functional, affected integration, and package/integrity; Structural selects parse/lint, broader affected regression, and package/integrity. Elevation requires a recorded reason; lowering is not silent. Selected, skipped, and reused evidence groups are recorded.

Product packaging may call `archive-generated-build-output.ps1` with an explicit generated-directory pattern. It keeps the current generated folder prominent and moves only matching sibling generated folders to `archive/`; source and hand-authored paths outside that build root are ineligible.

Builder runs in Codex with the authorized local checkout.

For `Update Framework`, supply the Framework ZIP and authenticated SHA-256 plus any extension ZIP/SHA pairs. Builder reads the local checkout, derives the managed update internally, validates, creates one commit, pushes, and verifies a clean synchronized result. No snapshot request or hand-written plan is required.

For milestone work, verify branch, clean tree, remote synchronization, current milestone, and package identity. Run only the bounded checks selected by the milestone.

Do not run historical exhaustive matrices unless a milestone explicitly requires one.
