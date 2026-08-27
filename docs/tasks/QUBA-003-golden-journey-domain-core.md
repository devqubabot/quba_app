# QUBA-003: Golden Journey domain core

- Status: in_review
- Owner/implementer: primary Codex agent
- Reviewer: unassigned (must be separate from implementer)
- Branch/worktree: `quba-003-golden-journey-domain-core`
- Last updated: 2026-08-27 Asia/Jakarta

## Goal

Provide framework-independent domain rules and an application transaction contract for the Golden Journey so normalized robot/app activity events can be retried without duplicating progress, completion, XP, or streak updates.

## Non-goals

- Adding SQLite, Supabase, BLE, notification, or other production dependencies.
- Locking BLE services, characteristics, framing, acknowledgement windows, or firmware payload shapes.
- Implementing UI, pairing, activation, cloud synchronization, or physical-device behavior.
- Implementing the final streak-expiration policy, correction/reversal events, badges, levels, or configurable XP balancing.
- Treating a standalone activity as a habit occurrence or rewarding it with habit XP/streak.

## Acceptance criteria

- [x] Domain entities use named types for IDs, dates, instants, progress values, and configuration versions without framework/vendor imports.
- [x] A new linked progress event updates its matching run and occurrence; crossing the occurrence target creates exactly one 10 XP ledger entry and records one streak completion.
- [x] Re-delivering the same `event_id` returns an acknowledgeable duplicate outcome without state mutations or a second reward.
- [x] Several linked runs may contribute to one occurrence, while completing a partial run does not complete or reward the occurrence early.
- [x] A standalone run can complete and enter processed history without an occurrence, XP ledger entry, or streak change.
- [x] Mismatched links, non-positive progress, unavailable entities, and events recorded after a habit tombstone are rejected with typed, non-acknowledgeable outcomes; a delayed event recorded before archival remains reconcilable.
- [x] Habit configuration accepts only monotonically newer versions, distinguishes an identical retry from a same-version conflict, and prevents tombstone removal.
- [x] The application use case defines an atomic unit-of-work port and translates transaction failure into a retryable typed outcome.
- [x] Deterministic tests cover normal, boundary, duplicate, linked, standalone, invalid, stale-version, tombstone, and transaction-failure behavior.
- [x] `npm run check` passes with no new production dependency.

## Context and sources

- PRD principles: section 5, especially supportive rewards, offline-first behavior, and trustworthy synchronization.
- PRD model and flow: sections 8.4-8.5, 9.2-9.4, 10.1, 12, and 13.
- PRD requirements: CHK-01, CNT-04, CNT-05, PRA-02-PRA-07, PRA-09, and XP-01-XP-04.
- PRD acceptance journeys: D (progress sync), E (safe retry), F (linked session), and G (standalone session).
- Related ADRs: ADR 0002 (local-first SQLite), ADR 0003 (Supabase boundary), and ADR 0004 (BLE adapter boundary).

## Scope ownership

- Modules/files owned by this task: `src/domain/{shared,habits,activities,rewards,sync}/`, `src/application/sync/`, their tests, and this task brief.
- Shared boundaries/contracts: normalized positive progress-delta activity events and the atomic application unit-of-work port.
- Known parallel tasks/conflicts: none. QUBA-001 and QUBA-002 are accepted and archived; this task starts from their reviewed baseline.

## Implementation plan

1. Define branded identifiers, explicit date/instant types, and the minimum habit, occurrence, activity-run, event, XP-ledger, and streak state.
2. Implement monotonic habit-configuration application with identical-retry, conflict, stale-version, and tombstone behavior.
3. Implement pure event reconciliation for linked and standalone runs, including exact-once completion rewards.
4. Define an application unit-of-work port that persists event inbox, run, occurrence, ledger, and streak changes atomically.
5. Add deterministic domain/application tests for the acceptance criteria.
6. Run quality gates, audit the diff, and hand off for independent review.

## Risk and verification plan

| Risk | Evidence/test required |
|---|---|
| A duplicate event awards XP or progress twice | Repeat the same `event_id`; assert duplicate outcome and zero writes on retry |
| A completed run rewards an incomplete occurrence | Complete a 15/15 linked run against a 30-minute occurrence; assert occurrence remains incomplete and no reward exists |
| Standalone activity contaminates habit state | Complete a standalone run; assert no occurrence, XP, or streak mutation |
| Two distinct completion events award the same occurrence twice | Apply an event to an already completed/rewarded occurrence; assert progress may advance but ledger and streak do not |
| Stale or conflicting configuration overwrites current state | Test lower, equal-identical, equal-different, and higher versions |
| An archived habit is silently restored | Test that a newer unarchive proposal is rejected |
| Partial persistence breaks idempotency | Application contract exposes one transaction boundary; fake-store test proves all writes occur within it |
| Hardware assumptions leak into domain | Import audit and ESLint boundaries; no BLE framing or vendor dependency |

