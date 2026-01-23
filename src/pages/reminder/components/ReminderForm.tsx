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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialFormData: Reminder = {
  id: uuidv4(),
  title: "",
  photo: "",
  enabled: true,
  earlyReminder: 0,
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
    <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-7 max-h-120 overflow-auto scrollbar-hide">
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
          <Select
            value={formData.earlyReminder.toString()}
            onValueChange={(val) => setFormData({ ...formData, earlyReminder: parseInt(val) })}
          >
            <SelectTrigger className="bg-card w-full" id="early-reminder">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">None</SelectItem>
              <SelectItem value="5">5 minutes before</SelectItem>
              <SelectItem value="15">15 minutes before</SelectItem>
              <SelectItem value="30">30 minutes before</SelectItem>
              <SelectItem value="60">1 hour before</SelectItem>
              <SelectItem value="120">2 hours before</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="bg-card border-b border-border px-4 py-3 flex gap-3 items-center">
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
