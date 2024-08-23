"use client"
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Search } from '@instanvi/ui-components'
import WalletIcon from '../../components/icons/walletIcon'


export default function Navbar() {
  const { asPath } = useRouter()
  const string = asPath
  const str = string.split("/")

  return (

    <nav className="bg-blue border-b">
      <div className="grid px-2 md:px-0 md:grid-cols-3 py-2 gap-2">
        <div className="flex py-4 md:block hidden w-1/3 items-center">
          <h1 className="font-semibold text-[22px] capitalize"></h1>
        </div>
        <div className='w-full'>
          <Search onChange={() => { console.log("search") }} value={''} placeholder={'Search a text here'} />
        </div>
        <div className='flex justify-end'>
          <div className='flex justify-end'>
            <div className="flex gap-8 w-full items-center px-4">
              <div className="">
                <div className='flex justify-center'>
                  <WalletIcon height={'10'} width={'20'} color={''} />
                </div>
              </div>
              <span className="px-5 py-1 flex font-semibold rounded-full border-2 border-[#4563f985]  text-[#4564F9]">XAF&nbsp;35000</span>
              <Image src={"/icons/top-menu-bell.svg"} alt='notifiations' className='cursor-pointer' width={26} height={26} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
