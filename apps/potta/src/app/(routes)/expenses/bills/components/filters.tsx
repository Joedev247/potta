'use client';
import React from 'react';
import Button from '@potta/components/button';
import Select from '@potta/components/select';
import Search from '@potta/components/search';
import Link from 'next/link';

interface FilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
}

const paymentMethodOptions = [
  { label: 'All', value: 'all' },
  { label: 'Credit Card', value: 'Credit Card' },
  { label: 'Bank Transfer', value: 'Bank Transfer' },
  { label: 'ACH Transfer', value: 'ACH Transfer' },
  { label: 'Mobile Money', value: 'Mobile Money' },
  { label: 'Cash', value: 'Cash' },
  { label: 'Credit', value: 'Credit' },
  { label: 'Other', value: 'Other' },
];
const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Issued', value: 'Issued' },
  { label: 'Paid', value: 'Paid' },
  { label: 'Overdue', value: 'Overdue' },
];

const Filter: React.FC<FilterProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  paymentMethod,
  onPaymentMethodChange,
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4 whitespace-normal break-words">
      <div className="flex flex-row gap-3 items-center flex-nowrap flex-1 min-w-0">
        <div className="w-full min-w-[120px] max-w-xs">
          <Search
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search bills..."
          />
        </div>
        <Select
          outline
          border={false}
          options={statusOptions}
          selectedValue={status}
          onChange={onStatusChange}
          bg="bg-white"
          SelectClass="min-w-[90px] max-w-[140px]"
        />
        <Select
          outline
          border={false}
          options={paymentMethodOptions}
          selectedValue={paymentMethod || 'all'}
          onChange={onPaymentMethodChange}
          bg="bg-white"
          SelectClass="min-w-[90px] max-w-[140px]"
        />
      </div>
      <div className="flex flex-row gap-2 justify-end items-center mt-2 md:mt-0">
        <Button
          type={'button'}
          color
          text="Export"
          icon={<img src="/images/export.svg" />}
          theme="lightBlue"
        />
        <Link className="flex justify-end" href={'/expenses/bills/new'}>
          <Button
            text={'Create New'}
            icon={<i className="ri-file-add-line"></i>}
            theme="default"
            type={'button'}
          />
        </Link>
      </div>
    </div>
  );
};

export default Filter;
