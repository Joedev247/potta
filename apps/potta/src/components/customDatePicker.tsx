'use client';

import React, { useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@potta/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldError, UseFormRegister } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateInputProps {
  label?: string;
  placeholder?: string;
  name: string;
  className?: string;
  errors?: FieldError;
  register?: UseFormRegister<any>;
  required?: boolean;
  value?: Date;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  yearRange?: { start: number; end: number };
}

export function DateInput({
  label,
  placeholder,
  name,
  className,
  errors,
  register,
  required,
  value,
  onChange,
  yearRange = { start: 1900, end: new Date().getFullYear() },
}: DateInputProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [calendarDate, setCalendarDate] = useState<Date>(date || new Date());
  
  const months = [
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
  
  // Generate years array
  const years = Array.from(
    { length: yearRange.end - yearRange.start + 1 },
    (_, i) => yearRange.end - i
  );
  
  // Update internal state when value prop changes
  useEffect(() => {
    if (value && (!date || value.getTime() !== date.getTime())) {
      setDate(value);
      setCalendarDate(value);
    }
  }, [value]);
  
  const createSyntheticEvent = (
    date: Date | undefined
  ): React.ChangeEvent<HTMLInputElement> => {
    const inputEl = document.createElement("input");
    inputEl.type = "date";
    inputEl.name = name;
    inputEl.value = date ? date.toISOString() : "";
    
    return {
      target: inputEl,
      currentTarget: inputEl,
      nativeEvent: new Event("change"),
      bubbles: true,
      cancelable: true,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: true,
      timeStamp: Date.now(),
      type: "change",
      preventDefault: () => {},
      stopPropagation: () => {},
      isPropagationStopped: () => false,
      persist: () => {},
      isDefaultPrevented: () => false,
    } as React.ChangeEvent<HTMLInputElement>;
  };
  
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) setCalendarDate(selectedDate);
    if (onChange) {
      // Create and dispatch a synthetic event
      const syntheticEvent = createSyntheticEvent(selectedDate);
      onChange(syntheticEvent);
    }
  };
  
  const handleMonthChange = (monthValue: string) => {
    const monthIndex = months.findIndex((m) => m === monthValue);
    if (monthIndex !== -1) {
      const newDate = new Date(calendarDate);
      newDate.setMonth(monthIndex);
      setCalendarDate(newDate);
    }
  };
  
  const handleYearChange = (yearValue: string) => {
    const year = parseInt(yearValue, 10);
    const newDate = new Date(calendarDate);
    newDate.setFullYear(year);
    setCalendarDate(newDate);
  };
  
  return (
    <div>
      {label && (
        <span className="block mb-3 font-bold">
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full mt-2 p-5 py-8 justify-start text-left font-normal",
              "border border-gray-200 rounded-[2px]",
              "hover:bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              !date && "text-muted-foreground"
            )}
          >
            <div className="flex items-center w-full justify-between">
              {date ? (
                format(date, "dd/MM/yyyy")
              ) : (
                <span className="text-gray-300">
                  {placeholder || "Pick a date"}
                </span>
              )}
              <CalendarIcon
                size={60}
                className="mr-2 text-gray-300 w-[60px] h-[60px]"
              />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex p-3 space-x-2 border-b">
            <Select
              value={months[calendarDate.getMonth()]}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={calendarDate.getFullYear().toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            month={calendarDate}
            onMonthChange={setCalendarDate}
            initialFocus
            className="rounded-m"
          />
        </PopoverContent>
      </Popover>
      {errors && <small className="text-red-500">{errors.message}</small>}
      {/* Hidden input for form integration */}
      {register && (
        <input
          type="hidden"
          {...register(name)}
          value={date ? date.toISOString() : ""}
        />
      )}
    </div>
  );
}

export default DateInput;