# ADR 0001: React Native dengan Expo Development Build

- Status: Accepted
- Tanggal: 2026-08-27

## Context

Quba membutuhkan satu codebase mobile untuk iOS dan Android, UI yang cepat diiterasi, akses BLE/native capability, SQLite, notifications, dan pengujian pada perangkat fisik. Expo Go saja tidak dapat menjadi runtime utama karena BLE membutuhkan native module.

## Decision

Gunakan React Native, TypeScript strict, dan Expo Development Build. Native project dihasilkan/dikelola melalui Expo tooling, dengan custom native module hanya jika capability tidak dapat dipenuhi secara aman oleh library yang tersedia.

## Consequences

- Iterasi JavaScript/TypeScript dan distribusi development build tetap cepat.
- Build iOS dan Android serta native permission harus menjadi bagian dari verification matrix.
- Perubahan native config harus reproducible melalui app config/config plugin; hindari edit generated native files tanpa alasan terdokumentasi.
- Expo Go boleh digunakan hanya untuk flow yang tidak membutuhkan native dependency dan tidak menjadi bukti akhir BLE.

## Alternatives considered

- Flutter: tooling dan UI konsisten, tetapi tidak dipilih karena ekosistem/team direction Quba menggunakan React/TypeScript.
- Bare React Native sejak awal: memberi kontrol penuh, tetapi menambah beban native sebelum kebutuhan membenarkannya.

