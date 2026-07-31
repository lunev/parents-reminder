import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import { format } from "date-fns";
import { saveChild } from "./ChildForm.helpers";
import type { Child, WeekDay } from "@/types";

const getMock = chrome.storage.local.get as Mock;
const setMock = chrome.storage.local.set as Mock;
const badgeMock = chrome.action.setBadgeText as Mock;

const todayName = format(new Date(), "eeee").toLowerCase() as WeekDay;

const buildChild = (overrides: Partial<Child> = {}): Child => ({
  id: "child-1",
  name: "Alice",
  photo: "",
  enabled: true,
  earlyReminder: { enabled: false, minutes: "0" },
  schedule: [{ day: todayName, time: "08:00", notes: "", enabled: true, status: "pending" }],
  ...overrides,
});

describe("saveChild", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("resets a notified child's schedule to pending and clears the badge", async () => {
    const notifiedChild = buildChild({
      schedule: [{ day: todayName, time: "08:00", notes: "", enabled: true, status: "notified" }],
    });
    const expectedSaved = [
      { ...notifiedChild, schedule: [{ ...notifiedChild.schedule[0], status: "pending" }] },
    ];

    // 1st storage.get is saveChild's own fetch, 2nd is updateBadgeText's re-read.
    getMock
      .mockResolvedValueOnce({ children: [notifiedChild] })
      .mockResolvedValueOnce({ children: expectedSaved });

    await saveChild(notifiedChild);

    expect(setMock).toHaveBeenCalledWith({ children: expectedSaved });
    expect(badgeMock).toHaveBeenCalledWith({ text: "" });
  });

  it("recomputes the badge from another child that is still notified", async () => {
    const editedChild = buildChild({
      id: "child-1",
      schedule: [{ day: todayName, time: "08:00", notes: "", enabled: true, status: "notified" }],
    });
    const stillNotifiedChild = buildChild({
      id: "child-2",
      name: "Bobby",
      schedule: [{ day: todayName, time: "09:00", notes: "", enabled: true, status: "notified" }],
    });
    const expectedSaved = [
      { ...editedChild, schedule: [{ ...editedChild.schedule[0], status: "pending" }] },
      stillNotifiedChild,
    ];

    getMock
      .mockResolvedValueOnce({ children: [editedChild, stillNotifiedChild] })
      .mockResolvedValueOnce({ children: expectedSaved });

    await saveChild(editedChild);

    expect(badgeMock).toHaveBeenCalledWith({ text: "Bobby" });
  });

  it("appends a new child when none exist yet", async () => {
    const newChild = buildChild({ id: "new-child" });

    getMock
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ children: [newChild] });

    const updatedChildren = await saveChild(newChild);

    expect(updatedChildren).toHaveLength(1);
    expect(updatedChildren[0].id).toBe("new-child");
    expect(setMock).toHaveBeenCalledWith({ children: [newChild] });
  });
});
