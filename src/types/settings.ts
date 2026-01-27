export interface Settings {
  voiceNotifications: boolean;
  systemNotifications: boolean;
  anonymousMode: boolean;
  weather: {
    openWeatherAPIKey: string;
    temperatureUnit: "C" | "F";
    cityName?: string;
  };
}
