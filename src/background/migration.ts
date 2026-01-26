import { DEFAULT_SETTINGS, STORAGE_KEYS, WEEK_DAYS } from "@/constants";
import { storage } from "@/lib";
import type { Child, Settings } from "@/types";

interface prevPreferences {
  voice: boolean;
  alerts: boolean;
  anonymous: boolean;
}

export type prevReminder = {
  id: string;
  name: string;
  notes: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  earlyReminder: number;
  status: "pending" | "notified";
  active: boolean;
};

export const migratePreferences = async () => {
  const prevPreferences = await storage.get<prevPreferences>("preferences");

  if (prevPreferences) {
    const migratedSettings: Settings = {
      voiceNotifications: prevPreferences.voice ?? true,
      systemNotifications: prevPreferences.alerts ?? true,
      anonymousMode: prevPreferences.anonymous ?? false,
      openWeatherAPIKey: "",
    };
    await storage.set(STORAGE_KEYS.SETTINGS, migratedSettings);
    await storage.remove("preferences");
  } else {
    await storage.set(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }
};

export const migrateReminders = async () => {
  const prevReminders = await storage.get<prevReminder[]>("reminders");

  if (!prevReminders || !Array.isArray(prevReminders)) return;

  const migratedChildren: Child[] = prevReminders.map((prevReminder) => {
    return {
      id: prevReminder.id,
      name: prevReminder.name,
      enabled: prevReminder.active ?? true,
      photo: "",
      schedule: WEEK_DAYS.map((day) => ({
        day: day,
        time: prevReminder[day] || "08:00",
        enabled: !!prevReminder[day],
        status: "pending",
        notes: "",
      })),
      earlyReminder: {
        enabled: !!prevReminder.earlyReminder,
        minutes: String(prevReminder.earlyReminder),
      },
    };
  });

  if (migratedChildren.length > 0) {
    await storage.set(STORAGE_KEYS.CHILDREN, migratedChildren);
    await storage.remove("reminders");
  }
};
