import { initMidnightAlarm, initScheduleAlarm, MIDNIGHT_ALARM, SCHEDULE_ALARM } from "./alarms";
import { checkSchedule, initSettings, resetScheduleStatus } from "./helpers";
import { migrateReminders } from "./migration";
import { STORAGE_KEYS } from "@/constants";
import { storage } from "@/lib";

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === SCHEDULE_ALARM) {
    await checkSchedule();
  }
  if (alarm.name === MIDNIGHT_ALARM) {
    await resetScheduleStatus();
    chrome.action.setBadgeText({ text: "" });
  }
});

chrome.runtime.onInstalled.addListener(async (details) => {
  await initSettings();
  await initScheduleAlarm();
  await initMidnightAlarm();

  if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    await storage.set(STORAGE_KEYS.CHANGELOG_PENDING, true);

    const migrationNeeded = details.previousVersion === "2.1.0";
    if (migrationNeeded) {
      migrateReminders();
    }
  }
});

chrome.runtime.onStartup.addListener(async () => {
  await initScheduleAlarm();
  await initMidnightAlarm();
});
