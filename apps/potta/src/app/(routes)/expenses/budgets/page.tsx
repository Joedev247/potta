// src/app/budgets/page.tsx (or wherever your page resides)
'use client'; // Needed for useState

import React, { useState } from 'react';
import RootLayout from '../../layout';
import { BudgetCard } from './component/budgetCard'; // Adjust path if needed
import { mockBudgets } from './data/data'; // Adjust path if needed
import { Budget } from './new/types/budget'; // Adjust path if needed
import { Search, Upload, Plus, Calendar } from 'lucide-react'; // Import icons
import { Button } from '@potta/components/shadcn/button';
import Input from '@potta/components/input';
import Filter from '../components/filters';

export default function BudgetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  // Add state for filters if needed later
  // const [activeFilter, setActiveFilter] = useState('all');
  // const [activeDateRange, setActiveDateRange] = useState('all-time');

  const filteredBudgets = mockBudgets.filter((budget) =>
    budget.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RootLayout>
      <div className=" bg-gray-50  pl-16 pr-5 w-full ">
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search and Filters */}
          <Filter />
        </div>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {filteredBudgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
          {filteredBudgets.length === 0 && (
            <p className="col-span-full text-center text-gray-500 mt-10">
              No budgets found matching your search.
            </p>
          )}
        </div>
      </div>
    </RootLayout>
  );
}
