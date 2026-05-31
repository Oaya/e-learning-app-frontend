import { useQuery } from "@tanstack/react-query";

import type { UserNameAndAvatar } from "../../../../type/user";
import { getInstructors } from "../../../../api/users";

export function useInstructors() {
  const userQuery = useQuery<UserNameAndAvatar[], Error>({
    queryKey: ["instructors"],
    queryFn: getInstructors,
    staleTime: 60_000,
  });

  console.log("Instructors fetched:", userQuery.data);

  return {
    ...userQuery,
    instructors: userQuery.data,
  };
}
