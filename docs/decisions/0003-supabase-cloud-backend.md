# ADR 0003: Supabase as the cloud backend

- Status: Accepted
- Date: 2026-08-27

## Context

The MVP requires registration/login/recovery, activation-code ownership, device binding, data backup, synchronization, and server-enforced authorization without building an entire backend platform from scratch.

## Decision

Use Supabase for Auth, Postgres, Row Level Security, and backend functions when an operation requires a secret or server-side transaction. Treat every schema and policy as a versioned migration.

## Consequences

- RLS is deny-by-default and ownership tests are required before the app may use a table.
- Service-role operations run only inside a trusted server boundary.
- The app accesses Supabase through an application port, never directly from a screen or component.
- Local-first behavior remains in force; a Supabase outage does not block already-available local activities.

## Alternatives considered

- Fully custom backend: offers high control but expands MVP delivery and operational scope.
- Firebase: provides many mobile capabilities, but the relational model, ledger, and transaction requirements align better with Postgres.

## Open questions

- Boundary between database functions and Edge Functions for activation/rebinding.
- Data retention and account-deletion mechanism.
- Merge/recovery details when a user changes phones.
