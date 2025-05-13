'use client';

import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import VoucherTypeSelector, { VoucherType, TabType } from './components/left';
import Policy from './components/policy.';
import Audience from './components/audience';
import Scheduling from './components/scheduling';
import Eligibility from './components/eligibility';

// Define a new type that includes all possible tab values
type AllTabTypes = TabType | 'VoucherType';

// Define an enum for voucher types to match your payload
enum VoucherTypeEnum {
  COUPON = 'DISCOUNT',
  GIFT_CARD = 'GIFT_CARD',
  ROYALTY_POINTS = 'ROYALTY_POINTS',
  CASHBACK = 'CASHBACK',
}

export default function NewVoucherPage() {
  const [activeTab, setActiveTab] = useState<AllTabTypes>('VoucherType');
  const [voucherType, setVoucherType] = useState<VoucherType>('ROYALTY_POINTS');

  // Update form structure to match your desired payload
  const methods = useForm({
    defaultValues: {
      type: VoucherTypeEnum.ROYALTY_POINTS, // Default to ROYALTY_POINTS
      code: '',
      usageLimit: null,
      discountAmount: 0,
      minimumPurchase: 0,
      loyaltyAmount: 0,
      maximumDiscount: 0,
      discountPercent: 0,
      balance: 0,
      cashbackPercent: 0,
      cashbackMaximum: 0,
      scheduling: {
        programStartDate: '',
        programEndDate: '',
        neverEnds: false,
        specificDaysOnly: false,
        validDays: [],
      },
      audience: {
        segment: '',
        autoAddUsers: false,
        canJoinOnce: false,
        programCardPrefix: '',
        
      },
    },
  });

  const handleVoucherTypeChange = (type: VoucherType) => {
    setVoucherType(type);

    // Update the form's voucher type when it changes
    let voucherTypeEnum: VoucherTypeEnum;

    switch (type) {
      case 'ROYALTY_POINTS':
        voucherTypeEnum = VoucherTypeEnum.ROYALTY_POINTS;
        break;
      case 'DISCOUNT':
        voucherTypeEnum = VoucherTypeEnum.COUPON;
        break;
      case 'GIFT_CARD':
        voucherTypeEnum = VoucherTypeEnum.GIFT_CARD;
        break;
      case 'CASHBACK':
        voucherTypeEnum = VoucherTypeEnum.CASHBACK;
        break;
      default:
        voucherTypeEnum = VoucherTypeEnum.ROYALTY_POINTS;
    }

    methods.setValue('type', voucherTypeEnum);
  };

  const handleTabChange = (tab: AllTabTypes) => {
    setActiveTab(tab);
  };

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  const tabs: TabType[] = ['Policy', 'Audience', 'Scheduling', 'Eligibility'];

  return (
    <div className="px-10 h-[92.7vh] overflow-y-auto flex">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex w-full">
          {/* Sidebar Navigation - Fixed width */}
          <div className="w-64 min-w-64 flex-shrink-0 bg-white p-6">
            <nav className="flex flex-col space-y-1">
              <button
                className={`py-2 text-left ${
                  activeTab === 'VoucherType'
                    ? 'text-green-600 font-medium border-l-2 border-green-600 pl-2'
                    : 'text-gray-700 pl-2'
                } hover:text-green-600 transition-colors`}
                onClick={() => handleTabChange('VoucherType')}
                type="button"
              >
                Voucher Type
              </button>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`py-2 text-left ${
                    activeTab === tab
                      ? 'text-green-600 font-medium border-l-2 border-green-600 pl-2'
                      : 'text-gray-700 pl-2'
                  } hover:text-green-600 transition-colors`}
                  onClick={() => handleTabChange(tab)}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content Area - Takes remaining width */}
          <div className="flex-1 p-6 py-6 flex flex-col">
            {/* Tab-specific content */}
            <div className="flex-1">
              {activeTab === 'VoucherType' ? (
                <VoucherTypeSelector
                  selectedType={voucherType}
                  onVoucherTypeChange={handleVoucherTypeChange}
                />
              ) : activeTab === 'Policy' ? (
                <Policy voucherType={voucherType} />
              ) : activeTab === 'Audience' ? (
                <Audience />
              ) : activeTab === 'Scheduling' ? (
                <Scheduling />
              ) : activeTab === 'Eligibility' ? (
                <Eligibility />
              ) : (
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  Component (Coming Soon)
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="mt-auto pt-6 flex justify-between space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white"
              >
                Publish
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
