# Quba App Architecture Overview

Status: Foundation-phase baseline. Implementation details may evolve through ADRs, but the data and dependency invariants below must not be violated without explicit review.

## System context

```text
Quba App
├── Presentation: screens, navigation, components, accessibility
├── Application: use cases, orchestration, ports, typed outcomes
├── Domain: habits, occurrences, activity runs, events, XP, streaks
└── Infrastructure
    ├── SQLite repositories and migrations
    ├── Supabase auth and cloud synchronization
    ├── BLE transport and protocol adapter
    ├── notifications/prayer-time integrations
    └── telemetry and diagnostics

Quba Bot
├── local reminders and activity execution
├── offline event queue
└── BLE protocol

Supabase
├── identity and account recovery
├── activation and device ownership
├── backup/cloud synchronization
└── server-enforced authorization
```

Dependencies move only from the outside inward: presentation and infrastructure depend on application/domain contracts. Domain does not know any framework or vendor.

## Responsibility boundaries

### Quba App

- Acts as the center for habit, schedule, activity-run, pairing, correction, and reflection configuration.
- Stores operational state in SQLite so UI and core use cases do not depend on the network.
- Pulls robot events before sending new configuration.
- Reconciles events idempotently and presents understandable synchronization results.

### Quba Bot

- Runs synchronized reminders, counters, checklists, and countdowns.
- Persists offline events until it receives an acknowledgement.
- Does not host complex habit configuration.
- Rejects incompatible payload/protocol versions without corrupting the last valid state.

### Supabase

- Handles authentication, activation, ownership, recovery, backup, and cloud synchronization.
- Enforces authorization through RLS/server boundaries.
- Does not sit on the critical path for running an already-available local activity.

## Core data rules

### Configuration

- Habits and schedules use a monotonically increasing `config_version`.
- App/backend wins configuration conflicts in the MVP.
- Delete is represented as an archive/tombstone until every relevant consumer is safe.

### Activity events

- Events are append-only with globally unique `event_id` values.
- The robot resends an event until it receives an acknowledgement.
- The application may receive the same event repeatedly but applies it only once.
- Raw events do not award XP directly; reconciliation resolves the occurrence and writes an idempotent XP ledger entry.

### Activity runs

- A linked run references only a habit with a compatible type.
- Use `occurrence_id` when a relevant occurrence is available.
- A standalone run has no `habit_id` or `occurrence_id` and does not affect habit streaks or badges.
- Multiple runs may contribute to one occurrence without producing duplicate completion or rewards.

### Time

- Store instants in UTC.
- A local schedule stores its timezone and local-time intent, not only a one-time conversion result.
- Robot events include the recorded time and device clock offset required for reconciliation.
- Timezone changes, clock drift, and daylight-saving behavior are explicit domain cases.

## Sync state machine

Minimum flow:

```text
discover → connect → authenticate/protocol-check
→ read device metadata
→ upload unacknowledged events
→ validate and deduplicate
→ apply occurrence/XP/streak transaction
→ acknowledge applied events
→ download newer configuration/activity run
→ confirm atomic device apply
→ report full/partial/failure outcome
```

The connection may drop at any step. Every step must be safely repeatable without losing events, the last valid configuration, or awarding a reward twice.

## Initial module boundaries

Final folder names are locked during scaffolding, but the initial module boundaries are:

- `auth-activation`
- `devices-pairing`
- `habits-occurrences`
- `activities`
- `sync`
- `rewards`
- `reminders-prayer-times`
- `statistics`
- `settings-profile`

Create shared code only for concepts that genuinely cross domains. Avoid a `utils` folder that becomes an ownerless dependency sink.

## Security and privacy baseline

- A service-role key never enters the application bundle.
- Store tokens through secure platform storage, not plain SQLite or logs.
- Verify device ownership on the server; BLE proximity alone is not proof of ownership.
- Redact or minimize sensitive diagnostics.
- Analytics stores only the events and metadata required by PRD metrics.

## Open architecture inputs

The following items cannot be locked before hardware feasibility work:

- BLE services/characteristics and protocol framing.
- MTU, throughput, bonding, retry window, and acknowledgement details.
- Habit, reminder, and offline event-queue capacity.
- Firmware update path.
- RTC accuracy and recovery after power loss.
