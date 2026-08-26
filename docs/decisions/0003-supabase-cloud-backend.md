# ADR 0003: Supabase sebagai cloud backend

- Status: Accepted
- Tanggal: 2026-08-27

## Context

MVP membutuhkan registrasi/login/recovery, activation-code ownership, device binding, backup data, synchronization, dan server-enforced authorization tanpa membangun seluruh backend platform dari nol.

## Decision

Gunakan Supabase untuk Auth, Postgres, Row Level Security, dan backend functions ketika operasi membutuhkan secret atau transaksi server-side. Semua schema dan policy diperlakukan sebagai versioned migrations.

## Consequences

- RLS deny-by-default dan ownership tests wajib sebelum table dapat digunakan app.
- Service-role operations hanya berjalan di trusted server boundary.
- App mengakses Supabase melalui application port, bukan langsung dari screen/component.
- Local-first behavior tetap berlaku; Supabase outage tidak memblokir aktivitas lokal yang sudah tersedia.

## Alternatives considered

- Custom backend penuh: kontrol tinggi tetapi memperbesar waktu dan operational scope MVP.
- Firebase: memenuhi banyak kebutuhan mobile, tetapi relational model, ledger, dan transaction needs lebih selaras dengan Postgres.

## Open questions

- Batas antara database function dan Edge Function untuk activation/rebinding.
- Retention data dan mekanisme account deletion.
- Detail merge/recovery ketika pengguna mengganti ponsel.

