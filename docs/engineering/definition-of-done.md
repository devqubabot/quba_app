# Definition of Done

Checklist ini berlaku untuk setiap perubahan. Item yang tidak relevan ditandai `N/A` beserta alasan pada task brief atau pull request.

## Scope and correctness

- [ ] Goal, non-goals, dan acceptance criteria task jelas serta terpenuhi.
- [ ] Implementasi konsisten dengan PRD, architecture overview, dan ADR accepted.
- [ ] Tidak ada perubahan di luar scope atau dependency baru tanpa review.
- [ ] Failure, offline, retry, partial-success, dan recovery behavior yang relevan didefinisikan.
- [ ] Data integrity dan idempotency dipertahankan.

## Quality

- [ ] Formatting, lint, TypeScript, tests, dan React diagnostics lulus melalui command kanonis.
- [ ] Test baru membuktikan behavior dan regression berisiko.
- [ ] Tidak ada test yang dilewati, dibuat flaky, atau dilemahkan tanpa alasan eksplisit.
- [ ] Build/runtime verification dilakukan pada platform yang relevan.
- [ ] Diff telah direview oleh reviewer terpisah untuk perubahan non-trivial.

## Product experience

- [ ] Loading, empty, success, offline, dan error states relevan tersedia.
- [ ] Accessibility dan reduced-motion behavior diverifikasi.
- [ ] Copy konsisten dengan tone Quba dan siap localization.
- [ ] UI tidak membocorkan internal error code tanpa penjelasan/action.

## Security, privacy, and operations

- [ ] Auth/authorization dan ownership boundary diuji jika tersentuh.
- [ ] Tidak ada secret atau sensitive data di source/log/analytics.
- [ ] Migration, rollback/recovery, dan compatibility diperiksa jika relevan.
- [ ] Error penting memiliki diagnosability yang aman.

## Handoff

- [ ] Task brief memuat status, keputusan, file berubah, dan verification evidence.
- [ ] ADR/dokumentasi diperbarui bila invariant atau behavior berubah.
- [ ] Known limitations, blocker, dan next step dicatat.
- [ ] Working tree dan commit state dapat dipahami agent penerima.

