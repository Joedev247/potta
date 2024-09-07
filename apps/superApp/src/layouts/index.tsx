import React, { FC, ReactNode } from 'react'
import Navbar from './navbar'
import SideBar from './sidebar'

interface Children {
  children: ReactNode
}

const Layout: FC<Children> = ({ children }) => {

  return (
    <div className='w-full flex'>
      <aside className='w-[10%] md:w-[60px] fixed z-40'>
        <SideBar />
      </aside>
      <main className='w-full md:grow pl-12'>
        <div className='fixed min-w-full bg-white z-30'>
          <Navbar />
        </div>
        <section className='h-screen pt-24 md:pt-14'>
          {children}
        </section>
      </main>
    </div>
  )
}
export default Layout