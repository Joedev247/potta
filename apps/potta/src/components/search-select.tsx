import React, { useEffect, useState, useCallback } from 'react';
import Select, { SingleValue, Props as SelectProps } from 'react-select';
import debounce from 'lodash/debounce';
import AsyncSelect from 'react-select/async';

export interface Option {
  label: string;
  value: string | number;
}

interface SearchSelectProps extends Omit<SelectProps<Option, false>, 'value' | 'onChange'> {
  label?: string;
  error?: string;
  value?: Option | null;
  onChange?: (value: Option | null) => void;
  loadOptions?: (inputValue: string) => Promise<Option[]>;
  options?: Option[];
  placeholder?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  minInputLength?: number;
  isAsync?: boolean;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  label,
  error,
  value,
  onChange,
  loadOptions,
  options = [],
  placeholder = 'Search...',
  isSearchable = true,
  isClearable = true,
  minInputLength = 0,
  isAsync = false,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [dynamicOptions, setDynamicOptions] = useState<Option[]>(options);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Debounced function to load options
  const debouncedLoadOptions = useCallback(
    debounce(async (input: string) => {
      if (!loadOptions || input.length < minInputLength) return;

      setIsLoading(true);
      setFetchError(null);

      try {
        const results = await loadOptions(input);
        setDynamicOptions(results);
      } catch (error) {
        setFetchError(error instanceof Error ? error.message : 'Failed to fetch options');
        setDynamicOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [loadOptions, minInputLength]
  );

  // Handle input change
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (newValue.length >= minInputLength) {
      debouncedLoadOptions(newValue);
    }
  };

  // Async load options for AsyncSelect
  const loadOptionsAsync = async (inputValue: string) => {
    if (inputValue.length < minInputLength) {
      return [];
    }

    try {
      if (loadOptions) {
        return await loadOptions(inputValue);
      }
      return [];
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : 'Failed to fetch options');
      return [];
    }
  };

  const customStyles = {
    control: (base: any, state: { isFocused: boolean }) => ({
      ...base,
      minHeight: '42px',
      borderColor: error ? '#ef4444' : state.isFocused ? '#2563eb' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 1px #2563eb' : 'none',
      '&:hover': {
        borderColor: error ? '#ef4444' : '#2563eb',
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9ca3af',
    }),
    input: (base: any) => ({
      ...base,
      color: '#111827',
    }),
    option: (base: any, state: { isSelected: boolean; isFocused: boolean }) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#2563eb'
        : state.isFocused
          ? '#e5e7eb'
          : 'transparent',
      color: state.isSelected ? 'white' : '#111827',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#2563eb',
      },
    }),
    loadingMessage: (base: any) => ({
      ...base,
      color: '#6b7280',
    }),
    noOptionsMessage: (base: any) => ({
      ...base,
      color: '#6b7280',
    }),
  };

  const SelectComponent = isAsync ? AsyncSelect : Select;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <SelectComponent
        className="w-full"
        classNamePrefix="search-select"
        value={value}
        onChange={(newValue) => onChange?.(newValue)}
        isSearchable={isSearchable}
        isClearable={isClearable}
        placeholder={placeholder}
        isLoading={isLoading}
        options={isAsync ? undefined : dynamicOptions}
        loadOptions={isAsync ? loadOptionsAsync : undefined}
        onInputChange={(newValue) => handleInputChange(newValue)}
        noOptionsMessage={({ inputValue }) => {
          if (fetchError) return fetchError;
          if (inputValue.length < minInputLength) {
            return `Please enter ${minInputLength} or more characters`;
          }
          return 'No options found';
        }}
        loadingMessage={() => 'Loading...'}
        styles={customStyles}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default SearchSelect;



// 'use client'
// import { useState } from 'react';
// import SearchSelect, { Option } from '@/components/search-select';

// const ExamplePage = () => {
//   const [selectedOption, setSelectedOption] = useState<Option | null>(null);

//   // Example API function to load options
//   const loadOptions = async (inputValue: string): Promise<Option[]> => {
//     try {
//       // Replace with your API endpoint
//       const response = await fetch(`/api/search?query=${encodeURIComponent(inputValue)}`);

//       if (!response.ok) {
//         throw new Error('Failed to fetch options');
//       }

//       const data = await response.json();

//       // Transform your API response to Option format
//       return data.map((item: any) => ({
//         value: item.id,
//         label: item.name,
//       }));
//     } catch (error) {
//       console.error('Error loading options:', error);
//       throw error;
//     }
//   };

//   return (
//     <div className="p-4">
//       <SearchSelect
//         label="Search Items"
//         value={selectedOption}
//         onChange={setSelectedOption}
//         loadOptions={loadOptions}
//         isAsync={true} // Use async loading
//         minInputLength={2} // Only start searching after 2 characters
//         placeholder="Type to search..."
//       />
//     </div>
//   );
// };

// export default ExamplePage;
