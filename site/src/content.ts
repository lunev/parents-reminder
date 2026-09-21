export type Content = {
  id: string;
  shortName: string;
  name: string;
  tagline: string;
  hero: { width: number; height: number };
  repoUrl: string;
  narrative: { heading: string; body: string[] };
  steps: { title: string; body: string }[];
  features: string[];
};

export const content: Content = {
  id: "honpenmjodkgcmmmiangohmegkobhmkh",
  shortName: "Parents Reminder",
  name: "Parents Reminder – School Pickup & Schedule Alerts",
  tagline: "The daily nudges that keep family life on track.",
  hero: { width: 1400, height: 560 },
  repoUrl: "https://github.com/lunev/parents-reminder",
  narrative: {
    heading: "For busy households with a lot to remember",
    body: [
      "Lunches, medications, pickups, permission slips — the mental load of running a family is enormous. Parents Reminder turns that load into a set of gentle, well-timed nudges right where you already work.",
      "Build a rhythm once and let it carry you through the week, with schedules flexible enough for real life.",
    ],
  },
  steps: [
    {
      title: "Add your reminders",
      body: "Write the reminders you need, from morning routines to evening wind-downs.",
    },
    {
      title: "Set the schedule",
      body: "Choose exact times and days — different for weekdays, weekends, or specific dates.",
    },
    {
      title: "Get nudged",
      body: "Receive clean, unobtrusive notifications exactly when you asked for them.",
    },
  ],
  features: [
    "Fully customizable daily and weekly schedules",
    "Per-day and per-date scheduling for real routines",
    "Gentle, unobtrusive notifications",
    "Snooze and repeat options",
    "Simple setup with no account required",
  ],
};
