import React from 'react'
import SideMenu from './components/sideMenu'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='min-h-screen w-full md:flex'>
      <div className='md:w-[50%] w-full'>
        {children}
      </div>
      <div className='w-[50%] md:block hidden min-h-screen'
        style={{
          background: `url('/icons/bg.svg')`,
          backgroundPosition: 'center center',
          backgroundRepeat: "no-repeat",
          backgroundSize: 'cover'
        }}>
        <SideMenu />
      </div>
    </div>
  )
}
