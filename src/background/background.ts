import { initMidnightAlarm, initScheduleAlarm, MIDNIGHT_ALARM, SCHEDULE_ALARM } from "./alarms";
import { checkSchedule, resetScheduleStatus } from "./helpers";
import { migratePreferences, migrateReminders } from "./migration";

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === SCHEDULE_ALARM) {
    await checkSchedule();
  }
  if (alarm.name === MIDNIGHT_ALARM) {
    await resetScheduleStatus();
    chrome.action.setBadgeText({ text: "" });
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  await initScheduleAlarm();
  await initMidnightAlarm();
});

chrome.runtime.onStartup.addListener(async () => {
  await initScheduleAlarm();
  await initMidnightAlarm();
});

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    const migrationNeeded = details.previousVersion === "2.1.0";
    if (migrationNeeded) {
      migratePreferences();
      migrateReminders();
    }
  }
});
