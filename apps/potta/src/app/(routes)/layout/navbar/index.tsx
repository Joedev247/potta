'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Select from '../../../../components/select';
import { useRouter } from 'next/navigation';
import Box from './box';
import PaymentsBox from './boxes/PaymentsBox';
import AccountsBox from './boxes/AccountsBox';
import ExpensesBox from './boxes/ExpensesBox';
import InvoiceBox from './boxes/InvoiceBox';
import InvoicePurchaseBox from './boxes/InvoicePurchaseBox';
import InvoiceRecurringBox from './boxes/InvoiceRecurringBox';
import PosCustomersBox from './boxes/PosCustomersBox';
import VendorsBox from './boxes/PosVendorsBox';
import VouchersBox from './boxes/VouchersBox';
import PosSalesBox from './boxes/PosSalesBox';


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

// Routes where Box component should be displayed with their specific box component
const routesWithBox = [
  { main: 'payments', sub: '', component: PaymentsBox },
  { main: 'expenses', sub: '', component: ExpensesBox },
  { main: 'vouchers', sub: '', component: VouchersBox },
  { main: 'accounts', sub: '', component: AccountsBox },
  { main: 'invoice', sub: '', component: InvoiceBox },
  { main: 'pos', sub: 'sales', component: PosSalesBox },
  { main: 'invoice', sub: 'purchase', component: InvoicePurchaseBox },
  { main: 'invoice', sub: 'recurring', component: InvoiceRecurringBox },
];

// Routes with specific sub-routes where Box should NOT be displayed
const routesWithoutBox = [
  { main: 'invoice', sub: 'new' },
  { main: 'invoice', sub: 'credit/new' },
  { main: 'invoice', sub: 'purchase/new' },
  { main: 'invoice', sub: 'recurring/new' },
  { main: 'pos', sub: 'sales/new' },
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
  
  // Check if the current path contains "customers"
  const pathContainsCustomers = pathname.includes('customers');
  const pathContainsVendors = pathname.includes('vendors');
  // Get the appropriate box component for the current route
  const getBoxComponent = () => {
    // If the path contains "customers", return the PosCustomersBox
    if (pathContainsCustomers) {
      return PosCustomersBox;
    }
    // If the path contains "vendors", return the PosVendorsBox
    else if (pathContainsVendors) {
      return VendorsBox;
    }
   
    // Otherwise, find the component based on the route
    const routeConfig = routesWithBox.find(route => 
      route.main === currentMainRoute && 
      (route.sub === currentSubRoute || 
       (route.sub === '' && currentSubRoute === ''))
    );
    
    return routeConfig?.component || null;
  };

  // Check if Box component should be displayed for the current route
  const shouldShowBox = () => {
    // If the path contains "customers", always show the box
    if (pathContainsCustomers) {
      return true;
    }
    
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
      return 'New Sales Receipt';
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
    if (str[1] === 'invoice' && str[2] === 'recurring' && str[3] === undefined) {
      return 'Recurring Invoice';
    }
    if (str[1] === 'invoice' && str[2] === 'recurring' && str[3] === 'new') {
      return 'New Recurring Invoice';
    }
    if (str[1] === 'pos' && str[2] === 'files') {
      return 'File Manager';
    }
    if (str[1] === 'vouchers' && str[2] === 'new') {
      return 'New Voucher';
    }
    // Default behavior
    return str[2] == undefined ? str[1] : str[2];
  };

  // Render the appropriate box component
  const BoxComponent = getBoxComponent();

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
      
      {/* Render the route-specific box component */}
      {shouldShowBox() && BoxComponent && (
        <div className='ml-14 pb-10'>
          <BoxComponent />
        </div>
      )}
    </nav>
  );
}