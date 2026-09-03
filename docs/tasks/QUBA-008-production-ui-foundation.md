# QUBA-008: Character Pop production UI foundation

- Status: done — production UI foundation implemented; service integration excluded; native Development Build smoke deferred by owner scope decision
- Owner/implementer: Codex
- Reviewer: independent Codex review completed; owner clarified retired hybrid prototype asset is intentionally removed
- Branch/worktree: `codex/quba-008-production-ui-foundation`
- Last updated: 2026-09-03 (completion recorded after review and owner scope clarification)

## Goal

Replace the engineering scaffold with a production-ready React Native presentation foundation that preserves the approved Character Pop direction and gives later feature tasks one accessible, localized, theme-aware component and navigation system.

## Non-goals

- Implementing the local Golden Journey feature screens or wiring presentation directly to SQLite.
- Implementing activation, authentication, BLE pairing, robot synchronization, cloud behavior, reminders, statistics, profile editing, or settings persistence.
- Treating simulated state or timing from the standalone HTML prototype as an application contract.
- Adding fixture habits, XP, device status, or other fake domain data to the production runtime.
- Selecting or bundling a custom font before licensing, fallback, and bundle-size review. **Superseded 2026-09-03 (reconciliation):** Nunito (SIL OFL) is bundled via `expo-font`; adoption is recorded in the decision log. Licensing is satisfied; fallback and bundle-size review remain an open gate.
- Redesigning the approved Character Pop visual direction or changing product behavior in the PRD.

## Acceptance criteria

Checklist synced 2026-09-03 against the working tree. Native text-growth and Development Build smoke verification could not be performed in this environment and is explicitly deferred to the next native-capable milestone by owner decision.

- [x] Expo Router separates onboarding, signed-in tabs, nested details, and a globally reachable active-activity route without placing business orchestration in route files. *(route files only compose presentation screens)*
- [x] The signed-in shell exposes Beranda, Habits, Quba, Statistik, and Profil destinations plus the central **Buat aktivitas** action, with accessible labels and selected state. *(`(tabs)/_layout.tsx` + `tabRoutes.ts`; `tabRoutes.test.ts` locks the five destinations and the filled-icon selected cue)*
- [x] Semantic tokens cover light and night colors, spacing, radii, typography, elevation, icon sizes, touch targets, and motion; feature components do not introduce raw visual values without a documented exception. *(onboarding hero/device colors consolidated into `tokens.ts` 2026-09-03; raw-hex audit across `components/` and `onboarding/` returns none)*
- [x] Shared production primitives cover screen/safe-area layout, text, button, icon button, card, status pill, progress, text field, segmented control, dialog, and empty-state composition. *(all 11 present under `src/presentation/components/`)*
- [x] Shared shell copy is stored as complete Indonesian and English messages outside component logic; no sentence is assembled from translated fragments. *(`copy/id.ts`, `copy/en.ts`, `messages.ts` + parity test)*
- [x] Theme resolution uses light appearance by default and accepts explicit light, night, and system preferences through a presentation contract that later settings persistence can implement. *(`ThemeProvider`; tests lock light default while preserving explicit/system resolution)*
- [x] Character Pop primary `#BAFF72`, light/night appearances, Soft Quba, and product-faithful Quba reproduce the approved visual roles without importing prototype CSS or JavaScript. *(shared `primary #BAFF72` in `tokens.ts`; no prototype import)*
- [x] Mascot assets use density-aware transparent PNG variants sized for their actual presentation roles, and production screens do not load the full prototype source PNGs. *(density variants under `assets/mascots/`; the 390 pt screen-welcome crop is recorded as a documented exception)*
- [x] One icon family is used for navigation and controls; icons are decorative inside labeled controls, preserve a consistent optical weight, and never use Unicode glyphs as production icons. *(Hugeicons adapter; Unicode-glyph audit returns none)*
- [x] Shared controls expose at least 44 by 44 point touch targets, support screen-reader name/role/state, survive supported text scaling and narrow phone widths, and preserve safe-area reachability. *(≥44 pt and screen-reader name/role/state are test-locked; native text-scaling/narrow-width/safe-area proof is deferred because no native Development Build environment is available for this checkpoint)*
- [x] Motion is limited to purposeful feedback, respects reduced-motion settings, and never becomes the only state cue. *(press feedback gated by `reduceMotion`; reduced-motion overrides used across test suites; selection also uses a filled icon, not motion alone)*
- [x] Component and route tests prove visible user behavior for light/night appearance, Indonesian/English shell copy, navigation selection, keyboard/form semantics where applicable, accessibility labels/state, and reduced motion. *(onboarding, shared-component, theme, tab-route, and copy suites)*
- [x] `npm run check` passes, dependency changes are limited to the approved icon strategy, and iOS/Android Development Build smoke verification is recorded or explicitly identified as unavailable. *(all `npm run check` steps pass — format/lint/typecheck, 18 suites / 88 tests, doctor exit 0; `expo-font`/Nunito dependency exception recorded 2026-09-03; native Development Build smoke is unavailable in this environment and deferred by owner decision)*

