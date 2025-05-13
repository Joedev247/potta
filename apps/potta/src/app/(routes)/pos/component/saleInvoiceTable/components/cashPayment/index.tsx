import Button from '@potta/components/button';
import React, { useContext, useState } from 'react';
import { ContextData } from '@potta/components/context';
import HoldOrderButton from '../holdOn';
import { toast } from 'sonner';
import ReceiptPrinter from '../../../print/page';
import { LineItem, PaymentMethod } from '@potta/app/(routes)/pos/utils/types';
import { SalesReceiptPayload } from '@potta/app/(routes)/pos/utils/validation';
import { posApi } from '@potta/app/(routes)/pos/utils/api';
import SalesReceiptReport from '../../../../../reports/components/collectioReports/salesReceiptReport';
import { useCreateSalesReceipt } from '@potta/app/(routes)/pos/sales/hooks/useCreateReceipt';

const PayCash = () => {
  const context = useContext(ContextData);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [error, setError] = useState('');
  const [lastOrderData, setLastOrderData] = useState<any>(null);
  const [printer] = useState(() => new ReceiptPrinter());
  const [isProcessing, setIsProcessing] = useState(false);

  const total = context?.orderSummary?.total || 0;
  const change = cashAmount === 0 ? 0 : cashAmount - total;
  const orderNumber =
    Math.floor(Math.random() * (200000000 - 100000000 + 1)) + 100000000;

  const handleCashInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCashAmount(isNaN(value) ? 0 : value);
  };

  const formatOrderItemsForPrinting = (items: LineItem[]) => {
    return items.map((item) => {
      return {
        quantity: item.quantity,
        name: item.description,
        // Ensure price is a number
        price:
          typeof item.unitPrice === 'string'
            ? parseFloat(item.unitPrice)
            : item.unitPrice,
      };
    });
  };

  const handleReprint = async () => {
    if (lastOrderData) {
      toast.promise(printer.printReceipt(lastOrderData), {
        loading: 'Reprinting receipt...',
        success: 'Receipt reprinted successfully',
        error: 'Failed to reprint receipt',
      });
    } else {
      toast.error('No previous order found to reprint');
    }
  };

  const mutation = useCreateSalesReceipt();

  const handleComplete = async () => {
    if (cashAmount < total) {
      setError('Cash amount must be greater than or equal to total amount');
      return;
    }
    setError('');
    setIsProcessing(true);

    try {
      // Format order items for receipt printing
      const formattedItems = formatOrderItemsForPrinting(context?.data || []);

      // Create order data for receipt printing
      const orderData = {
        orderNumber,
        orderItems: formattedItems,
        total: total,
        cashAmount: cashAmount,
        change: change,
        timestamp: new Date().toISOString(),
      };

      // Ensure line items have numeric unit prices for the API
      const lineItemsWithNumericPrices = (context?.data || []).map(
        (item: any) => ({
          ...item,
          unitPrice:
            typeof item.unitPrice === 'string'
              ? parseFloat(item.unitPrice)
              : item.unitPrice,
        })
      );

      // Create sales receipt data for API submission
      const salesReceiptData: SalesReceiptPayload = {
        saleDate: new Date().toISOString(),
        totalAmount: total,
        paymentReference: orderNumber.toString(),
        notes: '',
        paymentMethod: 'Other' as PaymentMethod,
        receiptNumber: orderNumber.toString(),
        discountAmount: context?.orderSummary?.discount || 0,
        customerId: '3ab17f69-0a8f-4693-a628-f6ca73977b5f',
        salePerson: '532e5da0-204f-4417-95e0-f26a13c62e39',
        lineItems: lineItemsWithNumericPrices,
      };

      console.log('Order', salesReceiptData);
      mutation.mutate(salesReceiptData, {
        onSuccess: async () => {
          setLastOrderData(orderData);

          // Print the receipt
          await printer.printReceipt(orderData);

          toast.success('Order completed successfully');

          // Reset the cart after successful order
          if (context?.setData) {
            context.setData([]);
          }

          // Reset the order summary
          if (context?.setOrderSummary) {
            context.setOrderSummary({
              subtotal: 0,
              discount: 0,
              itemDiscounts: 0,
              tax: 0,
              total: 0,
            });
          }
        },
        onError: (error: any) => {
          toast.error(
            `Failed to create receipt: ${error.message || 'Unknown error'}`
          );
          console.error('Error creating sales receipt:', error);
        },
      });

      // Reset the cash amount
      setCashAmount(0);
    } catch (error) {
      console.error('Failed to process order:', error);
      toast.error('Failed to process order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-10 h-[60vh] space-y-40">
      <div className="flex justify-between items-center">
        <h3 className="text-xl">Cash Payment</h3>
        {lastOrderData && (
          <button
            onClick={handleReprint}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <i className="w-4 h-4 ri-printer-line"></i>
            Reprint Last Receipt
          </button>
        )}
      </div>
      <div className="w-full">
        <div className="w-full min-h-28">
          <span className="mb-3 text-gray-900 font-medium">
            Enter Cash Amount
          </span>
          <input
            id="cash_amount"
            placeholder="00.00"
            type="number"
            name="cashAmount"
            value={cashAmount || ''}
            onChange={handleCashInput}
            className="w-full py-2.5 px-4 border border-gray-200 rounded-[2px] outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
   "
          />
          {error ? (
            <small className="col-span-2 text-red-500">{error}</small>
          ) : null}
        </div>
      </div>
      <div className="w-full flex justify-between my-10">
        <HoldOrderButton />
        <div className="w-96 flex-col space-y-4">
          <div className="w-full flex justify-between border-b py-2">
            <span className="font-thin">Total</span>
            <p className="font-semibold text-lg">{total.toFixed(2)} XAF</p>
          </div>
          <div className="w-full flex justify-between border-b py-2">
            <span className="font-thin">Cash Amount</span>
            <p className="font-semibold text-lg">{cashAmount.toFixed(2)} XAF</p>
          </div>
          <div className="w-full flex justify-between py-2">
            <span className="font-thin">Change</span>
            <p
              className={`font-semibold text-lg ${
                change < 0 ? 'text-red-500' : ''
              }`}
            >
              {change.toFixed(2)} XAF
            </p>
          </div>
          <div className="w-full mt-5">
            <Button
              width="full"
              text={isProcessing ? 'Processing...' : 'Complete'}
              type="button"
              onClick={handleComplete}
              disabled={cashAmount < total || cashAmount === 0 || isProcessing}
            />
          </div>
        </div>
      </div>
      {printer.getIframeElement()}
    </div>
  );
};

export default PayCash;
