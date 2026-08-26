# ADR 0001: React Native with Expo Development Builds

- Status: Accepted
- Date: 2026-08-27

## Context

Quba requires one mobile codebase for iOS and Android, fast UI iteration, access to BLE/native capabilities, SQLite, notifications, and physical-device testing. Expo Go cannot be the primary runtime because BLE requires a native module.

## Decision

Use React Native, strict TypeScript, and Expo Development Builds. Generate and manage native projects through Expo tooling; add a custom native module only when available libraries cannot safely provide a required capability.

## Consequences

- JavaScript/TypeScript iteration and development-build distribution remain fast.
- iOS and Android builds and native permissions must be part of the verification matrix.
- Native configuration changes must be reproducible through app config/config plugins; avoid editing generated native files without a documented reason.
- Expo Go may be used only for flows without native dependencies and is not final evidence for BLE.

## Alternatives considered

- Flutter: consistent tooling and UI, but not selected because the Quba ecosystem/team direction uses React/TypeScript.
- Bare React Native from the beginning: offers full control, but adds native maintenance before requirements justify it.