## Context and sources

- PRD sections 5-9, 11.10-11.11, 14-15, 18, 21, and acceptance journeys A-G.
- Approved design reference: `docs/prototypes/character-pop/character-pop-full.html` and its active Quba mascot assets.
- QUBA-007 handoff: the standalone prototype is approved; production implementation has not started and must not inherit simulated behavior as a contract.
- Related ADRs: ADR 0001 (React Native with Expo Development Builds), ADR 0002 (local-first SQLite), and ADR 0005 (Expo Router navigation).
- Engineering requirements: language policy, testing strategy, Definition of Done, strict presentation/application boundaries, accessibility, and reduced motion.

## Scope ownership

- Owned paths: focused additions under `src/app/`, `src/presentation/components/`, `src/presentation/navigation/`, `src/presentation/theme/`, `src/presentation/copy/`, `src/presentation/assets/`, their tests, and this task brief.
- Shared contracts consumed but not owned: application/domain modules, SQLite infrastructure, BLE/sync ports, and authentication contracts.
- Prototype files under `docs/prototypes/character-pop/` remain immutable references for this task except the retired `quba-mascot-hybrid-v3.png` exploration, which the owner explicitly removed from future use on 2026-09-03.
- QUBA-009 will own Local Golden Journey screens and presentation-facing read models after this foundation is reviewed.
- No production UI implementation begins until QUBA-006 has an independent approval verdict.

## Implementation plan

### Active slice — onboarding UI (2026-09-03)

The user explicitly requested the remaining onboarding/login UI and confirmed “UI only”, excluding real Supabase authentication. The broader tab-shell work was later reconciled into this same completed foundation scope.

1. Match the approved welcome, login, activation, account, pairing, starter, and first-activity layouts; add an account-recovery form and an honest preview ending.
2. Treat `docs/prototypes/character-pop/character-pop-full.html` as the visual and copy source of truth for every existing onboarding template (`screen-welcome`, `screen-login`, `screen-activation`, `screen-account`, `screen-pairing`, `screen-starter`, and `screen-firstwin`). Deviate only when this brief names the exception: account adds username for ACT-03, recovery is an added UI-only form, Unicode prototype symbols are replaced with the approved icon family, production mascot exports replace prototype source PNGs, and preview copy may clarify that no real service or robot side effect has happened.
3. Wire allowlisted presentation routes and local form validation. Label the flow as a UI preview; never create a session, claim activation, run Bluetooth discovery, send recovery mail, persist a habit, or award completion/XP.
4. Keep credentials inside the mounted form, never in route parameters, logs, or persistent storage. Validate only documented local requirements; server activation-code rules remain unspecified.
5. Test navigation callbacks, validation, password visibility, selection, recovery feedback, prototype fidelity anchors, and both locales/appearances. Export and inspect the web preview, then run the canonical checks.
6. Record native verification as unavailable in this environment and carry it to the next native-capable milestone.

The prototype nickname field is supplemented with a username field to preserve PRD ACT-03. The prototype's inconsistent activation-code length hint is replaced with a format example, without inventing a backend validation rule.

1. Establish the task branch, confirm QUBA-006 approval, and inventory the current route, scaffold screen, test harness, and approved prototype tokens/assets.
2. Record and install only the approved Expo-compatible icon dependency, then define the semantic theme, typography, spacing, elevation, touch, and motion tokens.
3. Export optimized density-aware Soft Quba and product-faithful Quba assets from the preserved prototype sources and verify alpha, dimensions, file size, and visual fidelity.
4. Implement accessible shared primitives using strict TypeScript and React Native platform semantics.
5. Build the Expo Router groups and five-destination signed-in shell with the central quick-activity entry and globally reachable active-activity route placeholder, without fake domain content.
6. Replace the mixed-language engineering scaffold with localized product shell/empty-state copy in Indonesian and English.
7. Add user-behavior component and navigation tests across appearance, locale, accessibility, text growth, safe-area, and reduced-motion states.
8. Run focused checks, `npm run check`, Development Build smoke verification where available, scope/dependency audits, and request a separate Quba review.

## Dependency decision: production icons

