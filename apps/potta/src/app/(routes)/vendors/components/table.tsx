'use client';
import React, { FC, useState } from 'react';
import MyTable from '@potta/components/table';
import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';
import Flag from 'react-world-flags';

import {
  PopoverTrigger,
  PopoverContent,
  Popover,
  Button,
} from '@nextui-org/react';
import Filter from './filters';
import useGetAllVendors from '../hooks/useGetAllVendors';
import ViewVendorSlider from './viewVendorSlider.tsx';
import CustomPopover from '@potta/components/popover';
import EditVendor from './updateVendorSlider';
import DeleteModal from './deleteModal';
import { VendorFilter } from '../utils/types';
import { log } from 'console';
import { UpdateVendorPayload, updateVendorSchema } from '../utils/validations';
import TableActionPopover, { PopoverAction } from '@potta/components/tableActionsPopover';

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
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState<string | null>(null);
  const [openUpdateModal, setOpenUpdateModal] = useState<string | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [vendorDetails, setVendorDetails] =
    useState<UpdateVendorPayload | null>(null);
  const columns = [
    {
      name: 'Vendor/ Company Name',
      selector: (row: any) => <div className="">{row.name}</div>,
    },
    {
      name: 'Telephone ',
      selector: (row: any) => <PhoneFlag phoneNumber={row.phone} />,
    },
    {
      name: 'Email',
      selector: (row: any) => <div className="">{row.email}</div>,
    },
    {
      name: 'Balance',
      selector: (row: any) => (
        <div>
          {row.openingBalance !== null ? row.currency : ''}
          {row.openingBalance !== null ? row.openingBalance : 'N/A'}
        </div>
      ),
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
              setVendorDetails(row);
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

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filter: VendorFilter = { page, limit };
  const { data: vendor, isLoading, error } = useGetAllVendors(filter);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePerRowsChange = (newLimit: number, newPage: number) => {
    setLimit(newLimit);
    setPage(newPage); // Reset page when changing rows per page
  };

  if (error)
    return (
      <p className="text-red-600">Error fetching vendors: {error.message}</p>
    );
  return (
    <div className="mt-10">
      <Filter />
      <MyTable
        columns={columns}
        data={vendor?.data || []}
        pagination
        expanded
        pending={isLoading}
        paginationServer
        paginationTotalRows={vendor?.meta?.totalItems ?? 0}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
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
