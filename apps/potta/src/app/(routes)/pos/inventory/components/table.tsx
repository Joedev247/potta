'use client';
import React, { FC, useState } from 'react';
import Table from '@potta/components/table';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@nextui-org/react';
import { IFilter } from '../_utils/types';
import useGetAllProducts from '../_hooks/useGetAllProducts';
const InventoryTable = () => {
  const columns = [
    {
      name: 'Name',
      selector: (row: any) => (
        <div className="flex items-center space-x-3">
          <img src={row.img} alt="" width={60} />
          <p className="mt-0.5">{row.name}</p>
        </div>
      ),
    },
    {
      name: 'Sku',
      selector: (row: { sku: any }) => row.sku,
    },
    {
      name: 'Type',
      selector: (row: { category: any }) => row.category,
    },
    {
      name: 'Cost',
      selector: (row: any) =>  <div>{row.vendor.currency} {row.cost}</div>,
    },
    {
      name: 'Sale Price',
      selector: (row:  any) => <div>{row.vendor.currency} {row.salesPrice}</div>,
    },
    {
      name: 'Inventory',
      selector: (row: any) => <div>{row.inventoryLevels}</div>,
    },
    {
      name: 'Reorder Point',
      selector: (row: { points: any }) => <div className="">{row.points}</div>,
    },
    {
      name: 'Actions',
      selector: (row: { reference: any; id: string }) => <MoreIcon />,
    },
  ];
  const data = [
    {
      id: 'Inv 001',
      name: 'Black Shoes Nike',
      img: '/icons/shoes.svg',
      sku: '194E175W',
      type: 'Inventory',
      cost: 'Xaf 350,000',
      salePrice: 'Xaf 450,000',
      inventory: '245',
      points: '23 ',
    },
  ];
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filter: IFilter = { page, limit };
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useGetAllProducts(filter);
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const handlePerRowsChange = (newLimit: number, newPage: number) => {
    setLimit(newLimit);
    setPage(newPage); // Reset page when changing rows per page
    
  };
  return (
    <div className="mt-10">
      <div></div>
      <Table
        columns={columns}
        data={products?.data || []}
        ExpandableComponent={null}
        expanded
        pagination
        pending={isLoading}
        paginationServer
        paginationTotalRows={products?.meta?.totalItems ?? 0}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
      />
    </div>
  );
};
const MoreIcon: FC = () => {
  return (
    <Popover placement="left-start" showArrow={true}>
      <PopoverTrigger>
        <Button className="flex h-6 rounded-full items-center justify-evenly hover:bg-gray-100">
          <i className="ri-more-line text-lg cursor-pointer"></i>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-1 bg-white shadow-md flex flex-col gap-2">
          <div className="text-xs cursor-pointer hover:bg-gray-200 py-0.5 px-2 rounded-[2px]">
            <h1>View </h1>
          </div>
          <div className="text-xs cursor-pointer hover:bg-gray-200 py-0.5 px-2 rounded-[2px]">
            <h1>Edit</h1>
          </div>

          <div className="text-xs cursor-pointer hover:bg-red-200 py-0.5 px-2 rounded-[2px] text-red-600">
            <h1>Delete</h1>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InventoryTable;
