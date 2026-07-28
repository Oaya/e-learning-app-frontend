import { useQuery, keepPreviousData } from "@tanstack/react-query";

import type { User, UserSort } from "../../../../type/user";
import { getUsers } from "../../../../api/users";

export type UserQueryInput = {
  filters?: Record<string, string[]>;
  search?: string;
  sorts?: UserSort[];
};

export function useUsers({ filters, search, sorts }: UserQueryInput) {
  const userQuery = useQuery<User[], Error>({
    queryKey: ["users", { filters, search, sorts }],
    queryFn: () => getUsers({ filters, search, sorts }),
    staleTime: 60_000,
    placeholderData: keepPreviousData, // keep the previous data while fetching
  });

  return {
    ...userQuery,
    users: userQuery.data,
  };
}
