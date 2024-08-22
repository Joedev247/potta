import React, { FC, ReactNode } from 'react'
import SideMenu from './components/sideMenu'
interface Children {
    children: ReactNode
}
export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='h-screen w-full md:flex '>
            <div className='md:w-[50%] w-full'>
                {children}
            </div>
            <div className='w-[50%] md:block hidden'>
                <SideMenu />
            </div>
        </div>
    )
}
