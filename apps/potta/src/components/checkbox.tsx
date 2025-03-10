import React from 'react';
import { FieldError, Control, Controller } from 'react-hook-form';

type Props = {
  label?: string;
  name: string;
  className?: string;
  errors?: FieldError;
  control?: Control<any>;
  required?: boolean;
};

const Checkbox: React.FC<Props> = ({
  label,
  name,
  className,
  errors,
  control,
  required
}) => {
  return (
    <div className={`w-full ${className}`}>
       {label && <span className="mb-5 text-gray-900 font-medium">{label}{ required && <span className=" text-red-500">*</span>}</span>}
      <div className="flex items-center space-x-3 mt-4">
        {control ? (
          <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className='flex space-x-2'>
                <div className="relative inline-block">
                  <input
                    id={name}
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="
                      peer
                      appearance-none
                      h-6
                      w-6
                      border-2
                      border-gray-300
                      rounded
                      bg-white
                      checked:bg-blue-500
                      checked:border-blue-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-blue-200
                      transition-all
                      duration-300
                      cursor-pointer
                    "
                  />
                  <svg
                    className="
                      absolute
                      top-[40%]
                      left-1/2
                      transform
                      -translate-x-1/2
                      -translate-y-1/2
                      w-5
                      h-5
                      text-white
                      opacity-0
                      peer-checked:opacity-100
                      pointer-events-none
                    "
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                {label && (
                  <label
                    htmlFor={name}
                    className="
                      text-gray-700
                      font-medium
                      select-none
                      cursor-pointer
                      hover:text-blue-600
                      transition-colors
                      duration-300
                    "
                  >
                    {label}
                  </label>
                )}
              </div>
            )}
          />
        ) : null}
      </div>
      {errors && (
        <small
          className="
          text-red-500
          text-xs
          mt-1
          block
        "
        >
          {errors.message}
        </small>
      )}
    </div>
  );
};

export default Checkbox;
