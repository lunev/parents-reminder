import type { ChangelogEntry } from "@/types";

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "3.4.0",
    date: "2026-09-08",
    items: ["changelog340Localization"],
  },
  {
    version: "3.3.0",
    date: "2026-08-31",
    items: [
      "Fixed settings sometimes resetting to defaults after an update.",
      "Theme now always follows your system automatically; removed the manual light/dark toggle.",
    ],
  },
  {
    version: "3.2.0",
    date: "2026-08-28",
    items: [
      "Added a dismissible corner prompt and a Feedback icon in Settings, both linking to the Chrome Web Store support page.",
    ],
  },
  {
    version: "3.1.0",
    date: "2026-08-13",
    items: [
      "Refreshed dark mode with new background, card, and text colors.",
      "Fixed a lingering orange tint at the bottom of the home screen in dark mode.",
    ],
  },
  {
    version: "3.0.3",
    date: "2026-08-11",
    items: [
      "Widened the popup for a more comfortable layout.",
      "Removed page transition animations for snappier navigation.",
    ],
  },
  {
    version: "3.0.2",
    date: "2026-07-31",
    items: [
      "Added a what's new screen so you can see what changed after each update.",
      "The extension now follows your system's light/dark setting by default.",
      "Fixed the toolbar badge getting stuck after editing a notified child.",
    ],
  },
];
