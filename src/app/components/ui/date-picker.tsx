"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";
import { BirthDateCalendar } from "./birth-date-calendar";
import { TodoDateCalendar } from "./todo-date-calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: "birthdate" | "todo";
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
  variant = "birthdate",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    onChange?.(date);
    // Close the popover when a date is selected
    if (date) {
      setOpen(false);
    }
  };

  const CalendarComponent =
    variant === "todo" ? TodoDateCalendar : BirthDateCalendar;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-9 px-3 bg-input-background border-gray-200 dark:border-gray-700 hover:bg-input-background/80 hover:text-foreground",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate hover:text-foreground">
            {value ? format(value, "PPP") : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent selected={value} onSelect={handleDateSelect} />
      </PopoverContent>
    </Popover>
  );
}