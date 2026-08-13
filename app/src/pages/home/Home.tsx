import { useChangelog, useChildren } from "@/hooks";
import { ChildCard, type ToggleChildPayload } from "./components/ChildCard";
import { storage } from "@/lib";
import { STORAGE_KEYS } from "@/constants/storage_keys";
import { HomeHeader } from "./components/HomeHeader";
import { EmptyState } from "./components/EmptyState";
import { Changelog } from "./components/Changelog";

export const Home = () => {
  const { children, setChildren, isLoading } = useChildren();
  const { pendingEntry, dismiss } = useChangelog();

  const handleToggle = async ({ id, enabled }: ToggleChildPayload) => {
    if (!children) return;
    const updated = children.map((c) => (c.id === id ? { ...c, enabled } : c));
    setChildren(updated);
    await storage.set(STORAGE_KEYS.CHILDREN, updated);
  };

  if (isLoading) return null;

  return (
    <>
      <HomeHeader />
      <Changelog entry={pendingEntry} onDismiss={dismiss} />
      <div className="p-5 bg-background flex flex-col gap-3">
        {children?.length ? (
          <>
            {children?.map((child) => (
              <ChildCard key={child.id} child={child} onToggle={handleToggle} />
            ))}
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  );
};
