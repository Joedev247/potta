'use client'; // Make sure to mark this component as client-side

import React, { useState, FC, useMemo } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button, Checkbox } from '@nextui-org/react';
import InvoiceModal from './modalInvoice';
import ModalInvoice from './modal';
import DataGrid from './DataGrid';
import { ColumnDef } from '@tanstack/react-table';


interface IInvoiceTableComponents {
  onInvoiceDetailsClose:()=>void,
  onInvoiceDetailsOpen:()=>void,
  onDeleteModal:()=> void
  isInvoiceDetailsOpen:boolean

}
const InvoiceTableComponents = ({onInvoiceDetailsClose,isInvoiceDetailsOpen, onInvoiceDetailsOpen,onDeleteModal}:IInvoiceTableComponents) => {
    const columns = [

      {
        name:<><Checkbox color="success" size="lg" /></>,
        selector: (row) => <Checkbox color="success" size="lg" />
      },
        {
            name: "Date",
            selector: (row: any) => row.date,
        },
        {
            name: "Customer",
            selector: (row: { customer: any; }) => row.customer,
        },
        {
            name: "ID",
            selector: (row: { id: any; }) => row.id,
        },
        {
            name: "Title",
            selector: (row: { title: any; }) => row.title,
        },
        {
            name: "Status",
            selector: (row: { status: any; }) => row.status,
        },
        {
            name: "Amount",
            selector: (row: { amount: any; }) => row.amount,
        },
        {
            name: "Resolution",
            selector: (row: { resolution: any; }) => row.resolution,
        },
        {
            name: "Actions",
            selector: (row: { reference: any; id: string }) => (
                <MoreIcon onInvoiceDetailsOpen={onInvoiceDetailsOpen} onInvoiceDetailsClose={onInvoiceDetailsClose} isInvoiceDetailsOpen={isInvoiceDetailsOpen} onDeleteModal={onDeleteModal} />
            ),
        }
    ];

    const data = [
        {
            date: "Yesterday",
            customer: "Jonathan Major",
            id: "009",
            title: "Office Cleaning",
            status: "Unpaid",
            amount: "$12,000",
            resolution: "Pending",
            reference: "REF123",
        },
        {
            date: "Today",
            customer: "Sarah Connor",
            id: "010",
            title: "Window Cleaning",
            status: "Paid",
            amount: "$500",
            resolution: "Completed",
            reference: "REF124",
        }
    ];

    type IData = {
      date: string;
    customer: string;
    id: string;
    title: string;
    status: string;
    amount: string;
    resolution: string;
    reference: string;
    }

    const dataColumn = () : ColumnDef<IData> []=> {

      return [{
        accessorKey:"id",
        header:"ID"
      },
    {
      accessorKey:"amount",
      header:"Amount"
    },
    {
      accessorKey:"customer",
      header:"Customer"
    },
    {
      accessorKey:"date",
      header:"Date"
    },
    {
      accessorKey:"title",
      header:"Title"
    },
    {
      accessorKey:"status",
      header:"Status"
    }
    ]
    }


    const newData = useMemo(()=> data,[])
    if(data?.length){
      return <DataGrid
      column={dataColumn()}
      data={newData}
      /> 
    }

    return (
      <div className="mt-10">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="py-4 bg- px-4 border-b bg-green-50 text-left"
                >
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={'py-4 px-4 border-b border-r'}>
                    {col.selector(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};


interface IMoreIcon {
  onInvoiceDetailsClose:()=>void,
  onInvoiceDetailsOpen:()=>void,
  onDeleteModal:()=> void
  isInvoiceDetailsOpen: boolean
}
const MoreIcon: FC<IMoreIcon> = ({onInvoiceDetailsOpen, onInvoiceDetailsClose, onDeleteModal,isInvoiceDetailsOpen}) => {

    return (
        <Popover placement="left-start" showArrow={true}>
            <PopoverTrigger>
                <Button className="flex w-6 h-6 rounded-full items-center justify-evenly hover:bg-gray-100">
                    <i className="ri-more-line text-lg cursor-pointer"></i>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="p-1 bg-white shadow-md flex flex-col gap-2">
                    <div className="text-xs cursor-pointer hover:bg-gray-200 py-0.5 px-2 rounded-[2px]">
                      <Button onClick={onInvoiceDetailsOpen}>

                      Invoice details
                      </Button>
                      {/*{*/}
                      {/*  isInvoiceDetailsOpen ?*/}
                      {/*  <InvoiceModal open={isInvoiceDetailsOpen} onClose={onInvoiceDetailsClose} />*/}
                      {/*    : null*/}
                      {/*}*/}
                    </div>
                    {/*<div className="text-xs cursor-pointer hover:bg-gray-200 py-0.5 px-2 rounded-[2px]">*/}
                    {/*    <ModalInvoice />*/}
                    {/*</div>*/}

                    <div className="text-xs cursor-pointer hover:bg-red-200 py-0.5 px-2 rounded-[2px] text-red-600">
                        <h1>Delete ID</h1>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default InvoiceTableComponents;
