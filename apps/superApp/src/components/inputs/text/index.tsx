import React, { ChangeEvent } from 'react';

interface TextInputProps {
  onchange: (event: ChangeEvent<HTMLInputElement>) => void;
  text: string;
  value: string;
  placeholder: string;
}

const TextInput: React.FC<TextInputProps> = ({ onchange, text, value, placeholder }) => {
  return (
    <div>
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
  )
}

export default TextInput;