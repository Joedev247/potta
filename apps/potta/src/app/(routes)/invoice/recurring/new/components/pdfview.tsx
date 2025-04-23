'use client';
import useGetOneCustomer from '@potta/app/(routes)/customers/hooks/useGetOneCustomer';
import useGetOneVendor from '@potta/app/(routes)/vendors/hooks/useGetOneVendor'; // You'll need to create this hook
import { Customer } from '@potta/app/(routes)/customers/utils/types';
import { ContextData } from '@potta/components/context';
import React, { useContext } from 'react';

interface TableItem {
  name: string;
  qty: number;
  price: number | string;
  tax: number | string; 
  productId: string;
  uuid: string;
  id: number;
  discountRate: number | string;
  discountCap: number | string;
}

const PdfView = () => {
  const context = useContext(ContextData);
  const contextData = context?.data || {};
  const tableData: TableItem[] = contextData.table || [];
  const customerId = contextData.customerId; // Get customer ID from context
  const vendorId = contextData.vendorId; // Get vendor ID from context

  // Format dates if they exist
  const formattedOrderDate = contextData.orderDate
    ? new Date(contextData.orderDate).toLocaleDateString()
    : 'Not set';

  const formattedRequiredDate = contextData.requiredDate
    ? new Date(contextData.requiredDate).toLocaleDateString()
    : 'Not set';
    
  const formattedShipDate = contextData.shipDate
    ? new Date(contextData.shipDate).toLocaleDateString()
    : 'Not set';

  const orderNumber = contextData.orderNumber || '';
  const shoppingAddress = contextData.shoppingAddress || '';
  const paymentTerms = contextData.paymentTerms || '';
  const paymentMethod = contextData.paymentMethod || '';
  const status = contextData.status || 'Pending';

  const getCurrencySymbol = (currencyCode: string): string => {
    switch (currencyCode) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'XAF':
        return 'XAF';
      default:
        return currencyCode;
    }
  };
  const currencySymbol = getCurrencySymbol(contextData.currency || 'USD');

  // Use the getOneCustomer hook with the customer ID
  const { data: customerData, isLoading: customerLoading } = useGetOneCustomer(
    customerId || ''
  );
  const customerDetails: Customer | null = customerData || null;
  
  // Use the getOneVendor hook with the vendor ID
  const { data: vendorData, isLoading: vendorLoading } = useGetOneVendor(
    vendorId || ''
  );
  const vendorDetails = vendorData || null;

  // Calculate subtotal (without tax and discounts)
  const subtotal = tableData.reduce((sum: number, item: TableItem) => {
    const price = Number(item.price);
    const qty = Number(item.qty);
    return sum + price * qty;
  }, 0);

  // Calculate total discounts
  const totalDiscounts = tableData.reduce((sum: number, item: TableItem) => {
    const price = Number(item.price);
    const qty = Number(item.qty);
    const discountRate = Number(item.discountRate || 0);
    const discountCap = Number(item.discountCap || Infinity);
    
    const itemTotal = price * qty;
    const itemDiscount = Math.min((itemTotal * discountRate) / 100, discountCap);
    
    return sum + itemDiscount;
  }, 0);

  // Calculate total tax
  const totalTax = tableData.reduce((sum: number, item: TableItem) => {
    const price = Number(item.price);
    const qty = Number(item.qty);
    const tax = Number(item.tax || 0);
    const discountRate = Number(item.discountRate || 0);
    const discountCap = Number(item.discountCap || Infinity);
    
    const itemTotal = price * qty;
    const itemDiscount = Math.min((itemTotal * discountRate) / 100, discountCap);
    const taxableAmount = itemTotal - itemDiscount;
    
    return sum + (taxableAmount * tax) / 100;
  }, 0);

  // Calculate total amount
  const total = subtotal - totalDiscounts + totalTax;

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-full flex-col items-center justify-center overflow-y-auto w-full scroll bg-[#F2F2F2]">
      <div className="flex min-w-[45rem] justify-between w-full p-8">
        <h3 className="text-xl font-semibold">Purchase Order Preview</h3>
      </div>
      
      <div className="max-w-[48rem] bg-white space-y-8 min-w-[45rem] w-full mb-10">
        <div className="h-36 w-full flex items-center justify-between px-8 bg-blue-800">
          <div>
            <p className="text-3xl font-semibold text-white">Purchase Order</p>
            <p className="text-white mt-2">#{orderNumber}</p>
            <div className={`mt-2 inline-block px-2 py-1 rounded-full ${getStatusColor(status)}`}>
              {status}
            </div>
          </div>
          <div className="text-right text-white">
            <p>
              <strong>Order Date:</strong> {formattedOrderDate}
            </p>
            <p>
              <strong>Required Date:</strong> {formattedRequiredDate}
            </p>
            <p>
              <strong>Ship Date:</strong> {formattedShipDate}
            </p>
          </div>
        </div>
        
        <div className="p-5 space-y-8 bg-white">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-gray-700 mb-2">From (Vendor):</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {vendorLoading ? (
                  <p>Loading vendor details...</p>
                ) : vendorDetails ? (
                  <>
                    <p className="font-medium text-gray-800">{vendorDetails.name}</p>
                    <p>{vendorDetails.email || 'No email'}</p>
                    <p>{vendorDetails.address.address || 'No address'}</p>
                    <p>{vendorDetails.phone || 'No phone'}</p>
                  </>
                ) : (
                  <p>No vendor selected</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-700 mb-2">To (Customer):</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {customerLoading ? (
                  <p>Loading customer details...</p>
                ) : customerDetails ? (
                  <>
                    <p className="font-medium text-gray-800">
                      {customerDetails.firstName} {customerDetails.lastName}
                    </p>
                    <p>{customerDetails.email || 'No email'}</p>
                    <p>{customerDetails.address?.address || 'No address'}</p>
                    <p>{customerDetails.phone || 'No phone'}</p>
                  </>
                ) : (
                  <p>No customer selected</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-700 mb-2">Ship To:</h3>
              <p className="text-sm text-gray-600">{shoppingAddress || 'No shipping address specified'}</p>
            </div>
          </div>

          <table className="min-w-full table-auto mt-8 border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  Item
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  Qty
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  Unit Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  Discount
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  Tax
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((item: TableItem, index: number) => {
                const price = Number(item.price);
                const qty = Number(item.qty);
                const tax = Number(item.tax);
                const discountRate = Number(item.discountRate || 0);
                const discountCap = Number(item.discountCap || Infinity);
                
                const itemTotal = price * qty;
                const itemDiscount = Math.min((itemTotal * discountRate) / 100, discountCap);
                const taxableAmount = itemTotal - itemDiscount;
                const itemTax = (taxableAmount * tax) / 100;
                const totalWithTax = taxableAmount + itemTax;

                return (
                  <tr key={item.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border px-6 py-3">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">ID: {item.productId}</p>
                    </td>
                    <td className="border px-4 py-3 text-center">{qty}</td>
                    <td className="border px-4 py-3 text-right">
                      {currencySymbol}
                      {price.toFixed(2)}
                    </td>
                    <td className="border px-4 py-3 text-right">
                      {discountRate > 0 ? (
                        <>
                          {discountRate}% 
                          <span className="text-red-500 ml-1">
                            (-{currencySymbol}{itemDiscount.toFixed(2)})
                          </span>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="border px-4 py-3 text-right">
                      {tax > 0 ? (
                        <>
                          {tax}%
                          <span className="ml-1">
                            (+{currencySymbol}{itemTax.toFixed(2)})
                          </span>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="border px-4 py-3 text-right font-medium">
                      {currencySymbol}
                      {totalWithTax.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Subtotal, Tax, and Total */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>
                  {currencySymbol}
                  {subtotal.toFixed(2)}
                </span>
              </div>
              
              {totalDiscounts > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discounts:</span>
                  <span className="text-red-500">
                    -{currencySymbol}
                    {totalDiscounts.toFixed(2)}
                  </span>
                </div>
              )}
              
              {totalTax > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span>
                    {currencySymbol}
                    {totalTax.toFixed(2)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between pt-2 border-t font-bold">
                <span>Total:</span>
                <span>
                  {currencySymbol}
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t">
            <div>
              <h3 className="font-bold text-gray-700 mb-2">Payment Information:</h3>
              <p className="text-sm">
                <span className="font-medium">Method:</span> {paymentMethod || 'Not specified'}
              </p>
              {paymentTerms && (
                <div className="mt-2">
                  <p className="font-medium">Terms:</p>
                  <p className="text-sm text-gray-600 mt-1">{paymentTerms}</p>
                </div>
              )}
            </div>
            
            {contextData.note && (
              <div>
                <h3 className="font-bold text-gray-700 mb-2">Notes:</h3>
                <p className="text-sm text-gray-600">{contextData.note}</p>
              </div>
            )}
          </div>
          
          <div className="text-center text-xs text-gray-500 pt-6 border-t">
            <p>This purchase order is subject to the terms and conditions agreed upon by both parties.</p>
            <p className="mt-2">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfView;