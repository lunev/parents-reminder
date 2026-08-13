# Chrome Web Store Compliance

Tracking file for Chrome Web Store submission requirements: permission justifications (single-purpose policy) and privacy-relevant data handling notes. Keep this in sync whenever `app/public/manifest.json` permissions change.

## Single Purpose

Parents Reminder keeps track of a user's children's weekly school schedules and reminds them, at the times they configure, with a desktop notification and an optional spoken (text-to-speech) voice alert. Every permission below exists to support that one purpose.

## Permission Justifications

Current permissions declared in `app/public/manifest.json`: `["storage", "alarms", "tts", "notifications"]`. No `host_permissions` are declared.

### `storage`

Used to persist the user's children, their weekly schedules, reminder-lead-time settings, anonymous-mode preference, and theme choice locally via `chrome.storage.local`, so this configuration survives popup close and browser restart. Accessed in `app/src/lib/storage.ts` and `app/src/hooks/useChildren.ts`. No alternative to `storage` exists for this — it is the only API for persisting extension state.

### `alarms`

Used to schedule the background checks that fire reminders at the times the user configured, and a daily midnight alarm that rolls schedules over to the new day. `chrome.alarms` is the only API for scheduling work in an MV3 service worker, which does not stay alive on a plain `setTimeout`/`setInterval`. Usage: `chrome.alarms.create()`/`get()` in `app/src/background/alarms.ts`, and the `chrome.alarms.onAlarm` listener in `app/src/background/background.ts` that checks the current schedule and triggers a reminder when due.

### `tts`

Used to optionally read a reminder out loud (e.g. "Parents Reminder: Emma") when a scheduled alert fires, so a parent doesn't need to be looking at the screen. Usage: `chrome.tts.speak()` in `app/src/background/helpers.ts`, called only as part of firing a reminder the user already scheduled.

### `notifications`

Used to show a desktop notification when a reminder fires, naming the child (unless anonymous mode is on) so the user knows which child's schedule triggered it. Usage: `chrome.notifications.create()` in `app/src/background/helpers.ts`.

## Privacy-Relevant Data Handling

- **Data collected:** user-authored child names, weekly schedules, reminder-lead-time settings, anonymous-mode toggle, and theme preference. No browsing history, page content, form data, or credentials are read or stored.
- **Where it's stored:** locally in the browser via `chrome.storage.local`. This data is not synced across devices.
- **External transmission:** none. The codebase makes no `fetch`/`XMLHttpRequest`/network calls of any kind, and no `host_permissions` are declared. No data is sent to the developer or any third party.
- **Notification/voice content:** a child's name is included in the notification and spoken alert unless anonymous mode is enabled, in which case both are shown without the name. This content is generated and displayed entirely on-device.
