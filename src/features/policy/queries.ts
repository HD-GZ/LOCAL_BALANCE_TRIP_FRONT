import { queryOptions } from "@tanstack/react-query";
import { getPolicyDocument } from "@/features/policy/api";
import type { PolicyDocumentType } from "@/features/policy/types";
import type { Locale } from "next-intl";

export const policyQueryKeys = {
  all: ["policy"] as const,
  document: (type: PolicyDocumentType, locale: Locale) =>
    [...policyQueryKeys.all, locale, type] as const,
};

export const policyQueries = {
  document: (type: PolicyDocumentType, locale: Locale) =>
    queryOptions({
      queryKey: policyQueryKeys.document(type, locale),
      queryFn: () => getPolicyDocument(type),
    }),
};
