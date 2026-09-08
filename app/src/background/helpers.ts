import { getTtsLang } from "@/constants";
import { STORAGE_KEYS } from "@/constants/storage_keys";
import { storage, t } from "@/lib";
import { type Settings, type Child } from "@/types";
import { subMinutes, parse, format } from "date-fns";

export const calculateTriggerTime = (
  originalTime: string,
  reminder: Child["earlyReminder"],
): string => {
  if (!reminder.enabled || !reminder.minutes) return originalTime;

  const minutes = parseInt(reminder.minutes, 10);
  if (isNaN(minutes)) return originalTime;

  const date = parse(originalTime, "HH:mm", new Date());
  return format(subMinutes(date, minutes), "HH:mm");
};

export const checkSchedule = async () => {
  const [children, settings] = await Promise.all([
    storage.get<Child[]>(STORAGE_KEYS.CHILDREN),
    storage.get<Settings>(STORAGE_KEYS.SETTINGS),
  ]);

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

        sendNotification(child, s.time, settings);

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

const sendNotification = async (child: Child, time: string, settings: Settings | null) => {
  // Badge Notifications
  chrome.action.setBadgeText({ text: !settings?.anonymousMode ? child.name.slice(0, 5) : "." });
  chrome.action.setBadgeTextColor({ color: "#ffffff" });
  chrome.action.setBadgeBackgroundColor({ color: "#39BAFF" });

  // System Notification
  if (settings?.systemNotifications ?? true) {
    chrome.notifications.create(child.id, {
      type: "basic",
      iconUrl: child.photo || "icons/logo128x128.png",
      title: t("appName"),
      message: t("notificationMessage", [child.name, time]),
      priority: 2,
    });
  }

  // Voice Notification
  if (settings?.voiceNotifications ?? true) {
    // The English catalog's ttsAnnouncement keeps the brand name ("Parents Reminder: $1")
    // since it's spoken natively there; other locales omit it in their translation to
    // avoid a non-English voice mispronouncing the English brand name.
    const phrase = !settings?.anonymousMode
      ? t("ttsAnnouncement", [child.name])
      : t("ttsAnnouncementAnonymous");

    chrome.tts.speak(phrase, {
      lang: getTtsLang(),
      enqueue: true,
      rate: 0.9,
    });
  }
};
