'use client';
import React, { useContext, useState, useEffect } from 'react';
import Input from '@potta/components/input';

import Slider from '@potta/components/slideover';

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

  

 

  

  return (
    <Slider
      open={isOpen} // Use controlled or local state
      setOpen={setIsOpen} // Use controlled or local setter
      edit={false}
      title={'Create Account'}
      buttonText="account"
    >
      <p>hey</p>
    </Slider>
  );
};

export default SliderAccount;
