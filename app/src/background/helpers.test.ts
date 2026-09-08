import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { calculateTriggerTime, checkSchedule, resetScheduleStatus } from "./helpers";
import type { Child, Settings } from "@/types";

const getMock = chrome.storage.local.get as Mock;
const setMock = chrome.storage.local.set as Mock;
const notificationsCreateMock = chrome.notifications.create as Mock;
const ttsSpeakMock = chrome.tts.speak as Mock;
const setBadgeTextMock = chrome.action.setBadgeText as Mock;

const buildChild = (overrides: Partial<Child> = {}): Child => ({
  id: "child-1",
  name: "Alice",
  photo: "",
  enabled: true,
  earlyReminder: { enabled: false, minutes: "" },
  schedule: [{ day: "monday", time: "08:00", notes: "", enabled: true, status: "pending" }],
  ...overrides,
});

const settings: Settings = {
  voiceNotifications: true,
  systemNotifications: true,
  anonymousMode: false,
};

describe("calculateTriggerTime", () => {
  it("returns the original time when the reminder is disabled", () => {
    expect(calculateTriggerTime("08:00", { enabled: false, minutes: "15" })).toBe("08:00");
  });

  it("returns the original time when minutes is empty", () => {
    expect(calculateTriggerTime("08:00", { enabled: true, minutes: "" })).toBe("08:00");
  });

  it("returns the original time when minutes is not a number", () => {
    expect(calculateTriggerTime("08:00", { enabled: true, minutes: "abc" })).toBe("08:00");
  });

  it("subtracts the early-reminder minutes from the original time", () => {
    expect(calculateTriggerTime("08:00", { enabled: true, minutes: "15" })).toBe("07:45");
  });

  it("handles crossing an hour boundary", () => {
    expect(calculateTriggerTime("08:05", { enabled: true, minutes: "10" })).toBe("07:55");
  });
});

