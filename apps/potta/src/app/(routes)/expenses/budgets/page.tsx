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
import { Skeleton } from '@potta/components/shadcn/skeleton';

const BudgetCardSkeleton = () => (
  <div className="bg-white shadow-sm rounded-lg p-6">
    <div className="flex justify-between items-start gap-2">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
    <div className="mt-6">
      <Skeleton className="h-2 w-full" />
    </div>
    <div className="mt-4 grid grid-cols-3 gap-4">
      <div>
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div>
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div>
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
    <div className="mt-4">
      <Skeleton className="h-3 w-40" />
    </div>
  </div>
);

export default function BudgetsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const { budgets, meta, loading, error, updateFilter, refetch } = useBudgets();

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      updateFilter({ search: value, page: 1, status: activeTab });
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    updateFilter({ status: value, page: 1 });
  };

  return (
    <RootLayout>
      <div className="bg-gray-50 h-full pl-16 pr-5 w-full">
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search and Filters */}
          <Filter />
        </div>

        {/* Custom Tabs */}
        <div className="w-[30%] flex mb-6">
          <div
            onClick={() => handleTabChange('active')}
            className={`w-full h-12 flex justify-center cursor-pointer items-center bg-[#F3FBFB] ${
              activeTab === 'active' &&
              'border-b-2 border-[#154406] text-[#154406] font-medium'
            }`}
          >
            <p>Active Budgets</p>
          </div>
          <div
            onClick={() => handleTabChange('archived')}
            className={`w-full h-12 flex justify-center cursor-pointer items-center bg-[#F3FBFB] ${
              activeTab === 'archived' &&
              'border-b-2 border-[#154406] text-[#154406] font-medium'
            }`}
          >
            <p>Archived Budgets</p>
          </div>
        </div>

        {/* Budgets Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <BudgetCardSkeleton key={index} />
            ))}
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
                No {activeTab} budgets found matching your search.
              </p>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && budgets.length > 6 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() =>
                  updateFilter({
                    page: Math.max(1, (meta.currentPage || 1) - 1),
                    status: activeTab,
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
                    status: activeTab,
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
