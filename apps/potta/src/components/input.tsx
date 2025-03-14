import { cn } from 'lib/utils';
import React, { HTMLAttributes, InputHTMLAttributes } from 'react';
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

interface Props<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errors?: FieldError;
  register?: UseFormRegister<T>;
  inputClassName?: HTMLAttributes<HTMLDivElement>['className'];
}

const Input = <T extends FieldValues>({
  label,
  className,
  name,
  placeholder,
  errors,
  register,
  ...rest
}: Props<T>) => {
  return (
    <div className={`w-full ${className}`}>
      {label && <span className="mb-3 font-bold text-gray-900">{label}</span>}
      <input
        {...rest}
        // onChange={onchange}
        {...(register ? register(name as Path<T>) : {})}
        placeholder={placeholder}
        className={cn(
          `w-full px-4 border border-gray-200 rounded-[2px] outline-none mt-2`,
          className
        )}
      />
      {errors ? (
        <small className="col-span-2 text-red-500">{errors?.message}</small>
      ) : null}
    </div>
  );
};

export default Input;
