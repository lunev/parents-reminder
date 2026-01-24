import { useState, type FormEventHandler } from "react";
import { Link } from "react-router";
import { v4 as uuidv4 } from "uuid";
import { type Reminder } from "@/types";
import { WEEK_DAYS } from "@/constants";
import { ROUTES } from "@/config";
import { PhotoFied } from "./PhotoField";
import { ScheduleField } from "./ScheduleField";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const initialFormData: Reminder = {
  id: uuidv4(),
  title: "",
  photo: "",
  enabled: true,
  earlyReminder: {
    enabled: false,
    minutes: "0",
  },
  schedule: WEEK_DAYS.map((day) => ({
    day: day,
    time: "08:00",
    notes: "",
    enabled: true,
  })),
};

export const ReminderForm = () => {
  const [formData, setFormData] = useState<Reminder>(initialFormData);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form className="flex flex-col gap-7 text-xs" onSubmit={handleSubmit}>
      <div className="p-5 pb-2 flex flex-col gap-7 scrollbar-hide max-h-100 overflow-auto">
        {/* Photo */}
        <div className="pt-2 flex justify-center">
          <PhotoFied
            photo={formData.photo}
            onChange={(photo) => setFormData({ ...formData, photo })}
          />
        </div>

        {/* Title */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="title" className="font-medium">
            Name
          </Label>
          <Input
            required
            id="title"
            type="text"
            value={formData.title}
            placeholder="Child's name"
            onChange={(e) => setFormData({ ...formData, title: e.currentTarget.value })}
          />
        </div>

        {/* Schedule by Day */}
        <div className="flex flex-col gap-3">
          <Label>Schedule by Day</Label>
          <div className="flex flex-col gap-2">
            {formData.schedule.map((schedule) => (
              <ScheduleField
                key={schedule.day}
                schedule={schedule}
                onChange={(updatedSchedule) =>
                  setFormData((prev) => ({
                    ...prev,
                    schedule: prev.schedule.map((s) =>
                      s.day === updatedSchedule.day ? updatedSchedule : s,
                    ),
                  }))
                }
              />
            ))}
          </div>
        </div>

        {/* Early Reminder */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="early-reminder">Early Reminder</Label>
          <div className="bg-card p-3 shadow rounded-xl flex gap-3 items-center">
            <Switch
              checked={formData.earlyReminder.enabled}
              onCheckedChange={(checked) => {
                setFormData({
                  ...formData,
                  earlyReminder: {
                    ...formData.earlyReminder,
                    enabled: checked,
                  },
                });
              }}
            />
            <Label htmlFor="remind-me" className="min-w-20 flex-1">
              Remind me
            </Label>
            <Input
              required
              type="text"
              id="remind-me"
              value={formData.earlyReminder.minutes}
              disabled={!formData.earlyReminder.enabled}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 3);
                setFormData({
                  ...formData,
                  earlyReminder: { ...formData.earlyReminder, minutes: value },
                });
              }}
            />
            <span className="text-sm text-muted-foreground text-nowrap">min before</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="bg-card border-b border-border px-4 py-5 flex gap-3 items-center">
        <Button variant="outline" type="button" asChild className="flex-1">
          <Link to={ROUTES.HOME}>Cancel</Link>
        </Button>
        <Button type="submit" className="flex-1">
          Save
        </Button>
      </div>
    </form>
  );
};