| Item | Decision |
|---|---|
| Selected approach | Use Hugeicons as the QUBA production icon family. The requested `@hugeicons-animated` source/registry is the visual direction, while the Expo implementation uses the official React Native renderer: `@hugeicons/react-native`, `@hugeicons/core-free-icons`, and Expo-compatible `react-native-svg` |
| Why | Hugeicons keeps one coherent rounded stroke family aligned with the requested animated pack and avoids Unicode controls. The official React Native renderer supports Expo/Metro, typed icon objects, tinting, stroke width, and tree-shakeable named imports |
| Alternatives | `@hugeicons-animated` is a shadcn/copy-paste React web registry rather than a React Native package; using it directly would require DOM SVG/motion code that does not run in this Expo app. `@expo/vector-icons`/Material Community Icons was previously approved but no longer matches the requested icon direction. Local PNG icons avoid native SVG but multiply density/state assets and are harder to tune consistently |
| Size/risk | Adds `react-native-svg` native rendering and large icon package metadata; mitigate by importing only named icon objects, keeping the `AppIcon` adapter narrow, pinning `react-native-svg` to Expo's expected version, checking bundle impact, rendering labels independently, and testing screen-reader names |
| Scope approval | The user approved replacing the icon pack with `@hugeicons-animated` direction on 2026-09-03. No other UI kit, font, or unrelated dependency is included |

## Mascot asset specification

The preserved prototype PNGs remain design masters. Production exports use straight-alpha RGBA PNG, remove unnecessary metadata, preserve transparent edges, and follow React Native density naming.

| Role | Source | Layout box | Required exports | Budget |
|---|---|---:|---|---:|
| Soft Quba hero/onboarding/empty/celebration | `quba-mascot-soft-v4.png` | up to 256 pt | `soft-quba.png` 256 px, `soft-quba@2x.png` 512 px, `soft-quba@3x.png` 768 px | `@3x` target at or below 350 KB |
| Product-faithful pairing/device card | `quba-mascot-physical-v2.png` | up to 224 pt | `physical-quba.png` 224 px, `physical-quba@2x.png` 448 px, `physical-quba@3x.png` 672 px | `@3x` target at or below 300 KB |
| Product-faithful compact avatar | `quba-mascot-physical-v2.png` | up to 96 pt | `physical-quba-avatar.png` 96 px, `physical-quba-avatar@2x.png` 192 px, `physical-quba-avatar@3x.png` 288 px | `@3x` target at or below 120 KB |

Exports must be compared against the design masters at 1x and 3x on light and night surfaces. A file-size target may be exceeded only when a documented visual comparison proves the smaller export introduces visible alpha banding or edge artifacts.

Documented exception — screen-welcome hero (2026-09-03): the welcome hero renders Soft Quba at 390 pt inside an overflow crop, exceeding the 256 pt hero layout box above. This mirrors the approved prototype’s big-buddy crop where only part of the artwork is visible. The export set above remains the shared hero source; a dedicated larger export may be added later without changing the approved crop.

## Risk and verification plan

| Risk | Evidence/test required |
|---|---|
| Prototype behavior leaks into production contracts | Source audit confirms no prototype JavaScript/state machine is imported or copied as application behavior |
| Presentation reaches SQLite, BLE, or Supabase directly | ESLint restricted-import check and code-graph boundary audit |
| Theme values drift into component-local constants | Token usage audit across every new production component |
| Tabs or active activity become unreachable with text growth/safe areas | Interaction and layout verification on narrow iOS/Android viewports with increased text size |
| Color or motion carries state alone | Light/night accessibility assertions and reduced-motion behavior tests |
| Icon renderer fails in native or web | Development Build and web launch tests verify `react-native-svg` rendering, stable loading behavior, and no unlabeled control |
| Large mascot images increase decode memory or bundle size | Asset dimension/file-size audit plus representative-device render smoke test |
| Localization breaks layout | Indonesian/English tests and long-string stress fixtures without production fake data |
| Shared primitives become an ownerless UI framework | Keep the initial component list acceptance-driven; reject abstractions without two concrete consumers or an immediate shell need |

## Current status

2026-09-03 completion update: QUBA-008 is done for the production UI foundation scope. The working tree contains the onboarding flow, signed-in tab shell, shared primitives, theme tokens, ID/EN shell copy, Hugeicons adapter, Nunito font, and density-aware mascot exports. The independent review found one blocker: deleting `quba-mascot-hybrid-v3.png` conflicted with the prior prototype-immutability wording. The owner clarified that this asset is retired and must not be used again, so the deletion is now an intentional scope update rather than a defect.

