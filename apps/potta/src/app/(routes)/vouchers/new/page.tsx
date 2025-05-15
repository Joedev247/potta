'use client';

import { useState, useEffect } from 'react';
import {
  FormProvider,
  useForm,
  FieldPath,
  UnpackNestedValue,
} from 'react-hook-form';
import VoucherTypeSelector, { VoucherType, TabType } from './components/left';
import Policy from './components/policy.';
import Audience from './components/audience';
import Scheduling from './components/scheduling';
import Code from './components/code';

// Define a new type that includes all possible tab values
type AllTabTypes = TabType | 'VoucherType';

// Define an enum for voucher types to match your payload
enum VoucherTypeEnum {
  COUPON = 'DISCOUNT',
  GIFT_CARD = 'GIFT_CARD',
  ROYALTY_POINTS = 'ROYALTY_POINTS',
  CASHBACK = 'CASHBACK',
}

// Define the form data type
type FormData = {
  type: VoucherTypeEnum;
  usageLimit?: number;
  scheduling: {
    programStartDate: string;
    programEndDate?: string;
    specificDaysOnly: boolean;
    specificDays?: [{
      day: string;
      startTime?: string;
      endTime?: string;
      allDay: boolean;
    }]
  };
  audience: {
    segment: string;
    autoAddUsers: boolean;
    canJoinOnce: boolean;
    programCardPrefix: string;

  };
  // Discount fields
  discountAmount?: number;
  discountPercent?: number;
  

  // Gift Card fields
  balance?: number;
 

  // Royalty Points fields
  loyaltyPoints?: number;
  loyaltyAmount?: number;
  loyaltyPointsValue?: number;

  // Cashback fields
  cashbackPercent?: number;
  CashbackAmount?: number;

  // Code fields
  code?: string;
  advancedCodeSettings?: boolean;
  codeSettings?: {
    length: number;
    prefix: string;
    postfix: string;
    pattern: string;
    characterSet: string;
  }

  // Other fields can be added as needed
  [key: string]: any;
};

// Define fields specific to each voucher type
const voucherTypeSpecificFields: Record<VoucherType, Array<keyof FormData>> = {
  DISCOUNT: ['discountPercent', 'discountAmount'],
  GIFT_CARD: ['balance'],
  ROYALTY_POINTS: ['loyaltyPoints', 'loyaltyAmount', 'loyaltyPointsValue'],
  CASHBACK: ['cashbackPercent', 'CashbackAmount'],
};

// Define common fields that should be kept for all voucher types
const commonFields: Array<keyof FormData> = [
  'name',
  'description',
  'type',
  'startDate',
  'endDate',
];

export default function NewVoucherPage() {
  const [activeTab, setActiveTab] = useState<AllTabTypes>('VoucherType');
  const [voucherType, setVoucherType] = useState<VoucherType>('ROYALTY_POINTS');

  // Update form structure to match your desired payload
  const methods = useForm<FormData>({
    defaultValues: {
      type: VoucherTypeEnum.ROYALTY_POINTS, // Default to ROYALTY_POINTS
    },
  });

  const { unregister, setValue, getValues } = methods;

  // Function to unregister fields not applicable to the current voucher type
  const unregisterIrrelevantFields = (newType: VoucherType) => {
    // Get all voucher type specific fields
    const allTypeSpecificFields = Object.values(
      voucherTypeSpecificFields
    ).flat();

    // Get fields that should be kept for the new type
    const fieldsToKeep = [
      ...commonFields,
      ...(voucherTypeSpecificFields[newType] || []),
    ];

    // Unregister fields that aren't needed for the new type
    allTypeSpecificFields.forEach((field) => {
      if (!fieldsToKeep.includes(field)) {
        unregister(field as FieldPath<FormData>);
      }
    });
  };

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

    setValue('type', voucherTypeEnum);

    // Unregister fields not applicable to the new voucher type
    unregisterIrrelevantFields(type);

    // You can also set default values for the new voucher type if needed
    
  };

  const handleTabChange = (tab: AllTabTypes) => {
    setActiveTab(tab);
  };

  // Helper function to remove empty values recursively
  const removeEmptyValues = (obj: any): any => {
    if (obj === null || obj === undefined) return undefined;

    // Handle arrays
    if (Array.isArray(obj)) {
      const filteredArray = obj
        .map((item) =>
          typeof item === 'object' ? removeEmptyValues(item) : item
        )
        .filter((item) => item !== null && item !== undefined && item !== '');

      return filteredArray.length > 0 ? filteredArray : undefined;
    }

    // Handle objects
    if (typeof obj === 'object') {
      const filteredObj = Object.entries(obj).reduce((acc, [key, value]) => {
        const filteredValue = removeEmptyValues(value);

        if (filteredValue !== undefined) {
          acc[key] = filteredValue;
        }

        return acc;
      }, {} as Record<string, any>);

      return Object.keys(filteredObj).length > 0 ? filteredObj : undefined;
    }

    // Handle primitive values
    return obj === '' ? undefined : obj;
  };

  const onSubmit = (data: FormData) => {
    // Filter out empty values before submission
    const filteredData = removeEmptyValues(data);
    console.log('Raw form data:', data);
    console.log('Filtered form data:', filteredData);

    // Here you would send filteredData to your API
    // api.createVoucher(filteredData);
  };

  // Effect to handle tab-specific field unregistration
  useEffect(() => {
    // You can add logic here to unregister fields when tabs change if needed
    if (activeTab !== 'Code') {
      const advancedCodeSettings = getValues('advancedCodeSettings');
      if (advancedCodeSettings) {
        unregister('code' as FieldPath<FormData>);
      }
    }
  }, [activeTab, unregister, getValues]);

  const tabs: TabType[] = [
    'Code',
    'Policy',
    'Audience',
    'Scheduling',
  ];

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
              ) : activeTab === 'Code' ? (
                <Code />
              ) : (
                <div>Eligibility Content</div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="mt-auto pt-6 flex justify-between space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white hover:bg-red-800"
              >
                Cancel
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
