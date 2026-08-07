"use client";

import { useMeQuery } from "@/features/user/queries";
import { isApiError } from "@/lib/api/error";
import AccountForm from "./AccountForm";

export default function MyAccountPage() {
  const meQuery = useMeQuery();

  return (
    <div className="flex w-full justify-center px-6 pt-11 pb-16">
      <main className="w-full max-w-170 rounded-[18px] border border-[#EBE7DF] bg-white px-8 py-7 shadow-[0_12px_32px_-12px_rgba(41,36,28,0.14)]">
        {meQuery.isPending && <p className="text-[14px] text-[#928D84]">불러오는 중...</p>}
        {meQuery.isError && (
          <p className="text-[13px] text-red-500">
            {isApiError(meQuery.error)
              ? meQuery.error.message
              : "회원 정보를 불러오는 중 오류가 발생했습니다."}
          </p>
        )}
        {meQuery.isSuccess && <AccountForm user={meQuery.data} />}
      </main>
    </div>
  );
}
