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
import useGetAllCustomers from '../hooks/useGetAllCustomers';
import ViewCustomerSlider from './viewCustomerSlider.tsx';
import CustomPopover from '@potta/components/popover';
import EditCustomer from './updateCustomerSlider';
import DeleteModal from './deleteModal';
import { CustomerFilter } from '../utils/types';
import { log } from 'console';
import {
  UpdateCustomerPayload,
  updateCustomerSchema,
} from '../utils/validations';
import TableActionPopover, {
  PopoverAction,
} from '@potta/components/tableActionsPopover';
import Image from 'next/image';

export const PhoneFlag = ({
  phoneNumber,
}: {
  phoneNumber: string | number;
}) => {
  const convertToE164 = (phoneNumber: string | number) => {
    if (typeof phoneNumber === 'number') {
      return phoneNumber.toString();
    }
    return phoneNumber;
  };
  const phoneNumberObj = parsePhoneNumberFromString(convertToE164(phoneNumber));
  const countryCode = phoneNumberObj?.country;
  const number = phoneNumberObj?.number;
  return countryCode ? (
    <div className="flex items-center">
      <div className="">
        <Image
          width={200}
          height={200}
          className="w-full h-full object-cover"
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
  const [customerDetails, setCustomerDetails] =
    useState<UpdateCustomerPayload | null>(null);
  const columns = [
    {
      name: 'Customer Name',
      selector: (row: any) => (
        <div className="">
          {row.firstName} {row.lastName}
        </div>
      ),
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
      name: 'Type',
      selector: (row: any) => <div>{row.type}</div>,
    },
    {
      name: 'Status',
      selector: (row: any) => {
        const status = row.status || 'enabled'; // Default to enabled if status is not provided

        // Status color mapping based on the specific status values from validations.ts
        const statusColorMap: Record<string, string> = {
          pending: 'bg-yellow-100 text-yellow-800',
          schedule: 'bg-blue-100 text-blue-800',
          complete: 'bg-green-100 text-green-800',
          enabled: 'bg-green-100 text-green-800',
          disabled: 'bg-red-100 text-red-800',
          available: 'bg-teal-100 text-teal-800',
          expired: 'bg-gray-100 text-gray-800',
          taken: 'bg-purple-100 text-purple-800',
        };

        const colorClass =
          statusColorMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'; // Default styling
        return (
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}{' '}
            {/* Capitalize first letter */}
          </div>
        );
      },
    },
    {
      name: 'Actions',
      selector: (row: any) => {
        const actions: PopoverAction[] = [
          {
            label: 'View',
            onClick: () => {
              setOpenViewModal(row.uuid);
              setIsViewOpen(true);
            },
            className: 'hover:bg-gray-200',
            icon: <i className="ri-eye-line" />,
          },
          {
            label: 'Edit',
            onClick: () => {
              setOpenUpdateModal(row.uuid);
              setCustomerDetails(row);
              setIsEditOpen(true);
            },
            className: 'hover:bg-gray-200',
            icon: <i className="ri-edit-line" />,
          },
          {
            label: 'Delete',
            onClick: () => {
              setOpenDeleteModal(row.uuid);
              setIsDeleteOpen(true);
            },
            className: 'hover:bg-red-200 text-red-600',
            icon: <i className="ri-delete-bin-line" />,
          },
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

  const filter: CustomerFilter = { page, limit };
  const { data: customer, isLoading, error } = useGetAllCustomers(filter);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePerRowsChange = (newLimit: number, newPage: number) => {
    setLimit(newLimit);
    setPage(newPage); // Reset page when changing rows per page
  };

  const handleRowClick = (row: any) => {
    setOpenViewModal(row.uuid);
    setIsViewOpen(true);
  };

  if (error)
    return (
      <div className="mt-10">
        <Filter />
        <div className="min-h-60 items-center flex justify-center">
          <p className="text-red-600  text-center">
            An Error occured while fetching customers please try again later
          </p>
        </div>
      </div>
    );

  return (
    <div className="mt-10">
      <Filter />
      <MyTable
        minHeight="50vh"
        maxHeight="50vh"
        columns={columns}
        data={customer?.data || []}
        pagination
        expanded
        pending={isLoading}
        paginationServer
        paginationTotalRows={customer?.meta?.totalItems ?? 0}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        onRowClicked={handleRowClick}
      />
      {openDeleteModal && (
        <DeleteModal
          customerID={openDeleteModal}
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
        />
      )}
      {openUpdateModal && (
        <EditCustomer
          customer={customerDetails}
          customerId={openUpdateModal}
          open={isEditOpen}
          setOpen={setIsEditOpen}
        />
      )}
      {openViewModal && (
        <ViewCustomerSlider
          customerId={openViewModal}
          open={isViewOpen}
          setOpen={setIsViewOpen}
        />
      )}
    </div>
  );
};

export default TableComponents;
