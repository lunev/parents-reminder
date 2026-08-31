import { Link } from "react-router";
import { ROUTES } from "@/config";
import { useSettings } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Bell, MessageCircleQuestion, UserX, Volume2 } from "lucide-react";

export const Settings = () => {
  const { settings, setSettings, isLoading } = useSettings();

  if (isLoading) return null;

  return (
    <div>
      <header className="min-h-16.25 bg-card border-b border-border px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
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
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8 rounded-full hover:bg-accent"
          title="Feedback"
          aria-label="Feedback"
          asChild
        >
          <a
            href="https://chromewebstore.google.com/detail/parents-reminder/honpenmjodkgcmmmiangohmegkobhmkh/support"
            target="_blank"
            rel="noreferrer noopener"
          >
            <MessageCircleQuestion className="w-5 h-5" />
          </a>
        </Button>
      </header>
      <div className="p-5 bg-background flex flex-col gap-5 max-h-100 overflow-auto scrollbar-hide">
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Notifications
          </h2>

          {/* Voice Notifications */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground text-sm">Voice notifications</h3>
                  <Switch
                    checked={settings?.voiceNotifications ?? true}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings!, voiceNotifications: checked })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Enable voice notifications to announce reminders aloud
                </p>
              </div>
            </div>
          </Card>

          {/* System Notifications */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground text-sm">System notifications</h3>
                  <Switch
                    checked={settings?.systemNotifications ?? true}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings!, systemNotifications: checked })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Receive visually enhanced reminders in your system tray
                </p>
              </div>
            </div>
          </Card>

          {/* Anonymous Mode */}
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                <UserX className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground text-sm">Anonymous mode</h3>
                  <Switch
                    checked={settings?.anonymousMode ?? false}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings!, anonymousMode: checked })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Hide child names in notifications, badges, and voice alerts to protect privacy in
                  public places
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
