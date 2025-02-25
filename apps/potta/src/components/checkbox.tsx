import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

type Props =
{
  label?: string;
  type: string;
  name: string;
  className?: string;
  errors?: FieldError;
  placeholder?: string;
  register?: UseFormRegister<any>;
  onchange?: any;
  value?: boolean;
  height?: boolean;
}

const Checkbox: React.FC<Props> = ({

  label,
  type,
  name,
  className,
  errors,
  value,
  onchange
}) =>{
  return (
    <div className={`w-full ${className}`}>
      <div className="flex gap-1 items-center">
        <input
          id={name}
          name={name}
          type='checkbox'
          checked={value}
          onChange={onchange}
          
        />
        <label htmlFor={name}>{label}</label>
      </div>
    </div>
  );
}
export default Checkbox;
