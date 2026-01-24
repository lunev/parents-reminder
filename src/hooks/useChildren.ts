import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/constants/storage_keys";
import { storage } from "@/lib/storage";
import { type Child } from "@/types";

export const useChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isError, setError] = useState("");

  useEffect(() => {
    const loadReminders = async () => {
      try {
        const data = await storage.get<Child[]>(STORAGE_KEYS.CHILDREN);
        setChildren(data ?? []);
      } catch (error) {
        console.log(error);
        setError(error instanceof Error ? error.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadReminders();
  }, []);

  return {
    children,
    setChildren,
    isLoading,
    isError,
  };
};
