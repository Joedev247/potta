'use client';
import React, { useState } from 'react';
import RootLayout from '../../layout';
import { BudgetCard } from './component/budgetCard';
import { Budget } from './utils/types';
import { Search, Upload, Plus, Calendar } from 'lucide-react';
import { Button } from '@potta/components/shadcn/button';
import Input from '@potta/components/input';
import Filter from '../components/filters';
import { useBudgets } from './hooks/useBudgets';
import PottaLoader from '@potta/components/pottaloader';

export default function BudgetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { budgets, meta, loading, error, updateFilter, refetch } = useBudgets();

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      updateFilter({ search: value, page: 1 });
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  return (
    <RootLayout>
      <div className="bg-gray-50 h-full pl-16 pr-5 w-full">
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search and Filters */}
          <Filter />
        </div>

        {/* Budgets Grid */}
        {loading ? (
          <div className="flex justify-center h-1/2  items-center py-20">
            <PottaLoader />
          </div>
        ) : error ? (
          <div className="flex justify-center h-1/2 items-center py-20 text-red-500">
            <p>Error loading budgets. Please try again.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.length > 0 ? (
              budgets.map((budget: Budget) => (
                <BudgetCard
                  key={budget.uuid}
                  budget={budget}
                  onBudgetUpdated={refetch}
                />
              ))
            ) : (
              <p className="col-span-full h-1/2 text-center text-gray-500 mt-10">
                No budgets found matching your search.
              </p>
            )}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() =>
                  updateFilter({
                    page: Math.max(1, (meta.currentPage || 1) - 1),
                  })
                }
                disabled={meta.currentPage === 1}
              >
                Previous
              </Button>
              <span className="py-2 px-4 border rounded">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  updateFilter({
                    page: Math.min(
                      meta.totalPages,
                      (meta.currentPage || 1) + 1
                    ),
                  })
                }
                disabled={meta.currentPage === meta.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </RootLayout>
  );
}
