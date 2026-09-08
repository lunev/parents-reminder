# Localize Parents Reminder (Spanish, Polish, French, German)

## Context

This started as a growth/discoverability audit: pulling the extension's Google Analytics showed the Chrome Web Store listing gets almost no organic search traffic, but does get visits from non-English-locale countries (Poland, Germany, France, Switzerland, Finland already show up in the visitor data). Localizing the store listing and in-app experience is a direct lever on that gap — not just SEO copy, but making the product itself usable for the audience that's already finding it.

The extension currently has **zero i18n** — no `_locales/`, no `chrome.i18n` usage, no i18n library, hardcoded English strings across ~20 files, hardcoded `en-US` for both TTS voice and date formatting. This plan takes it to full localization: Chrome Web Store listing (name/description), in-app UI, desktop notifications, spoken TTS reminders, and locale-aware date/weekday display, for **Spanish, Polish, French, German** (English remains the source/default).

## Key design decisions

1. **Mechanism: native `chrome.i18n`**, not a new library (react-i18next etc.). `_locales/<locale>/messages.json` + `default_locale` in the manifest serves both the manifest fields (`__MSG_key__`) and in-app runtime strings (`chrome.i18n.getMessage()`, usable from React pages and the background service worker alike). Trade-off: the displayed language follows the browser's UI language automatically — there's no in-app language switcher. That matches how Chrome extensions conventionally localize and avoids maintaining two parallel translation systems.

2. **Weekday matching logic is untouched.** `constants/week_days.ts`'s canonical English keys (`'monday'`...) and the background's `format(now, "EEEE").toLowerCase()` day-matching in `background/helpers.ts` stay exactly as they are today — this logic is already locale-independent (date-fns defaults to English with no `locale:` option passed) and must stay that way regardless of UI language. Only the **displayed** weekday label in `ScheduleField.tsx` gets translated, via a new sibling lookup table, never the storage/matching key itself.

3. **Brand name "Parents Reminder" is never translated or transliterated, anywhere** — manifest tagline, in-app header, notification title, and TTS. The non-anonymous spoken TTS phrase keeps saying **"Parents Reminder: {name}"** literally in English in every language, rather than being run through per-locale translation. This is implemented as a fixed literal in `background/helpers.ts` (not a `messages.json` key), specifically so a future translation pass can't accidentally "helpfully" translate it. The **anonymous-mode** TTS phrase ("It's reminder time") contains no brand name and no child name, so it *is* translated normally per language.

4. **TTS voice language** switches per language (`en-US`/`es-ES`/`pl-PL`/`fr-FR`/`de-DE`) via a small lookup keyed off `chrome.i18n.getUILanguage()`, defaulting to `en-US` for any browser language outside the 4 targets.

5. **Scope trim: `constants/changelog.ts` stays English-only.** Translating the full historical changelog is large, low-value effort; only the live app chrome/UI/settings/notifications/TTS gets translated.

6. Translations for ~45 short strings × 4 languages are produced by Claude as part of implementation. Caveat: machine-produced translations, especially spoken TTS phrasing, should ideally get a native-speaker pass before shipping — not a blocker, but don't treat the first pass as final copy.

7. Chrome Web Store dashboard listing (`chrome-webstore/description.txt`) stays out of this code plan — translating that is a separate manual dashboard task, not wired to `_locales`.

## Implementation steps

**1. Manifest + `_locales` scaffold**
- `app/public/manifest.json`: add `"default_locale": "en"`; `"name"` → `"__MSG_extName__"`, `"description"` → `"__MSG_extDescription__"`, `action.default_title` → `"__MSG_appName__"`.
- New `app/public/_locales/{en,es,pl,fr,de}/messages.json`. ~45 flat camelCase keys covering: `extName`, `extDescription`, `appName`, home empty-state, child card status labels, changelog "What's new in v$1" wrapper (not the entries themselves), add/edit child screens, child form labels, 7 `weekday*` display-label keys, notes placeholder, photo field labels, settings screen (3 toggle titles+descriptions, feedback, section heading), 404 page, floating/support popup text, and `notificationMessage` ("$1, $2" — name + time) + `ttsAnnouncementAnonymous`. The brand-name TTS phrase is NOT a messages.json key (see decision 3).

