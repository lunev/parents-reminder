import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import { useChildren } from "./useChildren";
import { STORAGE_KEYS } from "@/constants/storage_keys";
import type { Child } from "@/types";

const getMock = chrome.storage.local.get as Mock;
const addListenerMock = chrome.storage.onChanged.addListener as Mock;
const removeListenerMock = chrome.storage.onChanged.removeListener as Mock;

const buildChild = (overrides: Partial<Child> = {}): Child => ({
  id: "child-1",
  name: "Alice",
  photo: "",
  enabled: true,
  earlyReminder: { enabled: false, minutes: "" },
  schedule: [],
  ...overrides,
});

describe("useChildren", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads children from storage", async () => {
    const children = [buildChild()];
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHILDREN]: children });

    const { result } = renderHook(() => useChildren());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.children).toEqual(children);
    expect(result.current.isError).toBe("");
  });

  it("defaults to an empty array when nothing is stored", async () => {
    getMock.mockResolvedValueOnce({});

    const { result } = renderHook(() => useChildren());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.children).toEqual([]);
  });

  it("surfaces an error message when storage.get rejects", async () => {
    getMock.mockRejectedValueOnce(new Error("boom"));

    const { result } = renderHook(() => useChildren());

    await waitFor(() => expect(result.current.isError).toBe("boom"));
    expect(result.current.isLoading).toBe(false);
  });

  it("updates children when chrome.storage.onChanged fires for the children key", async () => {
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHILDREN]: [] });

    const { result } = renderHook(() => useChildren());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const handleStorageChange = addListenerMock.mock.calls[0][0];
    const updated = [buildChild()];
    act(() => {
      handleStorageChange({ [STORAGE_KEYS.CHILDREN]: { newValue: updated } });
    });

    expect(result.current.children).toEqual(updated);
  });

  it("ignores storage changes unrelated to the children key", async () => {
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHILDREN]: [] });

    const { result } = renderHook(() => useChildren());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const handleStorageChange = addListenerMock.mock.calls[0][0];
    act(() => {
      handleStorageChange({ settings: { newValue: {} } });
    });

    expect(result.current.children).toEqual([]);
  });

  it("removes the storage listener on unmount", async () => {
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHILDREN]: [] });

    const { unmount } = renderHook(() => useChildren());
    await waitFor(() => expect(getMock).toHaveBeenCalled());

    const handler = addListenerMock.mock.calls[0][0];
    unmount();

    expect(removeListenerMock).toHaveBeenCalledWith(handler);
  });
});
