import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

type Props = {
    label?: string;
    type: string;
    className?: string;
    name: string;
    errors?: FieldError;
    placeholder?: string;
    register?: UseFormRegister<any>;
    onchange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string | number;
    height?: boolean;
    required?: boolean;
    autocomplete?: boolean;
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
    autocomplete
}) => {
    // Get register props if register is provided
    const registerProps = register ? register(name) : {};

    // If onchange is provided, use it instead of register's onChange
    const inputProps = onchange
        ? { ...registerProps, onChange: onchange }
        : registerProps;

    return (
        <div className={`w-full ${className}`}>
            {label && <span className="mb-3 text-gray-900 font-medium">{label}{ required && <span className=" text-red-500">*</span>}</span>}
            <input
                autoComplete={autocomplete ? 'off' : 'on'}
                type={type}
                value={value}
                {...inputProps}
                placeholder={placeholder}
                className={`w-full ${height ? 'py-1.5' : 'py-2.5'} px-4 border border-gray-200 rounded-[2px] outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors ? (
                <small className="col-span-2 text-red-500">{errors?.message}</small>
            ) : null}
        </div>
    );
};

export default Input;
