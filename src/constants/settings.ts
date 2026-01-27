import type { Settings } from "@/types";

export const DEFAULT_SETTINGS: Settings = {
  voiceNotifications: true,
  systemNotifications: true,
  anonymousMode: false,
  weather: {
    openWeatherAPIKey: "",
    temperatureUnit: "C",
    cityName: "",
  },
};
