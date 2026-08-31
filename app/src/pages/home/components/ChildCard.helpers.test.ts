import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { updateChildStatus } from "./ChildCard.helpers";
import { STORAGE_KEYS } from "@/constants/storage_keys";
import type { Child } from "@/types";

const getMock = chrome.storage.local.get as Mock;
const setMock = chrome.storage.local.set as Mock;

const buildChild = (overrides: Partial<Child> = {}): Child => ({
  id: "child-1",
  name: "Alice",
  photo: "",
  enabled: true,
  earlyReminder: { enabled: false, minutes: "" },
  schedule: [{ day: "monday", time: "08:00", notes: "", enabled: true, status: "notified" }],
  ...overrides,
});

describe("updateChildStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 31, 8, 0, 0)); // Monday
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("updates today's schedule status for the matching child", async () => {
    const child = buildChild();
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHILDREN]: [child] });

    const result = await updateChildStatus("child-1", "seen");

    expect(result?.[0].schedule[0].status).toBe("seen");
    expect(setMock).toHaveBeenCalledWith({
      [STORAGE_KEYS.CHILDREN]: [{ ...child, schedule: [{ ...child.schedule[0], status: "seen" }] }],
    });
  });

  it("leaves other children untouched", async () => {
    const target = buildChild({ id: "child-1" });
    const other = buildChild({ id: "child-2" });
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHILDREN]: [target, other] });

    const result = await updateChildStatus("child-1", "seen");

    expect(result?.find((c) => c.id === "child-2")).toEqual(other);
  });

  it("only updates the schedule entry for today, not other days", async () => {
    const child = buildChild({
      schedule: [
        { day: "monday", time: "08:00", notes: "", enabled: true, status: "notified" },
        { day: "tuesday", time: "09:00", notes: "", enabled: true, status: "notified" },
      ],
    });
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHILDREN]: [child] });

    const result = await updateChildStatus("child-1", "seen");

    const schedule = result?.[0].schedule ?? [];
    expect(schedule.find((s) => s.day === "monday")?.status).toBe("seen");
    expect(schedule.find((s) => s.day === "tuesday")?.status).toBe("notified");
  });

  it("does nothing when there are no children in storage", async () => {
    getMock.mockResolvedValueOnce({});

    const result = await updateChildStatus("child-1", "seen");

    expect(result).toBeUndefined();
    expect(setMock).not.toHaveBeenCalled();
  });

  it("does nothing when no child matches the given id", async () => {
    const child = buildChild({ id: "child-1" });
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHILDREN]: [child] });

    const result = await updateChildStatus("missing-id", "seen");

    expect(result?.[0]).toEqual(child);
  });
});
