import type { Child } from "@/types";
import { storage } from "./storage";
import { STORAGE_KEYS } from "@/constants";
import { format } from "date-fns";

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
