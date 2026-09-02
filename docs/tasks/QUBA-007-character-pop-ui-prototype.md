# QUBA-007: Character Pop full UI prototype

- Status: done
- Owner/implementer: primary Codex agent
- Reviewer: product owner (user)
- Branch/worktree: `main` working tree
- Last updated: 2026-09-02 Asia/Jakarta

## Goal

Preserve the selected Character Pop visual direction as a version-controlled, standalone, clickable HTML prototype covering Quba's primary MVP journeys and presentation states before React Native implementation begins.

## Non-goals

- Implementing Character Pop in the production React Native application.
- Connecting the prototype to BLE, SQLite, Supabase, notifications, prayer-time providers, or real account services.
- Treating prototype state or timing as production domain behavior.
- Finalizing English localization, hardware protocol details, analytics, or production illustration licensing.

## Acceptance criteria

- [x] The prototype is stored under `docs/prototypes/character-pop/` with all required local assets.
- [x] It opens without a build step or third-party runtime dependency.
- [x] The clickable flow covers activation, account creation, pairing, starter habit, first win, Home, Habits, quick activity, counter/session, device/sync, Statistics, history, Profile, and Settings.
- [x] Connected, Offline, Needs Attention, successful sync, partial sync, empty, and dark-theme states can be reviewed.
- [x] Linked and standalone activity copy remains distinct and matches MVP product invariants.
- [x] Forms use visible labels, modal focus is contained, dynamic status is announced, and reduced motion is respected.
- [x] A deterministic test exercises the Golden Journey and critical prototype state transitions.
- [x] A separate reviewer records a design/prototype readiness verdict before React Native implementation starts.

## Context and sources

- PRD sections 5-9, 11, 12.4, 14, 15, 18, 21, and acceptance journeys A-G.
- ADR 0001 (React Native with Expo Development Builds) and ADR 0005 (Expo Router navigation) constrain later production implementation, not this standalone prototype.
- The user selected the Character Pop direction after comparing Cozy Companion, Calm Focus, Playful Utility, and Material 3 explorations.
- Product invariants: Self Mode, screen-light use, supportive copy, transparent synchronization, and strict separation of linked and standalone activities.

## Scope ownership

- Owned paths: `docs/prototypes/character-pop/` and this task brief.
- Production paths under `src/`, native projects, dependencies, and application/domain contracts remain untouched.
- The existing comparison exploration remains outside the repository and is not part of this preserved deliverable.

## Implementation plan

1. Preserve the selected standalone HTML, generated Quba mascot, and deterministic test in the repository.
2. Apply the approved `#BAFF72` Quba primary color through semantic prototype tokens while retaining dark ink for contrast and purple as a supporting accent.
3. Replace the generic humanoid mascot with a two-mode character system: a product-faithful Quba render for hardware contexts and Soft Quba for hero, onboarding, and celebration contexts.
4. Verify the revised character and palette across primary actions, navigation, active controls, the Home hero, light appearance, and dark appearance.
5. Run formatting, lint, the deterministic prototype test, a local HTTP availability check, and a production-worktree scope audit.
6. Record verification and request a separate readiness review before production UI implementation.

## Risk and verification plan

| Risk                                          | Evidence/test required                                                                  |
| --------------------------------------------- | --------------------------------------------------------------------------------------- |
| Prototype is saved without a required asset   | Serve the folder and verify HTTP 200 for HTML and mascot                                |
| Clickable flow regresses while moving files   | Run the deterministic prototype test from the repository path                           |
| Prototype silently changes production code    | Confirm `git status` contains only this task brief and `docs/prototypes/character-pop/` |
| Prototype is mistaken for production behavior | Keep limitations and non-goals explicit in the colocated README                         |
| Accessibility affordances are lost            | Retain static checks for headings, wired controls, and visible input labels             |

## Current status

The selected Character Pop prototype now uses Quba lime `#BAFF72` for primary actions, active navigation, progress, and signature hero surfaces. Its mascot system uses a product-faithful render for Pairing, Device, and Profile contexts, plus Soft Quba for Welcome, First Win, Home, and Empty states. Soft Quba preserves the physical device's rounded cuboid body, two top buttons, side housing, and lower-front blocks while restoring the original orange mascot's joyful face and playful energy. The revised prototype passes its deterministic and repository quality checks and has been accepted by the product owner. Production implementation has not started.

