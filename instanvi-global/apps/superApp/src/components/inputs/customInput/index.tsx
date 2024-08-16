import React, { ChangeEvent } from 'react';

interface TextInputProps {
    onchange: (event: ChangeEvent<HTMLInputElement>) => void;
    text: string;
    value: string;
    placeholder: string;
    icon: string;
}

const CustomInput: React.FC<TextInputProps> = ({ onchange, text, value, placeholder, icon }) => {
    return (
        <div className="mt-2 flex rounded-md shadow-sm">
            <div className="relative flex flex-grow items-stretch focus-within:z-10">
                <input
                    type="search"
                    name="search"
                    id="search"
                    autoComplete="off"
                    value={value}
                    placeholder={placeholder}
                    onChange={onchange}
                    className="w-full py-2.5 mt-3 border outline-none pl-2"
                />
            </div>
            <button
                type="button"
                className="relative h-[48px] -ml-px inline-flex items-center gap-x-1.5 mt-3 px-6   text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
                <i className={`ri-${icon}-line text-xl -ml-0.5 h-5 w-5 -mt-2 text-gray-400`}></i>
            </button>
        </div>
    )
}
export default CustomInput
