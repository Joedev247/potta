'use client';
import React, { useContext, useState, useEffect } from 'react';
import Input from '@potta/components/input';
import Slider from '@potta/components/slideover';
import Select from '@potta/components/select';
import Button from '@potta/components/button';
import { useGetOhada } from '../hooks/hooks';

interface AccountCreateProps {
  open?: boolean; // Optional controlled open state
  setOpen?: (open: boolean) => void; // Optional setter from parent
}

// Define interfaces for the account hierarchy
interface AccountItem {
  uuid: string;
  code: string;
  name: string;
  children: AccountItem[];
}

const SliderAccount: React.FC<AccountCreateProps> = ({
  open: controlledOpen,
  setOpen: setControlledOpen,
}) => {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = controlledOpen ?? localOpen;
  const setIsOpen = setControlledOpen ?? setLocalOpen;
  
  // OHADA Categories
  const ohadaCategories = [
    { value: 'CAPITAL', label: 'CAPITAL' },
    { value: 'RESERVES (RETAINED EARNINGS)', label: 'RESERVES (RETAINED EARNINGS)' },
    { value: 'CARRIED/BROUGHT FORWARD', label: 'CARRIED/BROUGHT FORWARD' },
    { value: 'NET PROFIT OR LOSS FOR THE PERIOD', label: 'NET PROFIT OR LOSS FOR THE PERIOD' },
    { value: 'INVESTMENT GRANTS OR SUBSIDIES', label: 'INVESTMENT GRANTS OR SUBSIDIES' },
    { value: 'REGULATED PROVISIONS AND RELATED FUNDS', label: 'REGULATED PROVISIONS AND RELATED FUNDS' },
    { value: 'BORROWINGS AND ASSIMILATED DEBTS', label: 'BORROWINGS AND ASSIMILATED DEBTS' },
    { value: 'LEASING DEBTS AND ASSIMILATED CONTRACTS', label: 'LEASING DEBTS AND ASSIMILATED CONTRACTS' },
    { value: 'DEBTS RELATED TO PARTICIPATION AND LIAISON ACCOUNTS OF SUBSIDIARY ESTABLISHMENTS', label: 'DEBTS RELATED TO PARTICIPATION AND LIAISON ACCOUNTS OF SUBSIDIARY ESTABLISHMENTS' },
    { value: 'PROVISIONS FOR RISKS AND EXPENDITURES', label: 'PROVISIONS FOR RISKS AND EXPENDITURES' }
  ];
  
  // Account type options
  const accountTypeOptions = [
    { value: 'Asset', label: 'Asset' },
    { value: 'Liability', label: 'Liability' },
    { value: 'Equity', label: 'Equity' },
    { value: 'Revenue', label: 'Revenue' },
    { value: 'Expense', label: 'Expense' },
  ];
  
  // Currency options
  const currencyOptions = [
    { value: 'EUR', label: 'EUR' },
    { value: 'USD', label: 'USD($)' },
    { value: 'FCFA', label: 'FCFA' },
  ];
  
  // Initialize with default values (first option in each dropdown)
  const [accountType, setAccountType] = useState(accountTypeOptions[0].value);
  const [currency, setCurrency] = useState(currencyOptions[0].value);
  
  // State for the main OHADA category selection - initialize with first option
  const [selectedOhadaCategory, setSelectedOhadaCategory] = useState<string>(ohadaCategories[0].value);
  
  // Fetch OHADA data when a category is selected
  const { data: ohadaData, isLoading, isError } = useGetOhada(selectedOhadaCategory);
  
  // State for the hierarchical selection
  const [level1Selection, setLevel1Selection] = useState<string | null>(null);
  const [level2Selection, setLevel2Selection] = useState<string | null>(null);
  const [level3Selection, setLevel3Selection] = useState<string | null>(null);
  
  // Selected items at each level
  const [selectedLevel1Item, setSelectedLevel1Item] = useState<AccountItem | null>(null);
  const [selectedLevel2Item, setSelectedLevel2Item] = useState<AccountItem | null>(null);
  const [selectedLevel3Item, setSelectedLevel3Item] = useState<AccountItem | null>(null);

  // Initialize OHADA data fetch on component mount
  useEffect(() => {
    // This effect will run once on component mount since selectedOhadaCategory is already initialized
    // The useGetOhada hook will automatically be called with the default category
  }, []);

  // Reset hierarchy selections when OHADA category changes
  useEffect(() => {
    setLevel1Selection(null);
    setLevel2Selection(null);
    setLevel3Selection(null);
    setSelectedLevel1Item(null);
    setSelectedLevel2Item(null);
    setSelectedLevel3Item(null);
  }, [selectedOhadaCategory]);

  // Options for level 1 (main categories from OHADA data)
  const level1Options = ohadaData?.children?.map((item: AccountItem) => ({
    value: item.uuid,
    label: `${item.code} - ${item.name}`
  })) || [];

  // Options for level 2 (subcategories based on level 1 selection)
  const level2Options = selectedLevel1Item?.children?.map((item: AccountItem) => ({
    value: item.uuid,
    label: `${item.code} - ${item.name}`
  })) || [];

  // Options for level 3 (subcategories based on level 2 selection)
  const level3Options = selectedLevel2Item?.children?.map((item: AccountItem) => ({
    value: item.uuid,
    label: `${item.code} - ${item.name}`
  })) || [];

  // Auto-select first option when OHADA data is loaded
  useEffect(() => {
    if (ohadaData?.children && ohadaData.children.length > 0 && !level1Selection) {
      const firstItem = ohadaData.children[0];
      setLevel1Selection(firstItem.uuid);
      setSelectedLevel1Item(firstItem);
    }
  }, [ohadaData, level1Selection]);

  // Auto-select first option when level 1 is selected
  useEffect(() => {
    if (selectedLevel1Item?.children && selectedLevel1Item.children.length > 0 && !level2Selection) {
      const firstItem = selectedLevel1Item.children[0];
      setLevel2Selection(firstItem.uuid);
      setSelectedLevel2Item(firstItem);
    }
  }, [selectedLevel1Item, level2Selection]);

  // Auto-select first option when level 2 is selected
  useEffect(() => {
    if (selectedLevel2Item?.children && selectedLevel2Item.children.length > 0 && !level3Selection) {
      const firstItem = selectedLevel2Item.children[0];
      setLevel3Selection(firstItem.uuid);
      setSelectedLevel3Item(firstItem);
    }
  }, [selectedLevel2Item, level3Selection]);

  // Handle OHADA category selection
  const handleOhadaCategoryChange = (value: string) => {
    setSelectedOhadaCategory(value);
  };

  // Handle level 1 selection
  const handleLevel1Change = (value: string) => {
    setLevel1Selection(value);
    setLevel2Selection(null);
    setLevel3Selection(null);
    setSelectedLevel2Item(null);
    setSelectedLevel3Item(null);
    
    // Find the selected item
    const selectedItem = ohadaData?.children?.find((item: AccountItem) => item.uuid === value) || null;
    setSelectedLevel1Item(selectedItem);
  };

  // Handle level 2 selection
  const handleLevel2Change = (value: string) => {
    setLevel2Selection(value);
    setLevel3Selection(null);
    setSelectedLevel3Item(null);
    
    // Find the selected item
    const selectedItem = selectedLevel1Item?.children?.find((item: AccountItem) => item.uuid === value) || null;
    setSelectedLevel2Item(selectedItem);
  };

  // Handle level 3 selection
  const handleLevel3Change = (value: string) => {
    setLevel3Selection(value);
    
    // Find the selected item
    const selectedItem = selectedLevel2Item?.children?.find((item: AccountItem) => item.uuid === value) || null;
    setSelectedLevel3Item(selectedItem);
  };

  // Get the final selected account
  const getSelectedAccount = () => {
    if (selectedLevel3Item) return selectedLevel3Item;
    if (selectedLevel2Item) return selectedLevel2Item;
    if (selectedLevel1Item) return selectedLevel1Item;
    return null;
  };

  const selectedAccount = getSelectedAccount();

  return (
    <Slider
      open={isOpen}
      setOpen={setIsOpen}
      edit={false}
      title={'Create Account'}
      buttonText="account"
    >
      <div className="my-14 h-[76vh] relative">
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">OHADA Account Hierarchy</h3>
          
          {/* OHADA Main Category Dropdown */}
          <Select
            label="OHADA Category"
            bg='bg-white'
            options={ohadaCategories}
            selectedValue={selectedOhadaCategory}
            onChange={handleOhadaCategoryChange}
          />
          
          {/* Loading indicator */}
          {isLoading && selectedOhadaCategory && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-600">Loading OHADA data...</p>
            </div>
          )}
          
          {/* Error message */}
          {isError && selectedOhadaCategory && (
            <div className="mt-2 p-2 bg-red-50 rounded-md">
              <p className="text-sm text-red-600">Error loading OHADA data. Please try again.</p>
            </div>
          )}
          
          {/* Level 1 Dropdown - Only show if OHADA data is loaded */}
          {ohadaData && !isLoading && level1Options.length > 0 && (
            <Select
              label="Main Category"
              bg='bg-white'
              options={level1Options}
              selectedValue={level1Selection || ''}
              onChange={handleLevel1Change}
            />
          )}
          
          {/* Level 2 Dropdown - Only show if level 1 is selected and has children */}
          {level1Selection && level2Options.length > 0 && (
            <Select
              label="Subcategory"
              bg='bg-white'
              options={level2Options}
              selectedValue={level2Selection || ''}
              onChange={handleLevel2Change}
            />
          )}
          
          {/* Level 3 Dropdown - Only show if level 2 is selected and has children */}
          {level2Selection && level3Options.length > 0 && (
            <Select
              label="Detail"
              bg='bg-white'
              options={level3Options}
              selectedValue={level3Selection || ''}
              onChange={handleLevel3Change}
            />
          )}
          
          {/* Display the final selection */}
          {selectedAccount && (
            <div className="mt-2 p-2 bg-gray-50 rounded-md">
              <p className="text-sm font-medium">Selected Account:</p>
              <p className="text-sm">{`${selectedAccount.code} - ${selectedAccount.name}`}</p>
            </div>
          )}
        </div>
        
        <div>
          <Select
            label="Account Type"
            bg='bg-white'
            options={accountTypeOptions}
            selectedValue={accountType}
            onChange={(value: string) => setAccountType(value)} 
          />

        
        </div>
        
        <div className='mb-14'>
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
      
        
        <div className="flex justify-between ">
        <Button 
            type='submit' 
            text={'Create Account'} 
            onClick={() => {
              console.log('Account Created', {
                accountType,
                currency,
                ohadaCategory: selectedOhadaCategory,
                selectedAccount
              });
            }} 
          />
          <Button
            type="button"
            text="Close"
            theme='danger'
            onClick={() => setIsOpen(false)}
          />
        </div>
      </div>
    </Slider>
  );
};

export default SliderAccount;