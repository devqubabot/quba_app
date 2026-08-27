# Quba App

Quba is the companion application for the Quba robot. It helps users plan habits, run low-distraction activities, synchronize offline robot events, and reflect on their progress.

This repository contains the Quba App source code and the engineering governance that must evolve with the same codebase version.

## Status

The engineering scaffold is available on Expo SDK 57 with Expo Router, Development Builds, strict TypeScript, and executable quality gates. Product features have not yet been implemented.

## Sources of truth

Use project context in this order:

1. [Product Requirements Document](./QUBA_PRD_MVP_v1.0.md) for product requirements and acceptance criteria. The current PRD is intentionally maintained in Indonesian.
2. [AGENTS.md](./AGENTS.md) for mandatory rules for humans and coding agents.
3. [Architecture overview](./docs/architecture/overview.md) for system boundaries and dependency direction.
4. [Architecture Decision Records](./docs/decisions/README.md) for accepted technical decisions.
5. [Task briefs](./docs/tasks/README.md) for active work scope and status.

If these documents conflict, stop the affected implementation and resolve the conflict through an explicit PRD or ADR change.

## Initial stack decisions

- React Native with Expo Development Builds and TypeScript.
- Expo Router for application navigation.
- SQLite as the application's local operational store.
- Supabase for authentication and the cloud backend.
- BLE behind an adapter boundary; the initial implementation is expected to use `react-native-ble-plx` and may be replaced without changing domain or UI code.
- Local-first architecture with append-only activity events and idempotent synchronization.

## Workflow

Every change requires a task brief, acceptance criteria, verification, and a handoff another agent can understand. See the [task workflow](./docs/tasks/README.md), [Definition of Done](./docs/engineering/definition-of-done.md), and [engineering language policy](./docs/engineering/language-policy.md).

## Install Quba Devkit for Codex

[Quba Devkit](https://github.com/devqubabot/quba-devkit) is a separate, skills-only Codex plugin that provides reusable Quba engineering workflows such as `$quba-review`. It is not an npm package and does not become an application dependency.

From this repository's root, install it from the included **Quba App** marketplace:

```bash
codex plugin marketplace add .
codex plugin add quba-devkit@quba-app
```

Alternatively, restart the ChatGPT desktop app, open **Plugins**, select the **Quba App** marketplace, and install **Quba Devkit**. The marketplace downloads the plugin directly from its GitHub repository; private-repository access requires matching GitHub credentials.

After installation, start a new Codex task and invoke `$quba-review` to verify that the bundled skill is available.

See the official OpenAI documentation for [local plugin marketplaces](https://developers.openai.com/plugins/build/plugins#install-a-local-plugin-manually) and [using installed plugins](https://developers.openai.com/codex/plugins/#install-and-use-a-plugin).

## Local development

Requirements: Node.js 22.13 or newer within major version 22, npm, and the native toolchain for the target platform.

```bash
npm ci
npm run ios
# or
npm run android
```

Both native commands run Expo prebuild when generated native folders are absent, then compile and install a development build. After the build is installed, start Metro with `npm start`. Expo Go is not a valid verification runtime for Quba native flows.

Run every deterministic local quality gate with:

```bash
npm run check
```

For a compatibility check that uses Expo and React Native Directory metadata and requires network access, run `npm run expo:doctor` explicitly.

EAS Build, signing credentials, BLE, SQLite, and Supabase are intentionally not configured in this scaffold. Each requires a dedicated task and dependency review.
