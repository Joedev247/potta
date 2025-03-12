import Button from '@potta/components/button';
import Input from '@potta/components/input';
import React, { useContext, useState, useEffect } from 'react';
import { ContextData } from '@potta/components/context';
import HoldOrderButton from '../holdOn';
import { toast } from 'sonner';
import ReceiptPrinter from '../../../print/page';


const PayCash = () => {
  const context = useContext(ContextData);
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [error, setError] = useState('');
  const [lastOrderData, setLastOrderData] = useState<any>(null);
  const [printer] = useState(() => new ReceiptPrinter());

  const total = context?.orderSummary?.total || 0;
  const change = cashAmount === 0 ? 0 : cashAmount - total;
  const orderNumber = Math.floor(Math.random() * (200000000 - 100000000 + 1)) + 100000000;

  const handleCashInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCashAmount(isNaN(value) ? 0 : value);
  };

  const handleReprint = async () => {
    if (lastOrderData) {
      toast.promise(
        printer.printReceipt(lastOrderData),
        {
          loading: 'Reprinting receipt...',
          success: 'Receipt reprinted successfully',
          error: 'Failed to reprint receipt',
        }
      );
    } else {
      toast.error('No previous order found to reprint');
    }
  };

  const handleComplete = async () => {
    if (cashAmount < total) {
      setError('Cash amount must be greater than or equal to total amount');
      return;
    }
    setError('');

    const orderData = {
      orderNumber,
      orderItems: context?.data || [],
      total: total,
      cashAmount: cashAmount,
      change: change,
      timestamp: new Date().toISOString(),
    };

    setLastOrderData(orderData);
    console.log('Order Completed:', orderData);

    toast.promise(
      printer.printReceipt(orderData),
      {
        loading: 'Processing order...',
        success: 'Order completed successfully',
        error: 'Failed to process order',
      }
    );

    // if (context?.resetCart) {
    //   context.resetCart();
    // }
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
            className="w-full py-2.5 px-4 border border-gray-200 rounded-[2px] outline-none mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <p className={`font-semibold text-lg ${change < 0 ? 'text-red-500' : ''}`}>
              {change.toFixed(2)} XAF
            </p>
          </div>
          <div className="w-full mt-5">
            <Button
              width="full"
              text="Complete"
              type="button"
              onClick={handleComplete}
              disabled={cashAmount < total || cashAmount === 0}
            />
          </div>
        </div>
      </div>
      {printer.getIframeElement()}
    </div>
  );
};

export default PayCash;
