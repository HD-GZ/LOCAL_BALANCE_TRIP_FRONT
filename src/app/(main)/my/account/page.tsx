"use client";

import Skeleton from "@/components/common/Skeleton";
import SurfaceState from "@/components/common/SurfaceState";
import { useMeQuery } from "@/features/user/queries";
import { isApiError } from "@/lib/api/error";

import AccountForm from "./AccountForm";

export default function MyAccountPage() {
  const meQuery = useMeQuery();

  return (
    <main className="w-full flex-1 pb-20">
      <div className="mx-auto flex w-full max-w-[46rem] flex-col px-4 pt-10 md:pt-14">
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
            title="회원 정보를 불러오지 못했어요"
            description={
              isApiError(meQuery.error)
                ? meQuery.error.message
                : "네트워크 상태를 확인한 뒤 다시 시도해 주세요."
            }
            action={{ label: "다시 시도", onRetry: () => meQuery.refetch() }}
          />
        )}

        {meQuery.isSuccess && <AccountForm user={meQuery.data} />}
      </div>
    </main>
  );
}
