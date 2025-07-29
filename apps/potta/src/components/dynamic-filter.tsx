import React from 'react';
import Search from './search';
import CustomSelect from '@potta/app/(routes)/account_receivables/components/CustomSelect';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  selectClassName?: string;
}

interface DynamicFilterProps {
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClear?: () => void;
  searchPlaceholder?: string;
  filters: FilterConfig[];
  className?: string;
}

const DynamicFilter: React.FC<DynamicFilterProps> = ({
  searchValue,
  onSearchChange,
  onSearchClear,
  searchPlaceholder = 'Search...',
  filters,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 px-0 bg-white ${className}`}
    >
      <div className="flex flex-1 items-center gap-4 min-w-0">
        {onSearchChange && (
          <div className="w-full max-w-md">
            <Search
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={onSearchChange}
              onClear={onSearchClear}
            />
          </div>
        )}
        {filters.map((filter) => (
          <div key={filter.key} className="flex items-center gap-2">
            {filter.icon}
            <CustomSelect
              options={filter.options}
              value={filter.value}
              onChange={(value) => filter.onChange(value || '')}
              placeholder={filter.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicFilter;