describe("checkSchedule", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 31, 8, 0, 0)); // Monday, 08:00
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("notifies and marks the entry as notified when day and time match", async () => {
    const child = buildChild();
    getMock.mockResolvedValueOnce({ children: [child] }).mockResolvedValueOnce({ settings });

    await checkSchedule();

    expect(notificationsCreateMock).toHaveBeenCalledWith(
      child.id,
      expect.objectContaining({ message: "Alice, 08:00" }),
    );
    expect(setMock).toHaveBeenCalledWith({
      children: [{ ...child, schedule: [{ ...child.schedule[0], status: "notified" }] }],
    });
  });

  it("does not notify when the child is disabled", async () => {
    const child = buildChild({ enabled: false });
    getMock.mockResolvedValueOnce({ children: [child] }).mockResolvedValueOnce({ settings });

    await checkSchedule();

    expect(notificationsCreateMock).not.toHaveBeenCalled();
    expect(setMock).not.toHaveBeenCalled();
  });

  it("does not notify when the schedule entry is disabled", async () => {
    const child = buildChild({
      schedule: [{ day: "monday", time: "08:00", notes: "", enabled: false, status: "pending" }],
    });
    getMock.mockResolvedValueOnce({ children: [child] }).mockResolvedValueOnce({ settings });

    await checkSchedule();

    expect(notificationsCreateMock).not.toHaveBeenCalled();
  });

  it("does not notify when the schedule entry is for a different day", async () => {
    const child = buildChild({
      schedule: [{ day: "tuesday", time: "08:00", notes: "", enabled: true, status: "pending" }],
    });
    getMock.mockResolvedValueOnce({ children: [child] }).mockResolvedValueOnce({ settings });

    await checkSchedule();

    expect(notificationsCreateMock).not.toHaveBeenCalled();
  });

  it("does not notify when the current time doesn't match the schedule time", async () => {
    const child = buildChild({
      schedule: [{ day: "monday", time: "09:00", notes: "", enabled: true, status: "pending" }],
    });
    getMock.mockResolvedValueOnce({ children: [child] }).mockResolvedValueOnce({ settings });

    await checkSchedule();

    expect(notificationsCreateMock).not.toHaveBeenCalled();
  });

  it("does not re-notify a schedule entry that was already notified", async () => {
    const child = buildChild({
      schedule: [{ day: "monday", time: "08:00", notes: "", enabled: true, status: "notified" }],
    });
    getMock.mockResolvedValueOnce({ children: [child] }).mockResolvedValueOnce({ settings });

    await checkSchedule();

    expect(notificationsCreateMock).not.toHaveBeenCalled();
    expect(setMock).not.toHaveBeenCalled();
  });

  it("fires the trigger early when an early reminder is enabled", async () => {
    const child = buildChild({
      earlyReminder: { enabled: true, minutes: "15" },
      schedule: [{ day: "monday", time: "08:15", notes: "", enabled: true, status: "pending" }],
    });
    getMock.mockResolvedValueOnce({ children: [child] }).mockResolvedValueOnce({ settings });

    await checkSchedule();

    expect(notificationsCreateMock).toHaveBeenCalledWith(
      child.id,
      expect.objectContaining({ message: "Alice, 08:15" }),
    );
  });

  it("skips the system notification when systemNotifications is disabled", async () => {
    const child = buildChild();
    getMock
      .mockResolvedValueOnce({ children: [child] })
      .mockResolvedValueOnce({ settings: { ...settings, systemNotifications: false } });

    await checkSchedule();

    expect(notificationsCreateMock).not.toHaveBeenCalled();
    expect(ttsSpeakMock).toHaveBeenCalled();
  });

  it("skips the voice notification when voiceNotifications is disabled", async () => {
    const child = buildChild();
    getMock
      .mockResolvedValueOnce({ children: [child] })
      .mockResolvedValueOnce({ settings: { ...settings, voiceNotifications: false } });

    await checkSchedule();

    expect(ttsSpeakMock).not.toHaveBeenCalled();
    expect(notificationsCreateMock).toHaveBeenCalled();
  });

  it("uses a single-dot badge and speaks a translated phrase with no child name in anonymous mode", async () => {
    const child = buildChild();
    getMock
      .mockResolvedValueOnce({ children: [child] })
      .mockResolvedValueOnce({ settings: { ...settings, anonymousMode: true } });

    await checkSchedule();

    expect(setBadgeTextMock).toHaveBeenCalledWith({ text: "." });
    expect(ttsSpeakMock).toHaveBeenCalledTimes(1);
    expect(ttsSpeakMock).toHaveBeenCalledWith(
      "It's reminder time",
      expect.objectContaining({ lang: "en-US" }),
    );
  });

  it("speaks the app name and child's name together in a single call", async () => {
    const child = buildChild({ name: "Zofia" });
    getMock.mockResolvedValueOnce({ children: [child] }).mockResolvedValueOnce({ settings });

    await checkSchedule();

    expect(ttsSpeakMock).toHaveBeenCalledTimes(1);
    expect(ttsSpeakMock).toHaveBeenCalledWith(
      "Parents Reminder: Zofia",
      expect.objectContaining({ lang: "en-US" }),
    );
  });

  it("does nothing when there are no children", async () => {
    getMock.mockResolvedValueOnce({ children: [] }).mockResolvedValueOnce({ settings });

    await checkSchedule();

    expect(notificationsCreateMock).not.toHaveBeenCalled();
    expect(setMock).not.toHaveBeenCalled();
  });

  it("defaults notifications to on when no settings have ever been saved", async () => {
    const child = buildChild();
    getMock.mockResolvedValueOnce({ children: [child] }).mockResolvedValueOnce({});

    await checkSchedule();

    expect(notificationsCreateMock).toHaveBeenCalled();
    expect(ttsSpeakMock).toHaveBeenCalled();
  });
});

describe("resetScheduleStatus", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("resets every schedule entry back to pending regardless of prior status", async () => {
    const children: Child[] = [
      buildChild({
        schedule: [
          { day: "monday", time: "08:00", notes: "", enabled: true, status: "notified" },
          { day: "tuesday", time: "09:00", notes: "", enabled: true, status: "seen" },
        ],
      }),
    ];
    getMock.mockResolvedValueOnce({ children });

    await resetScheduleStatus();

    expect(setMock).toHaveBeenCalledWith({
      children: [
        expect.objectContaining({
          schedule: [
            expect.objectContaining({ status: "pending" }),
            expect.objectContaining({ status: "pending" }),
          ],
        }),
      ],
    });
  });

  it("does nothing when there are no children in storage", async () => {
    getMock.mockResolvedValueOnce({});

    await resetScheduleStatus();

    expect(setMock).not.toHaveBeenCalled();
  });
});
