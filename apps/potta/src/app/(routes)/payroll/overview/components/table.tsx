import React from 'react'
import Table from '@/components/table'
import Button from '@/components/button';

const PayrollTable = () => {
    const columns = [
        {
            name: "Employee",
            // selector: (row: { name: any; }) => <div className='flex space-x-3'><p className='mt-0.5'>{row.name}</p></div>,
            sortable: true
        },
        {
            name: "Today Pay",
            // selector: (row: { id: any; }) => row.id,
            sortable: true,

        },
        {
            name: "Rate",
            // selector: (row: { amount: any; }) => row.amount,
            sortable: true,

        },
        {
            name: "Regular hrs",
            // selector: (row: { Date: any; }) => row.Date,
            sortable: true
        },
        {
            name: "Overtime",
            // selector: (row: { Date: any; }) => row.Date,
            sortable: true
        },
        {
            name: "PTO hrs",
            // selector: (row: { Date: any; }) => row.Date,
            sortable: true
        },
        {
            name: "STO hrs",
            // selector: (row: { Date: any; }) => row.Date,
            sortable: true
        },
        {
            name: "Bonus ",
            // selector: (row: { Date: any; }) => row.Date,
            sortable: true
        },
        {
            name: "Commisions",
            // selector: (row: { Date: any; }) => row.Date,
            sortable: true
        },
        {
            name: "Other Earnings",
            // selector: (row: { Date: any; }) => row.Date,
            sortable: true
        },
        {
            name: "Pay Notes",
            // selector: (row: { Date: any; }) => row.Date,
            sortable: true
        },
        {
            name: "Methods",
            // selector: (row: { Date: any; }) => row.Date,
            sortable: true
        },
    ];
    const data = [
        {
            id: 'Inv 001',
            Name: 'Invoice for UI design',
            amount: "XAF 200,000",
            Date: "Feb 04, 2024 ",
            status: "Paid",
        },
    ]
    return (
        <div className='mt-10'>
            <Table columns={columns} data={data} ExpandableComponent={null} />
        </div>
    )
}

export default PayrollTable