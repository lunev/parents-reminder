import { isBefore, parse } from "date-fns";

export const isTimePassed = (timeStr: string): boolean => {
  const now = new Date();
  const scheduledTime = parse(timeStr, "HH:mm", new Date());
  return isBefore(scheduledTime, now);
};
