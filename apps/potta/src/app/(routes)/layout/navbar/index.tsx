'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Select from '../../../../components/select';
import { useRouter } from 'next/navigation';

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

  const handleSelect = (value: string) => {
    router.push(`/${value}`);
    setSeleted(value);
  };

  // If the current route is 'pos', don't render the navbar
  if (str[1] === 'pos' && str[2] === undefined) {
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
    // Default behavior
    return str[2] == undefined ? str[1] : str[2];
  };

  return (
    // <div className="sticky top-0 z-30 w-full bg-white">
    <nav className="sticky top-0 left-0 z-20 w-full bg-white border-b">
      {/* <div className="px-4"> */}
      <div className="flex justify-between">
        <div className="flex items-center gap-20 py-4">
          <Link href={'/'} className="flex items-center ml-10 -mt-2"></Link>
          <h1 className="font-medium text-[22px] -ml-14 capitalize">
            {getTitle()}
          </h1>
        </div>
        <div className="flex gap-8 px-4">
          {/* <Icon icon="Bell" size={23} /> */}
          <div className="w-full min-w-32 ">
            <Select
              options={urlRouters}
              selectedValue={selected.toString()}
              onChange={(value:any) => {
                handleSelect(value);
              }}
              bg={''}
            />
          </div>
        </div>
        {/* </div> */}
      </div>
    </nav>
    // </div>
  );
}
