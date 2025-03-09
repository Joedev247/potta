'use client'; // Make sure to mark this component as client-side

import React, { useState, FC } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button } from '@nextui-org/react';
import InvoiceModal from './modalInvoice';
import ModalInvoice from './modal';

const InvoiceTableComponents = () => {
    const columns = [
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
                <MoreIcon />
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

    return (
        <div className='mt-10'>
            <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className="py-2 px-4 border-b text-left">{col.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="py-2 px-4 border-b">
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

const MoreIcon: FC = () => {
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
                        <InvoiceModal />
                    </div>
                    <div className="text-xs cursor-pointer hover:bg-gray-200 py-0.5 px-2 rounded-[2px]">
                        <ModalInvoice />
                    </div>

                    <div className="text-xs cursor-pointer hover:bg-red-200 py-0.5 px-2 rounded-[2px] text-red-600">
                        <h1>Delete ID</h1>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default InvoiceTableComponents;
