import React, { FC, ReactNode } from 'react'
import SideMenu from '../sideMenu'
interface Children {
    children: ReactNode
}
export default function Layout({
    children,
}: Readonly<Children>) {
    return (
        <div className='h-screen w-full flex'>
            <div className='w-[50%]'>
                {children}
            </div>
            <div className='w-[50%]'>
                <SideMenu />
            </div>
        </div>
    )
}
