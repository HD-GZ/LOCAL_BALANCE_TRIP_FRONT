import { queryOptions } from "@tanstack/react-query";

import { checkEmailAvailability } from "@/features/user/api";

export const userQueryKeys = {
  all: ["user"] as const,
  emailAvailability: (email: string) =>
    [...userQueryKeys.all, "email-availability", email] as const,
};

export const userQueries = {
  emailAvailability: (email: string) =>
    queryOptions({
      enabled: email.length > 0,
      queryFn: () => checkEmailAvailability({ email }),
      queryKey: userQueryKeys.emailAvailability(email),
    }),
};
