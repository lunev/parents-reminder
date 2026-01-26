import type { MouseEvent } from "react";
import { useNavigate } from "react-router";
import { AlarmClockOff, Bell, ChevronRight, Clock, ClockAlert } from "lucide-react";
import type { Child } from "@/types";
import { Switch } from "@/components/ui/switch";
import { isTimePassed } from "@/lib";
import { format } from "date-fns";
import { updateChildStatus, updateBadgeText } from "./ChildCard.helpers";
import { useSettings } from "@/hooks";

export type ToggleChildPayload = Pick<Child, "id" | "enabled">;

interface ChildCardProps {
  child: Child;
  onToggle: (data: ToggleChildPayload) => Promise<void>;
}

export const ChildCard: React.FC<ChildCardProps> = ({ child, onToggle }) => {
  const navigate = useNavigate();
  const todayName = format(new Date(), "EEEE").toLowerCase();
  const todaySchedule = child.schedule.find((s) => s.day === todayName);
  const { settings } = useSettings();

  const handleMarkSeen = async (e: MouseEvent, childId: string) => {
    e.stopPropagation();
    await updateChildStatus(childId, "seen");
    await updateBadgeText();
  };

  const scheduleClockIcon = todaySchedule?.enabled ? (
    <Clock className="size-3.5" />
  ) : (
    <AlarmClockOff className="size-3.5" />
  );

  return (
    <div
      className="group bg-card rounded-xl p-4 shadow-soft hover:shadow-card transition-all duration-200 cursor-pointer animate-fade-in"
      onClick={() => navigate(`/edit/${child.id}`)}
    >
      <div className="flex items-center gap-3">
        {/* Avatar with photo or first letter */}
        <div className="relative">
          <div className="size-10 rounded-full bg-accent flex items-center justify-center shrink-0 overflow-hidden">
            {child.photo && !settings?.anonymousMode ? (
              <img src={child.photo} alt={child.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-base font-semibold text-accent-foreground">
                {child.name.charAt(0).toUpperCase() || "?"}
              </span>
            )}
          </div>
          {todaySchedule?.status === "notified" && (
            <div
              onClick={(e) => handleMarkSeen(e, child.id)}
              className="animate-bounce absolute -top-1 -right-1 size-4 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors z-10"
            >
              <Bell size={9} className="text-white fill-current" />
            </div>
          )}
        </div>

        {/* Name and time */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-foreground truncate transition-all">
            {settings?.anonymousMode ? `${child.name.charAt(0)}***` : child.name}
          </h4>
          {todaySchedule?.notes && (
            <div className="text-muted-foreground">{todaySchedule?.notes}</div>
          )}
          <div
            className={`
              flex items-center gap-1.5 text-sm text-muted-foreground 
              ${todaySchedule?.time && isTimePassed(todaySchedule?.time) ? "opacity-50" : ""}
            `}
          >
            {child.enabled ? (
              <>
                {scheduleClockIcon}
                <span>{todaySchedule?.time || "Not Scheduled"}</span>
              </>
            ) : (
              <>
                <ClockAlert className="size-3.5" />
                <span>Paused</span>
              </>
            )}
          </div>
        </div>

        {/* Toggle and chevron */}
        <div className="flex items-center gap-2">
          <Switch
            checked={child.enabled}
            onClick={(e) => e.stopPropagation()}
            onCheckedChange={(checked) => {
              onToggle({ id: child.id, enabled: checked });
            }}
          />
          <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
};
