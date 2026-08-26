# ADR 0002: Local-first with SQLite

- Status: Accepted
- Date: 2026-08-27

## Context

Quba must remain useful when the internet is unavailable and must connect directly to the robot. Delayed or failed synchronization must not lose progress or leave the UI empty.

## Decision

Use SQLite as the operational source for application state on the device. Local use cases write to the local database first, while cloud synchronization runs as retryable work. Schema changes use forward-only migrations.

## Consequences

- UI reads local state and does not wait for a network request when data is already available.
- Mutations require explicit sync metadata/outbox records.
- Conflict, retry, tombstone, migration, and recovery behavior become tested domain concerns.
- Sensitive authentication data remains in secure storage, not plain SQLite.

## Alternatives considered

- Cloud-first cache: initially simpler, but conflicts with offline behavior and direct robot synchronization.
- Key-value storage as the primary database: unsuitable for occurrence relations, events, ledger entries, and progress queries.
