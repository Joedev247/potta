'use client';
import React, { useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';

interface SearchProps {
  placeholder?: string;
}

const Search = ({ placeholder }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex justify-center my-4">
      <div className="relative flex items-center w-full">
        <RiSearchLine className="absolute left-2 text-gray-500 text-lg" />
        <input
          type="search"
          placeholder={placeholder ? placeholder : 'Search'}
          id="search"
          value={searchTerm}
          onChange={handleSearch}
          className="block w-full  py-2.5 pl-10 text-gray-900 outline-none border"
        />
      </div>
    </div>
  );
};

export default Search;
