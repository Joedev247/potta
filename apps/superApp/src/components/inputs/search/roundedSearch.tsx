import React, { ChangeEvent } from 'react';

interface SearchProps {
    onchange: (event: ChangeEvent<HTMLInputElement>) => void;
    text: string;
    value: string;
    placeholder: string;
}

const Search: React.FC<SearchProps> = ({ onchange, text, value, placeholder }) => {
    return (
        <>
            <div
                className={`flex items-center gap-x-3 border rounded-full px-4 w-full md:w-full `}
            >
                <i className="ri-search-line text-xl"></i>
                <input
                    type="search"
                    name="search"
                    id="search"
                    autoComplete="off"
                    value={value}
                    placeholder={placeholder}
                    onChange={onchange}
                    className="w-full py-1.5  rounded-full outline-none pl-1"
                />
            </div>
        </>
    )
}

export default Search;