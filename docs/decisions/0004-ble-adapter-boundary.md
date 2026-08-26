# ADR 0004: BLE adapter boundary

- Status: Accepted
- Tanggal: 2026-08-27

## Context

BLE merupakan critical path dengan ketidakpastian hardware dan firmware. Library atau implementasi native mungkin perlu berubah setelah feasibility test. Domain dan UI tidak boleh terikat ke callback, error code, atau data shape milik vendor BLE.

## Decision

Definisikan port BLE/protocol pada application boundary. Implementasi awal direncanakan menggunakan `react-native-ble-plx` di dalam Expo Development Build. Native fallback atau Expo Module dapat mengganti adapter tanpa mengubah use case, domain, atau presentation.

## Consequences

- Discovery, connection, permission, transport, framing, dan protocol semantics dipisahkan.
- Vendor error diterjemahkan menjadi typed application error dan user-action category.
- Fake/contract adapter tersedia untuk deterministic tests.
- Verifikasi akhir tetap membutuhkan perangkat fisik dan firmware compatible.
- Penambahan library BLE final menunggu feasibility spike dan dependency review.

## Alternatives considered

- Memanggil BLE library dari screen/store: lebih cepat untuk demo, tetapi menciptakan coupling dan sulit diuji.
- Custom native module sejak hari pertama: ditunda sampai capability gap terbukti.

