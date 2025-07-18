'use client';

import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@potta/lib/utils';
import { Button } from '@potta/components/shadcn/button';
import { Calendar } from '@potta/components/shadcn/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@potta/components/shadcn/popover';
import { FieldError, UseFormRegister } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@potta/components/shadcn/select';
import { CalendarDate as InternationalCalendarDate } from '@internationalized/date';

// Interface for the DateInput component (using native Date objects)
interface DateInputProps {
  label?: string;
  placeholder?: string;
  name: string;
  className?: string;
  errors?: FieldError;
  register?: UseFormRegister<any>;
  required?: boolean;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  yearRange?: { start: number; end: number };
}

// Interface for the CustomDatePicker component (using CalendarDate objects)
interface CustomDatePickerProps {
  label: string;
  placeholder: string;
  value: InternationalCalendarDate | null;
  onChange: (value: InternationalCalendarDate | null) => void;
  isRequired?: boolean;
  className?: string;
  yearRange?: { start: number; end: number };
}

// Export the DateInput component for use with native Date objects
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
  yearRange = { start: 1900, end: new Date().getFullYear() + 10 },
}: DateInputProps) {
  // Add validation when initializing the date state
  const [date, setDate] = useState<Date | undefined>(
    value && value instanceof Date && !isNaN(value.getTime())
      ? value
      : undefined
  );

  // Initialize calendar date with a valid date
  const [calendarDate, setCalendarDate] = useState<Date>(
    date && date instanceof Date && !isNaN(date.getTime())
      ? new Date(date)
      : new Date()
  );

  // Track popover open state
  const [open, setOpen] = useState(false);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Generate years array
  const years = Array.from(
    { length: yearRange.end - yearRange.start + 1 },
    (_, i) => yearRange.start + i
  );

  // Update internal state when value prop changes
  useEffect(() => {
    if (value && value instanceof Date && !isNaN(value.getTime())) {
      if (!date || value.getTime() !== date.getTime()) {
        setDate(value);
        setCalendarDate(new Date(value));
      }
    } else if (value === undefined && date !== undefined) {
      setDate(undefined);
    }
  }, [value, date]);

  const handleSelect = (selectedDate: Date | undefined) => {
    // Validate the date before setting it
    if (
      selectedDate &&
      selectedDate instanceof Date &&
      !isNaN(selectedDate.getTime())
    ) {
      setDate(selectedDate);
      setCalendarDate(new Date(selectedDate));
      if (onChange) {
        onChange(selectedDate);
      }
      setOpen(false); // Close the popover after selection
    } else if (selectedDate === undefined) {
      // Handle clearing the date
      setDate(undefined);
      if (onChange) {
        onChange(undefined);
      }
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
    if (!isNaN(year)) {
      const newDate = new Date(calendarDate);
      newDate.setFullYear(year);
      setCalendarDate(newDate);
    }
  };

  // Helper function to check if a date is valid
  const isValidDate = (date: any): date is Date => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  return (
    <div className={className}>
      {label && (
        <span className="block mb-2 font-bold">
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              'w-full p-5 py-[22px] justify-start text-left font-normal',
              'border border-gray-300 rounded-[4px]',
              'hover:bg-transparent focus:ring-2 focus:ring-green-500 focus:border-green-500',
              !isValidDate(date) && 'text-muted-foreground'
            )}
          >
            <div className="flex items-center w-full justify-between">
              {isValidDate(date) ? (
                format(date, 'dd/MM/yyyy')
              ) : (
                <span className="text-gray-300">
                  {placeholder || 'Pick a date'}
                </span>
              )}
              <CalendarIcon className="ml-2 text-gray-300 w-5 h-5" />
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
            selected={isValidDate(date) ? date : undefined}
            onSelect={handleSelect}
            month={calendarDate}
            onMonthChange={setCalendarDate}
            initialFocus
            className="rounded-md"
          />
        </PopoverContent>
      </Popover>
      {errors && <small className="text-red-500">{errors.message}</small>}
      {/* Hidden input for form integration */}
      {register && (
        <input
          type="hidden"
          {...register(name)}
          value={isValidDate(date) ? date.toISOString() : ''}
        />
      )}
    </div>
  );
}

// Create a CustomDatePicker component that uses the DateInput with CalendarDate
const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  placeholder,
  value,
  onChange,
  isRequired = false,
  className,
  yearRange,
}) => {
  // Convert CalendarDate to native Date
  const calendarDateToDate = (
    calendarDate: InternationalCalendarDate | null
  ): Date | undefined => {
    if (!calendarDate) return undefined;
    return new Date(
      calendarDate.year,
      calendarDate.month - 1,
      calendarDate.day
    );
  };

  // Convert native Date to CalendarDate
  const dateToCalendarDate = (
    date: Date | undefined
  ): InternationalCalendarDate | null => {
    if (!date || isNaN(date.getTime())) return null;
    return new InternationalCalendarDate(
      date.getFullYear(),
      date.getMonth() + 1, // Month is 0-indexed in Date but 1-indexed in CalendarDate
      date.getDate()
    );
  };

  // Handle date selection
  const handleDateChange = (selectedDate: Date | undefined) => {
    const calendarDate = dateToCalendarDate(selectedDate);
    onChange(calendarDate);
  };

  return (
    <DateInput
      label={label}
      placeholder={placeholder}
      name={`${label.toLowerCase().replace(/\s+/g, '-')}-date-input`}
      value={calendarDateToDate(value)}
      onChange={handleDateChange}
      required={isRequired}
      className={className}
      yearRange={yearRange}
    />
  );
};

// Export both components
export { CustomDatePicker };
export default CustomDatePicker;
