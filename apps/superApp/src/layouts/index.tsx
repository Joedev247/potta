import React, { FC, ReactNode } from 'react'
import SideBar from './sidebar'
import Navbar from './navbar'
interface Children {
    children: ReactNode
}
const Layout: FC<Children> = ({ children }) => {
    return (
        <div className='w-full  flex'>
            <div className='md:w-[3%] z-50 w-[10%] fixed'>
                <SideBar />
            </div>
            <div className='md:w-[97%] w-[90%] md:ml-[3%] ml-[10%]'>
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