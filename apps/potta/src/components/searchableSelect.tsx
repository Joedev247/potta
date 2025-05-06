'use client';
import React from 'react';
import ReactSelect, { Props as ReactSelectProps } from 'react-select';

export interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps
  extends Omit<ReactSelectProps<Option, false>, 'onChange'> {
  label?: string;
  labelClass?: string;
  options: Option[];
  selectedValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  required?: boolean;
  error?: string;
}

// Custom styles for react-select
const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
      ? '#bfdbfe '
      : undefined,
    color: state.isSelected ? 'white' : '#374151',
    '&:active': {
      backgroundColor: '#3b82f6',
    },
  }),
};

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  labelClass = '',
  options,
  selectedValue,
  onChange,
  placeholder = 'Select...',
  isDisabled = false,
  required = false,
  error,
  ...rest
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className={`block mb-2 ${labelClass}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <ReactSelect
        options={options}
        value={options.find((option) => option.value === selectedValue) || null}
        onChange={(option) => {
          if (option) {
            onChange(option.value);
          } else {
            onChange('');
          }
        }}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isClearable
        isSearchable
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
