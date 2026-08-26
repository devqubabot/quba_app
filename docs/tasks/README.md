# Task Briefs and Handoff

Satu task brief adalah kontrak kerja durable untuk satu unit perubahan. Chat membantu diskusi, tetapi bukan sumber status utama.

## Lifecycle

```text
proposed → ready → in_progress → in_review → done
                         ↘ blocked
```

1. Salin `TEMPLATE.md` menjadi `QUBA-<nomor>-<slug>.md`.
2. Isi goal, non-goals, acceptance criteria, related ADR, dan risk sebelum coding.
3. Agent implementer menjaga status dan decision log tetap aktual pada checkpoint penting.
4. Sebelum handoff, isi changed files, verification, known issues, dan exact next step.
5. Reviewer mencatat findings atau link review di file yang sama.
6. Setelah selesai, pindahkan brief ke `docs/tasks/archive/` tanpa menghapus history.

## Parallel work

- Satu task memiliki satu branch/worktree.
- Cantumkan file/module ownership untuk mencegah dua agent mengedit boundary sama.
- Shared contract disepakati lebih dahulu sebelum implementasi consumer berjalan paralel.
- Jangan menyerahkan perubahan penting hanya sebagai uncommitted diff tanpa status eksplisit.

## Handoff minimum

Agent penerima harus dapat menjawab tanpa menebak:

- Outcome apa yang sedang dibangun?
- Apa yang sudah dan belum selesai?
- Keputusan apa yang dibuat dan mengapa?
- File apa yang berubah?
- Verifikasi apa yang benar-benar dijalankan?
- Apa risiko/blocker saat ini?
- Langkah konkret berikutnya apa?

