# Architecture Decision Records

ADR menyimpan keputusan teknis yang berdampak lintas fitur. Nomor tidak digunakan ulang.

## Status

- `Proposed`: masih dapat berubah tanpa migration plan.
- `Accepted`: baseline implementation; perubahan membutuhkan ADR pengganti atau amendment yang direview.
- `Superseded`: digantikan ADR lain.
- `Rejected`: dipertimbangkan tetapi tidak dipilih.

## Format

Setiap ADR memuat context, decision, consequences, alternatives, dan open questions. Code tidak boleh menyimpang dari ADR `Accepted` secara diam-diam.

## Index

| ADR | Status | Keputusan |
|---|---|---|
| [0001](./0001-react-native-expo-development-build.md) | Accepted | React Native + Expo Development Build + TypeScript |
| [0002](./0002-local-first-sqlite.md) | Accepted | SQLite operational store dan local-first behavior |
| [0003](./0003-supabase-cloud-backend.md) | Accepted | Supabase untuk auth dan cloud backend |
| [0004](./0004-ble-adapter-boundary.md) | Accepted | BLE disembunyikan di balik adapter boundary |
| [0005](./0005-expo-router-navigation.md) | Accepted | Expo Router untuk navigasi app |

