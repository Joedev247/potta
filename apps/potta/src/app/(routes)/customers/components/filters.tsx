'use client';
import Button from '@potta/components/button';
import Search from '@potta/components/search';
import Select from '@potta/components/select';
import React, { useState } from 'react';
import SliderVendor from './customerSlider';
import { PopoverAction } from '@potta/components/tableActionsPopover';
import { NextPopover } from '@potta/components/popover';

const Filter = () => {
  const [selectedValue, setSelectedValue] = useState('All Time'); // Set your default value here
  const [selectedValue2, setSelectedValue2] = useState('pending'); // Set your default value here

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };
  const handleChange2 = (value: string) => {
    setSelectedValue2(value);
  };
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const actions: PopoverAction[] = [
    {
      label: 'Single Customer',
      onClick: () => {
        setIsCreateOpen(true);
      },
      className: 'hover:bg-gray-200',

    },
    {
      label: 'Import Customers',
      onClick: () => {
        setIsImportOpen(true);
      },
      className: 'hover:bg-gray-200',

    },
  ];

  return (
    <div className="w-full flex justify-between ">
      <div className="flex space-x-2 w-[50%]">
        <div className="w-1/2">
          <Search />
        </div>
        {/* <div className="flex mt-4 w-[40%] space-x-2">
          <div className="flex h-[47px] pt-3 w-full px-2 border">
            <p className="text-[17px] -mt-1">Filter&nbsp;: </p>
            <div className="-mt-3">
              <Select
                border={true}
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Paid', value: 'paid' },
                ]}
                selectedValue={selectedValue2}
                onChange={handleChange2}
                bg=" " // Add your desired background class here
              />
            </div>
          </div>
          <div className="flex h-[47px] py-3.5  w-full px-2 border">
            <p className="text-[17px] -mt-1">Date&nbsp;: </p>
            <div className="-mt-3">
              <Select
                border={true}
                options={[
                  { label: 'All Time', value: 'All Time' },
                  { label: 'Yesterday', value: 'Yesterday' },
                ]}
                selectedValue={selectedValue}
                onChange={handleChange}
                bg=" " // Add your desired background class here
              />
            </div>
          </div>
        </div> */}
      </div>
      <div className=" w-1/2 flex items-center">
        <div className="w-full  flex justify-end  space-x-3">
          <Button
            type={'button'}
            color
            text="Export"
            icon={<img src="/images/export.svg" />}
            theme="lightGreen"
          />

          <NextPopover
            rowUuid={'1'}
            actions={actions}
            openPopover={openPopover}
            setOpenPopover={setOpenPopover}
            triggerButton={
              <Button
                text={'New Customer'}
                type={'button'}
                icon={<i className="ri-file-add-line"></i>}
              />
            }
          />

          <SliderVendor  open={isCreateOpen} setOpen={setIsCreateOpen}/>
        </div>
      </div>
    </div>
  );
};

export default Filter;
