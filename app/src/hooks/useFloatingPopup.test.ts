import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import { useFloatingPopup } from "./useFloatingPopup";

const DAY_MS = 24 * 60 * 60 * 1000;

const getMock = chrome.storage.local.get as Mock;
const setMock = chrome.storage.local.set as Mock;

describe("useFloatingPopup", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows on first-ever run (no prior storage) without writing storage", async () => {
    getMock.mockResolvedValueOnce({});

    const { result } = renderHook(() => useFloatingPopup({ storageKey: "k", intervalDays: 30 }));

    await waitFor(() => expect(result.current.visible).toBe(true));
    expect(setMock).not.toHaveBeenCalled();
  });

  it("stays hidden before the interval has elapsed since it was last dismissed", async () => {
    getMock.mockResolvedValueOnce({ k: Date.now() - 5 * DAY_MS });

    const { result } = renderHook(() => useFloatingPopup({ storageKey: "k", intervalDays: 30 }));
    await waitFor(() => expect(getMock).toHaveBeenCalled());

    expect(result.current.visible).toBe(false);
  });

  it("shows again once the interval has elapsed since it was last dismissed", async () => {
    getMock.mockResolvedValueOnce({ k: Date.now() - 31 * DAY_MS });

    const { result } = renderHook(() => useFloatingPopup({ storageKey: "k", intervalDays: 30 }));

    await waitFor(() => expect(result.current.visible).toBe(true));
  });

  it("dismiss() hides it and records the dismissal timestamp", async () => {
    getMock.mockResolvedValueOnce({});

    const { result } = renderHook(() => useFloatingPopup({ storageKey: "k", intervalDays: 30 }));
    await waitFor(() => expect(result.current.visible).toBe(true));

    await act(async () => {
      await result.current.dismiss();
    });

    expect(result.current.visible).toBe(false);
    expect(setMock).toHaveBeenCalledWith({ k: expect.any(Number) });
  });
});
