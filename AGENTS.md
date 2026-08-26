# Quba App Agent Contract

These instructions apply to the entire repository. Instructions closer to a working directory may add specific rules, but they must not weaken the safety, data integrity, security, or quality gates defined here.

## Start every task

1. Read the relevant sections of `QUBA_PRD_MVP_v1.0.md`.
2. Read `docs/architecture/overview.md` and the related ADRs in `docs/decisions/`.
3. Read the active task brief in `docs/tasks/`. Do not code without clear goals, non-goals, and acceptance criteria.
4. Read `docs/engineering/language-policy.md` and use its canonical vocabulary for engineering artifacts.
5. Check Git status and preserve user or other-agent changes that are outside the task scope.
6. Write or update the implementation plan in the task brief for non-trivial work.

## Product invariants

- The MVP focuses on one account owner, one robot, and Self Mode.
- The app handles configuration and reflection; the robot handles reminders, activities, feedback, and offline events.
- Core robot activities continue without a phone after configuration has synchronized.
- Activity events are append-only and deduplicated by `event_id`.
- XP, completion, and streak updates must be idempotent. A retry must never award a reward twice.
- Configuration uses monotonically increasing versions. Habit deletion uses archive/tombstone semantics until synchronization is safe.
- Linked and standalone activities must not be mixed. A standalone activity does not create an occurrence, streak, or XP in the baseline MVP.
- Language and gamification must be supportive, non-judgmental, and must not evaluate the spiritual quality of a user.
- Every flow includes the relevant empty, loading, success, offline, partial-success, and actionable error states.

## Architecture boundaries

- UI must not access BLE, SQLite, or Supabase directly.
- Domain logic must not import React, Expo, Supabase, SQLite, or a BLE implementation.
- Infrastructure implements ports/application contracts and translates external failures into typed application errors.
- SQLite is the operational read/write store on the device. Cloud sync must not make core local features wait for the network.
- Supabase is the boundary for authentication, ownership, backup, and cloud synchronization; secrets and service-role keys must never enter the app.
- Validate every BLE, storage, network, deep-link, and user-input payload at its boundary.
- Store time explicitly; distinguish UTC instants, timezones, scheduled local time, and device clock offsets.
- Synchronization side effects must be retry-safe, observable, and resumable after interruption.

## Coding rules

- Use strict TypeScript. Do not use `any` without a documented boundary reason and immediate type narrowing.
- Prefer small functions, pure domain logic, explicit dependency injection, and named domain types over ambiguous primitives.
- Do not add a production dependency without recording its rationale, alternatives, size/risk impact, and task-scope approval.
- Do not create broad barrel exports that hide dependency cycles.
- Separate user-facing copy from logic so localization can be applied.
- Do not log passwords, tokens, full activation codes, full device identifiers, or unnecessary personal data.
- Accessibility and reduced motion are acceptance criteria, not separate cleanup work.
- Base performance optimization on measurement. Avoid unnecessary renders, subscriptions, or bridge traffic on hot paths.
- Schema changes must use forward-only migrations and include an upgrade test from the previous version.

## Testing rules

- Every behavior change must include a test at the lowest level that proves it.
- Test user-visible behavior instead of component implementation details.
- Sync, XP ledger, event deduplication, occurrence, and retry behavior require deterministic tests.
- Test BLE through a contract/fake adapter; critical journeys still require physical-device verification.
- Test database migrations against the previous database version and existing representative data.
- Test Supabase policies/RLS with realistic roles, not only with a privileged client.
- Tests must not depend on real time, global order, public networks, or undeclared hardware.

See `docs/engineering/testing-strategy.md` for details.

## Quality gates

After the app has been scaffolded, the canonical command is:

```bash
npm run check
```

The command must run formatting checks, lint, TypeScript type checking, unit/component tests, and React diagnostics. Run additional tests according to the task risk matrix. Do not claim completion when a required check has failed or has not run; report the reason explicitly.

## Git, parallel work, and handoff

- One task uses one branch or worktree and one task brief.
- Do not edit the same file in parallel without explicit ownership boundaries.
- Keep commits small and cohesive; do not mix unrelated refactors.
- Before handoff, update the task brief with status, decisions, changed files, verification, blockers, and a concrete next step.
- A handoff should ideally point to a buildable or testable commit. If it does not, state clearly what is not yet safe.
- The receiving agent reads the diff and runs baseline checks before continuing.
- The implementer must not give final approval to their own non-trivial change; use a separate review.

## Documentation and decisions

- Cross-feature architecture decisions require a new ADR or a reviewed status change to an existing ADR.
- Do not silently contradict an Accepted ADR in code.
- When product behavior changes, update the PRD or record a gap that requires a Product decision.
- Documentation must explain rationale and invariants; do not duplicate details that can be read directly from code.
- Follow `docs/engineering/language-policy.md`: engineering and agent-facing artifacts use English, while approved product and user-language exceptions remain in their intended language.

## Definition of Done

A task is complete only when it satisfies `docs/engineering/definition-of-done.md`, its acceptance criteria, every relevant quality gate, and a review of the diff.
