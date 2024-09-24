"use client"
import React, { useContext, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ContextData } from 'apps/potta/src/components/context'
import Icon from 'apps/potta/src/components/icon_fonts/icon'


export default function Navbar() {
    const pathname = usePathname()
    const string = pathname
    const str = string.split("/")
    const [collapse, setCollapse] = useState(false)
    const context = useContext(ContextData)
    return (
        <div className='w-full  bg-red-500 sticky top-0 bg-white z-30'>
            <nav className="w-full  sticky top-0 left-0  border-b bg-white z-10">
                <div className="px-4">
                    <div className="flex justify-between">
                        <div className="flex py-4  gap-20 items-center">
                            <Link href={"/"} className="flex items-center ml-10 -mt-2">
                            </Link>
                            <h1 className="font-medium text-[22px] -ml-14 capitalize">{str[1]}</h1>
                        </div>
                        <div className="flex gap-8 items-center px-4">
                            <Icon icon="Bell" size={23} />
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
