import { capitalize } from "@/utils/helper";

type TabFiltersProps = {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function TabFilters({
  tabs,
  activeTab,
  onTabChange,
}: TabFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`cursor-pointer rounded-full border px-1.5 py-1 text-xs font-medium transition md:px-3 md:py-1.5 ${
            activeTab === tab
              ? "border-theme-purple-40 bg-theme-purple-40 text-white"
              : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
          }`}
        >
          {capitalize(tab)}
        </button>
      ))}
    </div>
  );
}
