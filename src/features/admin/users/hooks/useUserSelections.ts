import { useMemo, useState } from "react";
import type { User } from "../../../../type/user";

export function useUserSelections(users: User[], currentUserId?: string) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const selectableUserIds = useMemo(() => {
    return users.filter((u) => u.id !== currentUserId).map((u) => u.id);
  }, [users, currentUserId]);

  const allSelected =
    selectableUserIds.length > 0 && selected.size === selectableUserIds.length;

  function toggleOne(id: string) {
    if (id === currentUserId) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    const ids = users.filter((u) => u.id !== currentUserId).map((u) => u.id);

    const allSelected = ids.length > 0 && selected.size === ids.length;

    setSelected(allSelected ? new Set() : new Set(ids));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  const selectedUsers = useMemo(() => {
    return users?.filter((u) => selected.has(u.id));
  }, [users, selected]);

  const selectedEmails = useMemo(() => {
    return selectedUsers.map((u: { email: string }) => u.email);
  }, [selectedUsers]);

  return {
    selected,
    setSelected,
    allSelected,
    toggleOne,
    toggleAll,
    clearSelection,
    selectedUsers,
    selectedEmails,
  };
}