## Current status

Implementation is complete and ready for independent review. The domain now owns explicit IDs, UTC instants, local dates, device clock offsets, progress/target values, configuration versions, habits, occurrences, linked/standalone runs, normalized events, XP ledger entries, and streak completion history. Pure reconciliation returns acknowledgeable applied/duplicate outcomes or typed non-acknowledgeable rejections. The application use case performs event-inbox, run, occurrence, ledger, and streak writes through one atomic unit-of-work port and returns a retryable failure when the transaction rolls back.

## Decision log

| Time | Decision | Rationale |
|---|---|---|
| 2026-08-27 | Normalize activity input as a positive progress delta inside the domain | BLE/app adapters can translate their payloads without locking firmware framing into business rules |
| 2026-08-27 | Award the PRD baseline of 10 XP once per completed occurrence | Journey D specifies 10 XP and the ledger must make retry behavior auditable |
| 2026-08-27 | Keep persistence behind one application unit-of-work port | Event inbox, occurrence, XP ledger, and streak writes must succeed or fail atomically |
| 2026-08-27 | Defer streak expiration while recording unique scheduled-date completions | Exact-once streak evidence is required now; expiration depends on a later clock/schedule policy |
| 2026-08-27 | Accept a delayed event recorded no later than `archived_at` | Upload-before-download sync and tombstones exist to preserve valid offline history during configuration changes |

## Changed files

| File/module | Change |
|---|---|
| `docs/tasks/QUBA-003-golden-journey-domain-core.md` | Task contract and handoff record |
| `src/domain/shared/` | Branded identifiers/numeric values, UTC instant and local-date handling, and explicit device clock offset |
| `src/domain/habits/habit.ts` | Habit/occurrence types and monotonic configuration/tombstone rules |
| `src/domain/activities/activity.ts` | Linked/standalone activity-run union and normalized progress event |
| `src/domain/rewards/rewards.ts` | Deterministic occurrence ledger ID, baseline XP, and scheduled-date streak recording |
| `src/domain/sync/reconcileActivityEvent.ts` | Pure linked/standalone reconciliation, deduplication outcome, validation, and exact-once reward plan |
| `src/application/sync/reconcileActivityEvent.ts` | Atomic unit-of-work port, transaction orchestration, acknowledgement policy, and retryable failure outcome |
| `src/{domain,application}/**/*.test.ts` | Deterministic configuration, time, reconciliation, duplicate, and transaction tests |

## Verification evidence

| Command/device/scenario | Result | Notes |
|---|---|---|
| `npm run check` | Pass | Prettier, ESLint with zero warnings, strict TypeScript, Jest 5/5 suites and 20/20 tests, and local React Doctor with no issues |
| `npx react-doctor@latest --verbose --scope changed` | Pass | Score 100/100; no issues after replacing the reported loop lookup with a `Set` |
| Focused domain/application tests | Pass | Linked completion, partial and multiple runs, standalone isolation, duplicate retry, extra progress, invalid links/progress, archival timing, config versions/tombstone, time normalization, atomic writes, and rollback |
| Code knowledge-graph architecture/trace audit | Pass | Application calls domain reconciliation; domain remains the framework/vendor-free leaf layer |
| `git diff --check` | Pass | No whitespace errors in staged or unstaged changes |
| Dependency diff | Pass | `package.json` and `package-lock.json` are unchanged; no production or development dependency added |

## Review findings

- Not reviewed; the implementer cannot provide final approval.

## Known issues and blockers

- Hardware BLE payload and acknowledgement details remain intentionally open.
- Physical Development Build verification remains a Milestone 1 gate and is outside this pure-domain task.
- Streak expiration relative to the current date, correction/reversal events, badges, levels, and configurable XP remain explicitly deferred.
- SQLite must enforce unique `event_id` and ledger/occurrence constraints inside the unit-of-work transaction in QUBA-004.

## Handoff / exact next step

A separate reviewer checks the normalized progress-delta semantics, archival-time rule, reward-state consistency, and unit-of-work contract against the PRD and ADRs, then runs `npm run check`. Resolve findings before changing the task to `done`. After acceptance, QUBA-004 can implement the SQLite schema, forward-only migration, repositories, event inbox, XP ledger constraints, and the unit-of-work port with fresh/upgrade/rollback tests.
