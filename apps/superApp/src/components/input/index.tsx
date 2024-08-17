import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

type Props = {
  label?: string;
  type: string;
  name: string;
  className?: string;
  errors?: FieldError;
  isTextArea?: boolean;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
};

const Input: React.FC<Props> = ({
  type,
  label,
  isTextArea,
  className,
  name,
  placeholder,
  errors,
  register,
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label htmlFor="" className="capitalize">
        {label}
      </label>
      {!isTextArea ? (
        <input
          id={name}
          type={type}
          {...(register && { ...register(name) })}
          placeholder={placeholder}
          className="w-full py-2.5 mt-3 border outline-none pl-2"
        />
      ) : (
        <textarea
          rows={6}
          id={name}
          autoComplete="off"
          {...(register && { ...register(name) })}
          placeholder={placeholder}
          className="w-full p-3 mt-3 border outline-none"
        />
      )}
      {errors ? (
        <small className="col-span-2 text-red-500">{errors?.message}</small>
      ) : null}
    </div>
  );
};

export default Input;
