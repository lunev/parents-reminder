import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config";
import { Plus, Settings } from "lucide-react";
import { Link } from "react-router";

export const Home = () => {
  return (
    <>
      <header className="min-h-16.25 bg-card border-b border-border px-4 py-3 flex gap-3 items-center">
        <h1 className="text-base font-bold text-foreground capitalize flex-1">Parents Reminder</h1>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="w-9 h-9 rounded-full hover:bg-accent"
            asChild
          >
            <Link to={ROUTES.SETTINGS}>
              <Settings className="w-5 h-5" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-9 h-9 rounded-full hover:bg-accent"
            asChild
          >
            <Link to={ROUTES.REMINDER_ADD}>
              <Plus className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </header>
      <div className="p-5 min-h-50 animate-in slide-in-from-bottom-20 duration-500 bg-gradient-soft">
        <nav className="flex gap-3">
          <Link to={ROUTES.REMINDER_EDIT}>Edit #2</Link>
        </nav>
      </div>
    </>
  );
};
