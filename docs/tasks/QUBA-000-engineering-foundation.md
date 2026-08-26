# QUBA-000: Engineering Foundation Pack

- Status: done
- Owner/implementer: primary Codex agent
- Reviewer: project owner
- Branch/worktree: main (initial repository foundation)
- Last updated: 2026-08-27 Asia/Jakarta

## Goal

Membuat source of truth, handoff protocol, dan objective quality contract agar agent yang berbeda dapat mengembangkan Quba App secara konsisten.

## Non-goals

- Men-scaffold Expo application.
- Memasang runtime dependencies.
- Membuat project-local `quba-app-engineering` skill sebelum workflow stabil.
- Mengunci detail BLE protocol yang masih menunggu hardware feasibility.

## Acceptance criteria

- [x] Repository Git tersedia untuk versioning dan handoff.
- [x] Root `AGENTS.md` mendefinisikan product invariant, architecture boundary, quality gate, serta handoff.
- [x] Keputusan stack yang sudah disepakati tercatat sebagai ADR.
- [x] Coding, testing, dan Definition of Done tersedia.
- [x] Task/handoff dan pull-request template tersedia.
- [x] CI memvalidasi foundation dan siap mengaktifkan `npm run check` setelah app di-scaffold.
- [x] Foundation Pack direview dan diterima pemilik proyek.

## Context and sources

- PRD: seluruh MVP, terutama bagian 5, 10, 12, 13, 16, 18, 22, dan 23.
- Related ADRs: ADR 0001-0005.
- OpenAI Codex project guidance: `AGENTS.md`, repo-scoped instructions, and code review workflow.

## Scope ownership

- Root governance files, `docs/`, dan `.github/` foundation.
- Tidak mengubah PRD atau product artifacts asli.
- Tidak ada parallel implementation task.

## Implementation plan

1. Inisialisasi Git.
2. Buat root source-of-truth dan agent contract.
3. Rekam arsitektur serta ADR keputusan yang sudah diterima.
4. Buat coding/testing/DoD dan task handoff protocol.
5. Tambahkan PR template dan pre-scaffold-safe CI.
6. Validasi cross-reference, Git state, dan isi dokumen.

## Risk and verification plan

| Risk | Evidence/test required |
|---|---|
| Aturan terlalu abstrak sehingga agent berbeda tetap menyimpang | Review setiap invariant dan task template terhadap PRD |
| CI gagal sebelum app ada | Workflow memiliki explicit pre-scaffold path |
| Keputusan prematur mengunci hardware | Detail protocol tetap open dan native fallback dipertahankan |
| Dokumen saling bertentangan | Link/status/terminology consistency audit |

## Current status

Foundation files sudah dibuat, validation pass selesai, dan Foundation Pack telah diterima pemilik proyek.

## Decision log

| Waktu | Keputusan | Alasan |
|---|---|---|
| 2026-08-27 | Foundation Pack berada dalam repository Quba App | Aturan, decisions, dan code harus versioned bersama |
| 2026-08-27 | Critical invariant berada di `AGENTS.md` dan CI, bukan hanya skill | Instruksi wajib dan verifikasi harus tersedia untuk semua agent |
| 2026-08-27 | Project-local skill ditunda | Workflow perlu distabilkan lebih dahulu agar skill tidak mengabadikan aturan prematur |
| 2026-08-27 | CI app aktif otomatis setelah `package.json` tersedia | Foundation dapat direview sebelum scaffold tanpa false failure |

## Changed files

| File/module | Perubahan |
|---|---|
| `AGENTS.md` | Agent contract repository-wide |
| `README.md`, `.gitignore`, `.editorconfig` | Repository baseline |
| `docs/architecture/` | System boundaries dan sync invariants |
| `docs/decisions/` | ADR 0001-0005 |
| `docs/engineering/` | Coding, testing, dan DoD |
| `docs/tasks/` | Task lifecycle dan handoff template |
| `.github/` | Pull request template dan quality workflow |

## Verification evidence

| Command/device/scenario | Result | Notes |
|---|---|---|
| `git status --short --branch` dan file inventory | Pass | Repository aktif pada branch `main`; seluruh perubahan foundation masih uncommitted untuk direview |
| Required foundation contract check | Pass | Semua file wajib tersedia dan tidak kosong |
| Markdown relative-link audit | Pass | 18 file Markdown diperiksa; tidak ada relative link rusak |
| YAML parse `.github/workflows/quality.yml` | Pass | Workflow valid secara syntax YAML |
| Trailing-whitespace audit | Pass | Tidak ditemukan trailing whitespace |
| Expo/app tests | N/A | App belum di-scaffold |

## Review findings

- Direview dan diterima oleh pemilik proyek pada 2026-08-27 tanpa perubahan tambahan.

## Known issues and blockers

- Hardware capability dan BLE protocol masih open sesuai PRD.
- Package manager/runtime/tool versions baru menjadi executable setelah scaffold.

## Handoff / exact next step

Scaffold Expo Development Build di repository ini, lalu buat task baru untuk executable quality tooling dan project structure.
