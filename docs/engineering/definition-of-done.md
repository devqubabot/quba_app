# Definition of Done

This checklist applies to every change. Mark an irrelevant item `N/A` and record the reason in the task brief or pull request.

## Scope and correctness

- [ ] Task goals, non-goals, and acceptance criteria are clear and satisfied.
- [ ] The implementation is consistent with the PRD, architecture overview, and Accepted ADRs.
- [ ] No out-of-scope change or unreviewed dependency is present.
- [ ] Relevant failure, offline, retry, partial-success, and recovery behavior is defined.
- [ ] Data integrity and idempotency are preserved.

## Quality

- [ ] Formatting, lint, TypeScript, tests, and React diagnostics pass through the canonical command.
- [ ] New tests prove the behavior and relevant regressions.
- [ ] No test is skipped, made flaky, or weakened without an explicit reason.
- [ ] Build/runtime verification is complete on relevant platforms.
- [ ] A separate reviewer has reviewed the diff for a non-trivial change.

## Product experience

- [ ] Relevant loading, empty, success, offline, and error states are available.
- [ ] Accessibility and reduced-motion behavior are verified.
- [ ] Copy follows the Quba tone and is ready for localization.
- [ ] UI does not expose an internal error code without an explanation/action.

## Security, privacy, and operations

- [ ] Authentication/authorization and ownership boundaries are tested when affected.
- [ ] Source, logs, and analytics contain no secrets or sensitive data.
- [ ] Migration, rollback/recovery, and compatibility are checked when relevant.
- [ ] Important errors have safe diagnostics.

## Handoff

- [ ] The task brief includes status, decisions, changed files, and verification evidence.
- [ ] ADRs/documentation are updated when an invariant or behavior changes.
- [ ] Known limitations, blockers, and next steps are recorded.
- [ ] The working tree and commit state are understandable to the receiving agent.
