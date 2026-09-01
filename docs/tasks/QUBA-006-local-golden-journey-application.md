# QUBA-006: Local Golden Journey application orchestration

- Status: in_review
- Owner/implementer: primary Codex agent
- Reviewer: independent review completed with `Changes requested`; re-reviewer unassigned
- Branch/worktree: `codex/quba-006-local-golden-journey-application`
- Last updated: 2026-09-01 Asia/Jakarta

## Goal

Provide framework-independent application use cases and a SQLite adapter that can atomically prepare the local Golden Journey: save a valid habit configuration with its occurrence snapshot, then create either a compatible linked activity run or an isolated standalone activity run.

## Non-goals

- Building habit/activity screens or changing the current presentation shell.
- Adding BLE transport, robot acknowledgement, device pairing, activation, Supabase, notifications, or cloud outbox behavior.
- Recording progress events; QUBA-003 and QUBA-004 already own reconciliation and persistence for processed activity events.
- Generating schedules beyond one explicitly requested occurrence date.
- Adding execution-target state, reminders, badges, levels, streak expiration, or correction/reversal behavior.
- Adding a production dependency.

## Acceptance criteria

- [x] A domain factory creates an occurrence whose immutable activity type, target, active days, and configuration version are snapshotted from its habit.
- [x] Occurrence creation rejects an identity mismatch, an archived/disabled habit, a date outside the habit schedule, and an attempt to replace an existing occurrence with different immutable identity or snapshot data.
- [x] Habit setup applies only a new habit, an identical retry, or a monotonically newer configuration and persists the habit plus occurrence atomically.
- [x] A linked activity run can be prepared only for a compatible, available habit and occurrence whose snapshot matches the run type; unavailable or mismatched links return typed failures without writes.
- [x] A standalone activity run is persisted without a habit or occurrence and cannot contaminate habit state.
- [x] Re-delivering the same setup command is idempotent, while reusing an ID for different immutable input returns a typed conflict.
- [x] Application ports keep SQLite and Expo outside domain/application code, and the SQLite adapter reuses the QUBA-004 exclusive transaction boundary.
- [x] Deterministic domain, application, and real-SQLite integration tests cover success, retry, conflict, invalid schedule, archived/disabled habit, linked, standalone, and rollback behavior.
- [x] `npm run check` passes with no dependency change.

## Context and sources

- QUBA-004 handoff: select the next Milestone 1 task after atomic local persistence.
- PRD sections 5, 8.1-8.5, 9.2-9.4, 10.1, 11.3, 11.7, 12.2, 13.1-13.4, and journeys B, F, and G.
- Product invariants: one account owner/robot, local-first operation, monotonically versioned configuration, immutable occurrence history, and strict separation of linked and standalone activities.
- Related ADRs: ADR 0001 (Expo Development Builds) and ADR 0002 (local-first SQLite).

## Scope ownership

- Modules/files owned by this task: focused additions under `src/domain/habits/`, `src/domain/activities/`, `src/application/goldenJourney/`, `src/infrastructure/sqlite/`, their tests, and this task brief.
- Shared contracts consumed but not owned: QUBA-003 reconciliation and QUBA-004 SQLite database/repository primitives.
- Known parallel tasks/conflicts: QUBA-005 is an older documentation-only branch awaiting independent review and does not own these paths.

## Implementation plan

1. Add pure domain factories and typed results for occurrence and activity-run preparation.
2. Define application commands, transaction ports, and atomic use cases for habit/occurrence setup and linked/standalone run preparation.
3. Implement the application transaction port with the QUBA-004 SQLite database and repository.
4. Add deterministic domain/application tests and real-SQLite integration coverage, including rollback and retry.
5. Run focused tests and `npm run check`, audit the diff and dependency files, and update this brief for handoff.
6. Obtain a separate Quba review before marking the task done.
7. Add explicit snapshot-conflict regression coverage identified during implementer pre-review.
8. Remediate the independent-review finding by proving linked and standalone activity-run retries through the application and real-SQLite boundaries, then request a separate re-review.

## Risk and verification plan

| Risk | Evidence/test required |
|---|---|
| A later habit edit rewrites historical occurrence rules | Assert the occurrence snapshot remains derived from the configuration used at creation |
| A setup retry duplicates or mutates local state | Repeat identical commands and compare persisted row counts/content |
| An ID is reused for different data | Assert a typed conflict and zero writes |
| A linked run points to an incompatible or unavailable occurrence | Exercise habit/type/status/snapshot mismatches and assert no writes |
| Standalone activity gains a habit relation | Persist and reload a standalone run; assert both links remain null |
| Habit saves but occurrence/run save fails | Inject a write failure and assert the exclusive transaction rolls back |
| Application imports SQLite | ESLint/type import audit and architecture graph review |

