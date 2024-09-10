import React, { FC, ReactNode, useEffect, useState } from 'react'
import Navbar from './navbar'
import SideBar from './sidebar'
import { useRouter } from 'next/router'

interface Children {
  children: ReactNode
}

const Layout: FC<Children> = ({ children }) => {
  const { push } = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const _token = localStorage.getItem("token");
    if (_token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      push("/auth/login");
    }
  }, []);

  if (typeof isLoggedIn === "boolean" && isLoggedIn) return (
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