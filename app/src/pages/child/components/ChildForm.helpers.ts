import { STORAGE_KEYS } from "@/constants/storage_keys";
import { storage } from "@/lib/storage";
import { updateBadgeText } from "@/lib/badge";
import type { Child } from "@/types";

export const saveChild = async (formData: Child): Promise<Child[]> => {
  const children = (await storage.get<Child[]>(STORAGE_KEYS.CHILDREN)) ?? [];

  const preparedChild: Child = {
    ...formData,
    schedule: formData.schedule.map((s) => ({ ...s, status: "pending" })),
  };

  const isExisting = children.find((c) => c.id === formData.id);

  const updatedChildren = isExisting
    ? children.map((c) => (c.id === formData.id ? preparedChild : c))
    : [...children, preparedChild];

  await storage.set(STORAGE_KEYS.CHILDREN, updatedChildren);
  await updateBadgeText();

  return updatedChildren;
};
