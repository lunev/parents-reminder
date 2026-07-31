export const SCHEDULE_ALARM = "ScheduleAlarm";
export const MIDNIGHT_ALARM = "MidnightAlarm";

export const initScheduleAlarm = async () => {
  const alarm = await chrome.alarms.get(SCHEDULE_ALARM);

  if (!alarm) {
    chrome.alarms.create(SCHEDULE_ALARM, {
      periodInMinutes: 1 / 4,
    });
  }
};

export const initMidnightAlarm = async () => {
  const alarm = await chrome.alarms.get(MIDNIGHT_ALARM);

  if (!alarm) {
    const now = new Date();
    const midnight = new Date();

    midnight.setHours(24, 0, 0, 0);

    const msToMidnight = midnight.getTime() - now.getTime();

    chrome.alarms.create(MIDNIGHT_ALARM, {
      when: Date.now() + msToMidnight,
      periodInMinutes: 1440,
    });
  }
};
