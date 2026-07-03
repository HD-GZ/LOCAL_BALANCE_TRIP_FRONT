import { queryOptions, useQuery } from "@tanstack/react-query";

import { checkEmailAvailability, getMe } from "@/features/user/api";

export const userQueryKeys = {
  all: ["user"] as const,
  me: () => [...userQueryKeys.all, "me"] as const,
  emailAvailability: (email: string) =>
    [...userQueryKeys.all, "email-availability", email] as const,
};

export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: userQueryKeys.me(),
      queryFn: getMe,
      retry: false,
    }),

  emailAvailability: (email: string) =>
    queryOptions({
      enabled: email.length > 0,
      queryFn: () => checkEmailAvailability({ email }),
      queryKey: userQueryKeys.emailAvailability(email),
    }),
};

export function useMeQuery() {
  return useQuery(userQueries.me());
}
