'use client';
import Button from '@potta/components/button';
import React, { useState } from 'react';
import Slider from '@potta/components/slideover';
import ReimbursementForm from './ReimbursementForm';
import DynamicFilter from '@potta/components/dynamic-filter';
import Image from 'next/image';

const Filter = ({ onNew }: { onNew: (data: any) => void }) => {
  const [selectedValue, setSelectedValue] = useState('All Time');
  const [selectedValue2, setSelectedValue2] = useState('pending');
  const [sliderOpen, setSliderOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  const dateOptions = [
    { label: 'All Time', value: 'All Time' },
    { label: 'Yesterday', value: 'Yesterday' },
    { label: 'Last 7 Days', value: 'Last 7 Days' },
    { label: 'Last 30 Days', value: 'Last 30 Days' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchValue('');
  };

  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      value: selectedValue2,
      onChange: setSelectedValue2,
      selectClassName: 'min-w-[140px]',
    },
    {
      key: 'date',
      label: 'Date',
      options: dateOptions,
      value: selectedValue,
      onChange: setSelectedValue,
      selectClassName: 'min-w-[140px]',
    },
  ];

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex-1">
        <DynamicFilter
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          onSearchClear={handleSearchClear}
          searchPlaceholder="Search reimbursements..."
          filters={filterConfig}
          className="p-0 bg-transparent"
        />
      </div>
      <div className="flex items-center space-x-3 ml-4">
        <Button
          type={'button'}
          color
          text="Export"
          icon={
            <Image
              width={200}
              height={200}
              className="w-full h-full object-cover"
              src="/images/export.svg"
              alt="Export"
            />
          }
          theme="lightBlue"
        />
        <Button
          text={'New'}
          icon={<i className="ri-file-add-line"></i>}
          theme="default"
          type={'button'}
          onClick={() => setSliderOpen(true)}
        />
        <Slider
          title="New Reimbursement"
          edit={false}
          open={sliderOpen}
          setOpen={setSliderOpen}
        >
          <ReimbursementForm
            onSubmit={onNew}
            onClose={() => setSliderOpen(false)}
          />
        </Slider>
      </div>
    </div>
  );
};

export default Filter;
