# QUBA-001: Expo Development Build and executable quality tooling

- Status: in_review
- Owner/implementer: primary Codex agent
- Reviewer: unassigned (must be separate from implementer)
- Branch/worktree: `quba-001-expo-engineering-scaffold`
- Last updated: 2026-08-27 Asia/Jakarta

## Goal

Menyediakan scaffold aplikasi Quba berbasis Expo Development Build yang dapat dijalankan pada iOS dan Android, memakai Expo Router serta TypeScript strict, dan memiliki quality tooling executable untuk formatting, lint, types, tests, React diagnostics, dan kesehatan konfigurasi Expo.

## Non-goals

- Mengimplementasikan fitur produk seperti auth, habit, activity, sync, BLE, SQLite, atau Supabase.
- Menambahkan dependency native/domain yang belum diperlukan oleh shell aplikasi, termasuk BLE dan persistence.
- Menghasilkan atau mengedit folder native `ios/` dan `android/` secara manual; task ini memakai Continuous Native Generation.
- Menyiapkan credential, project, atau build berbayar di EAS.
- Membuat project-local skill.

## Acceptance criteria

- [x] Project memakai stable Expo SDK, React Native, Expo Router, `expo-dev-client`, dan TypeScript strict dengan versi yang kompatibel.
- [x] `npm run ios`, `npm run android`, dan development server menargetkan development client, bukan menjadikan Expo Go sebagai runtime bukti akhir.
- [x] Route awal dapat dirender dan presentation code tidak mengakses BLE, SQLite, atau Supabase.
- [x] Struktur source mencatat dependency direction presentation/infrastructure ke application/domain tanpa membuat barrel export luas.
- [x] `npm run check` menjalankan format check, ESLint, TypeScript, unit/component tests, dan React Doctor tanpa placeholder atau ketergantungan wajib pada jaringan publik.
- [x] `npm run expo:doctor` tersedia dan lulus sebagai compatibility check eksplisit saat akses metadata Expo tersedia.
- [x] CI menginstal dependency secara reproducible dan menjalankan command kanonis.
- [x] Setup serta batas verifikasi native yang belum dijalankan didokumentasikan dengan jelas.

## Context and sources

- PRD: prinsip produk §5; architecture split §10; navigation §14; accessibility §15.3; NFR §16; Milestone 0-1 §22; Definition of Done §23.
- Related ADRs: ADR 0001-0005 (seluruh ADR Accepted saat task dimulai).
- Engineering contract: `AGENTS.md`, `docs/engineering/coding-standards.md`, `docs/engineering/testing-strategy.md`, dan `docs/engineering/definition-of-done.md`.
- Official Expo references: project creation, Expo SDK reference, Expo Router installation, dan development build documentation.

## Scope ownership

- Modules/files owned by this task: Expo/npm config, route shell, initial presentation shell, test/tooling config, CI app-quality job, README setup, dan task brief ini.
- Shared boundaries/contracts: hanya dokumentasi layer awal; tidak ada domain/application port baru.
- Known parallel tasks/conflicts: tidak ada parallel implementation task. Foundation Pack yang sudah direview dipertahankan.

## Implementation plan

1. Kunci stable Expo baseline yang kompatibel dengan Node LTS dan rekam dependency rationale.
2. Scaffold Expo Router + development client menggunakan Continuous Native Generation.
3. Tambahkan source layout minimal yang menjaga architecture boundary dan copy terpisah dari rendering.
4. Pasang formatter, lint, strict typecheck, Jest/RNTL, React Doctor, dan Expo Doctor sebagai executable local dependencies/scripts; network-backed Expo Doctor tetap terpisah dari deterministic canonical check.
5. Tambahkan deterministic component smoke test serta enforcement dependency boundary pada lint config.
6. Jalankan quality command, Expo config/prebuild checks yang aman, dan catat native verification yang belum tersedia.
7. Audit diff, perbarui README/task brief, lalu serahkan untuk review terpisah.

## Dependency review

### Runtime baseline

