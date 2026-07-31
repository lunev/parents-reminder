# Parents Reminder

A Chrome extension (Manifest V3) that keeps track of your children's school schedules and reminds you with desktop notifications and spoken (text-to-speech) voice alerts.

## Repo layout

- `app/` — the extension itself: React 19 + TypeScript + Vite 7, Tailwind CSS 4, shadcn/ui components. All commands below run from here.
- `design/` — Chrome Web Store promo assets (PNG/PSD).
- `chrome-webstore/` — packaged release zips (`releases/`) plus the store listing description and testing instructions.

## Development

```bash
cd app
npm install
npm run dev      # Vite dev server
npm run watch     # dev-mode build with --watch, for loading as an unpacked extension
```

To try it in Chrome: `npm run build`, then go to `chrome://extensions`, enable Developer mode, and "Load unpacked" pointing at `app/build`.

## Commands (from `app/`)

| Command | What it does |
|---|---|
| `npm run build` | Typechecks and builds to `app/build` |
| `npm run lint` | `eslint .` |
| `npm run format` | `prettier --write .` |
| `npm run release` | Builds, then zips `app/build` into `chrome-webstore/releases/<name>-v<version>.zip` |
| `npm run prev [version]` | Restores a previous release zip into `app/build` for comparison/debugging (wipes `app/build` first) |

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs typecheck, lint, and build on every push/PR to `main`.

## Permissions

`storage`, `alarms`, `tts`, `notifications` — see `app/public/manifest.json`. All data stays local in `chrome.storage`; no external servers or environment variables are involved.
