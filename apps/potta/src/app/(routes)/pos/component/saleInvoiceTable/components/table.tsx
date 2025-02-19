'use client';
import React, { useState, useEffect, useContext } from 'react';
import MyTable from "@potta/components/table";
import { ContextData } from "@potta/components/context";
import ModalCoupon from './modalCoupon';
import HoldOn from './holdOn';
import ModalPrint from '../../print/page';
import Button from '@potta/components/button';


const TableOPS = () => {
    const context = useContext(ContextData)

    const deleteItem = (id: string) => {
        context?.setData(context?.data.filter((item: any) => item.id !== id));
    };

    const calculateTotalPrice = () => {
        const total = context?.data?.reduce((acc: any, item: any) => {
            const subtotal = (item.price) * item.quantity;
            return acc + subtotal;
        }, 0);
        // context?.setTotalPrice(total);
    };

    useEffect(() => {
        calculateTotalPrice();
    }, [context?.data]);

    const handleQuantityChange = (itemId: string, change: number) => {
        context?.setData((prevData: any) =>
            prevData.map((item: any) => {
                if (item.id === itemId) {
                    const newQuantity = item.quantity + change;
                    if (newQuantity < 1) {
                        alert('Minimum quantity is 1');
                        return item; // Prevent decreasing below 1
                    }
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };
    const columns = [
        {
            name: 'Item Name',
            selector: (row: any) => row.name,
        },
        {
            name: 'Quantity',
            selector: (row: any) => (
                <div className="flex">
                    <button
                        onClick={() => handleQuantityChange(row.id, -1)}
                        disabled={row.quantity <= 1} // Disable if quantity is 1
                        className="h-[26px] px-2 items-center border-y border-l flex justify-center w-[30px]"
                    >
                        <i className="ri-subtract-line text-lg"></i>
                    </button>
                    <input
                        type="text"
                        value={row.quantity}
                        readOnly
                        className="h-[26px] w-full border outline-none pl-2"
                    />
                    <button
                        onClick={() => handleQuantityChange(row.id, 1)}
                        className="h-[26px] bg-red-500 border-red-500 px-2 text-white border-y border-r w-[30px] items-center flex justify-center"
                    >
                        <i className="ri-add-line text-lg"></i>
                    </button>
                </div>
            ),
        },
        {
            name: 'Price',
            selector: (row: any) => row.price.toFixed(2),
        },
        {
            name: 'Discount',
            selector: (row: any) => row.discount,
        },
        {
            name: 'SubTotal',
            selector: (row: any) => {
                const subtotal = (row.price + row.tax) * row.quantity;
                return subtotal.toFixed(2);
            },
        },
        {
            name: <i className="ri-close-fill text-xl"></i>,
            width: '60px',
            selector: (row: any) => (
                <button className="text-red-500 hover:text-red-400" onClick={() => deleteItem(row.id)}>
                    <i className="ri-delete-bin-line text-xl"></i>
                </button>
            ),
        }
    ];
    return (
        <>
            <div className="mt-2">
                <div className='h-[30vh]'>
                    <MyTable
                        columns={columns}
                        pagination={false}
                        data={context?.data?.map((item: any) => ({
                            ...item,
                            setQuantity: (quantityChange: any) => handleQuantityChange(item.id, quantityChange),
                            deleteItem,
                        }))}
                        ExpandableComponent={null}
                        size={true}
                        expanded={true}
                    />
                </div>
                <div>
                    <ModalCoupon />
                </div>
                <div className="mt-4 w-full flex justify-end">
                    <div className='w-1/2  '>
                        <table className=' divide-y   w-full'>
                            <thead className=' divide-y   w-full'>
                                <tr>
                                    <td className='py-2'>Discount</td>
                                    <td className='font-medium'><p>12.0</p></td>
                                </tr>
                                <tr>
                                    <td className='py-2'>Tax</td>
                                    <td className='font-medium'><p>12.0</p></td>
                                </tr>
                                <tr>
                                    <td className='py-2'>Total</td>
                                    <td className='font-medium'><p>1200
                                    </p></td>
                                </tr>
                            </thead>
                        </table>
                    </div>

                </div>
                <div className='flex justify-between my-3'>
                    <HoldOn />
                    {context?.data == undefined ? '' : <div><button className="bg-green-500  w-20 py-1   text-white" onClick={() => context.setToggle(false)} >Print</button></div>}

                </div>
            </div>
        </>
    );
};

export default TableOPS;

