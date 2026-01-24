import type { WeekDay } from "./enum";

export interface Reminder {
  id: string;
  title: string;
  photo: string;
  enabled: boolean;
  earlyReminder: EarlyReminder;
  schedule: Schedule[];
}

export interface Schedule {
  day: WeekDay;
  time: string;
  notes: string;
  enabled: boolean;
}

export interface EarlyReminder {
  enabled: boolean;
  minutes: string;
}
