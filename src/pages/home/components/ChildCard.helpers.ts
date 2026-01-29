import { STORAGE_KEYS } from "@/constants/storage_keys";
import { storage } from "@/lib";
import type { Child, ScheduleStatus } from "@/types";
import { format } from "date-fns";

export const updateChildStatus = async (id: string, status: ScheduleStatus) => {
  const children = await storage.get<Child[]>(STORAGE_KEYS.CHILDREN);
  if (!children?.length) return;

  const todayName = format(new Date(), "eeee").toLowerCase();

  const updatedChildren = children.map((child) => {
    if (child.id !== id) return child;

    const updatedSchedule = child.schedule.map((item) => {
      if (item.day === todayName) {
        return { ...item, status };
      }
      return item;
    });

    return { ...child, schedule: updatedSchedule };
  });

  await storage.set(STORAGE_KEYS.CHILDREN, updatedChildren);

  return updatedChildren;
};
