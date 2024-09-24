import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

type Props = {
    label?: string;
    type: string;
    className?: string;
    name: string;
    errors?: FieldError;
    placeholder?: string;
    onchange?: () => void;
    value?: string;
};

const Input: React.FC<Props> = ({
    label,
    type,
    className,
    name,
    placeholder,
    errors,
    onchange,
    value,
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && <span className="mb-3 text-gray-900 font-medium">{label}</span>}
            <input
                type={type}
                onChange={onchange}
                placeholder={placeholder}
                value={value}
                className="w-full py-2.5 px-4 border border-gray-200 outline-none mt-2"
            />
            {errors ? (
                <small className="col-span-2 text-red-500">{errors?.message}</small>
            ) : null}
        </div>
    );
};

export default Input;
