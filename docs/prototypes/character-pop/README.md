# Character Pop Quba UI Prototype

This folder preserves the selected Character Pop visual direction as a standalone, clickable prototype. It is a design and interaction artifact, not production application code.

The prototype uses Quba lime `#BAFF72` as its primary action and character-signature color. Dark ink is used on lime controls for contrast, while purple remains a supporting decorative and data-visualization accent.

## Open the prototype

From the repository root:

```bash
python3 -m http.server 4173 --directory docs/prototypes/character-pop
```

Then open:

```text
http://localhost:4173/character-pop-full.html
```

Use **Prototype map** in the top-right corner to jump between screens and simulate Connected, Offline, or Needs Attention device states.

## Included flows

- Welcome, activation, account creation, pairing, starter habit, and first win.
- Home, Habits, habit detail, and habit creation.
- Linked or standalone quick activity.
- Active counter and session states.
- Device status, successful sync, partial sync, and offline recovery copy.
- Statistics, badges, activity history, Profile, Settings, dark theme, and empty state.

## Files

- `character-pop-full.html`: self-contained UI, styles, templates, and interactions.
- `quba-mascot-soft-v4.png`: primary expressive mascot combining Soft Quba's physical form with the original orange mascot's joyful face.
- `quba-mascot-physical-v2.png`: product-faithful expressive Quba mascot used by the prototype.
- `quba-mascot-pop.png`: preserved original humanoid mascot exploration for comparison.
- `character-pop-full.test.cjs`: deterministic flow and static accessibility checks.

Retired 2026-09-03: `quba-mascot-hybrid-v3.png` is intentionally removed from preserved references and must not be used again.

## Important limitations

- All account, BLE, activity, synchronization, XP, badge, and device behavior is simulated.
- The prototype does not access application modules, SQLite, Supabase, BLE, notifications, or real hardware.
- Indonesian copy represents the selected review language. Localization completeness is not demonstrated here.
- The generated mascot is a prototype asset and requires an explicit production asset/licensing decision before release.
- Responsive production behavior must be reimplemented and verified in React Native Development Builds.

## Verify

Run the deterministic prototype check from the repository root:

```bash
node docs/prototypes/character-pop/character-pop-full.test.cjs
```

The test covers the Golden Journey, form transitions, habit creation, quick activity, counter completion, dark theme, Offline and partial sync states, wired controls, headings, input labels, and captured browser-script errors.
