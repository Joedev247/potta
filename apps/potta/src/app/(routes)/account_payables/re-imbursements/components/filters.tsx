'use client';
import Button from '@potta/components/button';
import Search from '@potta/components/search';
import Select from '@potta/components/select';
import React, { useState } from 'react';
import Slider from '@potta/components/slideover';
import ReimbursementForm from './ReimbursementForm';

import Link from 'next/link';

const Filter = ({ onNew }: { onNew: (data: any) => void }) => {
  const [selectedValue, setSelectedValue] = useState('All Time');
  const [selectedValue2, setSelectedValue2] = useState('pending');
  const [sliderOpen, setSliderOpen] = useState(false);

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];
  const categoryOptions = [
    { label: 'Travel', value: 'travel' },
    { label: 'Meals', value: 'meals' },
    { label: 'Office', value: 'office' },
    { label: 'Other', value: 'other' },
  ];

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };
  const handleChange2 = (value: string) => {
    setSelectedValue2(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    // This function is no longer used in the new implementation
  };

  return (
    <div className="w-full flex justify-between ">
      <div className="flex space-x-2 w-[50%]">
        <div className=" w-[50%]">
          <Search />
        </div>
        <div className="flex w-[50%] space-x-2">
          <div className="flex items-center gap-2 ">
            <label className="text-sm font-medium whitespace-nowrap">
              Filter:
            </label>
            <Select
              options={[
                { label: 'All', value: 'all' },
                { label: 'Pending', value: 'pending' },
                { label: 'Paid', value: 'paid' },
              ]}
              selectedValue={selectedValue2}
              onChange={handleChange2}
              bg=""
              labelClass="!mb-0"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">
              Date:
            </label>
            <Select
              options={[
                { label: 'All Time', value: 'All Time' },
                { label: 'Yesterday', value: 'Yesterday' },
                { label: 'Last 7 Days', value: 'Last 7 Days' },
                { label: 'Last 30 Days', value: 'Last 30 Days' },
              ]}
              selectedValue={selectedValue}
              onChange={handleChange}
              bg=""
            />
          </div>
        </div>
      </div>

      <div className="  mt-4  ">
        <div className="flex  space-x-2">
          <div className=" flex justify-end ">
            <Button
              type={'button'}
              color
              text="Export"
              icon={<img src="/images/export.svg" />}
              theme="lightBlue"
            />
          </div>
          <div className="">
            <Button
              text={'New'}
              icon={<i className="ri-add-line"></i>}
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
      </div>
    </div>
  );
};

export default Filter;
