'use client';
import useGetOneVendor from '@potta/app/(routes)/vendors/hooks/useGetOneVendor';
import { ContextData } from '@potta/components/context';
import React, { useContext } from 'react';

interface TableItem {
  name: string;
  qty: number;
  productId: string;
  uuid: string;
  id: number;
}

const PdfView = () => {
  const context = useContext(ContextData);
  const contextData = context?.data || {};
  const tableData: TableItem[] = contextData.table || [];
  const vendorId = contextData.vendorId; // Get vendor ID from context

  // Format dates if they exist
  const formattedOrderDate = contextData.orderDate
    ? new Date(contextData.orderDate).toLocaleDateString()
    : 'Not set';

  const formattedRequiredDate = contextData.requiredDate
    ? new Date(contextData.requiredDate).toLocaleDateString()
    : 'Not set';

  const orderNumber = contextData.orderNumber || '';
  const shoppingAddress = contextData.shoppingAddress || '';
  const paymentTerms = contextData.paymentTerms || '';
  const paymentMethod = contextData.paymentMethod || '';

  // Use the getOneVendor hook with the vendor ID
  const { data: vendorData, isLoading: vendorLoading } = useGetOneVendor(
    vendorId || ''
  );
  const vendorDetails = vendorData || null;

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
          </div>
          <div className="text-right text-white">
            <p>
              <strong>Order Date:</strong> {formattedOrderDate}
            </p>
            <p>
              <strong>Required Date:</strong> {formattedRequiredDate}
            </p>
          </div>
        </div>
        
        <div className="p-5 space-y-8 bg-white">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-700 mb-2">Vendor:</h3>
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
              </tr>
            </thead>
            <tbody>
              {tableData.map((item: TableItem, index: number) => (
                <tr key={item.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border px-6 py-3">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">ID: {item.productId}</p>
                  </td>
                  <td className="border px-4 py-3 text-center">{item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
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