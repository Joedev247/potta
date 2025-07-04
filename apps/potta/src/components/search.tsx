'use client';
import React from 'react';
import { RiSearchLine } from 'react-icons/ri';

interface SearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search = ({ placeholder, value, onChange }: SearchProps) => {
  return (
    <div className="flex justify-center my-4">
      <div className="relative flex items-center w-full">
        <RiSearchLine className="absolute left-2 text-gray-500 text-lg" />
        <input
          type="search"
          placeholder={placeholder ? placeholder : 'Search'}
          id="search"
          value={value}
          onChange={onChange}
          className="block w-full py-2.5 pl-10 pr-2 text-gray-900 outline-none border"
        />
      </div>
    </div>
  );
};

export default Search;
