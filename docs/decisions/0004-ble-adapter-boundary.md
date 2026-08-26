# ADR 0004: BLE adapter boundary

- Status: Accepted
- Date: 2026-08-27

## Context

BLE is a critical path with hardware and firmware uncertainty. The library or native implementation may need to change after feasibility testing. Domain and UI must not depend on vendor BLE callbacks, error codes, or data shapes.

## Decision

Define BLE/protocol ports at the application boundary. The initial implementation is expected to use `react-native-ble-plx` inside an Expo Development Build. A native fallback or Expo Module may replace the adapter without changing use cases, domain, or presentation.

## Consequences

- Discovery, connection, permissions, transport, framing, and protocol semantics remain separate.
- Vendor errors are translated into typed application errors and user-action categories.
- A fake/contract adapter supports deterministic tests.
- Final verification still requires physical devices and compatible firmware.
- The final BLE library addition waits for a feasibility spike and dependency review.

## Alternatives considered

- Calling the BLE library from a screen/store: faster for a demo, but creates coupling and is difficult to test.
- Custom native module from day one: deferred until a capability gap is proven.
