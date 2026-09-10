"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

/** 날짜 선택. 달력 숫자는 전부 고정폭이어야 격자가 흔들리지 않는다 (DESIGN.md §6 규칙 2). */

type CalendarCell = { day: number; isCurrentMonth: boolean };

function getCalendarWeeks(year: number, month: number): CalendarCell[][] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: CalendarCell[] = [];
  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, isCurrentMonth: true });
  }
  let nextMonthDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextMonthDay, isCurrentMonth: false });
    nextMonthDay += 1;
  }

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export default function ReceiptDateCalendar({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (date: string) => void;
}) {
  const [selectedYear, selectedMonth, selectedDay] = value.split("-").map(Number) as [
    number,
    number,
    number,
  ];
  const [viewYear, setViewYear] = useState(selectedYear);
  const [viewMonth, setViewMonth] = useState(selectedMonth - 1);
  const t = useTranslations("receipts");
  const weekdayLabels = [
    t("calendar.weekdays.sun"),
    t("calendar.weekdays.mon"),
    t("calendar.weekdays.tue"),
    t("calendar.weekdays.wed"),
    t("calendar.weekdays.thu"),
    t("calendar.weekdays.fri"),
    t("calendar.weekdays.sat"),
  ];

  const changeMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const handleSelectDay = (day: number) => {
    const month = String(viewMonth + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");
    onSelect(`${viewYear}-${month}-${date}`);
  };

  const weeks = getCalendarWeeks(viewYear, viewMonth);

  return (
    <div className="bg-surface shadow-overlay flex w-70 flex-col gap-2 rounded-md p-3">
      <div className="flex w-full items-center justify-between">
        <button
          type="button"
          aria-label={t("calendar.prevMonthAria")}
          onClick={() => changeMonth(-1)}
          className="press text-ink-2 hover:bg-surface-2 flex size-8 cursor-pointer items-center justify-center rounded-sm"
        >
          <ChevronLeft className="size-4" strokeWidth={1.75} />
        </button>
        <p className="text-title-3 text-ink tabular-nums">
          {viewYear}. {String(viewMonth + 1).padStart(2, "0")}
        </p>
        <button
          type="button"
          aria-label={t("calendar.nextMonthAria")}
          onClick={() => changeMonth(1)}
          className="press text-ink-2 hover:bg-surface-2 flex size-8 cursor-pointer items-center justify-center rounded-sm"
        >
          <ChevronRight className="size-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="border-line flex w-full border-b pb-1.5">
        {weekdayLabels.map((label) => (
          <span key={label} className="text-ink-3 text-cap flex flex-1 items-center justify-center">
            {label}
          </span>
        ))}
      </div>

      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex w-full">
          {week.map((cell, cellIndex) => {
            const isSelected =
              cell.isCurrentMonth &&
              viewYear === selectedYear &&
              viewMonth === selectedMonth - 1 &&
              cell.day === selectedDay;

            return (
              <button
                key={`${weekIndex}-${cellIndex}`}
                type="button"
                disabled={!cell.isCurrentMonth}
                aria-current={isSelected ? "date" : undefined}
                onClick={() => handleSelectDay(cell.day)}
                className={cn(
                  "text-num mx-px flex h-8 flex-1 items-center justify-center rounded-sm tabular-nums transition-colors duration-(--dur-1)",
                  cell.isCurrentMonth
                    ? "text-ink hover:bg-surface-2 cursor-pointer"
                    : "text-ink-3/60 cursor-default",
                  isSelected && "bg-brand hover:bg-brand text-brand-on font-semibold",
                )}
              >
                {cell.day}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
