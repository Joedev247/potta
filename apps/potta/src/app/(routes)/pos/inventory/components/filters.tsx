'use client';
import Button from '@potta/components/button';
import Search from '@potta/components/search';
import Select from '@potta/components/select';
import React, { useState } from 'react';

import CreateProduct from './slides/components/create_product/inventory';
import { PopoverAction } from '@potta/components/tableActionsPopover';
import { NextPopover } from '@potta/components/popover';
import CreateNonInventoryProduct from './slides/components/create_product/nonInventory';

const Filter = () => {
  const [selectedValue, setSelectedValue] = useState('createdAt:ASC'); // Set your default value here
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const handleChange = (value: string) => {
    setSelectedValue(value);
  };
  const actions: PopoverAction[] = [
    {
      label: 'Inventory Item',
      onClick: () => {
        setIsCreateOpen(true);
      },
      className: 'hover:bg-gray-200',
    },
    {
      label: 'Non Inventory Item',
      onClick: () => {
        setIsImportOpen(true);
      },
      className: 'hover:bg-gray-200',
    },
  ];

  return (
    <div className="w-full flex justify-between ">
      <div className="flex space-x-2 w-[60%]">
        <div className=" w-[60%]">
          <Search />
        </div>
        <div className="flex mt-2 w-[40%] space-x-2">
          <div>
            <Select
              options={[
                { label: 'Created At:ASC', value: 'createdAt:ASC' },
                { label: 'Created At:DESC', value: 'createdAt:DESC' },
                { label: 'Updated At:ASC', value: 'updatedAt:ASC' },
                { label: 'Updated At:DESC', value: 'updatedAt:DESC' },
              ]}
              selectedValue={selectedValue}
              onChange={handleChange}
              bg=" " // Add your desired background class here
            />
          </div>
        </div>
      </div>
      <div className=" w-[25%] mt-4 ">
        <div className="flex w-full space-x-3">
          <div className="w-full  flex space-x-3 justify-end ">
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
            <CreateProduct  open={isCreateOpen} setOpen={setIsCreateOpen}/>
            <CreateNonInventoryProduct open={isImportOpen} setOpen={setIsImportOpen}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
