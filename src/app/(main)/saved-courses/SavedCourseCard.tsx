"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Check } from "lucide-react";
import RouteMarker from "@/assets/routeMarker.svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteSavedCourse } from "@/features/recommendation/api";
import { recommendationQueryKeys } from "@/features/recommendation/queries";
import type { SavedCourse } from "@/features/recommendation/types";
import { cn } from "@/lib/utils";

type SavedCourseCardProps = {
  course: SavedCourse;
};

const STATUS_BADGE: Partial<Record<SavedCourse["status"], { label: string; className: string }>> = {
  TRAVELING: { label: "진행 중", className: "bg-[#B5654A]/92" },
  COMPLETED: { label: "완주", className: "bg-[#2F6F4F]/92" },
};

export default function SavedCourseCard({ course }: SavedCourseCardProps) {
  const [hasError, setHasError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: () => deleteSavedCourse(course.savedCourseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recommendationQueryKeys.savedCoursesAll() });
      setIsDialogOpen(false);
    },
  });
  const statusBadge = STATUS_BADGE[course.status];

  return (
    <div className="flex flex-col items-start overflow-hidden rounded-[18px] border border-[#EBE7DF] bg-white">
      <div className="relative h-44.25 w-full bg-linear-to-br from-[#E7F0EA] via-[#DFEEE4] to-[#D3E6DA]">
        {course.imageUrl && !hasError ? (
          <Image
            src={course.imageUrl}
            alt={course.courseName}
            fill
            sizes="236px"
            className="object-cover"
            onError={() => setHasError(true)}
          />
        ) : (
          <RouteMarker className="absolute top-1/2 left-1/2 size-11 -translate-x-1/2 -translate-y-1/2" />
        )}
        {statusBadge && (
          <span
            className={cn(
              "absolute top-2.5 left-2.5 flex h-6.5 items-center gap-1.25 rounded-full pr-2.75 pl-2.25 text-[11.5px] font-semibold tracking-[-0.115px] text-white",
              statusBadge.className,
            )}
          >
            {course.status === "COMPLETED" ? (
              <Check className="size-3" />
            ) : (
              <span className="size-1.75 rounded-full bg-white" />
            )}
            {statusBadge.label}
          </span>
        )}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="저장 취소"
              className="absolute top-2.5 right-2.5 flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#EBE7DF] bg-white/90"
            >
              <Bookmark className="size-4 fill-[#5B7488] text-[#5B7488]" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>저장을 취소할까요?</DialogTitle>
            <DialogDescription>
              이 코스가 저장한 코스 목록에서 사라져요. 코스 추천에서 언제든 다시 저장할 수 있어요.
            </DialogDescription>
            {deleteMutation.isError && (
              <p className="mt-2 text-[12px] text-red-500">
                삭제 중 오류가 발생했어요. 다시 시도해 주세요.
              </p>
            )}
            <div className="mt-5.5 flex w-full gap-2.5">
              <DialogClose asChild>
                <Button className="h-12.5 flex-1 border border-[#C3BDB3] bg-white text-[15px] font-semibold tracking-[-0.15px] text-[#222019] hover:bg-gray-100">
                  돌아가기
                </Button>
              </DialogClose>
              <Button
                className="h-12.5 flex-1 bg-[#B97056] text-[15px] font-semibold tracking-[-0.15px] text-white hover:bg-[#B97056]/90"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
              >
                {deleteMutation.isPending ? "취소하는 중..." : "저장 취소"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <p className="w-full px-4 pt-3.75 pb-4.25 text-[15.5px] font-semibold tracking-[-0.31px] text-[#222019]">
        {course.courseName}
      </p>
    </div>
  );
}
