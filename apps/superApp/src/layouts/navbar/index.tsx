"use client"
import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { Search } from '@instanvi/ui-components'
import WalletIcon from '../../components/icons/walletIcon'


export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-blue border-b">
      <div className="grid px-2 py-2 md:px-0 md:grid-cols-3 gap-2 items-center">
        <div className="hidden md:block w-1/3 items-center pl-5 min-w-fit">
          <h1 className="font-semibold text-2xl capitalize">{pathname === "/settings" ? "account settings" : null}</h1>
        </div>
        <div className='w-[90%] md:w-full '>
          <Search rounded placeholder={'Search a text here'} />
        </div>
        <div className='flex justify-end pr-16'>
          <div className='flex justify-end'>
            <div className="flex gap-5 w-full min-w-fit items-center">
              <div className='min-w-fit hover:bg-gray-200 p-1.5 rounded-md'>
                <WalletIcon color={''} />
              </div>
              <span className="px-5 py-1 min-w-fit flex font-semibold rounded-full border-2 border-[#4563f985] text-[#4564F9] hover:bg-[#4563f915] cursor-pointer">XAF 35000</span>
              <div className=' hover:bg-gray-200 rounded-full p-1.5'>
                <Image src={"/icons/top-menu-bell.svg"} alt='notifiations' className='cursor-pointer' width={26} height={26} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
