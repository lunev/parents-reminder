---
name: release
description: Cut a new release of the Parents Reminder Chrome extension - bump the version, build, package the zip, and prep the Chrome Web Store listing. Use when the user asks to release, ship, cut a version, or package the extension.
disable-model-invocation: true
---

Walk through cutting a release of this Chrome extension. Confirm each step with the user before moving to the next if anything is ambiguous (e.g. what the new version number should be).

1. Ask (if not already specified) what the new version number should be, or infer it from the nature of the changes since the last release (check `git log` since the last `vX.Y.Z` commit).
2. Bump `version` in `app/public/manifest.json` and `app/package.json` to match.
3. From `app/`, run `npm run release` (this runs `tsc -b && vite build`, then zips `app/build` into `chrome-webstore/releases/<name>-v<version>.zip`).
4. Verify the new zip exists in `chrome-webstore/releases/` with the expected version number.
5. If the release includes user-facing feature changes, ask whether `chrome-webstore/description.md` and/or `chrome-webstore/testing-instructions.md` need updating to reflect them (testing instructions must stay ≤ 500 characters, description ≤ 16,000 characters, both plain text since those are the actual Chrome Web Store field limits).
6. Commit the version bump and new release zip, following this repo's commit style (short, lowercase, imperative — e.g. `v3.1.0`), then ask before pushing.
7. Remind the user that publishing the new zip to the Chrome Web Store is a manual step through the developer dashboard — this skill does not do that part.
