'use client';
import Button from '@potta/components/button';
import Search from '@potta/components/search';
import Select from '@potta/components/select';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import CreateProduct from './slides/components/create_product/inventory';
import { PopoverAction } from '@potta/components/tableActionsPopover';
import { NextPopover } from '@potta/components/popover';
import CreateNonInventoryProduct from './slides/components/create_product/nonInventory';
import { Proportions, SquareStack } from 'lucide-react';
import RestockModal from './slides/components/restock';
import { useInventory } from '../_utils/context';

const Filter = () => {
  const [selectedValue, setSelectedValue] = useState('createdAt:ASC');
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
    <>
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
                bg=" "
              />
            </div>
          </div>
        </div>
        <div className=" w-[40%] mt-4 ">
          <div className="flex justify-end">
            <div className="w-fit justify-end space-x-2 flex">
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
            </div>
            <div className="w-fit ml-2">
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
        </div>
      </div>
      <CreateProduct open={isCreateOpen} setOpen={setIsCreateOpen} />
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