**2. Wrapper + locale helpers**
- New `app/src/lib/i18n.ts`: `t(key, substitutions?)` wrapping `chrome.i18n.getMessage`, falling back to the raw key on a miss (so a typo'd key shows visibly instead of blank UI).
- New `app/src/constants/locales.ts`: `getTtsLang()` reading `chrome.i18n.getUILanguage()` through the 5-entry lookup table.
- `app/src/constants/week_days.ts`: add sibling `WEEKDAY_LABEL_KEYS: Record<WeekDay, string>` mapping each canonical key to its `weekday*` message key. Everything else in this file is untouched.
- Remove `app/src/config/app.ts`'s `AppConfig` entirely — both its fields (`name`, `language`) are superseded by `t("appName")` and `getTtsLang()`.

**3. Wire UI components** (replace literal strings with `t(...)` calls) — `HomeHeader.tsx`, `EmptyState.tsx`, `ChildCard.tsx`, `Changelog.tsx`, `ChildAdd.tsx`, `ChildEdit.tsx`, `ChildForm.tsx`, `ScheduleField.tsx` (also drops the hand-rolled `capitalize` CSS/day-string logic in favor of `getWeekdayLabel(day)`), `PhotoField.tsx`, `Settings.tsx`, `NotFound.tsx`, `floating-popup.tsx`, `support-popup.tsx`. `CurrentDateTime.tsx`: replace the two hardcoded `"en-US"` args to `toLocaleDateString`/`toLocaleTimeString` with `undefined` so date/time display follows the real browser locale (independent of the message catalog).

**4. Background script** (`app/src/background/helpers.ts`)
- Notification: `title: t("appName")`, `message: t("notificationMessage", [child.name, time])`.
- TTS: non-anonymous → the fixed literal `` `Parents Reminder: ${child.name}` `` (not translated); anonymous → `t("ttsAnnouncementAnonymous")`. `lang: getTtsLang()` in both cases.
- `checkSchedule`'s weekday matching stays byte-for-byte as-is (decision 2). `alarms.ts` is untouched.

**5. `app/scripts/release.js` fix (easy to miss)** — it reads `manifest.name` raw off disk to build the release zip filename. Once that field becomes the literal string `"__MSG_extName__"` (only resolved by Chrome at install time, not on disk), the script needs to detect the `__MSG_(\w+)__` pattern and resolve it by reading `_locales/en/messages.json`, falling back to the raw field otherwise — so release zip names don't silently become `msg-extname-v3.x.x.zip`.

**6. Test updates**
- `app/src/test/setup.ts`: add a `chrome.i18n` mock (`getMessage` with `$1`/`$2` substitution over a small English lookup table, `getUILanguage` returning `"en-US"`).
- `app/src/background/helpers.test.ts`: notification-message assertion is unchanged (template reproduces `"Alice, 08:00"`). The TTS test stays asserting the literal `"Parents Reminder: Zofia"` string (now sourced from the fixed literal, not a mock lookup) with `lang: "en-US"`. Tighten the anonymous-mode assertion to check the actual call (`"It's reminder time"`, `lang: "en-US"`) rather than the current vacuous `not.toHaveBeenCalledWith(..., {})`.
- `background.test.ts` and other `*.test.ts` files need no changes.

**7. Verification**
- Automated: `npm test`, `npx tsc -b`, `npm run lint`, `npm run build` (from `app/`) — confirms `_locales` gets copied verbatim into `app/build` and manifest resolves correctly.
- Manual, real Chrome (required — `chrome.i18n`/`chrome.tts` don't exist outside a loaded extension context): `npm run watch` in the background, load `app/build` unpacked, then for each of es/pl/fr/de — switch Chrome's UI language at `chrome://settings/languages` ("Display Google Chrome in this language" + relaunch), walk every screen, trigger a real alarm to confirm notification body + spoken TTS, and check `chrome.tts.getVoices()` in the service-worker console to confirm an installed voice exists for that language. Also test one unsupported browser language (e.g. Italian) to confirm fallback to English/`en-US`. Re-run `npm run release` once to confirm the zip filename still comes out correctly (step 5).
- Visual QA pass: check that longer translated strings don't overflow `ScheduleField.tsx`'s label column or the Settings cards.

## Critical files
- `app/public/manifest.json`, `app/public/_locales/{en,es,pl,fr,de}/messages.json`
- `app/src/lib/i18n.ts`, `app/src/constants/locales.ts`, `app/src/constants/week_days.ts`
- `app/src/background/helpers.ts`, `app/src/background/helpers.test.ts`
- `app/scripts/release.js`
- `app/src/test/setup.ts`
- `app/src/config/app.ts` (removed), `app/src/config/index.ts` (barrel updated)
- All files listed under Step 3 above (UI string wiring)
