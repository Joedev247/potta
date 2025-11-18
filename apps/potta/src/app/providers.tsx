'use client';

import { DataProvider } from '@potta/components/context';
import TanstackQueryClientProvider from './_components/queryClientProvider';
import { Toaster } from 'react-hot-toast';
import { HeroUIProvider } from '@heroui/react';
import { AuthProvider } from './(routes)/auth/AuthContext';
import AuthGuard from './_components/AuthGuard';
import UserDataLoader from '@potta/components/UserDataLoader';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <AuthProvider>
        <TanstackQueryClientProvider>
          <HeroUIProvider>
            <Toaster position="top-center" />
            <AuthGuard>
              <UserDataLoader>{children}</UserDataLoader>
            </AuthGuard>
          </HeroUIProvider>
        </TanstackQueryClientProvider>
      </AuthProvider>
    </DataProvider>
  );
}
