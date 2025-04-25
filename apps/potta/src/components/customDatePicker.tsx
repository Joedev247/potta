'use client';

import React from 'react';
import { DatePicker as HeroDatePicker } from '@heroui/date-picker';
import { CalendarDate, toCalendarDate } from '@internationalized/date';

interface CustomDatePickerProps {
  label: string;
  placeholder: string;
  value: CalendarDate | null;
  onChange: (value: CalendarDate | null) => void;
  isRequired?: boolean;
  className?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  placeholder,
  value,
  onChange,
  isRequired = false,
  className,
}) => {
  return (
    <div>
      <HeroDatePicker
        label={label}
        className={className}
        placeholder={placeholder}
        value={value || undefined}
        onChange={(value) =>
          onChange(value ? toCalendarDate(value as any) : null)
        }
        isRequired={isRequired}
        showMonthAndYearPickers
        classNames={{
          base: 'max-w-full',
          label: 'font-bold text-sm mb-1 block',
          inputWrapper: 'border border-gray-300 rounded-md bg-white p-2',
          calendar: 'bg-white shadow-lg border border-gray-200 p-2',
          calendarHeader: 'bg-white p-2',
          calendarHeaderItem: 'text-gray-700 p-1',
          calendarHeaderTitle: 'text-gray-800 font-semibold p-2',
          calendarBody: 'bg-white p-1',
          calendarFooter: 'bg-white p-2',
          yearGrid: 'bg-white grid grid-cols-4 gap-2 p-2',
          monthGrid: 'bg-white grid grid-cols-3 gap-2 p-2',
          monthCell:
            'p-2 rounded hover:bg-green-100 text-center cursor-pointer',
          yearCell: 'p-2 rounded hover:bg-green-100 text-center cursor-pointer',
          selectedMonth: 'bg-green-500 text-white rounded',
          selectedYear: 'bg-green-500 text-white rounded',
          monthText: 'text-gray-800',
          yearText: 'text-gray-800',
          dayCell: 'p-2 rounded hover:bg-green-100 text-center cursor-pointer',
          today: 'bg-green-50 text-green-600 font-semibold',
          selectedDate: 'bg-green-500 text-white hover:bg-green-600 rounded',
          weekdayCell: 'p-1 text-gray-500 text-center',
          monthAndYearCell: 'p-2 hover:bg-green-100 rounded cursor-pointer',
        }}
        popoverProps={{
          classNames: {
            content: 'bg-white p-2 border border-gray-200 shadow-lg rounded-md',
            trigger: 'w-full',
          },
          placement: 'bottom-start',
          offset: 8,
        }}
      />
    </div>
  );
};

export default CustomDatePicker;
