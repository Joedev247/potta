'use client';
import Button from '@potta/components/button';
import { ContextData } from '@potta/components/context';
import React, { useContext, useEffect, useState } from 'react';
import { Customer } from '../../../customers/utils/types';
import useGetOneCustomer from '../../../customers/hooks/useGetOneCustomer';

interface TableItem {
  name: string;
  qty: number;
  price: number | string;
  tax: number | string;
  productId: string;
  uuid: string;
  id: number;
}

const PdfView = () => {
  const context = useContext(ContextData);
  const contextData = context?.data || {};
  const tableData: TableItem[] = contextData.table || [];
  const customerId = contextData.customerName; // Get customer ID from context

  // Use the getOneCustomer hook with the customer ID
  const { data: customerData, isLoading: customerLoading } = useGetOneCustomer(
    customerId || ''
  );
  const customerDetails: Customer | null = customerData || null;
  console.log(customerDetails);
  // Calculate totals
  const subtotal = tableData.reduce((sum: number, item: TableItem) => {
    const price = Number(item.price);
    const qty = Number(item.qty);
    return sum + price * qty;
  }, 0);

  const totalTax = tableData.reduce((sum: number, item: TableItem) => {
    const price = Number(item.price);
    const qty = Number(item.qty);
    const tax = Number(item.tax);
    return sum + (price * qty * tax) / 100;
  }, 0);

  const total = subtotal + totalTax;

  return (
    <div className="h-[100vh] flex flex-col items-center  w-full bg-[#F2F2F2]">
      <div className="flex mt-10 min-w-[45rem]  justify-between w-full p-8">
      <h3 className="text-2xl font-semibold">PDF Preview</h3>
        <Button
          text={'Download'}
          icon={<i className="ri-download-line"></i>}
          type={'submit'}
        />
      </div>
      <div className="p-8 max-w-[48rem] min-w-[45rem] w-full">
        
        <div className="mt-5 h-36 w-full flex items-center pl-4 bg-green-800">
        <p className="text-3xl mt-5 font-semibold text-white">Sales Receipt</p>
        </div>
        <div className="p-5 bg-white">
          <div className="flex justify-between items-center">
            <p></p>
            <div className="text-right">
              <p>Date: {contextData.date || 'Not set'}</p>
              <p>
                Receipt #:{' '}
                {contextData.receiptNumber ||
                  contextData.invoiceNumber ||
                  'Not set'}
              </p>
              <p>Currency: {contextData.currency || 'USD'}</p>
            </div>
          </div>

          <div className="mt-5 w-full flex space-x-5">
            <div className="flex w-[40%] space-x-2">
              <h3>From : </h3>
              <div className="space-y-2 text-sm text-gray-400 flex-col">
                <p>ABC Company</p>
                <p>hello@ABCcompany.com</p>
                <p>ABC, Street, D'la Cameroon</p>
                <p>+237 695904751</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <h3>To : </h3>
              <div className="space-y-2 text-sm text-gray-400 flex-col">
                {customerLoading ? (
                  <p>Loading customer details...</p>
                ) : customerDetails ? (
                  <>
                    <p>
                      {customerDetails.firstName} {customerDetails.lastName}
                    </p>
                    <p>{customerDetails.email || 'No email'}</p>
                    <p>{customerDetails.address.address || 'No address'}</p>
                    <p>{customerDetails.phone || 'No phone'}</p>
                  </>
                ) : (
                  <p>No customer selected</p>
                )}
              </div>
            </div>
          </div>

          <table className="min-w-full table-auto mt-10 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left font-bold">ID</th>
                <th className="px-4 py-2 text-left font-bold">Item</th>
                <th className="px-4 py-2 text-left font-bold">Qty</th>
                <th className="px-4 py-2 text-left font-bold">Price</th>
                <th className="px-4 py-2 text-left font-bold">Tax</th>
                <th className="px-4 py-2 text-left font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item: TableItem, index: number) => {
                const price = Number(item.price);
                const qty = Number(item.qty);
                const tax = Number(item.tax);
                const itemTotal = price * qty;
                const itemTax = (itemTotal * tax) / 100;
                const totalWithTax = itemTotal + itemTax;

                return (
                  <tr key={item.id || index}>
                    <td className="border-b px-4 py-2">{index + 1}</td>
                    <td className="border-b px-4 py-2">{item.name}</td>
                    <td className="border-b px-4 py-2">{qty}</td>
                    <td className="border-b px-4 py-2">{price.toFixed(2)}</td>
                    <td className="border-b px-4 py-2">{itemTax.toFixed(2)}</td>
                    <td className="border-b px-4 py-2">
                      {totalWithTax.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Subtotal and Tax Rows */}
          <div className="w-full mt-10 flex">
            <div className="w-[50%]">
              {/* Payment Method and Notes */}
              <div className="pl-4">
                <p>
                  <strong>Payment Method:</strong>{' '}
                  {contextData.payment_method?.[0] || 'Not selected'}
                </p>
                {contextData.note && (
                  <div className="mt-4">
                    <strong>Notes:</strong>
                    <p className="text-gray-600 mt-1">{contextData.note}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="w-[50%]">
              <div className="mt-4 flex justify-between ">
                <div className="w-1/2">Sub Total:</div>
                <div className="w-1/2 text-right pr-20">
                  {subtotal.toFixed(2)}
                </div>
              </div>

              <div className="mt-2 flex justify-between ">
                <div className="w-1/2">Tax:</div>
                <div className="w-1/2 text-right pr-20">
                  {totalTax.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Line */}
          <hr className="my-4 border-t-2 border-gray-300" />
          <div className="w-full mt-10 flex">
            <div className="w-[50%]"></div>
            <div className="w-[50%] ">
              <div className="flex justify-between font-bold">
                <div className="w-1/2">Total:</div>
                <div className="w-1/2 text-right pr-20">{total.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfView;
