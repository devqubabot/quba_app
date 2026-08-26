# Testing Strategy

Tujuan testing Quba adalah membuktikan integritas progres, recovery, dan pengalaman pengguna—bukan mengejar angka coverage tanpa konteks.

## Test layers

| Layer | Fokus | Contoh |
|---|---|---|
| Domain unit | Rule murni dan edge cases | occurrence, linked/standalone, XP, streak, target completion |
| Application | Orchestration dan typed outcomes | create habit, start run, reconcile event, retry sync |
| Component | Behavior yang terlihat pengguna | form validation, loading/offline/error, accessibility |
| Infrastructure contract | Implementasi port | SQLite repository, BLE fake/real contract, Supabase adapter |
| Integration | Beberapa boundary bersama | event → transaction → occurrence → XP ledger → outbox |
| Device/E2E | Critical user journey | activation, pairing, golden journey, reconnect, recovery |

## Risk-based requirements

### Domain atau reward change

- Unit tests untuk normal, boundary, duplicate, correction, dan invalid transition.
- Bukti bahwa reward/completion tidak terjadi dua kali.

### SQLite schema/repository change

- Fresh database test.
- Upgrade test dari schema sebelumnya dengan data representative.
- Transaction rollback dan restart/reopen test bila relevan.

### Sync change

- Duplicate delivery.
- Disconnect sebelum dan setelah acknowledgement.
- Partial success.
- Out-of-order/stale configuration version.
- Event untuk habit archived atau occurrence yang tidak tersedia.
- Restart di tengah proses dan safe retry.

### BLE/protocol change

- Contract tests terhadap protocol fixture yang disepakati firmware.
- Permission denied, powered-off, timeout, disconnect, incompatible protocol, malformed payload, dan storage-full behavior.
- Verifikasi perangkat fisik pada iOS dan Android untuk milestone terkait.

### Supabase change

- Migration dan constraint tests.
- RLS tests untuk anonymous, owner, different owner, dan trusted server role sesuai operasi.
- Idempotency/concurrency test untuk activation, binding, dan cloud reconciliation.

### UI change

- Test menggunakan queries dan interaction yang mencerminkan pengguna.
- Verifikasi empty/loading/success/offline/error state yang relevan.
- Accessibility label/role, touch target, focus/announcement, reduced motion, dan localization layout.

## Critical journeys

Journey berikut tidak boleh regress:

1. Aktivasi dan pairing satu robot.
2. Habit dzikir 33 → sync → aktivitas offline → sync balik → satu XP/streak update.
3. Retry setelah event diterima app tetapi acknowledgement gagal.
4. Linked session berkontribusi ke occurrence yang tepat.
5. Standalone session masuk history tanpa habit reward.
6. App offline dari backend tetapi tetap dapat memproses robot secara lokal.
7. Recovery setelah restart/disconnect tanpa kehilangan state valid terakhir.

## Test quality

- Gunakan fixed clock dan deterministic IDs pada test.
- Hindari arbitrary sleep; tunggu observable state/event.
- Jangan mock unit yang sedang dibuktikan.
- Fixture protocol/data memiliki versi dan mudah dibaca.
- Test failure harus menjelaskan invariant yang rusak.
- Flaky test diperlakukan sebagai defect; jangan sekadar retry tanpa root-cause task.

## Verification record

Task brief mencatat command, platform/device, hasil, serta test yang belum dapat dijalankan. Hardware-dependent verification tidak boleh diklaim hanya berdasarkan mock atau simulator.

