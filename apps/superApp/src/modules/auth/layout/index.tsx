import React, { useEffect, useState } from 'react'
import SideMenu from './components/sideMenu'
import { useRouter } from 'next/router';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { push } = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const _token = localStorage.getItem("token");
    if (_token) {
      setIsLoggedIn(true);
      push("/");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  if (typeof isLoggedIn === "boolean" && !isLoggedIn) return (
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
