import React, { FC, ReactNode } from 'react'
import SideBar from './sidebar'
import Navbar from './navbar'

interface Children {
  children: ReactNode
}

const Layout: FC<Children> = ({ children }) => {

  return (
    <div className='w-full flex'>
      <div className='w-[10%] md:w-[60px] fixed z-30'>
        <SideBar />
      </div>
      <div className='w-full md:grow pl-12'>
        <div className='fixed min-w-full bg-white z-20'>
          <Navbar />
        </div>
        <div className='h-screen pt-24 md:pt-14'>
          {children}
        </div>
      </div>
    </div>
  )
}
export default Layout