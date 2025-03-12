'use client';
import React, { useEffect, useContext } from 'react';
import MyTable from '@potta/components/table';
import { ContextData } from '@potta/components/context';
import OrderSummary from './orderSummary';

const TableOPS = () => {
  const context = useContext(ContextData);

  const deleteItem = (id: string) => {
    context?.setData(context?.data.filter((item: any) => item.id !== id));
  };

  const calculateTotalPrice = () => {
    if (!context?.data) return;

    const calculatedSubtotal = context.data.reduce((acc: number, item: any) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      return acc + price * quantity;
    }, 0);

    // Assuming tax is 10% of subtotal
    const calculatedTax = calculatedSubtotal * 0.1;

    // Calculate final total with current discount from context
    const calculatedTotal = calculatedSubtotal + calculatedTax - (context.orderSummary?.discount || 0);

    // Update order summary in context
    context?.setOrderSummary({
      subtotal: calculatedSubtotal,
      tax: calculatedTax,
      discount: context.orderSummary?.discount || 0,
      total: calculatedTotal
    });
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [context?.data, context?.orderSummary?.discount]);

  const handleQuantityChange = (itemId: string, change: number) => {
    context?.setData((prevData: any) =>
      prevData.map((item: any) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          if (newQuantity < 1) {
            alert('Minimum quantity is 1');
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const columns = [
    {
      name: 'Name',
      width: '170px',
      selector: (row: any) => row.name,
    },
    {
      name: 'Quantity',
      selector: (row: any) => (
        <div className="flex space-x-1 items-center">
          <button
            onClick={() => handleQuantityChange(row.id, -1)}
            disabled={row.quantity <= 1}
            className="h-[20px] bg-red-500 border-red-500 px-2 items-center border text-white flex justify-center w-[20px]"
          >
            <i className="ri-subtract-line text-lg"></i>
          </button>
          <input
            type="text"
            value={row.quantity}
            readOnly
            className="h-[26px] w-1/3 text-base outline-none pl-2"
          />
          <button
            onClick={() => handleQuantityChange(row.id, 1)}
            className="h-[20px] bg-green-800 border-green-800 px-2 text-white border-y border-r w-[20px] items-center flex justify-center"
          >
            <i className="ri-add-line text-lg"></i>
          </button>
        </div>
      ),
    },
    {
      name: 'Price',
      selector: (row: any) => {
        const price = Number(row.price);
        return isNaN(price) ? '0.00' : `$${price.toFixed(2)}`;
      },
    },
    {
      name: 'Discount',
      selector: (row: any) => {
        const tax = Number(row.tax);
        return isNaN(tax) ? '0.00' : `$${tax.toFixed(2)}`;
      },
    },
    {
      name: 'Total',
      selector: (row: any) => {
        const price = Number(row.price);
        const tax = Number(row.tax);
        const quantity = Number(row.quantity);

        if (isNaN(price) || isNaN(tax) || isNaN(quantity)) {
          return '$0.00';
        }

        const subtotal = (price + tax) * quantity;
        return `$${subtotal.toFixed(2)}`;
      },
    },
    {
      name: '',
      selector: (row: any) => (
        <button
          className="text-red-500 hover:text-red-400"
          onClick={() => deleteItem(row.id)}
        >
          <i className="ri-delete-bin-line text-xl"></i>
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="mt-2">
        <div className="h-[50vh]">
          <MyTable
            columns={columns}
            pagination={false}
            data={context?.data || []}
            ExpandableComponent={null}
            selectable={false}
            expanded={true}
            color
          />
        </div>
        <OrderSummary
          subtotal={context?.orderSummary?.subtotal || 0}
          discount={context?.orderSummary?.discount || 0}
          tax={context?.orderSummary?.tax || 0}
          total={context?.orderSummary?.total || 0}
          setDiscount={(newDiscount: number) => {
            if (context?.setOrderSummary) {
              context.setOrderSummary(prev => ({
                ...prev,
                discount: newDiscount,
                total: prev.subtotal + prev.tax - newDiscount
              }));
            }
          }}
        />
      </div>
    </>
  );
};

export default TableOPS;
