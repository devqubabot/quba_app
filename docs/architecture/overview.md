# Quba App Architecture Overview

Status: baseline untuk Foundation phase. Detail implementasi boleh berkembang melalui ADR, tetapi invariant data dan dependency di bawah tidak boleh dilanggar tanpa review eksplisit.

## System context

```text
Quba App
├── Presentation: screens, navigation, components, accessibility
├── Application: use cases, orchestration, ports, typed outcomes
├── Domain: habits, occurrences, activity runs, events, XP, streaks
└── Infrastructure
    ├── SQLite repositories and migrations
    ├── Supabase auth and cloud synchronization
    ├── BLE transport and protocol adapter
    ├── notifications/prayer-time integrations
    └── telemetry and diagnostics

Quba Bot
├── local reminders and activity execution
├── offline event queue
└── BLE protocol

Supabase
├── identity and account recovery
├── activation and device ownership
├── backup/cloud synchronization
└── server-enforced authorization
```

Dependency hanya bergerak dari luar ke dalam: presentation dan infrastructure bergantung pada application/domain contracts. Domain tidak mengenal framework atau vendor.

## Responsibility boundaries

### Quba App

- Menjadi pusat konfigurasi habit, schedule, activity run, pairing, koreksi, dan refleksi.
- Menyimpan state operasional di SQLite agar UI dan use case inti tidak bergantung pada jaringan.
- Mengambil event robot sebelum mengirim konfigurasi baru.
- Merekonsiliasi event secara idempotent dan menampilkan hasil sinkronisasi yang dapat dipahami.

### Quba Bot

- Menjalankan reminder, counter, checklist, dan countdown yang telah tersinkron.
- Menyimpan event offline secara persisten sampai menerima acknowledgement.
- Tidak menjadi tempat konfigurasi habit kompleks.
- Menolak payload/protocol version yang tidak kompatibel tanpa merusak state terakhir yang valid.

### Supabase

- Menangani auth, aktivasi, ownership, recovery, backup, dan sinkronisasi cloud.
- Menegakkan authorization melalui RLS/server boundary.
- Tidak berada di critical path untuk menjalankan aktivitas lokal yang sudah tersedia.

## Core data rules

### Configuration

- Habit dan schedule memakai `config_version` monotonik.
- App/backend memenangkan konflik konfigurasi pada MVP.
- Delete direpresentasikan sebagai archive/tombstone sampai semua consumer yang relevan aman.

### Activity events

- Event append-only dengan `event_id` global unik.
- Robot mengirim ulang event sampai acknowledgement diterima.
- Aplikasi boleh menerima event yang sama berkali-kali tetapi hanya menerapkannya sekali.
- Event mentah tidak langsung memberikan XP; reconciliation menentukan occurrence dan menulis XP ledger idempotent.

### Activity runs

- Linked run hanya menunjuk habit dengan tipe yang kompatibel.
- `occurrence_id` digunakan ketika occurrence relevan tersedia.
- Standalone run tidak memiliki `habit_id` atau `occurrence_id` dan tidak memengaruhi streak/badge habit.
- Beberapa run dapat berkontribusi pada satu occurrence tanpa menghasilkan completion atau reward ganda.

### Time

- Instant disimpan dalam UTC.
- Jadwal lokal menyimpan timezone dan local-time intent, bukan hanya hasil konversi sesaat.
- Event robot membawa waktu rekam dan device clock offset yang dibutuhkan untuk rekonsiliasi.
- Perubahan timezone, clock drift, dan daylight-saving behavior harus ditangani sebagai domain case eksplisit.

## Sync state machine

Alur minimum:

```text
discover → connect → authenticate/protocol-check
→ read device metadata
→ upload unacknowledged events
→ validate and deduplicate
→ apply occurrence/XP/streak transaction
→ acknowledge applied events
→ download newer configuration/activity run
→ confirm atomic device apply
→ report full/partial/failure outcome
```

Koneksi dapat terputus pada setiap langkah. Setiap langkah harus dapat diulang tanpa kehilangan event, konfigurasi valid terakhir, atau pemberian reward ganda.

## Initial module boundaries

Nama folder final dikunci saat scaffold, tetapi module boundary awal adalah:

- `auth-activation`
- `devices-pairing`
- `habits-occurrences`
- `activities`
- `sync`
- `rewards`
- `reminders-prayer-times`
- `statistics`
- `settings-profile`

Shared code hanya dibuat untuk konsep yang benar-benar lintas domain. Hindari folder `utils` yang menjadi tempat dependency tanpa ownership.

## Security and privacy baseline

- Service-role key tidak pernah berada di bundle app.
- Token disimpan melalui secure platform storage, bukan plain SQLite atau logs.
- Device ownership diverifikasi di server; BLE proximity saja bukan bukti ownership.
- Sensitive diagnostics direduksi atau disamarkan.
- Analytics hanya menyimpan event dan metadata yang diperlukan untuk metrik PRD.

## Open architecture inputs

Item berikut belum dapat dikunci sebelum feasibility hardware:

- BLE service/characteristic dan protocol framing.
- MTU, throughput, bonding, retry window, dan acknowledgement detail.
- Kapasitas habit, reminder, serta offline event queue.
- Firmware update path.
- RTC accuracy dan recovery setelah kehilangan daya.

