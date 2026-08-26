# Quba App Agent Contract

Instruksi ini berlaku untuk seluruh repository. Instruksi yang lebih dekat dengan folder kerja boleh menambah aturan khusus, tetapi tidak boleh melemahkan safety, data integrity, security, atau quality gates di dokumen ini.

## Mulai setiap task

1. Baca `QUBA_PRD_MVP_v1.0.md` pada bagian yang relevan.
2. Baca `docs/architecture/overview.md` dan ADR terkait di `docs/decisions/`.
3. Baca task brief aktif di `docs/tasks/`. Jangan coding tanpa goal, non-goals, dan acceptance criteria yang jelas.
4. Periksa status Git dan pertahankan perubahan pengguna atau agent lain yang tidak termasuk scope.
5. Tulis atau perbarui rencana implementasi di task brief untuk pekerjaan non-trivial.

## Product invariants

- MVP berfokus pada satu pemilik akun, satu robot, dan Self Mode.
- App menangani konfigurasi dan refleksi; robot menangani reminder, aktivitas, feedback, serta event offline.
- Aktivitas inti robot tetap berjalan tanpa ponsel setelah konfigurasi tersinkron.
- Activity event bersifat append-only dan dideduplikasi dengan `event_id`.
- XP, completion, dan streak harus idempotent. Retry tidak boleh memberi reward ganda.
- Konfigurasi menggunakan versi monotonik. Penghapusan habit menggunakan archive/tombstone sampai sinkronisasi aman.
- Linked activity dan standalone activity tidak boleh dicampur. Standalone activity tidak membuat occurrence, streak, atau XP pada baseline MVP.
- Bahasa dan gamifikasi bersifat mendukung, tidak menghakimi, dan tidak menilai kualitas spiritual pengguna.
- Semua flow memiliki empty, loading, success, offline, partial-success, dan actionable error states yang relevan.

## Architecture boundaries

- UI tidak boleh mengakses BLE, SQLite, atau Supabase secara langsung.
- Domain logic tidak mengimpor React, Expo, Supabase, SQLite, atau implementasi BLE.
- Infrastructure mengimplementasikan port/application contract dan menerjemahkan error eksternal menjadi typed application errors.
- SQLite adalah operational read/write store pada perangkat. Cloud sync tidak boleh membuat fitur lokal inti menunggu jaringan.
- Supabase adalah boundary untuk auth, ownership, backup, dan cloud synchronization; secrets atau service-role key tidak boleh masuk ke app.
- Semua payload dari BLE, storage, network, deep link, dan input pengguna divalidasi pada boundary.
- Waktu disimpan secara eksplisit; bedakan instant UTC, timezone, scheduled local time, dan device clock offset.
- Side effect sinkronisasi harus retry-safe, observable, dan dapat dilanjutkan setelah proses terputus.

## Coding rules

- Gunakan TypeScript strict. Jangan gunakan `any` tanpa alasan boundary yang didokumentasikan dan penyempitan tipe segera.
- Utamakan fungsi kecil, pure domain logic, explicit dependency injection, dan named domain types daripada primitive yang ambigu.
- Jangan menambahkan dependency produksi tanpa mencatat alasan, alternatif, ukuran/risk impact, serta persetujuan scope task.
- Jangan membuat barrel export luas yang menyembunyikan dependency cycle.
- Pisahkan copy pengguna dari logic agar localization dapat diterapkan.
- Jangan log password, token, activation code penuh, device identifier penuh, atau data pribadi yang tidak diperlukan.
- Accessibility dan reduced motion merupakan acceptance criteria, bukan cleanup terpisah.
- Optimasi performance harus berdasarkan pengukuran. Hindari render, subscription, atau bridge traffic yang tidak diperlukan pada hot path.
- Perubahan schema harus melalui migration forward-only dan memiliki test upgrade dari versi sebelumnya.

## Testing rules

- Perubahan behavior harus disertai test pada level terendah yang dapat membuktikannya.
- Uji behavior yang terlihat pengguna, bukan detail implementasi komponen.
- Sync, XP ledger, event deduplication, occurrence, dan retry wajib memiliki deterministic tests.
- BLE diuji melalui contract/fake adapter; critical journey tetap wajib diverifikasi pada perangkat fisik.
- Database migration diuji terhadap database versi sebelumnya dan data yang sudah ada.
- Supabase policy/RLS diuji menggunakan role yang realistis; jangan hanya menguji dengan privileged client.
- Test tidak boleh bergantung pada waktu nyata, urutan global, jaringan publik, atau hardware yang tidak dinyatakan sebagai test khusus.

Detail ada di `docs/engineering/testing-strategy.md`.

## Quality gates

Setelah app di-scaffold, command kanonis adalah:

```bash
npm run check
```

Command tersebut harus menjalankan format check, lint, TypeScript typecheck, unit/component tests, dan React diagnostics. Jalankan test tambahan sesuai risk matrix task. Jangan menyatakan selesai jika check yang diwajibkan gagal atau belum dijalankan; laporkan alasannya secara eksplisit.

## Git, parallel work, and handoff

- Satu task menggunakan satu branch atau worktree dan satu task brief.
- Jangan mengedit file yang sama secara paralel tanpa pembagian ownership yang jelas.
- Commit harus kecil, kohesif, dan tidak mencampur refactor tidak terkait.
- Sebelum handoff, perbarui task brief dengan status, keputusan, file berubah, verifikasi, blocker, dan next step yang konkret.
- Handoff ideal berada pada commit yang dapat dibangun atau diuji. Jika tidak, tandai dengan jelas apa yang belum aman.
- Agent penerima membaca diff dan menjalankan baseline checks sebelum melanjutkan.
- Implementer tidak melakukan approval akhir sendiri; gunakan review terpisah untuk perubahan non-trivial.

## Documentation and decisions

- Keputusan arsitektur lintas fitur membutuhkan ADR baru atau perubahan status ADR yang ada.
- Jangan mengubah ADR accepted secara diam-diam melalui code.
- Jika behavior produk berubah, perbarui PRD atau catat gap yang membutuhkan keputusan Product.
- Dokumentasi harus menjelaskan alasan dan invariant; jangan menduplikasi detail yang dapat diperoleh langsung dari code.

## Definition of Done

Sebuah task hanya selesai jika memenuhi `docs/engineering/definition-of-done.md`, acceptance criteria task, seluruh quality gate yang relevan, dan review atas diff.

