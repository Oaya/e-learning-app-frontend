import { useQuery } from "@tanstack/react-query";

import type { Instructor } from "../type/user";
import { getInstructors } from "../api/users";

export function useInstructors() {
  const userQuery = useQuery<Instructor[], Error>({
    queryKey: ["instructors"],
    queryFn: getInstructors,
    staleTime: 60_000,
  });

  return {
    ...userQuery,
    instructors: userQuery.data,
  };
}
