"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-1 items-center justify-center">
      <Button
        className="inline-flex h-13.5 gap-2.25 px-8 text-[16px] font-semibold shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_8px_18px_-10px_rgba(47,111,79,0.60)]"
        onClick={() => router.push("/propensity")}
      >
        취향진단 시작하기 <ArrowRight className="size-4.5" />
      </Button>
    </main>
  );
}
