"use client";

import { useTranslations } from "next-intl";

import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { useMeQuery } from "@/features/user/queries";
import { isApiError } from "@/lib/api/error";

import AccountForm from "./AccountForm";

export default function MyAccountPage() {
  const t = useTranslations("page");
  const tCommon = useTranslations();
  const meQuery = useMeQuery();

  return (
    <main className="w-full flex-1 pb-20">
      <div className="mx-auto w-full max-w-[62rem] px-4 pt-10 md:px-8 md:pt-14">
        {meQuery.isPending && (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-8 w-40" />
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-11 w-full" rounded="xs" />
              </div>
            ))}
          </div>
        )}

        {meQuery.isError && (
          <SurfaceState
            tone="error"
            title={t("errorTitle")}
            description={
              isApiError(meQuery.error) ? meQuery.error.message : t("errorDescriptionFallback")
            }
            action={{ label: tCommon("retry"), onRetry: () => meQuery.refetch() }}
          />
        )}

        {meQuery.isSuccess && (
          <div className="border-line bg-surface shadow-card rounded-md border px-6 py-7 sm:px-8">
            <AccountForm user={meQuery.data} />
          </div>
        )}
      </div>
    </main>
  );
}
