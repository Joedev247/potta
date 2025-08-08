'use client';
import { Inter } from 'next/font/google';
import ImprovedCustomNavbar from '../../../components/improved-custom-navbar';
import Sidebars from './sidebar';
import Navbar from './navbar';
import { useContext, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ContextData } from '../../../components/context';
import { Toaster } from 'sonner';
import PottaLoader from '../../../components/pottaloader';
import React from 'react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = false;

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isOrganigrammer = pathname === '/organigrammer';
  const isReports = pathname.startsWith('/reports');
  const context = useContext(ContextData);

  console.log(context?.layoutMode);
  // Show loader until layout is loaded from localStorage
  if (!context?.isLayoutLoaded) {
    return (
      <div className="relative flex w-full h-screen bg-white">
        <PottaLoader size="lg" />
      </div>
    );
  }

  // Determine if sidebar should be forced
  const forceSidebar = isReports;
  const isSettingsPolicies = pathname.startsWith('/settings/policies');
  const useSidebar = forceSidebar || context?.layoutMode === 'sidebar';

  return (
    <div className="relative flex w-full h-screen">
      <div className="transition-all flex duration-500 ease-in-out w-full">
        <div className="w-full h-screen overflow-x-hidden overflow-y-auto scroll z-10 flex">
          {/* Sidebar */}
          {useSidebar && (
            <div className="fixed z-50">
              <Sidebars />
            </div>
          )}

          <div
            className={`flex duration-500 ease-in-out ${
              isOrganigrammer ? '!pl-0' : ''
            } ${
              useSidebar
                ? context?.toggle
                  ? 'flex w-full pl-[35px]'
                  : isSettingsPolicies || isReports
                  ? 'pl-[150px] w-full'
                  : 'pl-[170px] w-full'
                : 'w-full pl-5'
            }`}
          >
            <div className="w-full relative mx-0">
              {/* Navigation Bar */}
              {/* {!isHome && ( */}
              <>
                {useSidebar && <Navbar />}
                {!useSidebar && <ImprovedCustomNavbar />}
              </>
              {/* )} */}

              <Toaster position="top-center" />
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
