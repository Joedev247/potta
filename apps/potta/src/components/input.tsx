import React, { useState } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@potta/lib/utils";
import { Button } from "@potta/components/shadcn/button";
import { Calendar } from "@potta/components/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@potta/components/shadcn/popover";

// Create a custom error type that can handle both FieldError and simple message objects
type CustomError = FieldError | { message: string };

type Props = {
  label?: string | React.ReactNode;
  type: string;
  className?: string;
  name: string;
  errors?: CustomError;
  placeholder?: string;
  register?: UseFormRegister<any>;
  onchange?: (event: React.ChangeEvent<HTMLInputElement> | string) => void;
  value?: string | number;
  height?: boolean;
  required?: boolean;
  autocomplete?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
};

const Input: React.FC<Props> = ({
  label,
  type,
  className,
  name,
  placeholder,
  required,
  errors,
  register,
  value,
  height,
  onchange,
  autocomplete,
  disabled,
  min,
  max,
}) => {
  // Get register props if register is provided
  const registerProps = register ? register(name) : {};

  // If onchange is provided, use it instead of register's onChange
  const inputProps = onchange
    ? { ...registerProps, onChange: onchange }
    : registerProps;

  // For date picker
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value.toString()) : undefined
  );

  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate && onchange) {
      // Format the date as YYYY-MM-DD for HTML input compatibility
      const formattedDate = format(newDate, "yyyy-MM-dd");
      onchange(formattedDate);
    }
  };

  // Render date picker if type is date
  if (type === "date") {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <span className="mb-3 text-lg text-gray-900 font-medium">
            {label}
            {required && <span className="text-red-500">*</span>}
          </span>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className={`w-full justify-start shadow-none h-11 text-left font-normal mt-2 ${
                !date && "text-gray-500"
              } ${
                height ? "py-1.5" : "py-2.5"
              } hover:bg-gray-50`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : placeholder || "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors ? (
          <small className="col-span-2 text-red-500">{errors?.message}</small>
        ) : null}
      </div>
    );
  }

  // Render regular input for other types
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <span className="mb-3 text-lg text-gray-900 font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      )}
      <input
        disabled={disabled}
        autoComplete={autocomplete ? "off" : "on"}
        type={type}
        max={max}
        min={min}
        value={value}
        {...inputProps}
        placeholder={placeholder}
        className={`w-full ${
          height ? "py-1.5" : "py-2.5"
        } px-4 border border-gray-200 rounded-[2px] outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
      />
      {errors ? (
        <small className="col-span-2 text-red-500">{errors?.message}</small>
      ) : null}
    </div>
  );
};

export default Input;