import React from 'react';
import MyTable from '@/components/table';
import SliderBenefit from './sliderBenefit';

const TableBenefit = () => {
    const columns = [
        {
            name: "Benefit",
            // render: (row: any) => <div className=''>{row.date}</div>,
        },
        {
            name: "Type ",
            // render: (row: any) => <div className=''>{row.type}</div>,
        },
        {
            name: "Rate",
            // render: (row: { amount: any; }) => <div className=''>{row.amount}</div>,
        },
        {
            name: "Provider",
            // render: (row: { status: any; }) => <div className=''>{row.status}</div>,
        },
        {
            name: "Next Due Date",
            // render: (row: { reference: any; }) => <div className=''>{row.reference}</div>,
        },
        {
            name: "Status",
            // render: (row: { reference: any; }) => <div className=''>{row.reference}</div>,
        }
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
        <div className='mt-10 px-14 pt-10'>
            <div className='my-2 flex justify-end'>
                <SliderBenefit />
            </div>
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

export default TableBenefit;
