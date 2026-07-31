import type { ScheduleStatus, WeekDay } from "./enum";

export interface Child {
  id: string;
  name: string;
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
  status: ScheduleStatus;
}

export interface EarlyReminder {
  enabled: boolean;
  minutes: string;
}
