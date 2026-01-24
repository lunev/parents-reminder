import { useNavigate } from "react-router";
import type { Child } from "@/types";
import { Switch } from "@/components/ui/switch";
import { AlarmClockOff, ChevronRight, Clock, ClockAlert } from "lucide-react";
import { isTimePassed } from "@/lib";

export type ToggleChildPayload = Pick<Child, "id" | "enabled">;

interface ChildCardProps {
  child: Child;
  onToggle: (data: ToggleChildPayload) => Promise<void>;
}

export const ChildCard: React.FC<ChildCardProps> = ({ child, onToggle }) => {
  const navigate = useNavigate();
  const todayName = new Intl.DateTimeFormat("en-US", { weekday: "long" })
    .format(new Date())
    .toLowerCase();
  const todaySchedule = child.schedule.find((s) => s.day === todayName);

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
        <div className="size-10 rounded-full bg-accent flex items-center justify-center shrink-0 overflow-hidden">
          {child.photo ? (
            <img src={child.photo} alt={child.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-base font-semibold text-accent-foreground">
              {child.name.charAt(0).toUpperCase() || "?"}
            </span>
          )}
        </div>

        {/* Name and time */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-foreground truncate">{child.name}</h4>
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
                <span>{todaySchedule?.time}</span>
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
