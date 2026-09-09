# Rally Site Studio 4.0 — Milestone 12 Architecture Review

Milestone: `studio-4-m12-review-comments-conversations`
Implementation commit: `0d7380a8af6a306470f7594656a77dd6ab30d2f2`
Validation level: functional
Decision: **Approved**

## Review summary
Milestone 12 satisfies the frozen Review Comments & Conversations architecture.

The implementation correctly separates collaboration metadata from the canonical Website document and its transaction history. Conversations own stable identities, Website/Page/optional Component anchors, actor placeholders, timestamps, ordered Messages, and the approved lifecycle states: Open, Waiting on Rally, Waiting on Client, and Resolved.

Conversation creation, replies, filtering, selection, status changes and navigation do not create Website history entries. Document editing continues through the existing transaction boundary independently.

Anchoring behavior is correct: conversations remain attached through reorder/content/variant/responsive changes, become explicitly unavailable when their Page or Component identity disappears, and recover navigation automatically when Undo restores the same identity. Whole-Website replacement does not silently reassign or destroy old conversations.

The Comments lens implements the approved sidebar-first interaction with temporary pins on the canvas only while Comments mode is open. Selecting conversations can navigate across Pages and focus the anchored Component when available.

Functional evidence reports 47 automated tests passing across prior milestones and the new conversation behaviors, plus Framework integrity, startup/assets, Studio v3 preservation and a live review-conversation scenario.

## Scope discipline
Formal Review Sessions, guided review questions, approvals/sign-off, task conversion, assignments, notifications, Portal exposure, persistence, authentication, realtime sync, attachments and later service-platform systems remain deferred.

## Forward architecture notes
1. Review Sessions should wrap conversations and a frozen review target/checkpoint rather than copy Website content into a parallel review document.
2. Approval must be separate from conversation resolution: zero open comments is useful context but must not automatically equal approval.
3. When persistence/multi-user identity arrives, collaboration state should retain its separate service boundary rather than being folded into Website transaction snapshots.
4. Task conversion should reference the source Conversation rather than mutate a Conversation into a Task.

## Decision
Approved. Architecture may create the next Studio 4 milestone.