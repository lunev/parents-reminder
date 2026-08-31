import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import { useChangelog } from "./useChangelog";
import { CHANGELOG } from "@/constants";
import { STORAGE_KEYS } from "@/constants/storage_keys";

const getMock = chrome.storage.local.get as Mock;
const setMock = chrome.storage.local.set as Mock;
const getManifestMock = chrome.runtime.getManifest as Mock;

describe("useChangelog", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("stays null when no changelog is pending", async () => {
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHANGELOG_PENDING]: false });

    const { result } = renderHook(() => useChangelog());

    await waitFor(() => expect(getMock).toHaveBeenCalled());
    expect(result.current.pendingEntry).toBeNull();
  });

  it("surfaces the changelog entry matching the current manifest version", async () => {
    const version = CHANGELOG[0].version;
    getManifestMock.mockReturnValue({ version });
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHANGELOG_PENDING]: true });

    const { result } = renderHook(() => useChangelog());

    await waitFor(() => expect(result.current.pendingEntry).toEqual(CHANGELOG[0]));
  });

  it("clears the pending flag when the current version has no changelog entry", async () => {
    getManifestMock.mockReturnValue({ version: "0.0.0-does-not-exist" });
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHANGELOG_PENDING]: true });

    const { result } = renderHook(() => useChangelog());

    await waitFor(() =>
      expect(setMock).toHaveBeenCalledWith({ [STORAGE_KEYS.CHANGELOG_PENDING]: false }),
    );
    expect(result.current.pendingEntry).toBeNull();
  });

  it("dismiss() clears the pending flag and the entry", async () => {
    const version = CHANGELOG[0].version;
    getManifestMock.mockReturnValue({ version });
    getMock.mockResolvedValueOnce({ [STORAGE_KEYS.CHANGELOG_PENDING]: true });

    const { result } = renderHook(() => useChangelog());
    await waitFor(() => expect(result.current.pendingEntry).toEqual(CHANGELOG[0]));

    await act(async () => {
      await result.current.dismiss();
    });

    expect(setMock).toHaveBeenCalledWith({ [STORAGE_KEYS.CHANGELOG_PENDING]: false });
    expect(result.current.pendingEntry).toBeNull();
  });
});
