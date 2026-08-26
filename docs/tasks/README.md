# Task Briefs and Handoff

A task brief is the durable contract for one unit of work. Chat supports discussion but is not the primary status source.

## Lifecycle

```text
proposed → ready → in_progress → in_review → done
                         ↘ blocked
```

1. Copy `TEMPLATE.md` to `QUBA-<number>-<slug>.md`.
2. Fill in goals, non-goals, acceptance criteria, related ADRs, and risks before coding.
3. The implementing agent keeps status and the decision log current at meaningful checkpoints.
4. Before handoff, complete changed files, verification, known issues, and the exact next step.
5. The reviewer records findings or a review link in the same file.
6. After completion, move the brief to `docs/tasks/archive/` without deleting its history.

## Parallel work

- One task uses one branch/worktree.
- Record file/module ownership so two tasks do not edit the same boundary.
- Agree on a shared contract before implementing consumers in parallel.
- Do not hand off an important change only as an unexplained uncommitted diff.

## Minimum handoff

The receiving agent must be able to answer without guessing:

- What outcome is being built?
- What is complete and incomplete?
- Which decisions were made and why?
- Which files changed?
- Which verification actually ran?
- What risks or blockers remain?
- What is the concrete next step?
