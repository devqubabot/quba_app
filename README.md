# Quba App

Quba adalah aplikasi pendamping robot Quba untuk merencanakan kebiasaan, menjalankan aktivitas minim distraksi, menyinkronkan event offline dari robot, dan merefleksikan progres pengguna.

Repository ini memuat source code Quba App sekaligus engineering governance yang harus mengikuti versi codebase yang sama.

## Status

Foundation phase. Source code Expo belum di-scaffold.

## Sumber kebenaran

Urutan sumber konteks proyek:

1. [Product Requirements Document](./QUBA_PRD_MVP_v1.0.md) untuk kebutuhan dan acceptance criteria produk.
2. [AGENTS.md](./AGENTS.md) untuk aturan kerja wajib manusia dan coding agent.
3. [Architecture overview](./docs/architecture/overview.md) untuk batas sistem dan dependency.
4. [Architecture Decision Records](./docs/decisions/README.md) untuk keputusan teknis yang telah diterima.
5. [Task briefs](./docs/tasks/README.md) untuk scope dan status pekerjaan aktif.

Jika dokumen bertentangan, hentikan implementasi terkait dan selesaikan konflik melalui perubahan PRD atau ADR yang eksplisit.

## Keputusan stack awal

- React Native dengan Expo Development Build dan TypeScript.
- Expo Router untuk navigasi aplikasi.
- SQLite sebagai operational store lokal aplikasi.
- Supabase untuk autentikasi dan backend cloud.
- BLE melalui adapter boundary; implementasi awal direncanakan memakai `react-native-ble-plx` dan dapat diganti tanpa mengubah domain/UI.
- Arsitektur local-first dengan event aktivitas append-only dan sinkronisasi idempotent.

## Workflow

Setiap perubahan harus memiliki task brief, acceptance criteria, verifikasi, dan handoff yang dapat dibaca agent lain. Lihat [task workflow](./docs/tasks/README.md) dan [Definition of Done](./docs/engineering/definition-of-done.md).

