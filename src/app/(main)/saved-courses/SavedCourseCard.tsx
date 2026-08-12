"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookmarkX } from "lucide-react";

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

import CourseStatusBadge from "./[courseId]/CourseStatusBadge";

/**
 * 저장 코스 카드. 이전 구현은 배지와 저장취소 버튼을 사진 위에 얹었다.
 * DESIGN.md §6 규칙 4에 따라 둘 다 사진 밖으로 내렸고, 그 덕에 겹친 클릭 영역
 * (절대 위치 Link + z-index 버튼)도 사라졌다.
 */
export default function SavedCourseCard({ course }: { course: SavedCourse }) {
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
  const hasPhoto = Boolean(course.imageUrl) && !hasError;

  return (
    <div className="border-line bg-surface hover:border-line-strong flex h-full flex-col overflow-hidden rounded-md border transition-colors duration-(--dur-2)">
      <Link
        href={`/saved-courses/${course.savedCourseId}`}
        className="group flex flex-1 flex-col"
        aria-label={course.courseName}
      >
        <span className="bg-paper-sunk relative block aspect-[4/3] w-full overflow-hidden">
          {hasPhoto && course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 18rem"
              className="lift-zoom object-cover"
              onError={() => setHasError(true)}
            />
          ) : (
            <RouteMarker
              aria-hidden
              className="text-ink-3 absolute top-1/2 left-1/2 size-8 -translate-x-1/2 -translate-y-1/2"
            />
          )}
        </span>
        <span className="flex flex-1 flex-col gap-2 px-4 pt-4">
          <CourseStatusBadge status={course.status} />
          <span className="text-title-3 text-ink group-hover:text-brand-ink line-clamp-2 transition-colors duration-(--dur-1)">
            {course.courseName}
          </span>
        </span>
      </Link>

      <div className="border-line mt-4 border-t px-2 py-1">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <BookmarkX className="size-3.5" strokeWidth={1.75} />
              저장 취소
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>저장을 취소할까요?</DialogTitle>
            <DialogDescription>
              이 코스가 저장한 코스 목록에서 사라져요. 코스 추천에서 언제든 다시 저장할 수 있어요.
            </DialogDescription>
            {deleteMutation.isError && (
              <p role="alert" className="text-danger-ink text-cap mt-3 font-medium">
                삭제 중 오류가 발생했어요. 다시 시도해 주세요.
              </p>
            )}
            <div className="mt-6 flex w-full gap-3">
              <DialogClose asChild>
                <Button variant="outline" size="lg" className="flex-1">
                  돌아가기
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                size="lg"
                className="flex-1"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
              >
                {deleteMutation.isPending ? "취소하는 중..." : "저장 취소"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
