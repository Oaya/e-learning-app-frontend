import { useMemo, useState } from "react";
import type { UserSort } from "../../../../type/user";
import { createFilters } from "../../../../models/filters";

export function useUserTableControl() {
  const [sorts, setSorts] = useState<UserSort[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const filters = createFilters().filters;
  const [openedFilter, setOpenedFilter] = useState<string[]>([]);

  function toggleSort(field: string) {
    setSorts((prev) => {
      const existing = prev.find((p) => p.field === field);

      if (!existing) {
        return [...prev, { field, dir: "asc" }];
      }

      return prev.map((s) =>
        s.field === field ? { ...s, dir: s.dir === "asc" ? "desc" : "asc" } : s,
      );
    });
  }

  function handleToggleFilter(filterName: string) {
    setOpenedFilter((prev) =>
      prev.includes(filterName)
        ? prev.filter((name) => name !== filterName)
        : [...prev, filterName],
    );
  }

  function removeFilterChip(key: string, value: string) {
    setSelectedFilters((prev) => {
      const next = { ...prev };
      if (!next[key]) return next;

      next[key] = next[key].filter((v) => v !== value);

      if (next[key].length === 0) {
        delete next[key];
      }

      return next;
    });
  }

  function updateSelectedFilters(
    filterName: string,
    optionValue: string,
    filterType: string,
  ) {
    setSelectedFilters((prev) => {
      const currentValues = prev[filterName] || [];

      if (filterType === "multi-select") {
        const isSelected = currentValues.includes(optionValue);
        const nextValues = isSelected
          ? currentValues.filter((v) => v !== optionValue)
          : [...currentValues, optionValue];

        return { ...prev, [filterName]: nextValues };
      }

      // radio / single select: replace with the one chosen value
      return { ...prev, [filterName]: [optionValue] };
    });
  }

  const chips = useMemo(() => {
    return Object.entries(selectedFilters).flatMap(([key, values]) =>
      values.map((value) => ({
        key,
        value,
        label: `${key}: ${value}`,
      })),
    );
  }, [selectedFilters]);

  return {
    sorts,
    selectedFilters,
    openedFilter,
    filters,
    chips,
    toggleSort,
    removeFilterChip,
    handleToggleFilter,
    updateSelectedFilters,
  };
}
