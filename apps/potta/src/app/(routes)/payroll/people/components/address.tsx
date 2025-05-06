'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Input from '@potta/components/input';
import SearchableSelect from '@potta/components/searchableSelect';
import {
  getCountries,
  getStates,
  getCities,
  getCountryName,
  getStateName,
  LocationOption,
} from '@potta/services/locationService';

interface AddressProps {
  onChange?: (data: any) => void;
  initialData?: any;
}

const Address: React.FC<AddressProps> = ({ onChange, initialData }) => {
  // Use a ref to track if we've initialized with initial data
  const initializedRef = useRef(false);

  // Initialize with default values to avoid uncontrolled to controlled warnings
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    latitude: 0,
    longitude: 0,
    countryName: '',
    stateName: '',
  });

  // State for location options
  const [countryOptions, setCountryOptions] = useState<LocationOption[]>([]);
  const [stateOptions, setStateOptions] = useState<LocationOption[]>([]);
  const [cityOptions, setCityOptions] = useState<LocationOption[]>([]);

  // Use a ref to prevent the onChange callback from causing re-renders
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Load countries on component mount
  useEffect(() => {
    const countries = getCountries();
    setCountryOptions(countries);
  }, []);

  // Initialize with initialData if provided - only once
  useEffect(() => {
    if (initialData && !initializedRef.current) {
      console.log('Address received initialData:', initialData);

      // Create a new object with default values for any missing fields
      const newFormData = {
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || '',
        postalCode: initialData.postalCode || '',
        latitude: initialData.latitude || 0,
        longitude: initialData.longitude || 0,
        countryName:
          initialData.countryName || getCountryName(initialData.country) || '',
        stateName:
          initialData.stateName ||
          (initialData.country && initialData.state
            ? getStateName(initialData.country, initialData.state)
            : ''),
      };

      setFormData(newFormData);
      initializedRef.current = true;
    }
  }, [initialData]);

  // Load states when country changes
  useEffect(() => {
    if (formData.country) {
      const states = getStates(formData.country);
      setStateOptions(states);
    } else {
      setStateOptions([]);
    }
  }, [formData.country]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.country && formData.state) {
      const cities = getCities(formData.country, formData.state);
      setCityOptions(cities);
    } else {
      setCityOptions([]);
    }
  }, [formData.country, formData.state]);

  // Direct input change handler for the Input component
  const handleInputChange = useCallback(
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        // Call onChange outside of setState to prevent re-renders
        setTimeout(() => {
          if (onChangeRef.current) onChangeRef.current(updated);
        }, 0);
        return updated;
      });
    },
    []
  );

  // Handle select change
  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // For country and state, also store the full names for the API
      if (name === 'country') {
        const countryName = getCountryName(value);
        newData.countryName = countryName;
        // Reset state and city
        newData.state = '';
        newData.stateName = '';
        newData.city = '';
      } else if (name === 'state') {
        const stateName = getStateName(prev.country, value);
        newData.stateName = stateName;
        // Reset city
        newData.city = '';
      }

      // Call onChange outside of setState to prevent re-renders
      setTimeout(() => {
        if (onChangeRef.current) onChangeRef.current(newData);
      }, 0);

      return newData;
    });
  }, []);

  return (
    <div className="w-full flex h-[80vh] flex-col gap-4 pt-10 px-14">
      <div>
        <Input
          type="text"
          name="address"
          label="Address"
          labelClass="!font-bold"
          placeholder="475 Meadow View"
          value={formData.address}
          onchange={handleInputChange('address')}
        />
      </div>

      <div>
        <SearchableSelect
          label="Country"
          labelClass="!font-bold"
          options={countryOptions}
          selectedValue={formData.country}
          onChange={(value) => handleSelectChange('country', value)}
          placeholder="Select a country"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <SearchableSelect
            label="State"
            labelClass="!font-bold"
            options={stateOptions}
            selectedValue={formData.state}
            onChange={(value) => handleSelectChange('state', value)}
            placeholder={
              formData.country ? 'Select a state' : 'Select a country first'
            }
            isDisabled={!formData.country}
          />
        </div>

        <div>
          <SearchableSelect
            label="City"
            labelClass="!font-bold"
            options={cityOptions}
            selectedValue={formData.city}
            onChange={(value) => handleSelectChange('city', value)}
            placeholder={
              !formData.country
                ? 'Select a country first'
                : !formData.state
                ? 'Select a state first'
                : 'Select a city'
            }
            isDisabled={!formData.state}
          />
        </div>
      </div>

      <div>
        <Input
          type="text"
          name="postalCode"
          label="Postal Code"
          labelClass="!font-bold"
          placeholder="96352"
          value={formData.postalCode}
          onchange={handleInputChange('postalCode')}
        />
      </div>
    </div>
  );
};

export default Address;
