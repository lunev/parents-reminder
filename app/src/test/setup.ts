import { vi } from "vitest";

const EN_MESSAGES: Record<string, string> = {
  appName: "Parents Reminder",
  notificationMessage: "$1, $2",
  ttsAnnouncement: "Parents Reminder: $1",
  ttsAnnouncementAnonymous: "It's reminder time",
};

const substituteMessage = (message: string, substitutions?: string | string[]): string => {
  const subs = Array.isArray(substitutions) ? substitutions : substitutions ? [substitutions] : [];
  return subs.reduce((result, sub, index) => result.replaceAll(`$${index + 1}`, sub), message);
};

globalThis.chrome = {
  storage: {
    local: {
      get: vi.fn().mockResolvedValue({}),
      set: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
    },
    onChanged: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
  },
  runtime: {
    getManifest: vi.fn().mockReturnValue({ version: "0.0.0" }),
    onInstalled: {
      addListener: vi.fn(),
    },
    onStartup: {
      addListener: vi.fn(),
    },
  },
  action: {
    setBadgeText: vi.fn(),
    setBadgeTextColor: vi.fn(),
    setBadgeBackgroundColor: vi.fn(),
  },
  notifications: {
    create: vi.fn(),
  },
  tts: {
    speak: vi.fn(),
  },
  alarms: {
    get: vi.fn().mockResolvedValue(undefined),
    create: vi.fn(),
    onAlarm: {
      addListener: vi.fn(),
    },
  },
  i18n: {
    getMessage: vi.fn((key: string, substitutions?: string | string[]) =>
      substituteMessage(EN_MESSAGES[key] ?? "", substitutions),
    ),
    getUILanguage: vi.fn().mockReturnValue("en-US"),
  },
} as unknown as typeof chrome;
