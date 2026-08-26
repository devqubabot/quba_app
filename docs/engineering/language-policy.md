# Engineering Language Policy

English is the canonical language for engineering and agent-facing artifacts in the Quba repository. The purpose is to keep code, tooling, external technical references, diagnostics, and agent instructions aligned around one stable vocabulary.

## Use English for

- `AGENTS.md` and other agent instructions.
- Architecture documents, ADRs, engineering standards, task briefs, handoffs, and pull-request content.
- File, module, type, function, variable, test, event, and internal error-code names.
- Code comments, configuration, CI labels, commit messages, and developer-facing diagnostics.
- Database, API, BLE protocol, analytics, and infrastructure contracts when they are introduced.

## Approved non-English contexts

- `QUBA_PRD_MVP_v1.0.md` remains in Indonesian as the current Product source of truth.
- User research, interview notes, design sources, and original business artifacts may remain in the language in which they were produced.
- Indonesian application copy remains Indonesian and must stay separated from logic for localization.
- Religious or culturally specific terms may retain their established form when translation would reduce precision. Define the term in English when it first enters a technical contract.
- Team conversation may use the language most effective for the participants; durable engineering outcomes must still be recorded in English.

## Translation and terminology rules

- A translation must preserve requirement IDs, commands, paths, identifiers, statuses, decision outcomes, and product semantics.
- Translating an Accepted ADR does not authorize changing its decision. Use a new ADR or reviewed amendment for semantic changes.
- Prefer one canonical English domain term. Record aliases only when required to map Indonesian product language to a technical model.
- Do not translate user-facing copy merely because its surrounding implementation is in English.
- Avoid sentence fragments assembled in code; localization resources own complete user-facing messages.

## Review checklist

- Engineering prose and code terminology are English.
- Product artifacts and localized user copy retain their intended language.
- Technical terms match the architecture and Accepted ADRs.
- No invariant, acceptance criterion, verification result, command, path, or identifier changed meaning during translation.
