import { Link } from "react-router";
import { ROUTES } from "@/config";
import { ReminderForm } from "./components/ReminderForm";

export const ReminderAdd = () => {
  return (
    <>
      <header className="min-h-16.25 bg-card border-b border-border px-4 py-3 flex gap-3 items-center">
        <Link to={ROUTES.HOME}>Logo</Link>
      </header>
      <div className="p-5 bg-background">
        <ReminderForm />
      </div>
    </>
  );
};
