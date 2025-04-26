'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Select from '../../../../components/select';
import { useRouter } from 'next/navigation';
import Box from './box';

const urlRouters = [
  {
    value: 'payments',
    label: 'Payments',
  },
  {
    value: 'expenses',
    label: 'Expenses',
  },
  {
    value: 'vouchers',
    label: 'Vouchers',
  },
  {
    value: "pos",
    label: "POS"
  },
  {
    value: 'invoice',
    label: 'Invoice',
  },
  {
    value: 'taxation',
    label: 'Taxation',
  },
  {
    value: "reports",
    label: "Reports"
  },
  {
    value: "accounts",
    label: "Accounts"
  },
];

// Routes where Box component should be displayed
const routesWithBox = [
  'payments',
  'expenses',
  'vouchers',
  'accounts',
  // Add other routes where Box should always appear
];

// Routes with specific sub-routes where Box should NOT be displayed
const routesWithoutBox = [
  { main: 'invoice', sub: 'new' },
  { main: 'invoice', sub: 'credit/new' },
  { main: 'invoice', sub: 'purchase/new' },
  // Add other specific routes where Box should not appear
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const string = pathname;
  const str = string.split('/');

  // Check if str[1] is one of the valid route values
  const isValidRoute = str[1] && urlRouters.some(route => route.value === str[1]);

  const [selected, setSeleted] = useState(
    isValidRoute ? str[1] : 'payments'
  );

  // Check if current route is in the exclusion list
  const isExcludedRoute = routesWithoutBox.some(route => 
    route.main === str[1] && 
    (route.sub === str.slice(2).join('/') || 
     (route.sub === '' && str[2] === undefined))
  );

  // Check if Box component should be displayed for the current route
  const shouldShowBox = () => {
    // If it's in the exclusion list, don't show Box
    if (isExcludedRoute) {
      return false;
    }
    
    // Special case for invoice - show Box only on the main invoice page
    if (str[1] === 'invoice') {
      return str[2] === undefined;
    }
    
    // For other routes, check if they're in the inclusion list
    return routesWithBox.includes(str[1]);
  };

  const handleSelect = (value: string) => {
    router.push(`/${value}`);
    setSeleted(value);
  };

  // If the current route is 'pos', don't render the navbar
  if (str[1] === 'pos' && str[2] === undefined) {
    return null;
  }

  if (str[1] === '' && str[2] === undefined) {
    return null;
  }

  // Determine the title to display
  const getTitle = () => {
    // Special case for /pos/new route
    if (str[1] === 'pos' && str[2] === 'sales' && str[3] === 'new') {
      return 'New Sales Reciept';
    }

    if (str[1] === 'invoice' && str[2] === 'new') {
      return 'New Invoice';
    }
    if (str[1] === 'invoice' && str[2] === undefined) {
      return 'Invoice Overview';
    }
    if (str[1] === 'invoice' && str[2] === 'credit' && str[3] === 'new') {
      return 'New Credit Note';
    }

    if (str[1] === 'invoice' && str[2] === 'purchase' && str[3] === 'new') {
      return 'New Purchase Order';
    }
    if (str[1] === 'invoice' && str[2] === 'purchase' && str[3] === undefined) {
      return 'Purchase Order';
    }
    // Default behavior
    return str[2] == undefined ? str[1] : str[2];
  };

  return (
    <nav className="sticky top-0 left-0 z-20 w-full bg-blue-50 space-y-10">
      <div className="flex justify-between">
        <div className="flex items-center gap-20 py-4">
          <Link href={'/'} className="flex items-center ml-8 -mt-2"></Link>
          <h1 className="font-medium text-3xl -ml-14 capitalize">
            {getTitle()}
          </h1>
        </div>
        <div className="flex gap-8 px-4">
          <div className="w-full min-w-32 ">
            <Select
              options={urlRouters}
              selectedValue={selected.toString()}
              onChange={(value: any) => {
                handleSelect(value);
              }}
              bg={'bg-white'}
            />
          </div>
        </div>
      </div>
      
      {/* Only render Box component for specific routes */}
      {shouldShowBox() && (
        <div className='ml-14 pb-10'>
          <Box />
        </div>
      )}
    </nav>
  );
}