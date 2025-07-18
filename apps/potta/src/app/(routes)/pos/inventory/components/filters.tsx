'use client';
import Button from '@potta/components/button';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import ProductStepperModal from './ProductStepperModal';
import { PopoverAction } from '@potta/components/tableActionsPopover';
import { NextPopover } from '@potta/components/popover';
import CreateNonInventoryProduct from './slides/components/create_product/nonInventory';
import { Proportions, SquareStack } from 'lucide-react';
import RestockModal from './slides/components/restock';
import { useInventory } from '../_utils/context';
import DynamicFilter from '@potta/components/dynamic-filter';

const Filter = () => {
  const [selectedValue, setSelectedValue] = useState('createdAt:ASC');
  const [searchValue, setSearchValue] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const { selectedProduct } = useInventory();

  const handleChange = (value: string) => {
    setSelectedValue(value);
  };

  const handleRestock = () => {
    setIsRestockOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchValue('');
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

  const filterConfig = [
    {
      key: 'sort',
      label: 'Sort by',
      options: [
        { label: 'Created At:ASC', value: 'createdAt:ASC' },
        { label: 'Created At:DESC', value: 'createdAt:DESC' },
        { label: 'Updated At:ASC', value: 'updatedAt:ASC' },
        { label: 'Updated At:DESC', value: 'updatedAt:DESC' },
      ],
      value: selectedValue,
      onChange: handleChange,
      selectClassName: 'min-w-[140px]',
    },
  ];

  return (
    <>
      <div className="w-full flex justify-between items-center">
        {/* Left side - Dynamic Filter */}
        <div className="flex-1">
          <DynamicFilter
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
            onSearchClear={handleSearchClear}
            searchPlaceholder="Search inventory..."
            filters={filterConfig}
            className="p-0 bg-transparent"
          />
        </div>

        {/* Right side - Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          <Button
            type={'button'}
            color
            text="Adjust"
            icon={<Proportions />}
            theme="lightBlue"
          />
          <Button
            type={'button'}
            color
            text="Restock"
            icon={<SquareStack />}
            theme="lightBlue"
            onClick={handleRestock}
            disabled={!selectedProduct}
          />
          <Button
            type={'button'}
            color
            text="Export"
            icon={<img src="/images/export.svg" />}
            theme="lightBlue"
          />
          <NextPopover
            rowUuid={'1'}
            actions={actions}
            openPopover={openPopover}
            setOpenPopover={setOpenPopover}
            triggerButton={
              <Button
                text={'New Item'}
                type={'button'}
                icon={<i className="ri-file-add-line"></i>}
              />
            }
          />
        </div>
      </div>

      <ProductStepperModal open={isCreateOpen} setOpen={setIsCreateOpen} />
      <CreateNonInventoryProduct
        open={isImportOpen}
        setOpen={setIsImportOpen}
      />
      {typeof window !== 'undefined' &&
        createPortal(
          <RestockModal open={isRestockOpen} setOpen={setIsRestockOpen} />,
          document.body
        )}
    </>
  );
};

export default Filter;
