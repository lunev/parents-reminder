import type { WeekDay } from '@/types';

export const WEEK_DAYS: WeekDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

// Display-only labels for WEEK_DAYS — never used for schedule storage/matching,
// which must stay locale-independent (see background/helpers.ts).
export const WEEKDAY_LABEL_KEYS: Record<WeekDay, string> = {
  monday: 'weekdayMonday',
  tuesday: 'weekdayTuesday',
  wednesday: 'weekdayWednesday',
  thursday: 'weekdayThursday',
  friday: 'weekdayFriday',
  saturday: 'weekdaySaturday',
  sunday: 'weekdaySunday',
};
