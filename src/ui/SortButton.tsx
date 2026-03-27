import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

export default function SortButton({ sort }: { sort?: "asc" | "desc" }) {
  const activeColor = "text-gray-800";
  const inactiveColor = "text-gray-400";

  return (
    <span className="ml-1 flex flex-col text-xs leading-none">
      <TiArrowSortedUp
        className={`cursor-pointer ${sort === "asc" ? activeColor : inactiveColor}`}
      />
      <TiArrowSortedDown
        className={`-mt-1 cursor-pointer ${sort === "desc" ? activeColor : inactiveColor}`}
      />
    </span>
  );
}
