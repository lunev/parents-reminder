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

export const updateBadgeText = async () => {
  const children = await storage.get<Child[]>(STORAGE_KEYS.CHILDREN);
  if (!children) return;

  const today = format(new Date(), "eeee").toLowerCase();

  const notifiedChildren = children.filter((child) =>
    child.schedule.some((s) => s.day === today && s.status === "notified"),
  );

  let badgeText = "";
  if (notifiedChildren.length > 0) {
    const lastChild = notifiedChildren[notifiedChildren.length - 1];
    badgeText = lastChild.name.slice(0, 5);
  }

  chrome.action.setBadgeText({ text: badgeText });
};
