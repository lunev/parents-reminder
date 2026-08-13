<p align="center">
  <img src="app/public/icons/logo128x128.png" width="96" alt="Parents Reminder logo">
</p>

<h1 align="center">Parents Reminder</h1>

<p align="center">
  A Chrome extension that keeps track of your children's school schedules and reminds you with desktop notifications and spoken (text-to-speech) voice alerts.
</p>

## Features

- **Multiple children** — each with their own weekly schedule.
- **Per-day reminder times** — set a specific time for every day of the week.
- **Early reminders** — get an early heads-up (e.g. 15 minutes before) so you have time to prepare.
- **Desktop notifications** — appear right when you need them.
- **Voice reminders** — spoken text-to-speech alerts for when you can't look at the screen.
- **Toolbar badge** — shows at a glance which child needs your attention.
- **Anonymous mode** — hides names in notifications and the badge, for privacy in public or shared spaces.
- **Light, dark, and system theme** support.

Everything runs locally — schedules and settings are stored in the browser via `chrome.storage`, and nothing is sent to any external server.

## Usage

1. Install the extension and pin it to the Chrome toolbar.
2. Click the extension icon to open the popup.
3. Click "Add child", enter a name, and set a weekly schedule with a reminder time for each day.
4. Save. At the scheduled time, a desktop notification appears, and a voice reminder is spoken (unless muted).
5. Enable anonymous mode in settings if you want notifications and the badge to omit names.

## Development

Manifest V3 extension (popup + background service worker) built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

```sh
cd app
npm install
npm run dev     # Vite dev server
npm run watch   # dev-mode build with --watch, for loading as an unpacked extension
```

Load it unpacked in Chrome: `npm run build`, then go to `chrome://extensions` → enable Developer mode → **Load unpacked** → select `app/build`.

| Command (run from `app/`) | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run watch` | Dev-mode build with `--watch` |
| `npm run build` | Typecheck and build to `app/build` |
| `npm run release` | Build, then zip `app/build` into `chrome-webstore/releases/<name>-v<version>.zip` |
| `npm run prev [version]` | Restore a previous release zip into `app/build` for comparison/debugging |
| `npm run lint` / `npm run format` | Lint / format with ESLint / Prettier |

GitHub Actions (`.github/workflows/ci.yml`) runs typecheck, lint, and build on every push/PR to `main`.

See [`CLAUDE.md`](CLAUDE.md) for repo layout and other conventions.

## Compatibility

Google Chrome on Windows and Mac.

## Changelog

All notable user-facing changes are listed here. Internal work like dependency upgrades, refactors, and build tooling is left out.

### 3.0.3 - 2026-08-11
- Widened the popup for a more comfortable layout.
- Removed page transition animations for snappier navigation.

### 3.0.2 - 2026-07-31
- Added a what's new screen so you can see what changed after each update.
- The extension now follows your system's light/dark setting by default.
- Fixed the toolbar badge getting stuck after editing a notified child.
