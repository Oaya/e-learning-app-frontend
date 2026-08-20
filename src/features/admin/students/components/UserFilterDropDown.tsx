import { AiOutlineClose } from "react-icons/ai";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import type { UserTableFilter } from "@/type/user";

export default function UserFilterDropDown({
  onClose,
  selectedFilters,
  openedFilter,
  filters,
  onHandleToggleFilter,
  onUpdateSelectedFilters,
}: {
  onClose: () => void;
  selectedFilters: Record<string, string[]>;
  openedFilter: string[];
  filters: UserTableFilter[];
  onHandleToggleFilter: (filterName: string) => void;
  onUpdateSelectedFilters: (
    filterName: string,
    optionValue: string,
    filterType: string,
  ) => void;
}) {
  return (
    <div
      className="absolute right-0 z-50 mt-4 w-[calc(100vw-3rem)] max-w-100 rounded-lg bg-white shadow-lg ring-1 ring-black/10"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-4 flex items-start justify-between px-4 py-2">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button type="button" className="icon-btn" onClick={onClose}>
          <AiOutlineClose size={16} />
        </button>
      </div>

      {filters.length > 0 && (
        <div className="space-y-4">
          {filters.map((filter) => (
            <div key={filter.name}>
              <div
                className="text-md mb-3 px-4 font-medium"
                onClick={() => onHandleToggleFilter(filter.name)}
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
                        onChange={(e) => {
                          e.stopPropagation();
                          onUpdateSelectedFilters(
                            filter.name,
                            option.value,
                            filter.type,
                          );
                        }}
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
