import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/config";
import { ChildForm } from "./components/ChildForm";
import { Button } from "@/components/ui/button";

export const ChildAdd = () => {
  return (
    <div className="animate-in slide-in-from-right-50">
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
        <h1 className="text-base font-bold text-foreground capitalize">Add Child</h1>
      </header>
      <div className="bg-background">
        <ChildForm />
      </div>
    </div>
  );
};
