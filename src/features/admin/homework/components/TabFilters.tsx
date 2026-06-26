import { capitalize } from "../../../../utils/helper";

type TabFiltersProps = {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
};

export default function TabFilters({
  tabs,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
}: TabFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
            activeTab === tab
              ? "border-theme-yellow-20 bg-theme-yellow-20 text-white"
              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
          }`}
        >
          {capitalize(tab)}
        </button>
      ))}
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="focus:border-theme-green-20 ml-auto w-80 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none"
      />
    </div>
  );
}
