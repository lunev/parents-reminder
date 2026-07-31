import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isTimePassed } from "./time";

describe("isTimePassed", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true for a time earlier today", () => {
    expect(isTimePassed("08:00")).toBe(true);
  });

  it("returns false for a time later today", () => {
    expect(isTimePassed("18:00")).toBe(false);
  });
});
