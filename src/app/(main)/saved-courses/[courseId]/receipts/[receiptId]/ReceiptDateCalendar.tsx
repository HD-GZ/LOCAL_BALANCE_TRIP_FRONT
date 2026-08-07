"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

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
    <div className="flex w-68 flex-col gap-2.5 rounded-[16px] bg-white p-3.5 shadow-[0px_12px_40px_-10px_rgba(40,36,28,0.32)]">
      <div className="flex w-full items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="cursor-pointer text-[18px] text-[#B8B3AA]"
        >
          ‹
        </button>
        <p className="text-[14.5px] font-bold text-[#222019]">
          {viewYear}년 {viewMonth + 1}월
        </p>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="cursor-pointer text-[18px] text-[#B8B3AA]"
        >
          ›
        </button>
      </div>
      <div className="flex w-full items-start">
        {WEEKDAY_LABELS.map((label) => (
          <span
            key={label}
            className="flex h-5 flex-1 items-center justify-center text-[11px] font-bold text-[#B8B3AA]"
          >
            {label}
          </span>
        ))}
      </div>
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex w-full items-start">
          {week.map((cell) => {
            const isSelected =
              cell.isCurrentMonth &&
              viewYear === selectedYear &&
              viewMonth === selectedMonth - 1 &&
              cell.day === selectedDay;

            return (
              <button
                key={cell.day}
                type="button"
                disabled={!cell.isCurrentMonth}
                onClick={() => handleSelectDay(cell.day)}
                className={cn(
                  "flex h-7.5 flex-1 items-center justify-center rounded-[17px] text-[12.5px]",
                  cell.isCurrentMonth ? "cursor-pointer text-[#222019]" : "text-[#B8B3AA]",
                  isSelected && "bg-[#2F6F4F] font-bold text-white",
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
