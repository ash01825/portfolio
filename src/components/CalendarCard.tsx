"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarCard() {
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let startingDay = firstDayOfMonth.getDay();
  startingDay = startingDay === 0 ? 6 : startingDay - 1;

  const handlePrevMonth = () => {
    const prevMonth = new Date(year, month - 1, 1);
    const todayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prevMonth >= todayMonth) {
      setCurrentDate(prevMonth);
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (dayNum: number) => {
    const clickedDate = new Date(year, month, dayNum);
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (clickedDate < todayOnly) return;

    const thirtyDaysFromNow = new Date(todayOnly);
    thirtyDaysFromNow.setDate(todayOnly.getDate() + 30);
    if (clickedDate > thirtyDaysFromNow) return;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dateStr = `${monthNames[month]} ${dayNum}, ${year}`;
    const subject = encodeURIComponent(`Meeting Request for ${dateStr}`);
    const body = encodeURIComponent(
      `Hi Arsh,\n\nI'd like to schedule a chat with you on ${dateStr}.\n\nBest,\n`
    );
    window.open(`mailto:arsh.tulshyan@gmail.com?subject=${subject}&body=${body}`);
  };

  const calendarGrid = [];
  for (let i = 0; i < startingDay; i++) {
    calendarGrid.push(<div key={`empty-${i}`} className="h-7 w-7" />);
  }

  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const thirtyDaysFromNow = new Date(todayOnly);
  thirtyDaysFromNow.setDate(todayOnly.getDate() + 30);

  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const iterDate = new Date(year, month, i);
    const iterDateOnly = new Date(iterDate.getFullYear(), iterDate.getMonth(), iterDate.getDate());
    const isToday = iterDateOnly.getTime() === todayOnly.getTime();
    const isPast = iterDateOnly < todayOnly;
    const isTooFar = iterDateOnly > thirtyDaysFromNow;

    let dayClass = "text-[var(--color-text-secondary)] border border-transparent transition-fluid ";
    if (isToday) {
      dayClass += "bg-white/10 text-white shadow-sm ring-1 ring-white/10 cursor-pointer haptic-press";
    } else if (isPast || isTooFar) {
      dayClass += "text-[var(--color-text-tertiary)] opacity-30 cursor-not-allowed";
    } else {
      dayClass += "hover:bg-white/5 hover:text-[var(--color-text-primary)] cursor-pointer haptic-press";
    }

    calendarGrid.push(
      <button
        key={`day-${i}`}
        type="button"
        onClick={() => handleDateClick(i)}
        className={`h-7 w-7 mx-auto flex items-center justify-center text-[10px] font-medium rounded-full ${dayClass}`}
        title={isPast ? "Past date" : isTooFar ? "Too far in advance" : `Schedule a meeting for ${month + 1}/${i}`}
      >
        {i}
      </button>
    );
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-[var(--color-text-primary)] tracking-wide">
          {monthNames[month]}{" "}
          <span className="text-[var(--color-text-tertiary)] font-normal">{year}</span>
        </span>
        <div className="flex space-x-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] haptic-press transition-fluid"
            aria-label="Previous month"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] haptic-press transition-fluid"
            aria-label="Next month"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-[8px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{calendarGrid}</div>
    </div>
  );
}
