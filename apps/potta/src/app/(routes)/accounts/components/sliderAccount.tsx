'use client';
import React, { useContext, useState, useEffect } from 'react';
import Input from '@potta/components/input';

import Slider from '@potta/components/slideover';
import Select from '@potta/components/select';
import Button from '@potta/components/button';

// Import the new PhoneInput component

interface AccountCreateProps {
  open?: boolean; // Optional controlled open state
  setOpen?: (open: boolean) => void; // Optional setter from parent
}

// Define the PhoneMetadata interface to match what our PhoneInput component provides

const SliderAccount: React.FC<AccountCreateProps> = ({
  open: controlledOpen, // Renamed to avoid naming conflict
  setOpen: setControlledOpen,
}) => {

  const [localOpen, setLocalOpen] = useState(false);



  // Determine which open state to use
  const isOpen = controlledOpen ?? localOpen;
  const setIsOpen = setControlledOpen ?? setLocalOpen;
const [accountType, setAccountType] = useState('');
const [currency, setCurrency] = useState('');






  return (
    <Slider
      open={isOpen} // Use controlled or local state
      setOpen={setIsOpen} // Use controlled or local setter
      edit={false}
      title={'Create Account'}
      buttonText="account"
    >
      <div>
        <Select
          label="Account Type"
          bg='white'
          options={[
            { value: 'Asset', label: 'Asset' },
            { value: 'Liability', label: 'Liability' },
            { value: 'Equity', label: 'Equity' },
            { value: 'Revenue', label: 'Revenue' },
            { value: 'Expense', label: 'Expense' },
          ]}
          selectedValue={accountType}
          onChange={(value: string) => console.log(value)} />

        <Select
          label="Currency"
          bg='white'
          options={[
            { value: 'EUR', label: 'EUR' },
            { value: 'USD', label: 'USD($)' },
            { value: 'FCFA', label: 'FCFA' },
          ]}
          selectedValue={currency}
          onChange={(value: string) => console.log(value)} />

      </div>
      <div>
        <Input
          label="Account Name"
          name="name"
          placeholder="Enter Account Name"
          type="text"
          onchange={(e) => console.log(e.target.value)}
        />
        <Input
          label="Opening Balance"
          name="openingBalance"
          placeholder="Enter Opening Balance"
          type="number"
          onchange={(e) => console.log(e.target.value)}
/>
      </div>
      <div>
        <Button type='submit' text={'Create Account'} onClick={() => console.log('Account Created')} />

      </div>
      <div className="flex justify-end mt-4">
        <Button
          type="button"
          text="Close"
          onClick={() => setIsOpen(false)} // Close the slider
        />
        </div>
    </Slider>
  );
};

export default SliderAccount;
