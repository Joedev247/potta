'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

export default function Layout(props: any) {
  console.log('Layout props:', Object.keys(props));
  const { children } = props;
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-screen overflow-hidden">
        <div className="w-full h-screen">
          <div className="h-[100vh] w-full overflow-hidden relative p-0">
            {children}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
