"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";

interface TodoDateCalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}

export function TodoDateCalendar({
  selected,
  onSelect,
  className,
}: TodoDateCalendarProps) {
  const [viewDate, setViewDate] = React.useState(
    selected || new Date()
  );
  const [view, setView] = React.useState<"days" | "years">("days");

  const currentYear = new Date().getFullYear();
  const minYear = currentYear;
  const maxYear = currentYear + 100;

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Month names
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

  // Day names
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Navigate months
  const goToPreviousMonth = () => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    setViewDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    if (newDate.getFullYear() <= maxYear) {
      setViewDate(newDate);
    }
  };

  // Navigate years
  const goToPreviousYearPage = () => {
    const newYear = viewDate.getFullYear() - 12;
    if (newYear >= minYear) {
      setViewDate(new Date(newYear, viewDate.getMonth(), 1));
    }
  };

  const goToNextYearPage = () => {
    const newYear = viewDate.getFullYear() + 12;
    if (newYear <= maxYear) {
      setViewDate(new Date(newYear, viewDate.getMonth(), 1));
    }
  };

  // Select a day
  const selectDay = (day: number) => {
    const newDate = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      day
    );
    // Only allow future dates (not today or past)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate > today) {
      onSelect?.(newDate);
    }
  };

  // Select a year
  const selectYear = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
    setView("days");
  };

  // Check if date is selected
  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === viewDate.getMonth() &&
      selected.getFullYear() === viewDate.getFullYear()
    );
  };

  // Check if date is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === viewDate.getMonth() &&
      today.getFullYear() === viewDate.getFullYear()
    );
  };

  // Check if date is today or in the past (disabled for todos)
  const isTodayOrPast = (day: number) => {
    const date = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      day
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date <= today;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    const days = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Generate year grid (12 years at a time)
  const generateYearGrid = () => {
    const currentViewYear = viewDate.getFullYear();
    const startYear = Math.floor(currentViewYear / 12) * 12;
    const years = [];

    for (let i = 0; i < 12; i++) {
      const year = startYear + i;
      if (year >= minYear && year <= maxYear) {
        years.push(year);
      }
    }

    return years;
  };

  const calendarDays = generateCalendarDays();
  const yearGrid = generateYearGrid();

  return (
    <div className={cn("w-[280px] p-3", className)}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="icon"
          className="size-7 bg-transparent p-0 hover:bg-teal-700 hover:text-white transition-colors"
          onClick={view === "days" ? goToPreviousMonth : goToPreviousYearPage}
        >
          <ChevronLeft className="size-4" />
        </Button>

        <button
          className="text-sm font-medium hover:bg-teal-700 hover:text-white rounded-md px-3 py-1 transition-colors"
          onClick={() => setView(view === "days" ? "years" : "days")}
        >
          {view === "days"
            ? `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`
            : `${yearGrid[0]} - ${yearGrid[yearGrid.length - 1]}`}
        </button>

        <Button
          variant="outline"
          size="icon"
          className="size-7 bg-transparent p-0 hover:bg-teal-700 hover:text-white transition-colors"
          onClick={view === "days" ? goToNextMonth : goToNextYearPage}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Fixed height container to prevent size changes */}
      <div className="h-[240px]">
        {view === "days" ? (
          <div>
            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs text-muted-foreground font-normal h-8 flex items-center justify-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div key={index} className="h-8 flex items-center justify-center">
                  {day ? (
                    <button
                      className={cn(
                        "size-8 rounded-md text-sm font-normal transition-colors",
                        "hover:text-teal-700 dark:hover:text-[#7FD6C8] dark:active:text-[#5FBFB0]",
                        isSelected(day) &&
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                        isTodayOrPast(day) &&
                          "text-muted-foreground opacity-40 cursor-not-allowed hover:text-muted-foreground"
                      )}
                      onClick={() => selectDay(day)}
                      disabled={isTodayOrPast(day)}
                    >
                      {day}
                    </button>
                  ) : (
                    <div className="size-8" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {yearGrid.map((year) => (
              <button
                key={year}
                className={cn(
                  "h-12 rounded-md text-sm font-normal transition-colors",
                  "hover:bg-teal-700 hover:text-white",
                  selected?.getFullYear() === year &&
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  year === currentYear &&
                    selected?.getFullYear() !== year &&
                    "bg-teal-700 text-white"
                )}
                onClick={() => selectYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}