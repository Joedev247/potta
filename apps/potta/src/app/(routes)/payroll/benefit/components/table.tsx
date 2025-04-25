'use client';
import React, { useState } from 'react';
import SliderBenefit from './sliderBenefit';
import MyTable from '@potta/components/table';
import Search from '@potta/components/search';
import { Benefit, BenefitType } from '../utils/types';
import moment from 'moment';
import { useBenefits } from '../hooks/useBenefits';

const TableBenefit = () => {
  const { benefits, loading, meta, updateFilter } = useBenefits({
    page: 1,
    limit: 20,
    sort_by: 'createdAt',
    sort_order: 'asc',
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    updateFilter({ search: term });
  };

  const formatCurrency = (value: string) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(parseFloat(value));
  };

  const formatRate = (rate: string, type: BenefitType, cycle: string) => {
    if (!rate) return 'N/A';

    const rateValue = parseFloat(rate) * 100;

    if (type === 'FINANCIAL') {
      if (cycle === 'MONTHLY') {
        return `${rateValue}%/Mn`;
      } else if (cycle === 'ANNUALLY' || cycle === 'YEARLY') {
        return `${rateValue}%/Yr`;
      } else {
        return `${rateValue}%`;
      }
    } else {
      return formatCurrency(rate);
    }
  };

  const formatCycle = (cycle: string) => {
    switch (cycle) {
      case 'MONTHLY':
        return 'Monthly';
      case 'ANNUALLY':
        return 'Annually';
      case 'DAILY':
        return 'Daily';
      case 'WEEKLY':
        return 'Weekly';
      case 'QUARTERLY':
        return 'Quarterly';
      case 'ONE_TIME':
        return 'One-time';
      default:
        return cycle;
    }
  };

  const getBenefitTypeDisplay = (type: BenefitType) => {
    switch (type) {
      case 'FINANCIAL':
        return 'Financial';
      case 'SERVICE':
        return 'Service';
      case 'REDEEMABLE':
        return 'Redeemable';
      default:
        return 'Employer'; // Default to Employer as shown in the image
    }
  };

  const getMaxAmount = (benefit: Benefit) => {
    if (!benefit.max_amount) return 'N/A';
    return formatCurrency(benefit.max_amount);
  };

  // Updated status color function with more distinctive colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-emerald-600 font-medium';
      case 'PENDING':
        return 'text-amber-600 font-medium';
      case 'INACTIVE':
        return 'text-red-600 font-medium';
      case 'SUSPENDED':
        return 'text-orange-600 font-medium';
      case 'EXPIRED':
        return 'text-gray-600 font-medium';
      default:
        return 'text-gray-800 font-medium';
    }
  };

  // Format status text with proper capitalization
  const formatStatus = (status: string) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const columns = [
    {
      name: 'Benefit',
      selector: (row: Benefit) => row.name,
      render: (row: Benefit) => <div className="font-medium">{row.name}</div>,
    },
    {
      name: 'Type',
      selector: (row: Benefit) => row.type,
      render: (row: Benefit) => <div>{getBenefitTypeDisplay(row.type)}</div>,
    },
    {
      name: 'Rate',
      selector: (row: Benefit) => row.rate,
      render: (row: Benefit) => (
        <div>{formatRate(row.rate, row.type, row.cycle)}</div>
      ),
    },
    {
      name: 'Provider',
      selector: (row: Benefit) => row.provider || 'N/A',
      render: (row: Benefit) => <div>{row.provider || 'N/A'}</div>,
    },
    {
      name: 'Max Amount',
      selector: (row: Benefit) => row.max_amount || '',
      render: (row: Benefit) => <div>{getMaxAmount(row)}</div>,
    },
    {
      name: 'Status',
      selector: (row: Benefit) => row.status,
      render: (row: Benefit) => (
        <div className={getStatusColor(row.status)}>
          {formatStatus(row.status)}
        </div>
      ),
    },
  ];

  return (
    <div className="mt-10 px-14 pt-10">
      <div className="my-2 items-center flex justify-between">
        <div className="relative w-1/3">
          <Search
            placeholder="Search benefits"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <SliderBenefit />
      </div>
      {benefits && benefits.length > 0 ? (
        <MyTable
          columns={columns}
          data={benefits}
          ExpandableComponent={({ row }: { row: Benefit }) => (
            <div className="p-4 bg-gray-50">
              <h3 className="font-medium mb-2">Benefit Details</h3>
              <p className="text-sm text-gray-600 mb-2">{row.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Cycle:</span>{' '}
                    {formatCycle(row.cycle)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Taxable:</span>{' '}
                    {row.is_taxable ? 'Yes' : 'No'}
                  </p>
                  {row.tax_cap && (
                    <p className="text-sm">
                      <span className="font-medium">Tax Cap:</span>{' '}
                      {formatCurrency(row.tax_cap)}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Value:</span>{' '}
                    {row.value ? formatCurrency(row.value) : 'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Salary Cap:</span>{' '}
                    {row.salary_cap ? formatCurrency(row.salary_cap) : 'N/A'}
                  </p>
                  {row.expires_at && (
                    <p className="text-sm">
                      <span className="font-medium">Expires:</span>{' '}
                      {moment(row.expires_at).format('MMM DD, YYYY')}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-medium">Default:</span>{' '}
                    {row.is_default ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          )}
          expanded
          pagination={!!meta && meta.totalItems > meta.itemsPerPage}
          pending={loading}
          onPageChange={(page) => updateFilter({ page })}
          totalPages={meta?.totalPages || 1}
          currentPage={meta?.currentPage || 1}
        />
      ) : (
        <div className="text-center py-10">
          {loading ? (
            <p>Loading benefits...</p>
          ) : (
            <p>No benefits found. Create a new benefit to get started.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TableBenefit;
