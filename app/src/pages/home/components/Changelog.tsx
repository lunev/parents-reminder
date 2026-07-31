import { Sparkles, X } from "lucide-react";
import type { ChangelogEntry } from "@/types";

interface ChangelogProps {
  entry: ChangelogEntry | null;
  onDismiss: () => void;
}

export const Changelog = ({ entry, onDismiss }: ChangelogProps) => {
  if (!entry) return null;

  return (
    <div className="mx-4 mt-3 bg-card rounded-xl p-3 shadow-soft animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-1.5 text-xs">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent-foreground shrink-0" />
          <span className="font-semibold text-foreground">What's new in v{entry.version}</span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <ul className="flex flex-col gap-1 pl-5 list-disc text-muted-foreground">
        {entry.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
