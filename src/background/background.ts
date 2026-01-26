import { initMidnightAlarm, initScheduleAlarm, MIDNIGHT_ALARM, SCHEDULE_ALARM } from "./alarms";
import { checkSchedule, resetScheduleStatus } from "./helpers";

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
