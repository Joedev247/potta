// 'use client'
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import 'remixicon/fonts/remixicon.css';
import 'react-accessible-accordion/dist/fancy-example.css';
import { DataProvider } from '@potta/components/context';
import TanstackQueryClientProvider from './_components/queryClientProvider';
import { Toaster } from 'react-hot-toast';

import { HeroUIProvider } from '@heroui/react';
import { AuthProvider } from './(routes)/auth/AuthContext';
import AuthGuard from './_components/AuthGuard';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Potta',
  description: 'Potta App',
  icons: {
    icon: '/icons/Potta.svg',
    shortcut: '/icons/Potta.svg',
    apple: '/icons/Potta.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DataProvider>
      <AuthProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <TanstackQueryClientProvider>
              <HeroUIProvider>
                <Toaster position="top-center" />
                <AuthGuard>{children}</AuthGuard>
              </HeroUIProvider>
            </TanstackQueryClientProvider>
          </body>
        </html>
      </AuthProvider>
    </DataProvider>
  );
}
