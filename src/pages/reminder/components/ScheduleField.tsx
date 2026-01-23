import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Schedule } from "@/types";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ScheduleFieldProps {
  schedule: Schedule;
  onChange: (schedule: Schedule) => void;
}

export const ScheduleField: React.FC<ScheduleFieldProps> = ({ schedule, onChange }) => {
  const [notesOpen, setNotesOpen] = useState<boolean>();
  const { day, time, enabled, notes } = schedule;
  const hasNotes = notes && notes.trim().length > 0;
  const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);

  return (
    <div className="bg-card p-3 shadow rounded-lg">
      <div className="flex gap-3 items-center">
        <Switch
          checked={enabled}
          onCheckedChange={(enabled) => onChange({ ...schedule, enabled })}
        />
        <Label htmlFor={day} className="min-w-20 flex-1 capitalize">
          {day}
        </Label>
        <Input
          id={day}
          type="time"
          disabled={!enabled}
          value={time ?? ""}
          className="max-w-40"
          onChange={(e) => onChange({ ...schedule, time: e.target.value })}
        />
        <Button
          type="button"
          variant="link"
          disabled={!enabled}
          className={`flex gap-0.5  hover:text-foreground ${hasNotes ? "text-primary hover:text-primary/80" : "text-muted-foreground"} `}
          onClick={() => setNotesOpen((prev) => !prev)}
        >
          <FileText />
          {notesOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
      {notesOpen && enabled && (
        <Textarea
          rows={2}
          value={notes}
          className="mt-3 w-full"
          placeholder={`Notes for ${capitalizedDay}...`}
          onChange={(e) => onChange({ ...schedule, notes: e.target.value })}
        />
      )}
    </div>
  );
};