- Expo SDK/React Native/React/Expo Router: stack yang diwajibkan ADR 0001 dan 0005; dipilih dari stable SDK resmi terbaru dan dipasang dalam versi kompatibel yang dihasilkan Expo tooling.
- `expo-dev-client`: menyelesaikan kebutuhan native-capable development runtime; Expo Go ditolak karena tidak dapat membuktikan flow BLE/native.
- Expo Router peer/runtime packages (`expo-constants`, `expo-linking`, status bar, screens, safe area, gesture handler, Reanimated, Worklets, React DOM, dan React Native Web): diperlukan oleh navigation/universal baseline resmi dan dipertahankan sesuai matriks kompatibilitas Expo. Dampaknya adalah native/bundle surface awal yang lebih besar, tetapi menghindari peer drift dan dapat diaudit ulang setelah route architecture stabil.
- Alternatif bare React Native ditolak sesuai ADR 0001 karena menambah native maintenance sebelum diperlukan.

### Development tooling

- ESLint 9 + Expo config: static correctness dan boundary restrictions menggunakan toolchain Expo. ESLint 10 belum dipakai karena peer plugin Expo SDK 57 belum mendukung major tersebut.
- Prettier: deterministic formatting tanpa mengubah dokumen Foundation yang telah direview.
- TypeScript: strict compile-time contract.
- Jest + `jest-expo` + React Native Testing Library: component behavior smoke test pada level terendah yang relevan.
- React Doctor: React diagnostics yang diwajibkan quality contract.
- Expo Doctor: memverifikasi dependency compatibility dan app configuration.
- Semua tooling dikunci di lockfile, hanya berjalan saat development/CI, dan dapat dihapus tanpa memengaruhi format data/runtime app.

## Risk and verification plan

| Risk | Evidence/test required |
|---|---|
| Dependency Expo/React Native tidak selaras | `expo-doctor` dan install reproducible dari lockfile |
| Development build tidak benar-benar terkonfigurasi | `expo-dev-client` terpasang, app config memiliki scheme/bundle identifiers, dan Expo config dapat dievaluasi |
| Route shell gagal render atau tidak accessible | Jest/RNTL smoke test berbasis role dan visible copy |
| Boundary arsitektur terlanggar sejak awal | ESLint restricted-import rules untuk domain serta presentation route/screen |
| Quality command hanya placeholder atau membutuhkan global tool | Semua subcommand berasal dari dependency lokal dan `npm run check` lulus |
| CI test bergantung pada public metadata API | Expo Doctor executable tetapi dijalankan terpisah dari canonical deterministic check |
| Native build tidak tersedia di host | Jalankan config/prebuild dry validation; catat iOS/Android device build sebagai pending, bukan pass |

## Current status

Implementasi selesai dan siap review terpisah. Scaffold memakai Expo SDK 57, React Native 0.86.2, React 19.2.3, Expo Router, `expo-dev-client`, CNG, dan Node 22. Quality command serta clean lockfile install lulus; bundle JavaScript/Hermes berhasil dibuat untuk iOS dan Android. Native compilation/device runtime belum dijalankan karena host tidak memiliki full Xcode, Java/Android SDK, CocoaPods, atau device toolchain.

## Decision log

| Waktu | Keputusan | Alasan |
|---|---|---|
| 2026-08-27 | Gunakan branch `quba-001-expo-engineering-scaffold` | Memisahkan task scaffold dari Foundation Pack sesuai kontrak handoff |
| 2026-08-27 | Target stable Expo SDK 57 dan Node 22 | Dokumentasi resmi Expo mencatat SDK 57 sebagai stable terbaru dengan minimum Node 22.13 |
| 2026-08-27 | Gunakan CNG; jangan commit generated native directories pada scaffold | Native config harus reproducible melalui app config sesuai ADR 0001 |
| 2026-08-27 | Tunda BLE, SQLite, dan Supabase dependencies | Task belum memiliki use case/contract yang membutuhkan vendor implementation tersebut |
| 2026-08-27 | Jangan aktifkan React Compiler pada scaffold | Belum ada profiling/render evidence yang membenarkan optimization; lint rules tetap tersedia dari Expo config |
| 2026-08-27 | Pin peer runtime sesuai default Expo SDK 57 template | Minimal install membuat npm memilih React DOM/Worklets yang tidak selaras; official template versions menghilangkan peer conflict |
| 2026-08-27 | Gunakan Jest 29 dan ESLint 9 yang dipilih/didukung Expo | Latest Jest 30.4 gagal di `jest-expo`; plugin Expo belum mendukung ESLint 10 |
| 2026-08-27 | Jalankan Expo Doctor di luar `npm run check` | Schema/RN Directory checks membutuhkan public API, sedangkan canonical tests harus deterministic tanpa public network |
| 2026-08-27 | Jangan menjalankan `react-doctor install` | Dependency/script cukup untuk diagnostics dan user secara eksplisit menunda project-local skill |

