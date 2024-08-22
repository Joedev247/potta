import React, { FC, ReactNode } from 'react'
import SideBar from './sidebar'
import Navbar from './navbar'
interface Children {
  children: ReactNode
}
const Layout: FC<Children> = ({ children }) => {
  return (
    <div className='w-full flex'>
      <div className='w-[10%] md:w-[60px]'>
        <SideBar />
      </div>
      <div className='w-full md:grow'>
        <div className='static'>
          <Navbar />
        </div>
        <div className='mt-[4vh]'>
          {children}
        </div>
      </div>
    </div>
  )
}
export default Layout