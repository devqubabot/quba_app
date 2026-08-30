# QUBA-004: SQLite persistence and atomic activity reconciliation

- Status: done
- Owner/implementer: primary Codex agent
- Reviewer: independent Codex Quba review (findings); project owner (remediation approved)
- Branch/worktree: `codex/quba-004-sqlite-persistence`
- Last updated: 2026-08-30 Asia/Jakarta

## Goal

Provide the local-first SQLite persistence boundary for the QUBA-003 Golden Journey domain so activity-event reconciliation, occurrence progress, XP rewards, and streak evidence commit atomically and remain idempotent across duplicate delivery, failure, and application restart.

## Non-goals

- Implementing BLE discovery, transport, framing, or robot acknowledgement.
- Implementing Supabase backup/cloud synchronization, authentication, or RLS.
- Implementing UI, dependency wiring into an application screen, or user-facing synchronization status.
- Expanding the domain model with badges, levels, reward reversal, streak expiration, schedules/reminders, or device ownership.
- Defining a final production database bootstrap/composition root before the Golden Journey UI and sync orchestration are introduced.

## Acceptance criteria

- [x] A versioned migration runner uses `PRAGMA user_version`, applies migrations in order, rejects databases newer than the app, enables foreign keys, and leaves no partial migration after failure.
- [x] Fresh databases receive the current schema for habits, occurrences, activity runs, processed activity-event inbox, XP ledger, and streak-completion evidence.
- [x] An upgrade from the representative previous schema preserves data and backfills immutable occurrence configuration snapshots.
- [x] SQLite constraints reject invalid linked/standalone relationships, duplicate `event_id`, duplicate occurrence reward entries, mismatched reward references, and invalid enum/value shapes.
- [x] Repositories translate persisted rows through domain constructors/validators instead of leaking unvalidated SQLite values into the application layer.
- [x] The SQLite unit-of-work implements the QUBA-003 application port and commits event inbox, run, occurrence, XP ledger, and streak writes in one transaction.
- [x] Re-delivering an event after commit returns an acknowledgeable duplicate without changing progress, XP, or streak evidence.
- [x] A write failure rolls back every reconciliation mutation; reopening and retrying the database can then apply the event exactly once.
- [x] Fresh-install, upgrade, reopen, rollback, constraint, duplicate-delivery, linked, and standalone tests run deterministically without public network or undeclared hardware.
- [x] `npm run check` passes.

## Context and sources

- QUBA-003 handoff: implement the SQLite schema, forward-only migration, repositories, event inbox, XP ledger constraints, and unit-of-work port.
- PRD principles and data rules: sections 5, 8.4-8.5, 10.1, 12, 13, 18, and acceptance journeys D-G.
- Related requirements: CHK-01, CNT-04, CNT-05, PRA-04, PRA-05, PRA-09, GAM-01-GAM-04, and GAM-08.
- Architecture baseline: SQLite is the operational local store; infrastructure depends inward on application/domain contracts; synchronization writes are retry-safe and resumable.
- Related ADRs: ADR 0002 (local-first SQLite) and ADR 0003 (Supabase remains outside the local critical path).

## Scope ownership

- Modules/files owned by this task: `src/infrastructure/sqlite/`, its tests, `package.json`, `package-lock.json`, and this task brief.
- Shared contracts consumed but not owned: `src/application/sync/reconcileActivityEvent.ts` and QUBA-003 domain types.
- Known parallel tasks/conflicts: none. QUBA-003 is independently approved at `f6722c5`; this branch starts at the recorded approval commit `2f53f55`.

## Implementation plan