## Decision log

| Time       | Decision                                                     | Rationale                                                                                                       |
| ---------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| 2026-09-02 | Preserve the artifact under `docs/prototypes/character-pop/` | Keeps design exploration version-controlled while maintaining a hard boundary from production React Native code |
| 2026-09-02 | Store a standalone HTML file and local PNG asset             | Allows review without installing a design tool or adding an application dependency                              |
| 2026-09-02 | Use `#BAFF72` as the prototype primary color                 | Establishes Quba's approved lime signature while dark ink preserves readable primary controls                   |
| 2026-09-02 | Align the expressive mascot with the physical Quba device    | Keeps the app character recognizable as the hardware while allowing screen expressions and a simple panel wave  |
| 2026-09-02 | Use product-faithful and expressive hybrid mascot modes      | Hardware flows stay accurate while emotional moments retain the bold personality of the original orange mascot  |
| 2026-09-02 | Promote Soft Quba as the primary expressive mascot            | Keeps the physical cuboid identity while restoring the original orange mascot's joyful face and playful energy   |

## Changed files

| File                                                        | Purpose                                                  |
| ----------------------------------------------------------- | -------------------------------------------------------- |
| `docs/prototypes/character-pop/character-pop-full.html`     | Standalone clickable Character Pop prototype             |
| `docs/prototypes/character-pop/quba-mascot-pop.png`         | Preserved original humanoid mascot exploration           |
| `docs/prototypes/character-pop/quba-mascot-physical-v2.png` | Product-faithful expressive mascot used by the prototype |
| `docs/prototypes/character-pop/quba-mascot-hybrid-v3.png`   | Preserved expressive hybrid exploration                  |
| `docs/prototypes/character-pop/quba-mascot-soft-v4.png`     | Primary Soft Quba mascot used in emotional UI moments     |
| `docs/prototypes/character-pop/character-pop-full.test.cjs` | Deterministic Golden Journey and critical-state checks   |
| `docs/prototypes/character-pop/README.md`                   | Review instructions, scope, and prototype limitations    |
| `docs/tasks/QUBA-007-character-pop-ui-prototype.md`         | Task scope, decisions, verification, and handoff record  |

## Verification evidence

- `node docs/prototypes/character-pop/character-pop-full.test.cjs`: passed; all deterministic flow checks passed.
- Prettier check for all prototype and task files: passed.
- `npx eslint docs/prototypes/character-pop/character-pop-full.test.cjs --max-warnings 0`: passed.
- `npm run check`: passed; 59 tests passed. React Doctor reported three existing infrastructure warnings and could not reach its optional score API.
- Critical WCAG 2 contrast pairs measured: dark ink on lime `14.62:1`, deep-green interactive text on warm background `7.83:1`, strong-green indicator on warm background `4.91:1`, and lime on the dark background `15.70:1`.
- Repository-local HTTP review returned `200` for `character-pop-full.html`, `quba-mascot-physical-v2.png`, and `quba-mascot-hybrid-v3.png`.
- The product-faithful mascot is a `1254 × 1254` RGBA PNG with genuine alpha transparency; the original generated checkerboard draft was not added to the repository.
- The expressive hybrid mascot remains as a separate `1254 × 1254` RGBA comparison asset and is no longer referenced by the active prototype.
- The primary Soft Quba mascot is a `1237 × 1271` RGBA PNG with genuine alpha transparency; all four emotional UI placements now reference `quba-mascot-soft-v4.png`.
- Browser review from repository-local servers confirmed computed primary `#baff72`, loaded product-faithful and hybrid assets, no browser warnings/errors, and representative Welcome, Home light/dark, and Device appearances.
- Scope audit: `git status --short` shows changes only under `docs/prototypes/` and this task brief; production application code is untouched.

## Review findings

No blocking findings were recorded. On 2026-09-02, the product owner reviewed the prototype and accepted the Soft Quba direction with the verdict `Approve` for the standalone prototype scope. This verdict does not approve or validate a future React Native implementation.

## Known limitations

- The prototype uses simulated state and must not be treated as evidence for BLE, SQLite, synchronization, localization, or hardware behavior.

## Handoff / exact next step

The prototype task is complete. Create a separate React Native implementation task when production UI work begins; re-read the prototype rather than treating its simulated behavior as an application contract.
