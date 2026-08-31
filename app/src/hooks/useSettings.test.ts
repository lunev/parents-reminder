import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import { useSettings } from "./useSettings";
import { DEFAULT_SETTINGS } from "@/constants";
import { STORAGE_KEYS } from "@/constants/storage_keys";

const getMock = chrome.storage.local.get as Mock;
const setMock = chrome.storage.local.set as Mock;

describe("useSettings", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("starts with default settings while loading", () => {
    getMock.mockResolvedValueOnce({});

    const { result } = renderHook(() => useSettings());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
  });

  it("loads stored settings", async () => {
    const stored = {
      voiceNotifications: false,
      systemNotifications: false,
      anonymousMode: true,
    };
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.SETTINGS]: stored });

    const { result } = renderHook(() => useSettings());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.settings).toEqual(stored);
  });

  it("falls back to default settings when nothing is stored", async () => {
    getMock.mockResolvedValueOnce({});

    const { result } = renderHook(() => useSettings());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.settings).toEqual(DEFAULT_SETTINGS);
  });

  it("surfaces an error message when storage.get rejects", async () => {
    getMock.mockRejectedValueOnce(new Error("boom"));

    const { result } = renderHook(() => useSettings());

    await waitFor(() => expect(result.current.isError).toBe("boom"));
    expect(result.current.isLoading).toBe(false);
  });

  it("setSettings persists and updates the in-memory settings", async () => {
    getMock.mockResolvedValueOnce({});
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const next = {
      voiceNotifications: false,
      systemNotifications: true,
      anonymousMode: true,
    };
    await act(async () => {
      await result.current.setSettings(next);
    });

    expect(setMock).toHaveBeenCalledWith({ [STORAGE_KEYS.SETTINGS]: next });
    expect(result.current.settings).toEqual(next);
  });

  it("surfaces an error message when setSettings fails", async () => {
    getMock.mockResolvedValueOnce({});
    setMock.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.setSettings(DEFAULT_SETTINGS);
    });

    expect(result.current.isError).toBe("Failed to save settings");
  });
});
