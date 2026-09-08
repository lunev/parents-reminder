import { WEEKDAY_LABEL_KEYS } from "@/constants";
import type { WeekDay } from "@/types";

export const t = (key: string, substitutions?: string | string[]): string =>
  chrome.i18n.getMessage(key, substitutions) || key;

export const getWeekdayLabel = (day: WeekDay): string => t(WEEKDAY_LABEL_KEYS[day]);
