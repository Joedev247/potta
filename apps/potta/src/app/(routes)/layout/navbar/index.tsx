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
  { main: 'payments', sub: '' },  // Empty string means main route
  { main: 'expenses', sub: '' },
  { main: 'vouchers', sub: '' },
  { main: 'accounts', sub: '' },
  { main: 'invoice', sub: '' }, 
  { main: 'pos', sub: 'customers' },  // Main invoice page
  // Add other routes where Box should appear
  // For example, to show Box on a specific sub-route:
  // { main: 'payments', sub: 'history' },
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

  // Get the current route and sub-route
  const currentMainRoute = str[1] || '';
  const currentSubRoute = str.slice(2).join('/');

  // Check if Box component should be displayed for the current route
  const shouldShowBox = () => {
    // First check if the route is in the exclusion list
    const isExcluded = routesWithoutBox.some(route => 
      route.main === currentMainRoute && 
      (route.sub === currentSubRoute || 
       (route.sub === '' && currentSubRoute === ''))
    );
    
    if (isExcluded) {
      return false;
    }
    
    // Then check if the route is in the inclusion list
    return routesWithBox.some(route => 
      route.main === currentMainRoute && 
      (route.sub === currentSubRoute || 
       (route.sub === '' && currentSubRoute === ''))
    );
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
    <nav className=" w-full bg-blue-50 space-y-10">
      <div className="flex sticky top-0 left-0 z-20 justify-between bg-blue-50">
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