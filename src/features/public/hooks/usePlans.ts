import { useQuery } from "@tanstack/react-query";
import { getPlans } from "../../../api/plans";
import type { Plan } from "../../../type/plan";

export function usePlans() {
  const userQuery = useQuery<Plan[], Error>({
    queryKey: ["plans"],
    queryFn: () => getPlans(),
    staleTime: 60_000,
  });

  console.log("Plans fetched:", userQuery.data);
  return {
    ...userQuery,
    plans: userQuery.data,
  };
}
