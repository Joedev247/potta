'use client';

import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { VoucherType } from './left';

type ValueType = 'fixed' | 'proportional';

interface PolicyProps {
  voucherType: VoucherType;
  onValueTypeChange?: (type: ValueType) => void;
}

const Policy: React.FC<PolicyProps> = ({ voucherType, onValueTypeChange }) => {
  const { register, watch, setValue } = useFormContext();
  const valueType = watch('valueType') as ValueType || 'fixed';
  
  // Set default value type if not set
  useEffect(() => {
    if (!valueType) {
      setValue('valueType', 'fixed');
    }
    
    // Update the form with the voucher type from props
    setValue('voucherType', voucherType);
    
    // If switching to gift card, force fixed value type
    if (voucherType === 'giftcard') {
      setValue('valueType', 'fixed');
    }
  }, [voucherType, valueType, setValue]);

  // Handle value type change
  const handleValueTypeChange = (type: ValueType) => {
    setValue('valueType', type);
    onValueTypeChange?.(type);
  };

  return (
    <div className="bg-white ">
      <div className="p-6">
        <h3 className="text-lg font-medium mb-8">Policy Settings</h3>
        
        {/* Value Type Selection (Fixed or Proportional) */}
        {voucherType !== 'giftcard' && (
          <div className="mb-6">
            <div className="flex w-1/2 border-b border-gray-200">
              <button
                type="button"
                onClick={() => handleValueTypeChange('fixed')}
                className={`px-4 py-2 w-1/2 ${
                  valueType === 'fixed'
                    ? 'border-b-2  border-green-600 text-green-600'
                    : 'text-gray-500'
                }`}
              >
                Fixed
              </button>
              <button
                type="button"
                onClick={() => handleValueTypeChange('proportional')}
                className={`px-4 py-2 w-1/2 ${
                  valueType === 'proportional'
                    ? 'border-b-2 border-green-600 text-green-600'
                    : 'text-gray-500'
                }`}
              >
                Proportional
              </button>
            </div>
          </div>
        )}

        {/* Discount Policy */}
        {voucherType === 'discount' && (
          <div className="mb-6 w-1/2">
            {valueType === 'fixed' ? (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fixed Discount Amount
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      {...register('discountAmount')}
                      className="border border-gray-300  px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                    />
                    <span className="ml-2 text-gray-500">XAF</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Percentage
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      {...register('discountPercentage')}
                      className="border border-gray-300  w-1/3 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter percentage"
                      min="0"
                      max="100"
                    />
                    <span className="ml-2 text-gray-500">%</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priced on
                  </label>
                  <select
                    {...register('pricedOn')}
                    className="border border-gray-300  px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pre">Pre-Discounted amount</option>
                    <option value="post">Post-Discounted amount</option>
                    <option value="total">Total amount</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rest of the component remains the same... */}
        {/* Cashback Policy */}
        {voucherType === 'cashback' && (
          <div className="mb-6 w-1/2">
            {valueType === 'fixed' ? (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fixed Cashback Amount
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      {...register('cashbackAmount')}
                      className="border border-gray-300  px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount"
                    />
                    <span className="ml-2 text-gray-500">XAF</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    For every
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      {...register('cashbackForEvery')}
                      className="border border-gray-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1000"
                    />
                    <span className="ml-2 text-gray-500">XAF</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cashback
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      {...register('cashbackValue')}
                      className="border border-gray-300  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="100"
                    />
                    <span className="ml-2 text-gray-500">XAF</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gift Card Policy */}
        {voucherType === 'giftcard' && (
          <div className="mb-6 w-1/2">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gift Card Value
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  {...register('giftcardAmount')}
                  className="border border-gray-300  px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                />
                <span className="ml-2 text-gray-500">XAF</span>
              </div>
            </div>
          </div>
        )}

        {/* Loyalty Points Policy */}
        {voucherType === 'loyalty' && (
          <div className="mb-6 w-1/2">
            {valueType === 'fixed' ? (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      {...register('loyaltyPoints')}
                      className="border border-gray-300  px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    For every
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      {...register('loyaltyForEvery')}
                      className="border border-gray-300  px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1000"
                    />
                    <span className="ml-2 text-gray-500">XAF</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Points
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      {...register('loyaltyPointsValue')}
                      className="border border-gray-300  px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Additional Policy Settings */}
        {/* <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Additional Settings</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Purchase Amount
            </label>
            <div className="flex items-center">
              <input
                type="number"
                {...register('minimumPurchase')}
                className="border border-gray-300  px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
              <span className="ml-2 text-gray-500">XAF</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Discount Amount
            </label>
            <div className="flex items-center">
              <input
                type="number"
                {...register('maximumDiscount')}
                className="border border-gray-300  px-3 py-2  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="No limit"
              />
              <span className="ml-2 text-gray-500">XAF</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Policy;