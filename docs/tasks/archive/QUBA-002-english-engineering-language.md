# QUBA-002: English engineering and agent language

- Status: done
- Owner/implementer: primary Codex agent
- Reviewer: project owner
- Branch/worktree: `quba-001-expo-engineering-scaffold` (sequential bootstrap history; changes are separated by task commit)
- Last updated: 2026-08-27 Asia/Jakarta

## Goal

Make English the canonical language for engineering and agent-facing artifacts so repository instructions, architecture, decisions, tasks, code terminology, and tooling use one consistent vocabulary while Indonesian remains available where it serves product understanding or users.

## Non-goals

- Translating or changing the product requirements document, user research, image boards, or other source product artifacts.
- Rewriting Indonesian user-facing copy in the application.
- Changing any accepted architecture decision, product invariant, quality requirement, or task outcome while translating it.
- Creating a project-local skill.
- Committing, merging, or approving QUBA-001.

## Acceptance criteria

- [x] A repository language policy clearly defines English engineering artifacts and the allowed Indonesian product/user-facing exceptions.
- [x] `AGENTS.md`, architecture docs, accepted ADRs, engineering standards, task workflow/templates, existing task briefs, developer README content, and source-boundary docs are in English.
- [x] Existing commands, paths, identifiers, requirement IDs, domain semantics, statuses, and verification results retain their meaning.
- [x] `QUBA_PRD_MVP_v1.0.md`, product research/assets, and Indonesian application copy remain unchanged.
- [x] No project-local skill or unrelated runtime dependency is added.
- [x] Required Markdown links resolve, whitespace checks pass, and `npm run check` still passes.

## Context and sources

- User direction on 2026-08-27: engineering and agent-facing material should use English.
- Product source remains `QUBA_PRD_MVP_v1.0.md` in Indonesian.
- Related accepted decisions: ADR 0001-0005; translation must not amend them.
- Related tasks: QUBA-000 accepted Foundation Pack and QUBA-001 Expo scaffold currently in review.

## Scope ownership

- Agent contract and developer-facing root documentation.
- `docs/architecture/`, `docs/decisions/`, `docs/engineering/`, and `docs/tasks/` Markdown.
- `.github/pull_request_template.md` and source-layer README files.
- No code, product copy, product artifacts, dependencies, or generated native files.
- No parallel implementation task is active.

## Implementation plan

1. Add the language policy before translating dependent documents.
2. Translate the agent contract and developer-facing repository entry points.
3. Translate architecture, all Accepted ADRs, and engineering standards without semantic edits.
4. Translate the task workflow, templates, historical task briefs, and handoff records while preserving statuses/evidence.
5. Translate source-boundary README files and the pull-request template.
6. Audit terminology, relative links, protected Indonesian artifacts, and whitespace.
7. Run `npm run check`, record evidence, and leave the task ready for independent review.

## Risk and verification plan

| Risk | Evidence/test required |
|---|---|
| Translation changes an invariant or accepted decision | Side-by-side semantic audit against the original scope and PRD references |
| Product and engineering language become mixed unpredictably | Explicit policy plus inventory search for Indonesian engineering phrases |
| Product source or UI copy is translated accidentally | Git diff audit limited to declared engineering files; checksum/diff confirmation for protected files |
| Paths, commands, IDs, or links break | Preserve code spans verbatim, run relative-link and file-reference audits |
| Existing scaffold quality regresses | `npm run check` |

## Current status

Migration and independent review are complete. English is now canonical across the agent contract, developer entry points, architecture, all five Accepted ADRs, engineering standards, task workflow/templates/history, source-layer documentation, and the pull-request template. The Indonesian PRD and application copy were not modified. No runtime dependency or project-local skill was added.

## Decision log

| Time | Decision | Rationale |
|---|---|---|
| 2026-08-27 | English is canonical for engineering and agent-facing artifacts | Aligns code, tooling, external documentation, diagnostics, and agent terminology |
| 2026-08-27 | Indonesian remains canonical for the current PRD and Indonesian UI copy | Preserves product-team usability and user-language intent |
| 2026-08-27 | Use the current bootstrap branch with separate task commits | The repository began without a baseline commit; reconstructing the exact QUBA-001 index keeps task history separated without losing the final translation working tree |
| 2026-08-27 | Preserve product terms and identifiers instead of literal translation | Stable domain vocabulary, IDs, commands, paths, and accepted decision semantics take precedence over stylistic rewriting |
| 2026-08-27 | Require the language-policy file in the Foundation CI contract | `AGENTS.md` now depends on the policy, so CI must prevent it from disappearing |

## Changed files

| File/module | Change |
|---|---|
| `docs/engineering/language-policy.md` | Canonical language boundary, exceptions, translation rules, and review checklist |
| `AGENTS.md`, `README.md` | English agent contract and developer-facing repository entry point |
| `docs/architecture/`, `docs/decisions/` | English architecture overview, ADR process, and all five Accepted ADRs |
| `docs/engineering/` | English coding, testing, Definition of Done, and language policy |
| `docs/tasks/` | English task workflow, template, archive guidance, QUBA-000 history, QUBA-001 handoff, and QUBA-002 record |
| `.github/pull_request_template.md` | English review/handoff prompts |
| `.github/workflows/quality.yml` | Foundation contract now requires the language policy |
| `src/**/README.md` | English source-layer ownership and dependency boundaries |

## Verification evidence

| Command/device/scenario | Result | Notes |
|---|---|---|
| Engineering-language inventory search | Pass | No common Indonesian engineering phrases remained in the declared Markdown scope |
| Markdown relative-link audit | Pass | 25 Markdown files checked; 0 broken relative links |
| Core invariant/ADR status search | Pass | `event_id`, `config_version`, idempotency, linked/standalone, service-role, physical-device requirements, and 5/5 Accepted statuses remain present |
| `git diff --name-only -- QUBA_PRD_MVP_v1.0.md` | Pass | No working-tree change to the Indonesian PRD |
| Indonesian application copy inspection | Pass | `src/presentation/copy/id.ts` retains its pre-existing localized content |
| `git diff --check` and trailing-whitespace search | Pass | No whitespace errors found |
| YAML parse for `.github/workflows/quality.yml` | Pass | Workflow remains valid YAML after adding the required policy file |
| `npm run check` | Pass | Prettier, ESLint, strict TypeScript, Jest 1/1, and React Doctor with no issues |

## Review findings

- The project owner reviewed and accepted the engineering-language migration on 2026-08-27.
- No semantic drift or implementation changes were requested.

## Known issues and blockers

- QUBA-000, QUBA-001, and QUBA-002 share the accepted bootstrap history and are separated into task-specific commits. Future tasks use their own branch/worktree.
- The current scaffold screen contains pre-existing mixed-language development copy (`Engineering foundation` plus Indonesian text). QUBA-002 intentionally did not rewrite user-facing copy; the first product UI task should replace scaffold copy through the localization contract.

## Handoff / exact next step

Use the accepted English engineering vocabulary and start QUBA-003 from a dedicated branch/worktree.
