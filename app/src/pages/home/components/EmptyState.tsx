import { useNavigate } from "react-router";
import { Bell, Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

export const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <Bell className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-card">
          <Heart className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No reminders yet</h3>
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-60">
        Add your first child to start receiving helpful pickup reminders
      </p>
      <Button
        size="lg"
        className="gap-2 shadow-card hover:shadow-elevated transition-shadow"
        onClick={() => navigate(ROUTES.CHILD_ADD)}
      >
        <Plus className="w-4 h-4" />
        Add child
      </Button>
    </div>
  );
};
