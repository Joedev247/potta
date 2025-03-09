'use client';
import React, { FC, useState } from 'react';
import Table from '@potta/components/table';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@nextui-org/react';
import { Filter } from '../_utils/types';
import useGetAllProducts from '../_hooks/useGetAllProducts';
import DeleteModal from './deleteModal';
import CustomPopover from '@potta/components/popover';
import EditProduct from './slides/components/update_product';
import { UpdateProductPayload } from '../_utils/validation';
import TableActionPopover, { PopoverAction } from '@potta/components/tableActionsPopover';
import ViewProductSlider from './slides/components/viewProduct';
const InventoryTable = () => {
   const [openPopover, setOpenPopover] = useState<string | null>(null);
    const [openViewModal, setOpenViewModal] = useState<string | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState<string | null>(null);
    const [openUpdateModal, setOpenUpdateModal] = useState<string | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [productDetails, setproductDetails] =
      useState<UpdateProductPayload | null>(null);
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
      selector: (row: { points: any }) => <div className="">355</div>,
    },
    {
      name: '',
      selector: (row: any) => {
        const actions: PopoverAction[] = [
          {
            label: 'View',
            onClick: () => {
              setOpenViewModal(row.uuid);
              setIsViewOpen(true);
            },
            className: 'hover:bg-gray-200',
            icon: <i className="ri-eye-line" />
          },
          {
            label: 'Edit',
            onClick: () => {
              setOpenUpdateModal(row.uuid);
              setproductDetails(row);
              setIsEditOpen(true);
            },
            className: 'hover:bg-gray-200',
            icon: <i className="ri-edit-line" />
          },
          {
            label: 'Delete',
            onClick: () => {
              setOpenDeleteModal(row.uuid);
              setIsDeleteOpen(true);
            },
            className: 'hover:bg-red-200 text-red-600',
            icon: <i className="ri-delete-bin-line" />
          }
        ];

        return (
          <TableActionPopover
            actions={actions}
            rowUuid={row.uuid}
            openPopover={openPopover}
            setOpenPopover={setOpenPopover}
          />
        );
      },
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

  const filter: Filter = { page, limit };
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
      {openDeleteModal && (
        <DeleteModal
          productID={openDeleteModal}
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
        />
      )}
      {openUpdateModal && (
        <EditProduct
          product={productDetails}
          productId={openUpdateModal}
          open={isEditOpen}
          setOpen={setIsEditOpen}
        />
      )}
      {openViewModal && (
        <ViewProductSlider
          productId={openViewModal}
          open={isViewOpen}
          setOpen={setIsViewOpen}
        />
      )}
    </div>
  );
};


export default InventoryTable;
