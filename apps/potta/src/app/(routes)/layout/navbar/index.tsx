import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Select from '../../../../components/select';
import { useRouter } from 'next/navigation';

// Import the "useClient" hook here

const urlRouters = [
  {
    value: "payments",
    label: "Payments"
  },
  {
    value: "expenses",
    label: "Expenses"
  },
  {
    value: "vouchers",
    label: "Vouchers"
  },
  {
    value: "POS",
    label: "POS"
  },
  {
    value: "invoicing",
    label: "Invoicing"
  },
  {
    value: "taxation",
    label: "Taxation"
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const string = pathname;
  const str = string.split("/");
  const [selected, setSeleted] = useState(
    // eslint-disable-next-line no-constant-condition
    str[1] == undefined || 'payments' ? 'payments' : str[1] == 'paymentls')

  const handleSelect = (value: string) => {
    router.push(`/${value}`)
    setSeleted(value)
  }

  // Use the "useClient" hook for client-side actions

  return (
    <div className='w-full bg-red-500 sticky top-0 bg-white z-30'>
      <nav className="w-full sticky top-0 left-0 border-b bg-white z-10">
        <div className="px-4">
          <div className="flex justify-between">
            <div className="flex py-4 gap-20 items-center">
              <Link href={"/"} className="flex items-center ml-10 -mt-2">
              </Link>
              <h1 className="font-medium text-[22px] -ml-14 capitalize">{str[2] == undefined ? str[1] : str[2]}</h1>
            </div>
            <div className="flex gap-8    px-4">
              {/* <Icon icon="Bell" size={23} /> */}
              <div className=' w-full'>
                <Select
                  options={urlRouters}
                  selectedValue={selected.toString()}
                  onChange={(value) => { handleSelect(value) }}
                  bg={''}

                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
