
import React from 'react'
import Table from '@/components/table'

const SaleTable = () => {
    const columns = [
        {
            name: "Date",
            // selector: (row: any) => <div className='flex space-x-3'><img src={row.img} alt="" /><p className='mt-0.5'>{row.name}</p></div>,
        },
        {
            name: "Customer",
            // selector: (row: { sku: any; }) => row.sku,


        },
        {
            name: "Type",
            // selector: (row: { type: any; }) => row.type,

        },
        {
            name: "Cost",
            // selector: (row: { cost: any; }) => row.cost,


        },
        {
            name: "Method",
            // selector: (row: { salePrice: any; }) => <div>XAF {row.salePrice}</div>,


        },
        {
            name: "Memo",
            // selector: (row: { inventory: any; }) =>
            //     <div>
            //         {row.inventory}
            //     </div>,


        },

        {
            name: "Due Date",
            // selector: (row: { points: any; }) =>
            //     <div className=''>
            //         {row.points}
            //     </div>,

        },
        {
            name: "Balance",
            // selector: (row: { inventory: any; }) =>
            //     <div>
            //         {row.inventory}
            //     </div>,


        },
        {
            name: "Total",
            // selector: (row: { inventory: any; }) =>
            //     <div>
            //         {row.inventory}
            //     </div>,


        },
        {
            name: "Resolution",
            // selector: (row: { inventory: any; }) =>
            //     <div>
            //         {row.inventory}
            //     </div>,


        },
        {
            name: "",
            // selector: (row: { method: any; }) =>
            //     <div>
            //         <i className='r-more-2-line'></i>
            //     </div>,


        },
    ];
    const data = [
        {
            id: 'Inv 001',
            name: 'Black Shoes Nike',
            img: "/icons/shoes.svg",
            sku: '194E175W',
            type: 'Inventory',
            cost: 'Xaf 350,000',
            salePrice: 'Xaf 450,000',
            inventory: "245",
            points: "23 ",

        },
    ]
    return (
        <div className='mt-10'>
            <div>

            </div>
            <Table columns={columns} data={data} ExpandableComponent={null} expanded pagination={data.length > 9 ? true : false} />
        </div>
    )
}

export default SaleTable