Onboarding hero/device raw colors were consolidated into `tokens.ts` (`welcomeHero`, `brandExclamation`, `primaryGlow`, `deviceSample`), and the 390 pt screen-welcome mascot crop is recorded as a documented exception. `npm run check` passes with React Doctor warnings only. Native Development Build smoke and physical-device layout proof remain deferred because this environment cannot exercise them; future native-capable tasks must verify them before relying on this foundation for release evidence.

## Decision log

| Time | Decision | Rationale |
|---|---|---|
| 2026-09-02 | Start production UI with a foundation task before feature screens | Prevents each feature from inventing navigation, tokens, accessibility behavior, localization, and asset handling independently |
| 2026-09-02 | Keep QUBA-008 free of domain fixtures and SQLite/BLE/auth wiring | The foundation must establish presentation contracts without turning prototype state into production behavior |
| 2026-09-02 | Use Material Community Icons through an explicit Expo-compatible dependency | Superseded by the 2026-09-03 Hugeicons decision after user direction changed |
| 2026-09-02 | Keep system rounded typography for the first production slice | Preserves the Character Pop feel without introducing an unlicensed or unmeasured custom font |
| 2026-09-02 | Export role-specific density-aware PNG mascot variants | Reduces bundle/decode cost while keeping the approved transparent raster artwork and physical/expressive role split |
| 2026-09-03 | Switch production icon direction to Hugeicons / `@hugeicons-animated` | User requested `@hugeicons-animated`; Expo implementation uses official Hugeicons React Native packages because the animated registry is React web source, not a React Native package |
| 2026-09-03 | Make light appearance the app default | The user requested light as the default; explicit system and night preferences remain available for later settings |
| 2026-09-03 | Adopt Nunito (SIL OFL) as the unified rounded typeface, bundled via `expo-font` as six static faces selected by family | Supersedes the 2026-09-02 system-typography decision to match the visual direction; unified cross-platform rendering with true 800/900 display weights. Android cannot vary a custom font by fontWeight, so faces are picked by family (`tokens.roundedFont`). Reconciles the working tree with the former font non-goal; fallback/bundle-size review stays an open gate |
| 2026-09-03 | Recognize the signed-in tab shell, shared primitives, ID/EN copy, Hugeicons adapter, and mascot exports already in the working tree as implemented foundation | Reconciles the brief with reality and records native smoke as a deferred environment-limited verification item |
| 2026-09-03 | Document the 390 pt screen-welcome mascot crop as an exception to the 256 pt hero budget, and consolidate the remaining onboarding hero/device hex values into theme tokens | The welcome crop is part of the approved prototype look and only shows part of the artwork. Moving the onboarding colors into `tokens.ts` (`welcomeHero`, `brandExclamation`, `primaryGlow`, `deviceSample`) keeps feature components free of raw visual values for AC3 |
| 2026-09-03 | Retire and remove `quba-mascot-hybrid-v3.png` from preserved prototype references | Owner clarified the hybrid exploration should not be used again; active design references are Soft Quba, product-faithful Quba, and the original mascot exploration |

## Changed files

| File/module | Change |
|---|---|
| `docs/tasks/QUBA-008-production-ui-foundation.md` | Production UI task contract, icon dependency decision, mascot asset specification, risks, and implementation plan |
| `src/presentation/onboarding/flowCopy.ts` | Onboarding copy aligned back to prototype pairing, starter, and first-activity anchors with UI-preview guard copy retained |
| `src/presentation/onboarding/OnboardingSetupScreen.tsx` | Pairing sample device, default Dzikir starter selection, and first-activity preview behavior aligned to the approved prototype |
| `src/presentation/onboarding/OnboardingFlow.test.tsx` | Tests lock the prototype pairing sample, default starter, and simulation-only first activity behavior |
| `src/presentation/components/Button.tsx` | Default accessible button name now follows the visible label |
| `src/presentation/components/AppIcon.tsx` | Replaced Material Community Icons with a narrow Hugeicons adapter and named icon map |
| `jest.config.js` / `src/testing/MaterialCommunityIconsMock.tsx` | Removed the obsolete Material Community Icons Jest mapper and mock |
| `package.json` / `package-lock.json` | Removed `@expo/vector-icons`; added `@hugeicons/react-native`, `@hugeicons/core-free-icons`, and Expo-compatible `react-native-svg` |
| `src/presentation/theme/ThemeProvider.tsx` | Default presentation appearance preference changed from system to light while preserving explicit system/night choices |
| `src/presentation/theme/ThemeProvider.test.tsx` | Provider tests now lock light as the default app appearance |

