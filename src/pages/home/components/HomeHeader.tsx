import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { AppConfig, ROUTES } from "@/config";
import logo from "@/assets/images/logo128x128.png";
import { CurrentDateTime } from "./CurrentDateTime";

export const HomeHeader: React.FC = () => {
  return (
    <header className="min-h-16.25 bg-card border-b border-border px-4 py-3 flex gap-3 items-center">
      {/* Logo */}
      <div className="flex gap-2.5 flex-1 items-center">
        <img src={logo} width={32} height={32} alt="logo" />
        <div className="flex flex-col">
          <h1 className="text-base font-bold text-foreground capitalize flex-1">
            {AppConfig.name}
          </h1>
          <CurrentDateTime />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost" className="size-9 rounded-full hover:bg-accent" asChild>
          <Link to={ROUTES.SETTINGS}>
            <Settings className="size-4" />
          </Link>
        </Button>
        <Button size="icon" variant="ghost" className="size-9 rounded-full hover:bg-accent" asChild>
          <Link to={ROUTES.CHILD_ADD}>
            <Plus className="size-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
};
