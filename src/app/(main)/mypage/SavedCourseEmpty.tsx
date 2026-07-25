"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SavedCourseEmpty() {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col items-center rounded-[18px] border border-[#C3BDB3] bg-white/50 px-7.5 py-15">
      <p className="text-center text-[18px] font-semibold tracking-[-0.36px] text-[#222019]">
        아직 저장한 코스가 없어요
      </p>
      <p className="mt-2 text-center text-[14px] text-[#5F5B53]">
        코스 추천에서 마음에 드는 코스를 저장하면 여기에 모여요.
      </p>
      <Button
        className="mt-5.5 h-12 rounded-[12px] px-6.5 text-[15px] font-semibold shadow-[0px_8px_18px_-10px_rgba(47,111,79,0.4)]"
        onClick={() => router.push("/course-recommend")}
      >
        코스 추천 보러 가기
      </Button>
    </div>
  );
}
