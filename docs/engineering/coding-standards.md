# Coding Standards

This document complements `AGENTS.md`. Automated tooling is the source of truth for formatting; this document focuses on correctness and maintainability.

## TypeScript and boundaries

- Enable strict mode and maintain zero unexplained type errors.
- Use domain types for identifiers, durations, counter values, versions, timestamps, and statuses that must not be mixed.
- Narrow `unknown` at boundaries. BLE/network/storage payloads are not trusted merely because they have a TypeScript type.
- Use discriminated unions for mutually exclusive states and outcomes.
- Translate external failures into typed application errors with categories for retry, user action, incompatibility, authorization, and permanent failure.

## Dependency direction

```text
presentation → application → domain
infrastructure ─────────────→ application/domain contracts
```

- Domain does not depend on a framework, database, network, BLE, analytics, or UI.
- Application orchestrates use cases and transaction boundaries, not rendering details.
- Infrastructure handles vendor SDKs, persistence, serialization, transport, and telemetry.
- Presentation renders state and sends intent; a screen does not implement reconciliation or reward logic.

## Data integrity

- Use a database transaction when one event changes the event inbox, occurrence, XP ledger, streak, and sync metadata together.
- Every activity-event consumer must be idempotent using a stable identifier.
- Do not use a title or name as an identity or deduplication key.
- Deleting synchronized data must account for tombstones/archives and unacknowledged events.
- Prefer additive/forward-only migrations and always include an upgrade test.

## React Native

- Keep state as close as possible to its consumer; shared state is only for data that genuinely crosses screens/modules.
- Avoid effects for derived state and global subscriptions without cleanup.
- Use virtualization and stable keys for large lists.
- Animations must respect reduced motion and must not block the JavaScript thread.
- Verify permissions, background behavior, and native failures on both supported platforms.
- Do not use Expo Go as evidence for a native flow.

## User experience

- A user-facing error answers: what happened, whether the data is safe, what the user can do next, and whether retry is safe.
- Do not communicate information through color or audio alone.
- Copy must not judge the user or turn worship into an assessment of spiritual value.
- Keep every user-facing string ready for localization; do not concatenate sentence fragments that are difficult to translate.

## Dependencies

A new production dependency requires a task-brief record covering:

- the problem it solves;
- alternatives considered;
- maintenance and provenance;
- native/build impact;
- bundle/runtime/security impact;
- how it will be tested and removed if necessary.

Commit the lockfile. Do not perform a major upgrade as a feature-task side effect.

## Security and observability

- Secrets must not enter source, fixtures, screenshots, analytics, or logs.
- Internal logs use stable error/event codes and minimum metadata.
- Redact sensitive identifiers in support UI and telemetry.
- Expected offline/retry states are not fatal exceptions.
- Crash reporting must remove tokens, email addresses, activation codes, and sensitive raw BLE payloads.