## Current status

Implementation and independent-review remediation are complete. Domain factories now prepare immutable occurrence snapshots and quick activity runs with typed retry/conflict outcomes. Application use cases save habit/occurrence setup and linked/standalone runs through one transaction, and the SQLite adapter reuses the QUBA-004 exclusive transaction boundary. Application and real-SQLite regression coverage now proves that identical linked and standalone activity-run retries return `unchanged`, perform no application write, preserve mutable progress/status, and retain one row per run. The reviewer also implemented this remediation, so a separate re-review is required before approval.

## Decision log

| Time | Decision | Rationale |
|---|---|---|
| 2026-08-30 | Prioritize local setup orchestration over Expo package maintenance | Local dependency validation reports packages up to date; current Expo Doctor failures are network metadata and unavailable CocoaPods, while the Golden Journey still lacks application commands that create persisted inputs for reconciliation |
| 2026-08-30 | Keep UI and BLE outside this task | The local application contract can be proven deterministically before hardware and presentation choices expand the scope |

## Changed files

| File/module | Change |
|---|---|
| `docs/tasks/QUBA-006-local-golden-journey-application.md` | Task contract and implementation plan |
| `src/domain/habits/habit.ts` | Occurrence preparation, immutable snapshot retry matching, schedule and availability validation |
| `src/domain/activities/activity.ts` | Linked/standalone quick-activity preparation and typed conflict validation |
| `src/application/goldenJourney/setupGoldenJourney.ts` | Atomic setup commands, application transaction ports, and retryable failure outcomes |
| `src/infrastructure/sqlite/goldenJourneySetupUnitOfWork.ts` | SQLite implementation of the setup transaction port |
| `src/{domain,application,infrastructure}/**/*.test.ts` | Deterministic unit/application tests and real-SQLite integration/rollback coverage |

## Verification evidence

| Command/device/scenario | Result | Notes |
|---|---|---|
| `npm exec expo install -- --check` | Pass with offline caveat | Local Expo compatibility map reports dependencies up to date; public version endpoint was unavailable |
| `npm run expo:doctor` | Partial | 18/21 checks pass; failures are Expo metadata network access, React Native Directory response, and unavailable CocoaPods |
| Focused QUBA-006 tests | Pass | 4/4 suites and 23/23 tests; the remediation-focused application/SQLite run passed 2/2 suites and 12/12 tests |
| `npm run check` | Pass | Prettier, ESLint with zero warnings, strict TypeScript, Jest 11/11 suites and 59/59 tests, and local React Doctor completed |
| Code knowledge-graph architecture/trace audit | Pass | Application setup calls only domain factories; infrastructure implements the application port; no Expo/SQLite/vendor imports exist in domain or application |
| `git diff --check` | Pass | No whitespace errors |
| Dependency diff | Pass | `package.json`, `package-lock.json`, and `tsconfig.json` are unchanged in QUBA-006 |
| React Doctor latest changed-scope scan | No QUBA-006 findings | The tool selected the repository's unrelated QUBA-005 remote default as baseline and reported two pre-existing sequential-await warnings in untouched QUBA-004 files; score 79/100 is therefore not a QUBA-006 regression score |

## Review findings

- Implementer pre-review found one missing proof for same-ID occurrence snapshot conflicts; explicit domain and application regression assertions were added and all checks were rerun.
- Independent review requested changes because linked and standalone activity-run retry behavior was not proven through the application and real-SQLite boundaries.
- The reviewer implemented the requested regression coverage and reran the focused and canonical checks successfully.
- No final approval has been issued: because the reviewer also implemented the remediation, a separate re-review remains required.

## Known issues and blockers

- Physical iOS/Android Development Build evidence remains required when the composed native runtime enters scope.
- QUBA-005 remains independently reviewable on its separate branch and is not merged into this application task.
- React Doctor's changed-scope baseline resolves to the unrelated remote-default QUBA-005 branch, so its numeric score includes accepted QUBA-004 files and cannot be used as a precise QUBA-006 delta.

## Handoff / exact next step

Ask a separate re-reviewer to review the remediated working-tree diff against local `main` (QUBA-004 at `e68eac4`), confirm the activity-run retry regression coverage, rerun the focused and canonical checks, and record a verdict before the task can move from `in_review` to `done`.
