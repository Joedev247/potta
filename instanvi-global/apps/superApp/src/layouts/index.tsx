import React, { FC, ReactNode } from 'react'
import SideBar from './sidebar'
import Navbar from './navbar'
interface Children {
    children: ReactNode
}
const Layout: FC<Children> = ({ children }) => {
    return (
        <div className='w-full  flex'>
            <div className='w-[3%] fixed'>
                <SideBar />
            </div>
            <div className='w-[97%] ml-[3%]'>
                <div className='w-full z-40 fixed '>
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