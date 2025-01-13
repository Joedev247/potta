import React from 'react'
import Table from '@/components/table'
import Button from '@/components/button';

const BudgetTable = () => {
    const columns = [
        {
            name: "Ref",
            selector: (row: { ref: any; }) => <div className='flex space-x-3'><p className='mt-0.5'>{row.ref}</p></div>,
            sortable: true
        },
        {
            name: "Made By",
            selector: (row: { madeby: any; }) => row.madeby,
            sortable: true,

        },
        {
            name: "Made To",
            selector: (row: { madeto: any; }) => row.madeto,
            sortable: true,

        },
        {
            name: "Category",
            selector: (row: { category: any; }) => row.category,
            sortable: true,

        },
        {
            name: "Amount",
            selector: (row: { amount: any; }) => <div>XAF {row.amount}</div>,
            sortable: true,

        },
        {
            name: "Method",
            selector: (row: { method: any; }) =>
                <div>
                    <img src="/images/Mastercard.svg" className='h-5 w-auto' alt="" />
                </div>,
            sortable: true,

        },
        {
            name: "Resolution",
            selector: (row: { Date: any; }) =>
                <div className=''>
                    <button className='space-x-2 px-4 py-1 border border-green-400 text-green-400'><i className="ri-checkbox-circle-fill"></i> Approved</button>
                </div>,
            sortable: true
        }
    ];
    const data = [
        {
            id: 'Inv 001',
            ref: 'Today',
            madeby: 'Kun Aguero',
            madeto: 'Eneo CMR',
            category: 'Office Cleaning',
            method: 'Invoice for UI design',
            amount: "200,000",
            Date: "Feb 04, 2024 ",
            status: "Paid",
        },
    ]
    return (
        <div className='mt-10'>
            <Table columns={columns} data={data} ExpandableComponent={null} expanded pagination={data.length > 9 ? true : false} />
        </div>
    )
}

export default BudgetTable