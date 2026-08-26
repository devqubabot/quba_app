# Testing Strategy

Quba testing exists to prove progress integrity, recovery, and user experience—not to pursue coverage numbers without context.

## Test layers

| Layer | Focus | Example |
|---|---|---|
| Domain unit | Pure rules and edge cases | occurrence, linked/standalone, XP, streak, target completion |
| Application | Orchestration and typed outcomes | create habit, start run, reconcile event, retry sync |
| Component | User-visible behavior | form validation, loading/offline/error, accessibility |
| Infrastructure contract | Port implementations | SQLite repository, BLE fake/real contract, Supabase adapter |
| Integration | Multiple boundaries together | event → transaction → occurrence → XP ledger → outbox |
| Device/E2E | Critical user journey | activation, pairing, golden journey, reconnect, recovery |

## Risk-based requirements

### Domain or reward change

- Unit tests for normal, boundary, duplicate, correction, and invalid transitions.
- Evidence that reward/completion cannot happen twice.

### SQLite schema/repository change

- Fresh database test.
- Upgrade test from the previous schema with representative data.
- Transaction rollback and restart/reopen tests where relevant.

### Sync change

- Duplicate delivery.
- Disconnect before and after acknowledgement.
- Partial success.
- Out-of-order/stale configuration version.
- Event for an archived habit or unavailable occurrence.
- Restart in the middle of the process and safe retry.

### BLE/protocol change

- Contract tests against protocol fixtures agreed with firmware.
- Permission denied, powered off, timeout, disconnect, incompatible protocol, malformed payload, and storage-full behavior.
- Physical-device verification on iOS and Android for the relevant milestone.

### Supabase change

- Migration and constraint tests.
- RLS tests for anonymous, owner, different owner, and trusted server roles as appropriate for the operation.
- Idempotency/concurrency tests for activation, binding, and cloud reconciliation.

### UI change

- Tests use queries and interactions that reflect user behavior.
- Verify the relevant empty/loading/success/offline/error states.
- Verify accessibility labels/roles, touch targets, focus/announcements, reduced motion, and localization layouts.

## Critical journeys

The following journeys must not regress:

1. Activate and pair one robot.
2. Create a dzikir habit with target 33 → sync → complete offline activity → sync back → exactly one XP/streak update.
3. Retry after the app receives an event but acknowledgement fails.
4. A linked session contributes to the correct occurrence.
5. A standalone session enters history without a habit reward.
6. The app remains able to process the robot locally while offline from the backend.
7. Restart/disconnect recovery preserves the last valid state.

## Test quality

- Use a fixed clock and deterministic IDs in tests.
- Avoid arbitrary sleeps; wait for observable state/events.
- Do not mock the unit being proved.
- Protocol/data fixtures are versioned and readable.
- A test failure explains which invariant broke.
- Treat a flaky test as a defect; do not merely retry without a root-cause task.

## Verification record

The task brief records the command, platform/device, result, and tests that could not run. Hardware-dependent verification must not be claimed from a mock or simulator alone.
