import React from 'react';
import MyTable from '@/components/table';

const TableAccount = () => {
    const columns = [
        {
            name: "Account Name",
            // render: (row: any) => <div className=''>{row.date}</div>,
        },
        {
            name: "Type",
            // render: (row: { amount: any; }) => <div className=''>{row.amount}</div>,
        },
        {
            name: "Detail Category",
            // render: (row: { status: any; }) => <div className=''>{row.status}</div>,
        },
        {
            name: "Accural Balance",
            // render: (row: { reference: any; }) => <div className=''>{row.reference}</div>,
        },
        {
            name: "Cash Balance",
            // render: (row: { reference: any; }) => <div className=''>{row.reference}</div>,
        }
        ,
        {
            name: "Status",
            // render: (row: { reference: any; }) => <div className=''>{row.reference}</div>,
        },
        {
            name: "",
            // render: (row: { reference: any; }) => <div className=''>{row.reference}</div>,
        }
    ];

    const data = [
        {
            id: 'Inv 001',
            date: '10/03/2024 | 00:25',
            amount: '25,000',
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

export default TableAccount;