## Changed files

| File/module | Perubahan |
|---|---|
| `package.json`, `package-lock.json`, `.nvmrc` | Expo/runtime/tooling dependency, scripts, Node contract, dan reproducible lockfile |
| `app.json` | Quba app identity, native identifiers, Router, dan development client config plugin |
| `src/app/` | Expo Router root layout dan thin route composition |
| `src/presentation/` | Accessible, light/dark-aware scaffold screen, localized copy source, dan component smoke test |
| `src/{application,domain,infrastructure}/README.md`, `src/README.md` | Initial dependency boundaries tanpa placeholder business code atau barrel export |
| `eslint.config.js`, `jest.config.js`, `tsconfig.json` | Boundary lint, Jest/Expo mapping, dan strict TypeScript config |
| `.github/workflows/quality.yml` | Mengaktifkan clean install dan canonical quality command tanpa pre-scaffold skip |
| `.gitignore` | Mengabaikan CNG-generated native folders dan Expo generated types |
| `README.md` | Development Build setup, quality command, dan deferred integration scope |
| `docs/tasks/QUBA-001-expo-engineering-scaffold.md` | Task contract, decision record, verification, dan handoff |

## Verification evidence

| Command/device/scenario | Result | Notes |
|---|---|---|
| `npm ci` | Pass | Clean install dari lockfile: 1,194 packages installed |
| `npm run check` | Pass | Prettier, ESLint (zero warning), TypeScript strict, Jest/RNTL 1/1 test, dan React Doctor no issues |
| `npx react-doctor@latest --verbose --scope changed` | Pass | Full fallback scan karena repository belum memiliki commit; score 100/100, no issues |
| `npm run expo:doctor` | Pass | 21/21 Expo config/dependency checks dengan metadata online |
| `npm run config` | Pass | Expo SDK 57 config resolved; scheme `quba`, iOS/Android identifiers, Router dan dev-client plugins tersedia |
| `expo export --platform ios` | Pass | iOS Hermes bundle berhasil dibuat di temporary output |
| `expo export --platform android` | Pass | Android Hermes bundle berhasil dibuat di temporary output |
| `npm start -- --offline` | Partial / intentionally stopped | Development-client server mencapai project startup lalu dihentikan dengan SIGINT; tidak ada device attach |
| Full iOS native build/device | Not run | Full Xcode/CocoaPods/device toolchain tidak tersedia pada host |
| Full Android native build/device | Not run | Java/Android SDK/ADB/device toolchain tidak tersedia pada host |
| `npm audit --omit=dev` | Known warning | 10 moderate paths berasal dari Expo build tooling `xcode -> uuid@7`; suggested force fix mendowngrade Expo ke 46 sehingga tidak aman diterapkan |

## Review findings

- Belum direview; implementer tidak memberi approval akhir sendiri. Task tetap `in_review` walaupun implementation checks lulus.

## Known issues and blockers

- Build dan runtime pada physical iOS/Android memerlukan native toolchain/device dan tetap harus dilakukan sebelum milestone yang mengandalkan native behavior.
- Detail BLE/native permission tetap menunggu hardware feasibility; sengaja tidak dikunci di task ini.
- Native identifiers `com.quba.app` adalah scaffold baseline dan harus dikonfirmasi terhadap ownership/signing sebelum EAS atau store setup.
- `npm audit` melaporkan advisory moderate pada transitive Expo build-tool path `xcode -> uuid@7`. Tidak ada non-breaking resolution yang ditawarkan; jangan memakai `npm audit fix --force` karena resolver mengusulkan downgrade Expo 57 ke 46.
- ESLint 9 mengeluarkan upstream deprecation notice setelah ESLint 10 dirilis, tetapi Expo SDK 57 masih memiliki plugin peer range sampai ESLint 9. Upgrade menunggu toolchain Expo mendukung major 10.
- Foundation Pack dan scaffold belum memiliki baseline commit; branch memuat staged Foundation files serta unstaged QUBA-001 changes secara eksplisit.

## Handoff / exact next step

Reviewer terpisah membaca Foundation baseline dan diff QUBA-001, menjalankan `npm ci && npm run check`, lalu memvalidasi satu local Development Build pada iOS atau Android yang memiliki toolchain. Setelah findings selesai dan bukti native dicatat, ubah task menjadi `done`; task fitur pertama berikutnya sebaiknya mendefinisikan application/domain contract sebelum menambahkan SQLite, Supabase, atau BLE adapter.
