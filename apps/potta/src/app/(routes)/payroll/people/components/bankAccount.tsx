'use client';
import React, { useState, useEffect } from 'react';
import Input from '@potta/components/input';
import Select from '@potta/components/select';
import SearchableSelect from '@potta/components/searchableSelect';
import { Switch } from '@headlessui/react';
import { peopleApi } from '../utils/api';
import {
  getCountries,
  getCountryName,
  getCountryCode,
  LocationOption,
} from '@potta/services/locationService';

interface BankAccountProps {
  personId: string;
  onChange?: (data: any) => void;
  initialData?: any;
}

// Updated account types to match backend requirements
const accountTypes = [
  { label: 'Checking', value: 'Checking' },
  { label: 'Savings', value: 'Savings' },
  { label: 'Mobile Money', value: 'MobileMoney' },
  { label: 'Other', value: 'Other' },
];

// Common currencies
const currencies = [
  { label: 'USD - US Dollar', value: 'USD' },
  { label: 'EUR - Euro', value: 'EUR' },
  { label: 'GBP - British Pound', value: 'GBP' },
  { label: 'JPY - Japanese Yen', value: 'JPY' },
  { label: 'CAD - Canadian Dollar', value: 'CAD' },
  { label: 'AUD - Australian Dollar', value: 'AUD' },
  { label: 'CHF - Swiss Franc', value: 'CHF' },
  { label: 'CNY - Chinese Yuan', value: 'CNY' },
  { label: 'XAF - Central African CFA Franc', value: 'XAF' },
  { label: 'NGN - Nigerian Naira', value: 'NGN' },
];

// Helper function to get currency based on country code
const getDefaultCurrencyForCountry = (countryCode: string): string => {
  const currencyMap: Record<string, string> = {
    CM: 'XAF', // Cameroon
    US: 'USD', // United States
    GB: 'GBP', // United Kingdom
    CA: 'CAD', // Canada
    AU: 'AUD', // Australia
    DE: 'EUR', // Germany
    FR: 'EUR', // France
    NG: 'NGN', // Nigeria
    ZA: 'ZAR', // South Africa
    KE: 'KES', // Kenya
    GH: 'GHS', // Ghana
    CN: 'CNY', // China
    JP: 'JPY', // Japan
    IN: 'INR', // India
    BR: 'BRL', // Brazil
    MX: 'MXN', // Mexico
  };

  return currencyMap[countryCode] || 'XAF'; // Default to XAF if not found
};

