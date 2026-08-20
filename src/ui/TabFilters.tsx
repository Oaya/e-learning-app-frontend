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
    <div className="scrollbar-none flex flex-nowrap items-center gap-2 overflow-x-auto md:flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`shrink-0 cursor-pointer rounded-lg border px-3 py-1 text-xs font-medium whitespace-nowrap transition md:rounded-xl md:px-3 md:py-1.5 md:text-[16px] ${
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
