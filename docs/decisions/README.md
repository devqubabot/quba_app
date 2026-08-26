# Architecture Decision Records

ADRs preserve technical decisions that affect multiple features. Numbers are never reused.

## Status

- `Proposed`: may still change without a migration plan.
- `Accepted`: implementation baseline; changes require a reviewed replacement ADR or amendment.
- `Superseded`: replaced by another ADR.
- `Rejected`: considered but not selected.

## Format

Every ADR includes context, decision, consequences, alternatives, and open questions. Code must not silently diverge from an `Accepted` ADR.

## Index

| ADR | Status | Decision |
|---|---|---|
| [0001](./0001-react-native-expo-development-build.md) | Accepted | React Native + Expo Development Build + TypeScript |
| [0002](./0002-local-first-sqlite.md) | Accepted | SQLite operational store and local-first behavior |
| [0003](./0003-supabase-cloud-backend.md) | Accepted | Supabase for authentication and the cloud backend |
| [0004](./0004-ble-adapter-boundary.md) | Accepted | BLE hidden behind an adapter boundary |
| [0005](./0005-expo-router-navigation.md) | Accepted | Expo Router for application navigation |
