import { useQuery } from "@tanstack/react-query";
import { getPlans } from "@/api/plans";
import { unwrapResponse } from "@/api/helper";
import type { Plan } from "@/type/plan";

export function usePlans() {
  const userQuery = useQuery<Plan[], Error>({
    queryKey: ["plans"],
    queryFn: async () => unwrapResponse<Plan[]>(await getPlans()),
    staleTime: 60_000,
  });

  return {
    ...userQuery,
    plans: userQuery.data,
  };
}
