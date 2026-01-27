import { useEffect, useState } from "react";
import type { Settings, WeatherResponse } from "@/types";
import { getLocation, storage } from "@/lib";
import { STORAGE_KEYS } from "@/constants";

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        const settings = await storage.get<Settings>(STORAGE_KEYS.SETTINGS);

        const apiKey = settings?.weather?.openWeatherAPIKey;
        const cityName = settings?.weather?.cityName;
        const currentUnit = settings?.weather?.temperatureUnit || "C";

        setUnit(currentUnit);

        if (!apiKey) {
          setIsLoading(false);
          return;
        }

        const apiUnit = currentUnit === "F" ? "imperial" : "metric";
        let url = "";

        if (cityName?.trim()) {
          url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=${apiUnit}&appid=${apiKey}`;
        } else {
          const coords = await getLocation();
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=${apiUnit}&appid=${apiKey}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Weather fetch failed: ${response.statusText}`);

        const data: WeatherResponse = await response.json();
        setWeather(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();

    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes[STORAGE_KEYS.SETTINGS]) {
        fetchWeather();
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  return { weather, isLoading, error, unit };
};
