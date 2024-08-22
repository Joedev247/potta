import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { FieldError, UseFormRegister } from "react-hook-form";
import React, { ChangeEvent, ReactNode, useState } from "react";

type Props = {
  type?: string;
  name: string;
  label?: string;
  icon?: ReactNode;
  className?: string;
  errors?: FieldError;
  isTextArea?: boolean;
  placeholder?: string;
  value?: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<Props> = ({
  icon,
  type,
  name,
  label,
  value,
  errors,
  register,
  onChange,
  className,
  isTextArea,
  placeholder,
}) => {
  const [open, setOpen] = useState(false)

  //========== component ============
  return (
    <div className={`w-full ${className}`}>
      <label htmlFor="" className="capitalize">
        {label}
      </label>
      {!isTextArea ? (
        <div className="relative rounded-md shadow-sm mt-3">
          <input
            id={name}
            type={open && name?.includes("password") ? "password" : !open && name?.includes("password") ? "text" : type}
            value={value}
            placeholder={placeholder}
            className="w-full py-2.5 border outline-none pl-3"
            {...(register && { ...register(name), onChange })}
          />

          {icon || type === "email" && <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            {type === "email" ? <EnvelopeIcon aria-hidden="true" className="h-5 w-5 text-gray-400" /> : icon ? icon : null}
          </div>}

          {name?.includes("password") && <div className="cursor-pointer absolute inset-y-0 right-0 flex items-center px-3" onClick={() => setOpen(!open)}>
            {
              open ? <i className="ri-eye-fill text-gray-500 text-xl" />
                : <i className="ri-eye-off-fill text-gray-500 text-xl" />
            }
          </div>}
        </div>
      ) : (
        <textarea
          rows={6}
          id={name}
          value={value}
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

