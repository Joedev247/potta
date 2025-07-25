'use client';
import React, { useEffect } from 'react';
import { useAuth } from '../(routes)/auth/AuthContext';
import PottaLoader from '@potta/components/pottaloader';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { token, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // If not loading and no token, redirect to auth
    if (!isLoading && !token) {
      const currentUrl = window.location.href;
      const authUrl = new URL('https://instanvi-auth.vercel.app');
      authUrl.searchParams.set('redirect', currentUrl);
      window.location.href = authUrl.toString();
    }
  }, [token, isLoading]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <PottaLoader size='lg' />
      </div>
    );
  }

  // If not authenticated, don't render children (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default AuthGuard;
