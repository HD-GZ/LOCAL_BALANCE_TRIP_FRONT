import { queryOptions } from "@tanstack/react-query";
import { getPolicyDocument } from "@/features/policy/api";
import type { PolicyDocumentType } from "@/features/policy/types";

export const policyQueryKeys = {
  all: ["policy"] as const,
  document: (type: PolicyDocumentType) => [...policyQueryKeys.all, type] as const,
};

export const policyQueries = {
  document: (type: PolicyDocumentType) =>
    queryOptions({
      queryKey: policyQueryKeys.document(type),
      queryFn: () => getPolicyDocument(type),
    }),
};
