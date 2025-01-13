import React from 'react';
import MyTable from '@/components/table';


const TimesheetTable = () => {
    const columns = [
        {
            name: "Employee",
            // render: (row: any) => <div className=''>{row.date}</div>,
        },
        {
            name: "Total Hours ",
            // render: (row: any) => <div className=''>{row.type}</div>,
        },
        {
            name: "Break Down",
            // render: (row: { amount: any; }) => <div className=''>{row.amount}</div>,
        },
        {
            name: "Regular Hours",
            // render: (row: { status: any; }) => <div className=''>{row.status}</div>,
        },
        {
            name: "OverTime",
            // render: (row: { reference: any; }) => <div className=''>{row.reference}</div>,
        },
        {
            name: "Status",
            // render: (row: { reference: any; }) => <div className=''>{row.reference}</div>,
        },

    ];

    const data = [
        {
            id: 'Inv 001',
            date: '10/03/2024 | 00:25',
            amount: '25,000',
            type: "",
            status: 'Paid',
            reference: '10054264',
        }
    ];

    return (
        <div className='mt-10'>
            <MyTable
                columns={columns}
                data={data}
                ExpandableComponent={null}
                expanded
                pagination={data.length > 9}
            />
        </div>
    );
};

export default TimesheetTable;
