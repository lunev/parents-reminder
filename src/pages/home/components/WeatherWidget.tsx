import { useWeather } from "@/hooks";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  Wind,
  Thermometer,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Thunderstorm: <CloudLightning className="size-3" />,
  Drizzle: <CloudDrizzle className="size-3" />,
  Rain: <CloudRain className="size-3" />,
  Snow: <CloudSnow className="size-3" />,
  Clear: <Sun className="size-3" />,
  Clouds: <Cloud className="size-3" />,
  Mist: <CloudFog className="size-3" />,
  default: <Wind className="size-3" />,
};

const WeatherWidget = () => {
  const { weather, unit, isLoading } = useWeather();

  if (isLoading || !weather) return null;

  const condition = weather.weather[0]?.main;
  const Icon = condition ? iconMap[condition] : iconMap.default;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="pl-1 flex items-center text-xs text-muted-foreground cursor-help animate-in fade-in hover:cursor-default">
          <div className="mr-1 text-accent-foreground">{Icon}</div>
          <span className="font-medium">{weather.main.temp.toFixed()}</span>
          <span>°{unit}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-1 p-2">
        <div className="text-[10px] text-muted-foreground">{weather.name}</div>
        <div className="flex items-center gap-1 text-[11px]">
          <Thermometer className="size-3" />
          <span>Feels like</span>
          <span className="font-medium">
            {weather.main.feels_like.toFixed()}°{unit}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <Wind className="size-3" />
          <span>Wind</span>
          <span className="font-medium">
            {weather.wind.speed.toFixed()} {unit === "C" ? "m/s" : "mph"}
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default WeatherWidget;
