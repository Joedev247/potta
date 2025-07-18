'use client';
import { Inter } from 'next/font/google';
import ImprovedCustomNavbar from '../../../components/improved-custom-navbar';
import Sidebars from './sidebar';
import Navbar from './navbar';
import { useContext, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ContextData } from '../../../components/context';
import { Toaster } from 'sonner';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = false;

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const context = useContext(ContextData);

  return (
    <div className="relative flex w-full h-screen">
      <div className="transition-all flex duration-500 ease-in-out w-full">
        <div className="w-full h-screen overflow-x-hidden overflow-y-auto scroll z-10 flex">
          {/* Sidebar */}
          {context?.layoutMode === 'sidebar' && !isHome && (
            <div className="fixed z-50">
              <Sidebars />
            </div>
          )}

          <div
            className={`flex duration-500 ease-in-out ${
              context?.layoutMode === 'sidebar' && !isHome
                ? context?.toggle
                  ? 'flex w-full pl-[35px]'
                  : 'pl-[150px] w-full'
                : 'w-full'
            }`}
          >
            <div className="w-full relative mx-0">
              {/* Navigation Bar */}
              {!isHome && (
                <>
                  {context?.layoutMode === 'sidebar' && <Navbar />}
                  {context?.layoutMode === 'navbar' && <ImprovedCustomNavbar />}
                </>
              )}

              <Toaster position="top-center" />
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
