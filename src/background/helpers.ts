import { AppConfig } from "@/config";
import { STORAGE_KEYS } from "@/constants/storage_keys";
import { storage } from "@/lib";
import type { Child } from "@/types";
import { subMinutes, parse, format } from "date-fns";

const calculateTriggerTime = (originalTime: string, reminder: Child["earlyReminder"]): string => {
  if (!reminder.enabled || !reminder.minutes) return originalTime;

  const minutes = parseInt(reminder.minutes, 10);
  if (isNaN(minutes)) return originalTime;

  const date = parse(originalTime, "HH:mm", new Date());
  return format(subMinutes(date, minutes), "HH:mm");
};

export const checkSchedule = async () => {
  const children = await storage.get<Child[]>(STORAGE_KEYS.CHILDREN);

  if (!children?.length) return;

  const now = new Date();
  const todayName = format(now, "EEEE").toLowerCase();
  const currentTime = format(now, "HH:mm");

  let hasChanges = false;

  const updatedChildren = children.map((child) => {
    if (!child.enabled) return child;

    const newSchedule = child.schedule.map((s) => {
      if (!child.enabled || !s.enabled || !s.time) return s;

      const triggerTime = calculateTriggerTime(s.time, child.earlyReminder);

      if (s.day === todayName && s.status === "pending" && triggerTime === currentTime) {
        hasChanges = true;

        sendNotification(child, s.time);

        return { ...s, status: "notified" };
      }
      return s;
    });

    return { ...child, schedule: newSchedule };
  });

  if (hasChanges) {
    await storage.set(STORAGE_KEYS.CHILDREN, updatedChildren);
  }
};

export const resetScheduleStatus = async () => {
  const children = await storage.get<Child[]>(STORAGE_KEYS.CHILDREN);
  if (children) {
    const resetChildren = children.map((child) => ({
      ...child,
      schedule: child.schedule.map((s) => ({ ...s, status: "pending" })),
    }));
    await storage.set(STORAGE_KEYS.CHILDREN, resetChildren);
  }
};

const sendNotification = (child: Child, time: string) => {
  // Chrome Notification
  chrome.notifications.create(child.id, {
    type: "basic",
    iconUrl: "icons/logo128x128.png",
    title: AppConfig.name,
    message: `${child.name}, ${time}`,
    priority: 2,
  });

  // Badge Notification
  chrome.action.setBadgeText({ text: child.name.slice(0, 5) });
  chrome.action.setBadgeTextColor({ color: "#ffffff" });
  chrome.action.setBadgeBackgroundColor({ color: "#39BAFF" });

  // Voice Notification
  chrome.tts.speak(`${AppConfig.name}: ${child.name}`, {
    lang: "en-US",
    enqueue: true,
    rate: 0.8,
    pitch: 0.8,
    volume: 1,
  });
};
