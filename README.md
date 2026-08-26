# Quba App

Quba adalah aplikasi pendamping robot Quba untuk merencanakan kebiasaan, menjalankan aktivitas minim distraksi, menyinkronkan event offline dari robot, dan merefleksikan progres pengguna.

Repository ini memuat source code Quba App sekaligus engineering governance yang harus mengikuti versi codebase yang sama.

## Status

Engineering scaffold tersedia pada Expo SDK 57 dengan Expo Router, Development Build, TypeScript strict, dan executable quality gates. Fitur produk belum diimplementasikan.

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

## Local development

Requirement: Node.js 22.13 atau lebih baru dalam major version 22, npm, dan native toolchain platform yang akan dijalankan.

```bash
npm ci
npm run ios
# atau
npm run android
```

Kedua command native menjalankan Expo prebuild saat folder generated native belum tersedia, lalu mengompilasi dan memasang development build. Setelah build terpasang, jalankan Metro dengan `npm start`. Expo Go bukan runtime verifikasi untuk flow native Quba.

Jalankan seluruh quality gate lokal melalui:

```bash
npm run check
```

Untuk compatibility check yang memakai metadata Expo/React Native Directory dan membutuhkan jaringan, jalankan `npm run expo:doctor` secara eksplisit.

Build EAS, credential signing, BLE, SQLite, dan Supabase sengaja belum dikonfigurasi pada scaffold ini; masing-masing membutuhkan task dan dependency review tersendiri.
