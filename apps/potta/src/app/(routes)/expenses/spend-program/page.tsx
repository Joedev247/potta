'use client';
import React, { useState } from 'react';
import RootLayout from '../../layout';
import { Badge } from '@potta/components/shadcn/badge';
import Search from '@potta/components/search';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@potta/components/shadcn/dropdown';
import Button from '@potta/components/button';
import NewSpendProgramSlideover from './components/NewSpendProgramSlideover';
import { ChevronDown } from 'lucide-react';
import { ContextData } from '@potta/components/context';
import { useQuery } from '@tanstack/react-query';
import { getSpendPrograms } from './utils/api';
import { Skeleton } from '@potta/components/shadcn/skeleton';

const filterOptions = [
  { label: 'All programs', value: 'all' },
  // Add more filters if needed
];

const SpendProgramPage = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(filterOptions[0].value);
  const [filterLabel, setFilterLabel] = useState(filterOptions[0].label);
  const [slideoverOpen, setSlideoverOpen] = useState(false);
  const context = React.useContext(ContextData);

  // Fetch spend programs from API
  const {
    data: spendPrograms = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['spend-programs'],
    queryFn: getSpendPrograms,
  });

  const filteredPrograms = spendPrograms.filter((program) =>
    program.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RootLayout>
      <div
        className={`${
          context?.layoutMode === 'sidebar' ? 'pl-16' : 'pl-5'
        } pr-5 pt-2`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-[220px] max-w-[400px]">
              <Search
                placeholder="search spend programs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-3 border  bg-white text-black text-sm flex items-center gap-2 min-w-[140px]">
                  {filterLabel}
                  <ChevronDown size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="!rounded-none min-w-[142px]"
              >
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => {
                      setActiveFilter(option.value);
                      setFilterLabel(option.label);
                    }}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <NewSpendProgramSlideover
              open={slideoverOpen}
              setOpen={setSlideoverOpen}
              onCreated={refetch}
            />
          </div>
        </div>
        {isLoading && (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            }}
          >
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 p-6 flex flex-col gap-4 rounded-md"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="bg-green-50 p-2 rounded w-10 h-10" />
                  <Skeleton className="h-6 w-32 flex-1" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <div className="flex items-center justify-between border-t pt-3 mt-2">
                  <Skeleton className="h-4 w-16 rounded-lg" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="ml-1 h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {isError && (
          <div className="text-red-500">Failed to load programs.</div>
        )}
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            // 3 per row on large screens, autofill on resize
          }}
        >
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-white border cursor-pointer border-gray-200 p-6 flex flex-col gap-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-50 p-2 rounded">{program.icon}</div>
                <h2 className="text-lg font-semibold text-gray-900 flex-1">
                  {program.name}
                </h2>
                <Badge className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-xs">
                  {program.status}
                </Badge>
              </div>
              <p className="text-gray-500 text-sm mb-2">
                {program.description}
              </p>
              <div className="flex items-center justify-between border-t pt-3 mt-2">
                <span className="text-xs bg-[#F3FBFB] px-3 py-1 rounded-lg text-gray-700">
                  {program.unit}
                </span>
                <span className="flex cursor-pointer items-center gap-1 text-xs">
                  <span
                    className={`grid place-content-center text-center w-5 h-5 rounded-full text-white text-xs font-bold ${
                      program.purchaseOrders > 0
                        ? 'bg-green-900'
                        : 'bg-gray-300'
                    }`}
                  >
                    {program.purchaseOrders}
                  </span>
                  <span
                    className={`ml-1 ${
                      program.purchaseOrders > 0
                        ? 'text-green-900'
                        : 'text-gray-400'
                    }`}
                  >
                    Purchase Orders
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RootLayout>
  );
};

export default SpendProgramPage;
