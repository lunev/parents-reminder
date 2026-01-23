import type { WeekDay } from './enum';

export interface Reminder {
  id: string;
  title: string;
  photo: string;
  enabled: boolean;
  earlyReminder: number;
  schedule: Schedule[];
}

export interface Schedule {
  day: WeekDay;
  note: string;
  enabled: boolean;
}
