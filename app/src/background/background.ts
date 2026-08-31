import { initMidnightAlarm, initScheduleAlarm, MIDNIGHT_ALARM, SCHEDULE_ALARM } from "./alarms";
import { checkSchedule, resetScheduleStatus } from "./helpers";
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
  await initScheduleAlarm();
  await initMidnightAlarm();

  if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    await storage.set(STORAGE_KEYS.CHANGELOG_PENDING, true);
  }
});

chrome.runtime.onStartup.addListener(async () => {
  await initScheduleAlarm();
  await initMidnightAlarm();
});
