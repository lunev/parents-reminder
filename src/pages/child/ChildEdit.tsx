import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Trash2 } from "lucide-react";
import { ROUTES } from "@/config";
import { ChildForm } from "./components/ChildForm";
import { Button } from "@/components/ui/button";
import { useChildren } from "@/hooks";
import { storage } from "@/lib";
import { STORAGE_KEYS } from "@/constants/storage_keys";

export const ChildEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { children } = useChildren();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const child = children.find((c) => c.id === id);

  const handleDeleteClick = async () => {
    if (confirmingDelete) {
      const updatedChildren = children.filter((child) => child.id !== id);
      await storage.set(STORAGE_KEYS.CHILDREN, updatedChildren);
      navigate(ROUTES.HOME);
    } else {
      setConfirmingDelete(true);
    }
  };

  useEffect(() => {
    if (confirmingDelete) {
      const timer = setTimeout(() => setConfirmingDelete(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [confirmingDelete]);

  if (!child) {
    return (
      <div className="p-5 text-center">
        <p className="mb-4">Child was not found</p>
        <Button asChild variant="outline">
          <Link to={ROUTES.HOME}>Go Back</Link>
        </Button>
      </div>
    );
  }

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
        <h1 className="text-base font-bold text-foreground capitalize">Edit Child</h1>
        <Button
          size={confirmingDelete ? "sm" : "icon"}
          variant="ghost"
          onClick={handleDeleteClick}
          className={`rounded-full ml-auto transition-all ${
            confirmingDelete
              ? "bg-destructive/10 text-destructive px-3 h-8"
              : "w-8 h-8 hover:bg-destructive/10 text-destructive"
          }`}
        >
          {confirmingDelete ? (
            <span className="text-xs font-medium">Sure?</span>
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      </header>
      <div className="bg-background">
        <ChildForm child={child} />
      </div>
    </div>
  );
};
