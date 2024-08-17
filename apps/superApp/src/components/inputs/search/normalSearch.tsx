import React, { ChangeEvent } from 'react';

interface SearchProps {
    value: string;
    placeholder: string;
    onchange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<SearchProps> = ({ onchange, value, placeholder }) => {
    return (
        <>
            <div
                className={`flex items-center gap-x-3 border  px-4 w-full md:w-full `}
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
                    className="w-full py-2.5   outline-none pl-1"
                />
            </div>
        </>
    )
}

export default Search;