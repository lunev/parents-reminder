import { useEffect, useState } from "react";
import { CHANGELOG, STORAGE_KEYS } from "@/constants";
import { storage } from "@/lib/storage";
import type { ChangelogEntry } from "@/types";

export const useChangelog = () => {
  const [pendingEntry, setPendingEntry] = useState<ChangelogEntry | null>(null);

  useEffect(() => {
    const checkChangelog = async () => {
      const isPending = await storage.get<boolean>(STORAGE_KEYS.CHANGELOG_PENDING);

      if (!isPending) return;

      const currentVersion = chrome.runtime.getManifest().version;
      const entry = CHANGELOG.find((entry) => entry.version === currentVersion);

      if (entry) {
        setPendingEntry(entry);
      } else {
        await storage.set(STORAGE_KEYS.CHANGELOG_PENDING, false);
      }
    };

    checkChangelog();
  }, []);

  const dismiss = async () => {
    await storage.set(STORAGE_KEYS.CHANGELOG_PENDING, false);
    setPendingEntry(null);
  };

  return { pendingEntry, dismiss };
};
