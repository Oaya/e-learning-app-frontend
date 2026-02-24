import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";

import { createFilters } from "./filters";

export default function UserFilterDropDown({
  onClose,
  selectedFilters,
  setSelectedFilters,
}: {
  onClose: () => void;
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
}) {
  // Get the filter options from the filters.ts
  const filters = createFilters().filters;
  const [openedFilter, setOpenedFilter] = useState<string[]>([]);

  function handleToggleFilter(filterName: string) {
    setOpenedFilter((prev) =>
      prev.includes(filterName)
        ? prev.filter((name) => name !== filterName)
        : [...prev, filterName],
    );
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

  useEffect(() => {
    console.log("Selected Filters:", selectedFilters);
  }, [selectedFilters]);

  return (
    <div className="absolute right-0 z-50 mt-4 w-100 rounded-lg bg-white shadow-lg ring-1 ring-black/10">
      <div className="mb-4 flex items-start justify-between p-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          type="button"
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
          onClick={onClose}
        >
          <AiOutlineClose className="text-2xl" />
        </button>
      </div>

      {filters.length > 0 && (
        <div className="space-y-4">
          {filters.map((filter) => (
            <div key={filter.name}>
              <div
                className="text-md mb-3 px-4 font-medium"
                onClick={() => handleToggleFilter(filter.name)}
              >
                <span className="mr-2">
                  {openedFilter.includes(filter.name) ? (
                    <IoIosArrowDown className="inline text-gray-400" />
                  ) : (
                    <IoIosArrowForward className="inline text-gray-400" />
                  )}
                </span>
                {filter.header}
              </div>

              {openedFilter.includes(filter.name) && (
                <div className="space-y-2 rounded bg-gray-100 p-3">
                  {filter.options.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type={
                          filter.type === "multi-select" ? "checkbox" : "radio"
                        }
                        name={filter.name}
                        value={option.value}
                        className="custom-checkbox"
                        checked={
                          selectedFilters[filter.name]?.includes(
                            option.value,
                          ) || false
                        }
                        onChange={() =>
                          updateSelectedFilters(
                            filter.name,
                            option.value,
                            filter.type,
                          )
                        }
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
