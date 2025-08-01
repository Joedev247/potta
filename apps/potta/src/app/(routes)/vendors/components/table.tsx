'use client';
import React, { FC, useState } from 'react';
import DataGrid from '@potta/app/(routes)/account_receivables/invoice/components/DataGrid';
import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';
import Flag from 'react-world-flags';

import Filter from './filters';
import useGetAllVendors from '../hooks/useGetAllVendors';
import ViewVendorSlider from './viewVendorSlider.tsx';

import EditVendor from './updateVendorSlider';
import DeleteModal from './deleteModal';
import { VendorFilter } from '../utils/types';

import { UpdateVendorPayload, updateVendorSchema } from '../utils/validations';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@potta/components/shadcn/dropdown';
import { ColumnDef } from '@tanstack/react-table';

export const PhoneFlag = ({ phoneNumber }: { phoneNumber: string }) => {
  const phoneNumberObj = parsePhoneNumberFromString(phoneNumber);
  const countryCode = phoneNumberObj?.country;
  const number = phoneNumberObj?.number;
  return countryCode ? (
    <div className="flex items-center">
      <div className="">
        <img
          src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
          alt={countryCode}
        />
      </div>
      {number}
    </div>
  ) : (
    <p>Invalid Number</p>
  );
};

const TableComponents = () => {
  const [openViewModal, setOpenViewModal] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<string | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = useState<string | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [vendorDetails, setVendorDetails] =
    useState<UpdateVendorPayload | null>(null);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Vendor/ Company Name',
      cell: ({ row: { original } }) => <div className="">{original.name}</div>,
    },
    {
      accessorKey: 'phone',
      header: 'Telephone',
      cell: ({ row: { original } }) => (
        <PhoneFlag phoneNumber={original.phone} />
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row: { original } }) => <div className="">{original.email}</div>,
    },
    {
      accessorKey: 'openingBalance',
      header: 'Balance',
      cell: ({ row: { original } }) => (
        <div>
          {original.openingBalance !== null ? original.currency : ''}
          {original.openingBalance !== null ? original.openingBalance : 'N/A'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row: { original } }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <i className="ri-more-2-fill text-gray-600"></i>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => {
                  setOpenViewModal(original.uuid);
                  setIsViewOpen(true);
                }}
                className="cursor-pointer"
              >
                <i className="ri-eye-line mr-2"></i>
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpenUpdateModal(original.uuid);
                  setVendorDetails(original);
                  setIsEditOpen(true);
                }}
                className="cursor-pointer"
              >
                <i className="ri-edit-line mr-2"></i>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpenDeleteModal(original.uuid);
                  setIsDeleteOpen(true);
                }}
                className="cursor-pointer text-red-600"
              >
                <i className="ri-delete-bin-line mr-2"></i>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filter: VendorFilter = { page, limit };
  const { data: vendor, isLoading, error } = useGetAllVendors(filter);

  const handleRowClick = (row: any) => {
    setOpenViewModal(row.uuid);
    setIsViewOpen(true);
  };

  if (error)
    return (
      <div className="mt-10">
        <Filter />
        <div className="min-h-60 items-center flex justify-center">
          <p className="text-red-600 text-center">
            Error fetching vendors: {error.message}
          </p>
        </div>
      </div>
    );
  return (
    <div className="mt-10">
      <Filter />
      <DataGrid
        columns={columns}
        data={vendor?.data || []}
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />
      {openDeleteModal && (
        <DeleteModal
          vendorID={openDeleteModal}
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
        />
      )}
      {openUpdateModal && (
        <EditVendor
          vendor={vendorDetails}
          vendorId={openUpdateModal}
          open={isEditOpen}
          setOpen={setIsEditOpen}
        />
      )}
      {openViewModal && (
        <ViewVendorSlider
          vendorId={openViewModal}
          open={isViewOpen}
          setOpen={setIsViewOpen}
        />
      )}
    </div>
  );
};

export default TableComponents;
