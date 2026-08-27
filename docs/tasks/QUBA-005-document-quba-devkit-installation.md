# QUBA-005: Document Quba Devkit installation

- Status: in_review
- Owner/implementer: primary Codex agent
- Reviewer: unassigned (must be separate from implementer)
- Branch/worktree: `codex/quba-005-document-devkit-installation`
- Last updated: 2026-08-27 Asia/Jakarta

## Goal

Provide a reproducible repository-scoped installation path for the separate `quba-devkit` Codex plugin.

## Non-goals

- Installing or enabling the plugin on a developer's machine.
- Copying the plugin into the application repository.
- Adding an application runtime or development dependency.
- Changing product behavior, architecture, or the Quba Devkit repository.

## Acceptance criteria

- [x] The root README identifies Quba Devkit as a separate skills-only Codex plugin rather than an npm package.
- [x] A repo marketplace points to the official `devqubabot/quba-devkit` GitHub repository.
- [x] The guide provides CLI, desktop, and verification steps.
- [x] The guide links to the Quba Devkit repository and current official OpenAI plugin documentation.
- [x] Documentation and repository quality checks pass.

## Context and sources

- Quba App `AGENTS.md`, architecture overview, engineering language policy, and task workflow.
- PRD sections 22 and 23 for the development milestones and MVP completion boundary; this documentation-only task changes neither.
- Quba Devkit repository manifest and README at `devqubabot/quba-devkit`.
- Official OpenAI documentation for repo marketplaces and plugin installation.
- Related ADR: ADR 0001 for the local development environment; no ADR decision changes.

## Scope ownership

- `README.md`
- `.agents/plugins/marketplace.json`
- `docs/tasks/QUBA-005-document-quba-devkit-installation.md`
- No known parallel task owns these documentation and tooling paths.

## Implementation plan

1. Verify the Quba Devkit GitHub repository, plugin identity, and current Codex installation mechanism.
2. Add a repo marketplace entry that installs Quba Devkit directly from GitHub.
3. Add concise CLI, desktop, and verification instructions to the root README.
4. Run documentation and canonical repository checks, inspect the diff, and prepare the handoff.

## Risk and verification plan

| Risk | Evidence/test required |
|---|---|
| The guide treats Quba Devkit as an npm package | Confirm the text identifies it as a Codex plugin and uses no npm install command |
| Codex cannot resolve the marketplace or plugin | Validate the marketplace JSON, confirm explicit CLI registration is required, and verify the documented command syntax |
| The catalog points to stale or incorrect source | Verify the GitHub URL, `main` ref, plugin name, and bundled `$quba-review` skill against the remote repository |
| Documentation changes app dependencies or behavior | Confirm `package.json`, lockfile, and application source remain unchanged |

## Current status

The repository marketplace and installation documentation are complete and ready for independent review. The CLI flow explicitly registers the repository root because marketplace listing does not auto-register repo marketplaces; the desktop flow uses the repo marketplace after restart.

## Decision log

| Time | Decision | Rationale |
|---|---|---|
| 2026-08-27 | Use a repo-scoped marketplace | Developers can discover and install the approved devkit from the Quba App context without changing personal marketplace files |
| 2026-08-27 | Use the GitHub repository as a Git-backed plugin source | The standalone plugin is published on GitHub and is not an npm package or universal-directory plugin |

## Changed files

| File/module | Change |
|---|---|
| `README.md` | Quba Devkit CLI/desktop installation and verification guide |
| `.agents/plugins/marketplace.json` | Repo marketplace entry for the GitHub-hosted Quba Devkit |
| `docs/tasks/QUBA-005-document-quba-devkit-installation.md` | Task contract and handoff record |

## Verification evidence

| Command/scenario | Result | Notes |
|---|---|---|
| Remote shallow clone and manifest inspection | Pass | GitHub `main` contains plugin `quba-devkit` version `0.1.0` and skill `$quba-review` |
| `jq empty .agents/plugins/marketplace.json` | Pass | Repo marketplace JSON is syntactically valid |
| `codex plugin marketplace list` | Pass with expected limitation | The CLI did not auto-register the repo marketplace, so README includes `codex plugin marketplace add .` before installation |
| `codex plugin marketplace add --help` and `codex plugin add --help` | Pass | Documented registration and `PLUGIN@MARKETPLACE` syntax match the installed CLI |
| `npm run check` | Pass | Formatting, ESLint, strict TypeScript, Jest 1/1 suite and 1/1 test, and React Doctor completed with no issues; score API was unreachable |
| `git diff --check` | Pass | No whitespace errors |

## Review findings

- Not reviewed; the implementer cannot provide final approval.

## Known issues and blockers

- Access to a private GitHub repository depends on the developer's Git credentials.
- Quba Devkit remains version `0.1.0` and its initialization task is still awaiting independent review.

## Handoff / exact next step

Ask a separate reviewer to verify the installation flow on a clean Codex profile, then record findings and move the task to `done` if accepted.
