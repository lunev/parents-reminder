# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Chrome Extension (Manifest V3), "Parents Reminder" — school schedule alerts with voice (TTS) and desktop notifications. React 19 + TypeScript + Vite 7, Tailwind CSS 4, shadcn/ui ("new-york" style) components under `src/components/ui`. Permissions: `storage`, `alarms`, `tts`, `notifications`. No environment variables are used — state lives in `chrome.storage` via `src/lib/storage.ts`.

## Repo layout

- `app/` — the entire buildable project (package.json, src/, public/, vite/tsconfig/eslint/prettier config, scripts/). Run all npm commands from inside `app/`.
- `design/` — Chrome Web Store promo assets (PNG/PSD), not part of the build.
- `chrome-webstore/` — `releases/` (packaged extension zips) plus `description.txt` and `testing-instructions.txt` starter drafts for the store listing. Store field limits: description ≤ 16,000 characters, testing instructions ≤ 500 characters, plain text only.

## Commands (run from `app/`)

- `npm run dev` — Vite dev server.
- `npm run build` — `tsc -b && vite build`, outputs to `app/build` (the unpacked-extension folder loaded via `chrome://extensions`).
- `npm run watch` — dev-mode build with `--watch`.
- **When iterating on changes you want to see live, start `npm run watch` (or `npm run dev` for UI-only work) in the background for the session** — don't rely on a one-off `npm run build` at the end, since its output goes stale the moment you make another edit.
- `npm run lint` — `eslint .`
- `npm run format` — `prettier --write .`
- `npm run release` — builds, then zips `app/build` into `chrome-webstore/releases/<name>-v<version>.zip` (version/name read from `app/public/manifest.json`).

`npm run test` runs the Vitest suite (`src/**/*.test.ts(x)`), with `chrome.*` APIs mocked in `src/test/setup.ts`. CI (`.github/workflows/ci.yml`) runs typecheck, lint, build, and vitest on push/PR to `main`, all from `app/`.

## Code style

- Prettier (`.prettierrc.json`): double quotes, `printWidth: 100`, 2-space indent, trailing commas everywhere.
- ESLint flat config (`eslint.config.js`), TypeScript strict mode.
- Import alias `@/*` → `app/src/*` (configured in `vite.config.ts`, `tsconfig.json`, and `components.json`).
- New shadcn/ui primitives go in `src/components/ui`; the shadcn CLI must be run from inside `app/` since `components.json` lives there.

## Conventions

- Commit messages are short, lowercase, imperative, no conventional-commit prefixes (e.g. `fix badge text after deleting notified child`). Version-bump commits are bare `vX.Y.Z`.
- Chrome Web Store publishing is fully manual through the developer dashboard — no automated submission tooling.
