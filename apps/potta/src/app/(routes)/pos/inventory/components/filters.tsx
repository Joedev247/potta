'use client';
import Button from '@potta/components/button';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import ProductStepperModal from './ProductStepperModal';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@potta/components/shadcn/dropdown';
import { Proportions, SquareStack } from 'lucide-react';
import RestockModal from './slides/components/restock';
import { useInventory } from '../_utils/context';
import DynamicFilter from '@potta/components/dynamic-filter';

const Filter = () => {
  const { selectedProduct, filters, setFilters } = useInventory();

  const [selectedValue, setSelectedValue] = useState(filters.sort);
  const [searchValue, setSearchValue] = useState(filters.search);
  const [selectedProductType, setSelectedProductType] = useState(
    filters.productType
  );
  const [isStepperOpen, setIsStepperOpen] = useState(false);
  const [stepperProductType, setStepperProductType] = useState<
    'INVENTORY' | 'NON_INVENTORY' | 'ASSEMBLY' | 'SIMPLEGROUPS'
  >('INVENTORY');
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    setFilters({ ...filters, sort: value });
  };

  const handleProductTypeChange = (value: string) => {
    setSelectedProductType(value);
    setFilters({ ...filters, productType: value });
  };

  const handleRestock = () => {
    setIsRestockOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setFilters({ ...filters, search: e.target.value });
  };

  const handleSearchClear = () => {
    setSearchValue('');
    setFilters({ ...filters, search: '' });
  };

  const filterConfig = [
    {
      key: 'productType',
      label: 'Product Type',
      options: [
        { label: 'All Products', value: 'ALL' },
        { label: 'Inventory', value: 'INVENTORY' },
        { label: 'Non-Inventory', value: 'NON_INVENTORY' },
        { label: 'Assembly', value: 'ASSEMBLY' },
        { label: 'Groups', value: 'SIMPLEGROUPS' },
      ],
      value: selectedProductType,
      onChange: handleProductTypeChange,
      selectClassName: 'min-w-[160px]',
    },
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
      <div className="w-full flex justify-between items-center overflow-visible">
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
        <div className="flex items-center space-x-2 ml-4 relative">
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
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className="px-4 py-2.5 bg-[#005D1F] text-white hover:bg-green-900 flex items-center gap-2 "
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <i className="ri-file-add-line"></i>
                New Item
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-full z-[9999]"
              sideOffset={5}
              collisionPadding={10}
            >
              <DropdownMenuItem
                onClick={() => {
                  setStepperProductType('INVENTORY');
                  setIsStepperOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                Inventory
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setStepperProductType('NON_INVENTORY');
                  setIsStepperOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                Non-Inventory
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setStepperProductType('ASSEMBLY');
                  setIsStepperOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                Assembly
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setStepperProductType('SIMPLEGROUPS');
                  setIsStepperOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                Groups
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ProductStepperModal
        open={isStepperOpen}
        setOpen={setIsStepperOpen}
        productType={stepperProductType}
        onComplete={() => {
          setIsStepperOpen(false);
          // Optionally refresh the product list
        }}
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
