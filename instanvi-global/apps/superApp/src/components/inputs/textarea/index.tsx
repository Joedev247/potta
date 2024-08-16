import React, { ChangeEvent } from 'react';

interface TextInputProps {
    onchange: (event: ChangeEvent<HTMLInputElement>) => void;
    text: string;
    value: string;
    placeholder: string;
}
const TextArea: React.FC<TextInputProps> = ({ onchange, text, value, placeholder }: any) => {
    return (
        <>
            <div className="">
                <textarea
                    id=""
                    autoComplete="off"
                    value={value}
                    placeholder={placeholder}
                    onChange={onchange}
                    rows={6}
                    className="w-full p-3 mt-3 border outline-none"
                >

                </textarea>
            </div>
        </>
    )
}

export default TextArea