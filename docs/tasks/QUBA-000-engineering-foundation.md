# QUBA-000: Engineering Foundation Pack

- Status: done
- Owner/implementer: primary Codex agent
- Reviewer: project owner
- Branch/worktree: main (initial repository foundation)
- Last updated: 2026-08-27 Asia/Jakarta

## Goal

Create the sources of truth, handoff protocol, and objective quality contract required for different agents to develop the Quba App consistently.

## Non-goals

- Scaffolding the Expo application.
- Installing runtime dependencies.
- Creating a project-local `quba-app-engineering` skill before the workflow stabilizes.
- Locking BLE protocol details that still depend on hardware feasibility.

## Acceptance criteria

- [x] A Git repository is available for versioning and handoff.
- [x] Root `AGENTS.md` defines product invariants, architecture boundaries, quality gates, and handoff requirements.
- [x] Agreed stack decisions are recorded as ADRs.
- [x] Coding, testing, and Definition of Done documents are available.
- [x] Task/handoff and pull-request templates are available.
- [x] CI validates the foundation and is ready to activate `npm run check` after application scaffolding.
- [x] The project owner reviewed and accepted the Foundation Pack.

## Context and sources

- PRD: the full MVP, especially sections 5, 10, 12, 13, 16, 18, 22, and 23.
- Related ADRs: ADR 0001-0005.
- OpenAI Codex project guidance: `AGENTS.md`, repository-scoped instructions, and the code-review workflow.

## Scope ownership

- Root governance files, the `docs/` tree, and the `.github/` foundation.
- Does not modify the PRD or original product artifacts.
- No parallel implementation task.

## Implementation plan

1. Initialize Git.
2. Create the root source of truth and agent contract.
3. Record the architecture and already-accepted decisions.
4. Create coding/testing/Definition of Done and the task handoff protocol.
5. Add a pull-request template and pre-scaffold-safe CI.
6. Validate cross-references, Git state, and document contents.

## Risk and verification plan

| Risk | Evidence/test required |
|---|---|
| Rules are too abstract, so different agents still diverge | Review every invariant and task template against the PRD |
| CI fails before the app exists | Workflow has an explicit pre-scaffold path |
| Premature decisions lock uncertain hardware | Protocol details remain open and a native fallback is preserved |
| Documents contradict each other | Link/status/terminology consistency audit |

## Current status

Foundation files were created, validation passed, and the project owner accepted the Foundation Pack.

## Decision log

| Time | Decision | Rationale |
|---|---|---|
| 2026-08-27 | Keep the Foundation Pack in the Quba App repository | Rules, decisions, and code must be versioned together |
| 2026-08-27 | Put critical invariants in `AGENTS.md` and CI, not only in a skill | Mandatory instructions and verification must be available to every agent |
| 2026-08-27 | Defer the project-local skill | The workflow should stabilize before a skill preserves premature rules |
| 2026-08-27 | Activate app CI automatically when `package.json` exists | The Foundation Pack can be reviewed before scaffolding without false failures |

## Changed files

| File/module | Change |
|---|---|
| `AGENTS.md` | Repository-wide agent contract |
| `README.md`, `.gitignore`, `.editorconfig` | Repository baseline |
| `docs/architecture/` | System boundaries and sync invariants |
| `docs/decisions/` | ADR 0001-0005 |
| `docs/engineering/` | Coding, testing, and Definition of Done |
| `docs/tasks/` | Task lifecycle and handoff template |
| `.github/` | Pull-request template and quality workflow |

## Verification evidence

| Command/device/scenario | Result | Notes |
|---|---|---|
| `git status --short --branch` and file inventory | Pass | Repository active on branch `main`; all foundation changes remained uncommitted for review |
| Required foundation contract check | Pass | Every required file existed and was non-empty |
| Markdown relative-link audit | Pass | 18 Markdown files checked; no broken relative links |
| YAML parse for `.github/workflows/quality.yml` | Pass | Workflow was valid YAML |
| Trailing-whitespace audit | Pass | No trailing whitespace found |
| Expo/app tests | N/A | App had not been scaffolded |

## Review findings

- Reviewed and accepted by the project owner on 2026-08-27 without additional changes.

## Known issues and blockers

- Hardware capabilities and the BLE protocol remain open as defined by the PRD.
- Package-manager/runtime/tool versions become executable only after scaffolding.

## Handoff / exact next step

Scaffold an Expo Development Build in this repository, then create a new task for executable quality tooling and project structure.
