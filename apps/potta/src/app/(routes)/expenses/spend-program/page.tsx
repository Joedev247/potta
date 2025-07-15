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

// Mock data for spend programs
const spendPrograms = [
  {
    id: '1',
    name: 'Software Procurement',
    description: 'This program controls spend in the technical department',
    status: 'Procurement',
    unit: 'software unit',
    purchaseOrders: 2,
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-monitor"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    id: '2',
    name: 'General Purchases',
    description: 'This is program controls spend in the technical department',
    status: 'Procurement',
    unit: 'software unit',
    purchaseOrders: 0,
    icon: (
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-shopping-cart"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
  },
];

const filterOptions = [
  { label: 'All programs', value: 'all' },
  // Add more filters if needed
];

const SpendProgramPage = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(filterOptions[0].value);
  const [filterLabel, setFilterLabel] = useState(filterOptions[0].label);
  const [slideoverOpen, setSlideoverOpen] = useState(false);

  const filteredPrograms = spendPrograms.filter((program) =>
    program.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RootLayout>
      <div className="pl-10 pr-5 pt-6">
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
            <Button
              text="New spend program"
              type="button"
              className="text-sm"
              onClick={() => setSlideoverOpen(true)}
            />
          </div>
        </div>
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
        <NewSpendProgramSlideover
          open={slideoverOpen}
          setOpen={setSlideoverOpen}
        />
      </div>
    </RootLayout>
  );
};

export default SpendProgramPage;
