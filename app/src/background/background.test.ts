import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("./alarms", () => ({
  SCHEDULE_ALARM: "ScheduleAlarm",
  MIDNIGHT_ALARM: "MidnightAlarm",
  initScheduleAlarm: vi.fn(),
  initMidnightAlarm: vi.fn(),
}));

vi.mock("./helpers", () => ({
  checkSchedule: vi.fn(),
  resetScheduleStatus: vi.fn(),
}));

import { initScheduleAlarm, initMidnightAlarm } from "./alarms";
import { checkSchedule, resetScheduleStatus } from "./helpers";
import { STORAGE_KEYS } from "@/constants/storage_keys";

type OnAlarmListener = Parameters<typeof chrome.alarms.onAlarm.addListener>[0];
type OnInstalledListener = Parameters<typeof chrome.runtime.onInstalled.addListener>[0];
type OnStartupListener = Parameters<typeof chrome.runtime.onStartup.addListener>[0];

const onAlarmAddListener = chrome.alarms.onAlarm.addListener as Mock;
const onInstalledAddListener = chrome.runtime.onInstalled.addListener as Mock;
const onStartupAddListener = chrome.runtime.onStartup.addListener as Mock;
const setBadgeTextMock = chrome.action.setBadgeText as Mock;
const setMock = chrome.storage.local.set as Mock;

(chrome.runtime as unknown as { OnInstalledReason: Record<string, string> }).OnInstalledReason = {
  INSTALL: "install",
  UPDATE: "update",
  CHROME_UPDATE: "chrome_update",
  SHARED_MODULE_UPDATE: "shared_module_update",
};

let onAlarm: OnAlarmListener;
let onInstalled: OnInstalledListener;
let onStartup: OnStartupListener;

describe("background wiring", () => {
  beforeEach(async () => {
    vi.resetModules();
    await import("./background");
    onAlarm = onAlarmAddListener.mock.calls[0][0] as OnAlarmListener;
    onInstalled = onInstalledAddListener.mock.calls[0][0] as OnInstalledListener;
    onStartup = onStartupAddListener.mock.calls[0][0] as OnStartupListener;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("runs checkSchedule when the schedule alarm fires", async () => {
    await onAlarm({ name: "ScheduleAlarm" } as chrome.alarms.Alarm);

    expect(checkSchedule).toHaveBeenCalled();
    expect(resetScheduleStatus).not.toHaveBeenCalled();
  });

  it("resets schedule status and clears the badge when the midnight alarm fires", async () => {
    await onAlarm({ name: "MidnightAlarm" } as chrome.alarms.Alarm);

    expect(resetScheduleStatus).toHaveBeenCalled();
    expect(setBadgeTextMock).toHaveBeenCalledWith({ text: "" });
    expect(checkSchedule).not.toHaveBeenCalled();
  });

  it("ignores alarms it doesn't recognize", async () => {
    await onAlarm({ name: "SomeOtherAlarm" } as chrome.alarms.Alarm);

    expect(checkSchedule).not.toHaveBeenCalled();
    expect(resetScheduleStatus).not.toHaveBeenCalled();
  });

  it("initializes both alarms on install", async () => {
    await onInstalled({ reason: "install" } as chrome.runtime.InstalledDetails);

    expect(initScheduleAlarm).toHaveBeenCalled();
    expect(initMidnightAlarm).toHaveBeenCalled();
    expect(setMock).not.toHaveBeenCalledWith({ [STORAGE_KEYS.CHANGELOG_PENDING]: true });
  });

  it("flags a pending changelog on update", async () => {
    await onInstalled({
      reason: "update",
      previousVersion: "3.0.0",
    } as chrome.runtime.InstalledDetails);

    expect(setMock).toHaveBeenCalledWith({ [STORAGE_KEYS.CHANGELOG_PENDING]: true });
  });

  it("re-initializes both alarms on browser startup", async () => {
    await onStartup();

    expect(initScheduleAlarm).toHaveBeenCalled();
    expect(initMidnightAlarm).toHaveBeenCalled();
  });
});
