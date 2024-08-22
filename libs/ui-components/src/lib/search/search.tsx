import React, { ChangeEvent } from 'react';

interface SearchProps {
  value: string;
  placeholder: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<SearchProps> = ({ onChange, value, placeholder }) => {
  return (
    <div
      className={`flex items-center gap-x-3 border rounded-full px-4 w-full md:w-full `}
    >
      <i className="ri-search-line text-xl text-slate-300"></i>
      <input
        type="search"
        name="search"
        id="search"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full py-2 outline-none pl-1"
      />
    </div>
  )
}

export default Search;
