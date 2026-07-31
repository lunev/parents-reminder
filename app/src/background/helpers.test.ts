import { describe, expect, it } from "vitest";
import { calculateTriggerTime } from "./helpers";

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