1. Record the task contract and dependency decision, then establish the task branch.
2. Add the Expo-compatible SQLite production dependency and a narrow database interface that keeps Expo/vendor types inside infrastructure.
3. Implement ordered forward-only migrations, including a representative version-1 schema and a version-2 occurrence-snapshot upgrade.
4. Implement row codecs, repositories, and the application unit-of-work adapter with nested-transaction protection.
5. Add a Node SQLite test driver and deterministic infrastructure/integration tests for fresh, upgrade, constraints, rollback, reopen, duplicate, linked, and standalone behavior.
6. Run focused tests and `npm run check`, audit the diff and dependency changes, and update this brief with verification evidence.
7. Obtain an independent Quba review and remediate every actionable finding before completion.
8. Enforce exact activity-run link matching for standalone and linked processed events at the SQLite boundary, including a regression test for nullable foreign-key behavior.
9. Reject nested Expo SQLite transactions explicitly instead of allowing the serialized queue to wait on itself, with adapter regression coverage.
10. Re-run focused and canonical verification, record the remediation evidence, and obtain independent re-review.

## Dependency decision

| Item | Decision |
|---|---|
| Proposed production dependency | `expo-sqlite`, installed at the Expo SDK-compatible version |
| Rationale | ADR 0002 requires SQLite as the operational local store. Expo SQLite is maintained within the Expo SDK, supports development builds, and avoids a second native database runtime. |
| Alternatives | AsyncStorage/key-value storage cannot enforce relational, ledger, and transaction invariants; a community native SQLite library adds another native compatibility boundary; a custom native module is disproportionate for MVP. |
| Size/risk impact | Adds a native Expo module and SQLite binary/runtime surface. Risks are migration correctness, platform behavior, and test/runtime divergence; mitigate with a vendor-neutral executor boundary, real SQLite integration tests, `expo-doctor`, and later physical development-build verification. |
| Task-scope approval | The user explicitly requested continuation of QUBA-004, whose accepted QUBA-003 handoff requires SQLite persistence. No unrelated production dependency is authorized. |
| Test engine | Node 22's built-in SQLite is used only by tests through the same narrow executor contract. `@types/node` is declared as a dev-only type dependency; no second SQLite implementation or native binary is added to the app. |

## Risk and verification plan

| Risk | Evidence/test required |
|---|---|
| Duplicate delivery awards progress or XP twice | Apply and commit an event, redeliver it, and assert unchanged persisted counts and an acknowledgeable duplicate outcome |
| One persistence write fails after earlier writes | Inject a deterministic write failure, assert the transaction rolls back, reopen, retry, and assert one complete result |
| Schema upgrade changes historical interpretation | Seed the prior schema, migrate, and assert occurrence snapshots were backfilled from the then-current habit configuration |
| Ledger can reward one occurrence twice | Attempt a second ledger row for the same occurrence and assert a database constraint failure |
| Linked and standalone rows become ambiguous | Exercise table checks and row decoding for both link modes |
| Corrupt SQLite values enter domain logic | Decode through domain constructors and reject malformed enums, identifiers, dates, instants, and numeric values |
| Migration is interrupted | Force a migration statement failure and assert schema version/data remain at the previous version |
| App opens a newer unknown schema | Set a future `user_version` and assert a typed compatibility failure without schema mutation |
| Test and mobile SQLite behavior diverge | Keep SQL/executor APIs in the SQLite common subset; run Expo diagnostics now and physical development-build verification at the integration milestone |

## Current status

Implementation and review remediation are complete and approved by the project owner. SQLite now enforces a null-safe exact match between every processed event and its activity-run links, and the Expo adapter rejects nested transactions with a typed error before its serialization queue can deadlock. All acceptance criteria and local quality gates pass.

## Decision log

| Time | Decision | Rationale |
|---|---|---|
| 2026-08-27 | Use a two-version initial migration history | It proves a representative forward upgrade and preserves the QUBA-003 occurrence-snapshot remediation instead of treating an empty database as the only previous state |
| 2026-08-27 | Persist streak evidence as one row per habit and scheduled date | A composite primary key enforces exact-once completion evidence and reconstructs the current domain streak deterministically |
| 2026-08-27 | Keep the SQL executor vendor-neutral inside infrastructure | Production can use Expo SQLite while deterministic tests exercise real SQLite without shipping a second database dependency |

## Changed files

