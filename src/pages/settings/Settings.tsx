import { useState } from "react";
import { Link } from "react-router";
import { ROUTES } from "@/config";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Bell,
  CloudSun,
  Eye,
  EyeClosed,
  Monitor,
  Moon,
  Sun,
  UserX,
  Volume2,
} from "lucide-react";

export const Settings = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="animate-in slide-in-from-right-50 duration-400">
      <header className="min-h-16.25 bg-card border-b border-border px-4 py-3 flex gap-3 items-center">
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8 rounded-full hover:bg-accent"
          asChild
        >
          <Link to={ROUTES.HOME}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-base font-bold text-foreground capitalize">Settings</h1>
      </header>
      <div className="p-5 bg-background flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Notifications
          </h2>

          {/* Voice Notifications */}
          <div className="bg-card rounded-xl p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground text-sm">Voice notifications</h3>
                  <Switch checked={true} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Enable voice notifications to announce reminders aloud
                </p>
              </div>
            </div>
          </div>

          {/* Visual Reminders */}
          <div className="bg-card rounded-xl p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground text-sm">System notifications</h3>
                  <Switch checked={true} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Receive visually enhanced reminders in your system tray
                </p>
              </div>
            </div>
          </div>

          {/* Anonymous Mode */}
          <div className="bg-card rounded-xl p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                <UserX className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground text-sm">Anonymous mode</h3>
                  <Switch checked={true} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Hide personal info like child names in public places
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Appearance
          </h2>

          <div className="bg-card rounded-xl p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                {theme === "dark" ? (
                  <Moon className="w-4 h-4 text-accent-foreground" />
                ) : (
                  <Sun className="w-4 h-4 text-accent-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground text-sm mb-2">Theme</h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className="flex-1 gap-1.5"
                  >
                    <Sun className="w-3.5 h-3.5" />
                    Light
                  </Button>
                  <Button
                    type="button"
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className="flex-1 gap-1.5"
                  >
                    <Moon className="w-3.5 h-3.5" />
                    Dark
                  </Button>
                  <Button
                    type="button"
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                    className="flex-1 gap-1.5"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    Auto
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Section */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Weather
          </h2>

          <div className="bg-card rounded-xl p-4 shadow-soft">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                <CloudSun className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div>
                  <h3 className="font-medium text-foreground text-sm">OpenWeather API Key</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your API key to display real weather data
                  </p>
                </div>
                <div className="relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    placeholder="Enter your API key"
                    className="bg-muted text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showApiKey ? <EyeClosed className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-block"
                >
                  Get a free API key →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