const BankAccount: React.FC<BankAccountProps> = ({
  personId,
  onChange,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    person_id: personId,
    account_holder_name: initialData?.account_holder_name || '',
    bank_name: initialData?.bank_name || '',
    account_number: initialData?.account_number || '',
    routing_number: initialData?.routing_number || '',
    currency: initialData?.currency || 'XAF', // Default to XAF for Cameroon
    account_type: initialData?.account_type || 'Checking',
    is_primary:
      initialData?.is_primary !== undefined ? initialData.is_primary : true,
    // country_code: initialData?.country_code || '',
    country: initialData?.country || '',
    verified:
      initialData?.verified !== undefined ? initialData.verified : false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [personData, setPersonData] = useState<any>(null);
  const [countryOptions, setCountryOptions] = useState<LocationOption[]>([]);

  // Load countries on component mount
  useEffect(() => {
    const countries = getCountries();
    setCountryOptions(countries);
  }, []);

  // Fetch person data to get the country from address
  useEffect(() => {
    const fetchPersonData = async () => {
      if (personId) {
        try {
          setIsLoading(true);
          const data = await peopleApi.getPerson(personId);
          setPersonData(data);

          // Auto-populate account holder name if not already set
          const fullName = `${data.firstName} ${data.lastName}`.trim();

          // Auto-populate country from person's address
          const country = data.address?.country || '';
          let countryCode = '';

          // Try to get country code using the locationService
          if (country) {
            // First try direct lookup by country code (if country is already a code)
            if (country.length === 2) {
              countryCode = country;
            } else {
              // Try to get code from country name
              countryCode = getCountryCode(country);
            }
          }

          // Set default currency based on country
          const defaultCurrency = countryCode
            ? getDefaultCurrencyForCountry(countryCode)
            : 'XAF';

          setFormData((prev) => ({
            ...prev,
            person_id: personId,
            account_holder_name: prev.account_holder_name || fullName,
            country: country,
            country_code: countryCode || prev.country_code,
            currency: prev.currency || defaultCurrency,
          }));
        } catch (error) {
          console.error('Error fetching person data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPersonData();
  }, [personId]);

  // Initialize data for parent component
  useEffect(() => {
    if (onChange) onChange(formData);
  }, []);

  // Update person_id when it changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      person_id: personId,
    }));
  }, [personId]);

  // Validate form data
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.account_holder_name.trim()) {
      newErrors.account_holder_name = 'Account holder name is required';
    }

    if (!formData.bank_name.trim()) {
      newErrors.bank_name = 'Bank name is required';
    }

    if (!formData.account_number.trim()) {
      newErrors.account_number = 'Account number is required';
    }

    if (!formData.country_code) {
      newErrors.country_code = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Direct input change handler for the Input component
  const handleInputChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => {
        const newData = { ...prev, [name]: value };
        if (onChange) onChange(newData);
        return newData;
      });

      // Clear error when field is edited
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // If changing country_code, also update the country name
      if (name === 'country_code') {
        newData.country = getCountryName(value) || '';

        // Also update currency based on new country if it hasn't been manually changed
        if (prev.currency === getDefaultCurrencyForCountry(prev.country_code)) {
          newData.currency = getDefaultCurrencyForCountry(value);
        }
      }

      if (onChange) onChange(newData);
      return newData;
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle switch change
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: checked };
      if (onChange) onChange(newData);
      return newData;
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid && onChange) {
      onChange(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center pt-20">
        <p className="text-gray-500">Loading bank account information...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 pt-10 px-14">
      <h2 className="text-xl font-bold mb-4">Direct Deposit Information</h2>
      <p className="text-gray-600 mb-4">
        Add bank account details for direct deposit
      </p>

      {personData && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            Using address information from: {personData.firstName}{' '}
            {personData.lastName}
          </p>
          {personData.address && (
            <p className="text-sm text-gray-600">
              Country: {personData.address.country || 'Not specified'}
              {formData.country_code && ` (${formData.country_code})`}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type={'text'}
            name={'account_holder_name'}
            label="Account Holder Name"
            labelClass="!font-bold"
            placeholder="John Doe"
            value={formData.account_holder_name}
            onchange={handleInputChange('account_holder_name')}
            error={errors.account_holder_name}
          />
        </div>

        <div>
          <Input
            type={'text'}
            name={'bank_name'}
            label="Bank Name"
            labelClass="!font-bold"
            placeholder="Example Bank"
            value={formData.bank_name}
            onchange={handleInputChange('bank_name')}
            error={errors.bank_name}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input
              type={'text'}
              name={'account_number'}
              label="Account Number"
              labelClass="!font-bold"
              placeholder="123456789"
              value={formData.account_number}
              onchange={handleInputChange('account_number')}
              error={errors.account_number}
            />
          </div>
          <div>
            <Input
              type={'text'}
              name={'routing_number'}
              label="Routing Number"
              labelClass="!font-bold"
              placeholder="987654321"
              value={formData.routing_number}
              onchange={handleInputChange('routing_number')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block mb-2 font-bold">Currency</label>
            <Select
              options={currencies}
              selectedValue={formData.currency}
              onChange={(value: string) =>
                handleSelectChange('currency', value)
              }
              bg={''}
            />
          </div>
          <div>
            <label className="block mb-2 font-bold">Account Type</label>
            <Select
              options={accountTypes}
              selectedValue={formData.account_type}
              onChange={(value: string) =>
                handleSelectChange('account_type', value)
              }
              bg={''}
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-bold">Country</label>
          <SearchableSelect
            options={countryOptions}
            selectedValue={formData.country_code}
            onChange={(value) => handleSelectChange('country_code', value)}
            placeholder="Select a country"
            error={errors.country_code}
          />
          {formData.country && !formData.country_code && (
            <p className="text-amber-600 text-sm mt-1">
              Country "{formData.country}" from address couldn't be matched.
              Please select a country.
            </p>
          )}
        </div>

        <div className="flex items-center mt-2">
          <Switch
            checked={formData.is_primary}
            onChange={(checked) => handleSwitchChange('is_primary', checked)}
            className={`${
              formData.is_primary ? 'bg-green-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
          >
            <span
              className={`${
                formData.is_primary ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <span className="ml-3 text-sm font-medium">
            Set as Primary Account
          </span>
        </div>

        <div className="flex items-center mt-2">
          <Switch
            checked={formData.verified}
            onChange={(checked) => handleSwitchChange('verified', checked)}
            className={`${
              formData.verified ? 'bg-green-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
          >
            <span
              className={`${
                formData.verified ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <span className="ml-3 text-sm font-medium">Verified Account</span>
        </div>
      </form>
    </div>
  );
};

export default BankAccount;
