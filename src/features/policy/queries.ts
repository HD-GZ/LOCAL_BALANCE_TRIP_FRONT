import { queryOptions } from "@tanstack/react-query";
import { getPolicyDocument } from "@/features/policy/api";
import type { PolicyDocumentType } from "@/features/policy/types";

export const policyQueryKeys = {
  all: ["policy"] as const,
  document: (type: PolicyDocumentType, locale: string) =>
    [...policyQueryKeys.all, locale, type] as const,
};

export const policyQueries = {
  document: (type: PolicyDocumentType, locale: string) =>
    queryOptions({
      queryKey: policyQueryKeys.document(type, locale),
      queryFn: () => getPolicyDocument(type),
    }),
};
