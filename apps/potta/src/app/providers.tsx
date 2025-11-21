'use client';

import { DataProvider } from '@potta/components/context';
import TanstackQueryClientProvider from './_components/queryClientProvider';
import { Toaster } from 'react-hot-toast';
import { HeroUIProvider } from '@heroui/react';
import { AuthProvider } from './(routes)/auth/AuthContext';
import AuthGuard from './_components/AuthGuard';
import UserDataLoader from '@potta/components/UserDataLoader';
import { ThreadEventsProvider } from './_components/ThreadEventsProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <AuthProvider>
        <TanstackQueryClientProvider>
          <ThreadEventsProvider>
            <HeroUIProvider>
              <Toaster position="top-center" />
              <AuthGuard>
                <UserDataLoader>{children}</UserDataLoader>
              </AuthGuard>
            </HeroUIProvider>
          </ThreadEventsProvider>
        </TanstackQueryClientProvider>
      </AuthProvider>
    </DataProvider>
  );
}
