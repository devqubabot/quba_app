# ADR 0005: Expo Router for navigation

- Status: Accepted
- Date: 2026-08-27

## Context

Quba requires onboarding, authentication, main tabs, nested details, and direct access to an active session. Navigation must align with Expo tooling while retaining access to React Navigation primitives when required.

## Decision

Use Expo Router as the public navigation architecture. Route files handle composition and navigation concerns; business logic remains in application/domain modules.

## Consequences

- Route groups distinguish onboarding/authentication from the signed-in experience.
- Do not move domain fetching, BLE calls, or synchronization orchestration into route components.
- Add a custom navigator only when the Expo Router abstraction cannot satisfy a requirement, and record the decision.
- Deep links and protected-route behavior require tests.

## Alternatives considered

- Direct React Navigation configuration: flexible, but Expo Router provides filesystem integration and Expo alignment that better fit the baseline.
