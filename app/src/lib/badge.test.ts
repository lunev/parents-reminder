import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { updateBadgeText } from "./badge";
import { STORAGE_KEYS } from "@/constants/storage_keys";
import type { Child } from "@/types";

const getMock = chrome.storage.local.get as Mock;
const setBadgeTextMock = chrome.action.setBadgeText as Mock;

const buildChild = (overrides: Partial<Child> = {}): Child => ({
  id: "child-1",
  name: "Alice",
  photo: "",
  enabled: true,
  earlyReminder: { enabled: false, minutes: "" },
  schedule: [{ day: "monday", time: "08:00", notes: "", enabled: true, status: "notified" }],
  ...overrides,
});

describe("updateBadgeText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 31, 8, 0, 0)); // Monday
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("shows the notified child's name, truncated to 5 characters", async () => {
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHILDREN]: [buildChild({ name: "Alexandra" })] });

    await updateBadgeText();

    expect(setBadgeTextMock).toHaveBeenCalledWith({ text: "Alexa" });
  });

  it("shows the last notified child when multiple are notified today", async () => {
    const first = buildChild({ id: "1", name: "Alice" });
    const second = buildChild({ id: "2", name: "Bob" });
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHILDREN]: [first, second] });

    await updateBadgeText();

    expect(setBadgeTextMock).toHaveBeenCalledWith({ text: "Bob" });
  });

  it("ignores schedule entries for other days", async () => {
    const child = buildChild({
      schedule: [{ day: "tuesday", time: "08:00", notes: "", enabled: true, status: "notified" }],
    });
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHILDREN]: [child] });

    await updateBadgeText();

    expect(setBadgeTextMock).toHaveBeenCalledWith({ text: "" });
  });

  it("clears the badge when no child has been notified today", async () => {
    const child = buildChild({
      schedule: [{ day: "monday", time: "08:00", notes: "", enabled: true, status: "pending" }],
    });
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHILDREN]: [child] });

    await updateBadgeText();

    expect(setBadgeTextMock).toHaveBeenCalledWith({ text: "" });
  });

  it("does nothing when there are no children in storage", async () => {
    getMock.mockResolvedValueOnce({});

    await updateBadgeText();

    expect(setBadgeTextMock).not.toHaveBeenCalled();
  });
});
