import { useQuery } from "@tanstack/react-query";

import type { Plan } from "../type/plan";
import { getPlans } from "../api/plans";

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
