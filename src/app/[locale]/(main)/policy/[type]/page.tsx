"use client";

import { notFound, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useTranslations } from "next-intl";
import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { policyQueries } from "@/features/policy/queries";
import type { PolicyDocumentType } from "@/features/policy/types";
import { isApiError } from "@/lib/api/error";

import PolicyContent from "./PolicyContent";

const ROUTE_TYPE_TO_API_TYPE: Record<string, PolicyDocumentType> = {
  terms: "service",
  privacy: "privacy",
};

export default function PolicyDocumentPage() {
  const { type: routeType } = useParams<{ type: string }>();
  const apiType = ROUTE_TYPE_TO_API_TYPE[routeType];
  const t = useTranslations("policy");

  if (!apiType) {
    notFound();
  }

  const documentQuery = useQuery(policyQueries.document(apiType));
  const document = documentQuery.data;

  return (
    <main className="w-full flex-1 pb-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col px-4 pt-10 md:px-8 md:pt-14">
        <div className="mx-auto flex w-full max-w-[45rem] flex-col items-center gap-8">
          {documentQuery.isPending && (
            <div className="border-line bg-surface flex w-full flex-col gap-4 rounded-md border px-6 py-8">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-32" />
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} className="mt-2 h-4 w-full" />
              ))}
            </div>
          )}

          {documentQuery.isError && (
            <SurfaceState
              tone="error"
              title={t("error.title")}
              description={
                isApiError(documentQuery.error) ? documentQuery.error.message : t("error.network")
              }
              action={{ label: t("error.retry"), onRetry: () => documentQuery.refetch() }}
            />
          )}

          {document && (
            <div className="border-line bg-surface flex w-full flex-col gap-4 rounded-md border px-6 py-8 sm:px-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-title-1 text-ink">{document.title}</h1>
                <p className="text-ink-3 text-cap">
                  {t("main.version", {
                    version: document.version,
                    effectiveDate: document.effectiveDate,
                  })}
                </p>
              </div>

              <div className="border-line border-t pt-4">
                <PolicyContent content={document.content} />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
