import type { ChildStatus, WeekDay } from "./enum";

export interface Child {
  id: string;
  name: string;
  photo: string;
  enabled: boolean;
  earlyReminder: EarlyReminder;
  schedule: Schedule[];
  createdAt?: number;
  updatedAt?: number;
}

export interface Schedule {
  day: WeekDay;
  time: string;
  notes: string;
  enabled: boolean;
  status: ChildStatus;
}

export interface EarlyReminder {
  enabled: boolean;
  minutes: string;
}
