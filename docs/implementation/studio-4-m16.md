# Studio 4 Milestone 16 — Implementation Note

Milestone 16 adds immutable, in-session Review Versions as intentional Website checkpoints distinct from frequent Workspace Undo/Redo transactions.

## Review Version model

`createReviewVersionStore()` owns stable version identity, Website identity, editable label, creation time and actor, source reason, optional Review Session reference, deterministic document fingerprint, Page/Component counts, and a deep-cloned complete Website document snapshot. Store reads and inspection return clones so callers cannot mutate captured evidence.

Manual Create Version does not change the Website or its history. Relabeling, selecting, inspecting, and browsing likewise remain version metadata/UI operations outside Workspace history. A later Website edit never changes an existing version; a new explicit capture creates a distinct identity and fingerprint.

## Review and approval linkage

Starting a Review Session creates exactly one `review-session-start` Review Version and records its ID on both the Session and lightweight checkpoint. The checkpoint remains useful metadata while the Review Version owns the complete restorable snapshot. Approval records retain that same `reviewVersionId`, preserving exact reviewed-state evidence without restoring or publishing anything.

## Inspect and restore

The compact Version History drawer shows label, time, actor, source, Review Session/approval context, size, fingerprint, and whether a version matches the current Website. Inspect opens a dedicated read-only Website representation and exits without changing canonical state or history.

Restore requires an explicit confirmation step. It deep-clones the captured document into the canonical Website, preserving captured Website/Page/Component identities, and records one meaningful Workspace transaction. Undo returns to the exact pre-restore document and Redo restores the version again. Version records and all Conversations, Tasks, Review Sessions, questionnaire responses, and approvals remain untouched; their anchors become available or unavailable naturally through stable identities.

## Validation and limitations

Functional validation passed 67 automated tests covering Milestones 01–15 plus immutable capture, Session and Approval linkage, inspection, relabeling, protected restore, exact identity restoration, Undo/Redo, collaboration retention, anchor availability, and distinct later versions. JavaScript syntax, Framework integrity, HTTP assets, Studio v3 preservation, and live create/metadata/read-only inspection passed.

Persistence, branching/merging, visual diffing, deployment versions, production rollback, Portal access, authentication, and later-stage systems remain intentionally out of scope.
