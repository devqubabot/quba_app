# Coding Standards

Dokumen ini melengkapi `AGENTS.md`. Tooling otomatis adalah sumber kebenaran formatting; dokumen ini fokus pada correctness dan maintainability.

## TypeScript and boundaries

- Aktifkan strict mode dan pertahankan zero unexplained type errors.
- Gunakan domain types untuk identifier, duration, counter value, version, timestamp, dan status yang tidak boleh tertukar.
- Narrow `unknown` pada boundary. Runtime payload BLE/network/storage tidak dipercaya hanya karena memiliki TypeScript type.
- Gunakan discriminated union untuk state dan outcome yang mutually exclusive.
- Error eksternal diterjemahkan menjadi typed application error: kategori untuk retry, user action, incompatibility, authorization, dan permanent failure.

## Dependency direction

```text
presentation → application → domain
infrastructure ─────────────→ application/domain contracts
```

- Domain tidak bergantung pada framework, database, network, BLE, analytics, atau UI.
- Application mengorkestrasi use case dan transaction boundary, bukan detail rendering.
- Infrastructure menangani vendor SDK, persistence, serialization, transport, dan telemetry.
- Presentation merender state dan mengirim intent; screen tidak mengimplementasikan reconciliation atau reward logic.

## Data integrity

- Gunakan database transaction ketika satu event mengubah event inbox, occurrence, XP ledger, streak, dan sync metadata bersama-sama.
- Semua consumer activity event harus idempotent berdasarkan stable identifier.
- Jangan gunakan title/nama sebagai identity atau deduplication key.
- Delete data tersinkron harus mempertimbangkan tombstone/archive dan event yang belum diakui.
- Migration bersifat additive/forward-only bila memungkinkan dan selalu memiliki upgrade test.

## React Native

- State ditempatkan sedekat mungkin dengan consumer; shared state hanya untuk data yang benar-benar lintas screen/module.
- Hindari effect untuk derived state dan hindari subscription global tanpa cleanup.
- List besar menggunakan virtualization dan stable key.
- Animation harus menghormati reduced motion dan tidak memblokir JS thread.
- Permission, background behavior, dan native error diverifikasi pada kedua platform yang didukung.
- Jangan menggunakan Expo Go sebagai bukti untuk native flow.

## User experience

- User-facing error menjawab: apa yang terjadi, apakah data aman, apa tindakan berikutnya, dan apakah retry aman.
- Informasi tidak hanya disampaikan melalui warna atau audio.
- Copy tidak menghakimi dan tidak mengubah ibadah menjadi penilaian spiritual.
- Semua string pengguna siap dilokalisasi; jangan concatenate sentence fragments yang sulit diterjemahkan.

## Dependencies

Dependency produksi baru membutuhkan catatan di task brief:

- masalah yang diselesaikan;
- alternatif yang dipertimbangkan;
- maintenance/provenance;
- native/build impact;
- bundle/runtime/security impact;
- cara dependency diuji dan dihapus bila perlu.

Lockfile harus ikut commit. Jangan menjalankan major upgrade sebagai efek samping task fitur.

## Security and observability

- Secret tidak masuk source, fixture, screenshot, analytics, atau logs.
- Log internal menggunakan stable error/event code dan metadata minimum.
- Identifier sensitif disamarkan pada UI support dan telemetry.
- Expected offline/retry state bukan exception fatal.
- Crash reporting harus menghapus token, email, activation code, dan raw BLE payload sensitif.