| File/module | Change |
|---|---|
| `package.json`, `package-lock.json` | Add the Expo SDK-compatible `expo-sqlite` production dependency and Node test types |
| `tsconfig.json` | Include Node types for the deterministic Node SQLite test driver |
| `src/infrastructure/sqlite/database.ts` | Vendor-neutral executor/database contracts and typed persistence errors |
| `src/infrastructure/sqlite/migrations.ts` | Forward-only schema versions, relational constraints, append-only protections, and exact event/run link validation |
| `src/infrastructure/sqlite/codecs.ts` | Domain-validated SQLite row encoders and decoders |
| `src/infrastructure/sqlite/goldenJourneyRepository.ts` | Habit, occurrence, run, event-inbox, XP-ledger, and streak persistence |
| `src/infrastructure/sqlite/activityReconciliationUnitOfWork.ts` | Atomic QUBA-003 reconciliation unit-of-work adapter |
| `src/infrastructure/sqlite/expoDatabase.ts` | Serialized Expo SQLite adapter, migration bootstrap, foreign-key check, and nested-transaction guard |
| `src/infrastructure/sqlite/testing/` | Deterministic Node SQLite driver and fixtures |
| `src/infrastructure/sqlite/*.test.ts` | Fresh, upgrade, rollback, constraint, reopen, retry, duplicate, linked, standalone, and Expo adapter coverage |
| `docs/tasks/QUBA-004-sqlite-persistence.md` | Task contract, dependency decision, review remediation, verification, and handoff |

## Verification evidence

| Command/device/scenario | Result | Notes |
|---|---|---|
| `npm test -- --runTestsByPath src/infrastructure/sqlite/migrations.test.ts src/infrastructure/sqlite/expoDatabase.test.ts` | Pass | 2/2 suites and 8/8 tests, including both review regressions |
| `npm run check` | Pass | Prettier, ESLint with zero warnings, strict TypeScript, Jest 8/8 suites and 39/39 tests, and local React diagnostics |
| `npx react-doctor@latest --verbose --scope changed` | Pass | Score 100/100; 11 changed files scanned with no issues |
| `git diff --check` | Pass | No whitespace errors |
| `npm run expo:doctor` | 19/21 checks pass | `expo-sqlite` has no reported compatibility mismatch; the remaining failures are unavailable CocoaPods and eight pre-existing Expo SDK patch-version drifts |
| Physical iOS/Android development build | Not run | Deferred until the runtime composition/integration milestone as recorded in task scope |

## Review findings

- P2 remediated: `processed_activity_events_validate_run_link_insert` uses null-safe `IS` comparisons to require the event's run ID, habit ID, and occurrence ID to match one persisted activity run. A direct-SQL regression proves a standalone-shaped event cannot target a linked run.
- P3 remediated: `ExpoQubaSqliteDatabase` tracks the active transaction, rejects nested entry with `SqlitePersistenceError.code = "nested_transaction"`, and rolls back the outer transaction. Adapter coverage proves it does not enqueue a second `BEGIN`.
- Documentation remediated: current status, acceptance criteria, changed files, verification, residual risks, and handoff now reflect the working tree.
- Original independent verdict: changes requested. All findings were remediated with regression coverage, and the project owner approved the remediated change on 2026-08-30.

## Known issues and blockers

- Physical iOS/Android development-build verification is not available in this task's automated environment and remains required before a milestone that ships the composed database at runtime.
- Expo Doctor reports that CocoaPods is unavailable and eight existing Expo SDK packages need patch-version alignment; `expo-sqlite` itself is not among the mismatches. Dependency alignment should be handled as a focused scaffold-maintenance task rather than mixed into QUBA-004 remediation.
- BLE acknowledgement and cloud outbox behavior remain outside QUBA-004; this task only makes the local reconciliation commit safe to acknowledge.

## Handoff / exact next step

QUBA-004 is accepted. Create the cohesive task commit, hand it off for integration into `main`, then select the next Milestone 1 task and establish its task brief before implementation.
