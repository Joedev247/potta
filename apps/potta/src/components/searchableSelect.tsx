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

// ✅ Custom styles for react-select
const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    borderColor: state.isFocused ? '#22c55e' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 2px #22c55e' : 'none',
    borderRadius: '2px',
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    backgroundColor: state.isDisabled ? '#f9fafb' : 'white',
    minHeight: '40px',
    outline: 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#22c55e' : '#d1d5db',
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#22c55e'
      : state.isFocused
      ? '#bbf7d0'
      : undefined,
    color: state.isSelected ? 'white' : '#374151',
    '&:active': {
      backgroundColor: '#22c55e',
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#9ca3af',
    fontSize: '1rem',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#374151',
    fontSize: '1rem',
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: '2px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    zIndex: 20,
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