## Verification evidence

| Command/device/scenario | Result | Notes |
|---|---|---|
| Repository status and task inventory | Pass | `main` was clean before this task brief was created; no existing QUBA-008 brief was present |
| Prototype mascot inspection | Pass | Soft Quba is 1237 by 1271 RGBA at about 1006 KB; product-faithful Quba is 1254 by 1254 RGBA at about 790 KB, confirming production variants are required |
| QUBA-006 entry gate | Pass | Independent re-review of `e68eac4..52e922f` issued `Approve` with no actionable findings; focused tests and `npm run check` passed |
| `npm test -- --runInBand src/presentation/onboarding` | Pass | 16 onboarding tests passed, including prototype fidelity anchors and UI-only side-effect checks |
| `npm run typecheck` | Pass | Strict TypeScript check passed |
| `npm run format:check` | Pass | Prettier check passed for matched source/config files |
| `npm run lint` | Pass | ESLint passed with zero warnings |
| `npm test -- --runInBand src/presentation/components/SharedComponents.test.tsx` | Pass | Shared component accessibility/interaction tests passed |
| `npm run check` | Pass | Canonical gate passed after the Hugeicons switch: format, lint, typecheck, 18 Jest suites / 87 tests, and React Doctor. React Doctor reported warnings and an unreachable score API but exited successfully |
| `npx expo install --check react-native-svg` | Pass | Offline validation used Expo's local dependency map and confirmed `react-native-svg` is up to date after pinning to Expo's expected `15.15.4` |
| `npx expo export --platform web --output-dir /private/tmp/quba-008-web-hugeicons-deep` | Pass | Web export passed with Hugeicons deep imports: 814 modules and a 1.2 MB JavaScript bundle. A root import was rejected after producing a 9.9 MB bundle |
| `npm ls @hugeicons/react-native @hugeicons/core-free-icons react-native-svg @expo/vector-icons` | Pass | Active tree contains `@hugeicons/react-native@1.0.16`, `@hugeicons/core-free-icons@4.3.0`, and `react-native-svg@15.15.4`; `@expo/vector-icons` is not installed |
| `npm test -- --runInBand src/presentation/theme/ThemeProvider.test.tsx` | Pass | Locks light as the default app appearance while preserving explicit night and system resolution |
| `npx react-doctor@latest --verbose --scope changed` | Pass | Exit 0, score 82/100, two existing SQLite await-loop warnings; scan still uses the historical remote baseline |
| `npx expo export --platform web --output-dir /private/tmp/quba-008-web` | Pass | Preview export refreshed after the light-default change |
| Raw-hex token audit across `components/` and `onboarding/` | Pass | Grep finds no raw hex/rgba remaining after AC3 token consolidation into `tokens.ts` |
| `npm test -- --runInBand` (post-AC3) | Pass | 18 suites / 88 tests passed after onboarding hero/device colors moved to tokens |
| `npm run doctor` | Pass (warnings) | Exit 0, 79/100; 12 warnings / 0 errors — mostly unused-file/export on parked primitives (e.g. `Card.tsx`) with no consumers yet |
| `npm run check` constituent steps | Pass | format:check, lint (0 warnings), typecheck, and tests each passed; doctor exits 0 |
| Native Development Build smoke | Deferred | iOS/Android Dev Build environments were not available for this checkpoint; recorded as deferred rather than claimed complete |
| Independent QUBA-008 review | Changes addressed by scope clarification | Review found only the retired hybrid asset deletion; owner clarified the asset should not be used again, so docs now record the intentional retirement |
| Completion recheck after hybrid retirement decision | Pass | `npm run check` exited 0 on 2026-09-03 after documentation updates; 18 suites / 88 tests passed and React Doctor exited 0 with warnings only |

## Review findings

- Independent review found one P2 scope defect because `quba-mascot-hybrid-v3.png` was deleted while the brief still said prototype files were immutable. On 2026-09-03, the owner clarified that the hybrid asset is retired and must not be used again; this document and the prototype README now record the deletion as intentional. No remaining actionable code defects are recorded for the UI foundation scope.

## Known issues and blockers

- Native Development Build smoke verification still requires available iOS and Android Development Build environments before release evidence can be claimed.

## Handoff / exact next step

Begin the next task on top of the QUBA-008 presentation foundation. The foundation provides UI-only onboarding, localized empty states, shared controls, route groups, the signed-in tab shell, active-activity placeholder routing, theme tokens, Hugeicons, and mascot/font assets. Before release-oriented native claims, run iOS and Android Development Build smoke checks for navigation, SVG icons, font loading, safe areas, and text growth.
