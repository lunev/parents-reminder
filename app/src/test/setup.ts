import { vi } from "vitest";

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
} as unknown as typeof chrome;
