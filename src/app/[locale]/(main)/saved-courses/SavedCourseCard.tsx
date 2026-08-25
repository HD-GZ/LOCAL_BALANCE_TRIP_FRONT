"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { useTranslations } from "next-intl";

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
 * 저장 코스 카드. 기존 디자인(develop)의 배치로 되돌렸다 — 팀 합의 사항.
 * 상태 배지는 사진 왼쪽 위, 저장취소는 사진 오른쪽 위 북마크 버튼.
 *
 * 단, 카드 전체를 덮는 절대 위치 Link 는 되살리지 않았다. 그러면 북마크 버튼과
 * 클릭 영역이 겹쳐 서로를 가린다. Link 는 사진·제목 영역만 감싼다.
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
  const t = useTranslations("savedCourses");
  const hasPhoto = Boolean(course.imageUrl) && !hasError;

  return (
    <div className="border-line bg-surface shadow-card relative flex h-full flex-col overflow-hidden rounded-md border">
      <Link
        href={`/saved-courses/${course.savedCourseId}`}
        className="group flex flex-1 flex-col"
        aria-label={course.courseName}
      >
        <span className="relative block aspect-[4/3] w-full overflow-hidden bg-[image:var(--thumb-gradient)]">
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
          <span className="absolute top-2.5 left-2.5">
            <CourseStatusBadge status={course.status} onPhoto />
          </span>
        </span>
        <span className="flex flex-1 flex-col px-4 pt-3.5 pb-4">
          <span className="text-title-3 text-ink group-hover:text-brand-ink line-clamp-2 transition-colors duration-(--dur-1)">
            {course.courseName}
          </span>
        </span>
      </Link>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="absolute top-2.5 right-2.5 z-10">
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={t("card.bookmarkAria")}
              className="press border-line bg-surface/90 text-ink-2 hover:text-brand-ink flex size-8 cursor-pointer items-center justify-center rounded-full border backdrop-blur-[2px]"
            >
              <Bookmark className="size-4 fill-current" strokeWidth={1.75} />
            </button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogTitle>{t("card.dialog.title")}</DialogTitle>
          <DialogDescription>{t("card.dialog.description")}</DialogDescription>
          {deleteMutation.isError && (
            <p role="alert" className="text-danger-ink text-cap mt-3 font-medium">
              {t("card.dialog.error")}
            </p>
          )}
          <div className="mt-6 flex w-full gap-3">
            <DialogClose asChild>
              <Button variant="outline" size="lg" className="flex-1">
                {t("card.dialog.cancel")}
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              size="lg"
              className="flex-1"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending
                ? t("card.dialog.confirmPending")
                : t("card.dialog.confirm")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
