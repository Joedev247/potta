"use client"
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import WalletIcon from '@/components/icons/walletIcon'
import Search from '@/components/inputs/search/roundedSearch'



export default function Navbar() {
    const { asPath } = useRouter()
    const string = asPath
    const str = string.split("/")

    return (
        <div className='w-full relative bg-white z-30'>
            <nav className="w-full  border-b  ">

                <div className="grid grid-cols-3 gap-2 h-[5.88vh]">
                    <div className="flex py-4 md:block hidden w-1/3 items-center">
                        <h1 className="font-semibold text-[22px] capitalize"></h1>
                    </div>
                    <div className='w-full  mt-2'>
                        <Search onchange={() => { }} text={''} value={''} placeholder={'Search a text here'} />
                    </div>
                    <div className='w-full -mt-0.5 flex justify-end'>
                        <div className='w-3/5  flex justify-end'>
                            <div className="flex gap-8  w-full  items-center px-4">
                                <div className="py-4"><div className='flex justify-center'><WalletIcon height={'10'} width={'20'} color={''} /></div></div>
                                <span className="py-1.5 px-5 flex font-medium border rounded-full border-blue-500  text-blue-500">XAF&nbsp;35000</span>
                                <Image src={"/icons/top-menu-bell.svg"} alt='notifiations' className='cursor-pointer' width={26} height={26} />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
