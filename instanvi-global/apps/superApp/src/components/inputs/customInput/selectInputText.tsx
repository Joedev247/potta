import React, { ChangeEvent } from 'react';

interface TextInputProps {
  onchange: (event: ChangeEvent<HTMLInputElement>) => void;
  text: string;
  value: string;
  placeholder: string;
  icon: string;
}

const CustomInputSelect: React.FC<TextInputProps> = ({ onchange, text, value, placeholder, icon }) => {
  return (
    <div>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          id="price"
          name="price"
          value={value}
          placeholder={placeholder}
          onChange={onchange}
          className="w-full py-2.5 mt-3 border outline-none pl-2"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <label htmlFor="currency" className="sr-only">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            className="relative h-[44px] -ml-px inline-flex items-center gap-x-1.5 mt-3 px-6 pr-2 border-x outline-none "
          >
            <option>USD</option>
            <option>CAD</option>
            <option>EUR</option>
          </select>
        </div>
      </div>
    </div>

  )
}
export default CustomInputSelect
