# ADR 0005: Expo Router untuk navigasi

- Status: Accepted
- Tanggal: 2026-08-27

## Context

Quba membutuhkan onboarding, auth, tab utama, nested detail, dan akses langsung ke active session. Navigasi harus konsisten dengan Expo tooling dan tetap dapat menggunakan React Navigation primitives ketika diperlukan.

## Decision

Gunakan Expo Router sebagai public navigation architecture. Route files melakukan composition dan navigation concerns; business logic tetap berada di application/domain modules.

## Consequences

- Route group membedakan onboarding/auth dan signed-in experience.
- Jangan memindahkan domain fetching, BLE calls, atau sync orchestration ke route components.
- Custom navigator hanya ditambahkan jika Expo Router abstraction tidak memenuhi requirement dan keputusan dicatat.
- Deep link dan protected route behavior wajib diuji.

## Alternatives considered

- React Navigation configuration langsung: fleksibel, tetapi Expo Router memberi integrasi filesystem dan Expo yang lebih sesuai baseline.

