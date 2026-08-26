# ADR 0002: Local-first dengan SQLite

- Status: Accepted
- Tanggal: 2026-08-27

## Context

Quba harus tetap berguna ketika internet tidak tersedia dan harus dapat terhubung langsung ke robot. Sync yang tertunda atau gagal tidak boleh menghilangkan progres maupun membuat UI kosong.

## Decision

Gunakan SQLite sebagai operational source untuk state aplikasi pada perangkat. Use case lokal menulis ke database lokal lebih dahulu dan cloud synchronization diproses sebagai pekerjaan retryable. Schema berubah melalui migration forward-only.

## Consequences

- UI membaca state lokal dan tidak menunggu network request untuk data yang sudah dimiliki.
- Mutation membutuhkan sync metadata/outbox yang eksplisit.
- Conflict, retry, tombstone, migration, dan recovery menjadi bagian domain yang harus diuji.
- Data autentikasi sensitif tetap disimpan di secure storage, bukan SQLite biasa.

## Alternatives considered

- Cloud-first cache: lebih sederhana pada awalnya tetapi bertentangan dengan offline behavior dan direct robot sync.
- Key-value storage sebagai database utama: tidak cocok untuk relasi occurrence, events, ledger, dan query progres.

