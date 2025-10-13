'use client';
import React, { useEffect, useMemo } from 'react';
import { useAuth } from '../(routes)/auth/AuthContext';
import PottaLoader from '@potta/components/pottaloader';

// Configuration constants
const AUTH_REDIRECT_URL =
  process.env.NEXT_PUBLIC_AUTH_URL || 'https://instanvi-auth.vercel.app';
const BYPASS_AUTH_ROUTES = [
  '/vendor-portal',
  '/vendor-portal/kyc/verify',
  '/vendor/rfqs',
  // Add more routes here as needed
  // '/client-portal',
  // '/public-api',
];

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { token, isLoading, isAuthenticated } = useAuth();

  // Memoized route detection to avoid unnecessary recalculations
  const isBypassRoute = useMemo(() => {
    if (typeof window === 'undefined') return false;

    const currentPath = window.location.pathname;
    return BYPASS_AUTH_ROUTES.some((route) => currentPath.includes(route));
  }, []);

  // Check if there's a token in the URL
  const hasUrlToken = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const url = new URL(window.location.href);
    return url.searchParams.has('token');
  }, []);

  useEffect(() => {
    // Skip auth check for bypass routes
    if (isBypassRoute) {
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthGuard: Bypass route detected, skipping auth check');
      }
      return;
    }

    // Don't redirect if there's a token in URL (AuthContext is processing it)
    if (hasUrlToken) {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          'AuthGuard: Token found in URL, waiting for AuthContext to process...'
        );
      }
      return;
    }

    // Redirect to auth if no token and not loading and no URL token
    if (!isLoading && !token && !hasUrlToken) {
      if (process.env.NODE_ENV === 'development') {
        console.log('AuthGuard: No token found, redirecting to auth...');
      }

      const currentUrl = window.location.href;
      const authUrl = new URL(AUTH_REDIRECT_URL);
      authUrl.searchParams.set('redirectUrl', currentUrl);
      window.location.href = authUrl.toString();
    }
  }, [token, isLoading, isBypassRoute, hasUrlToken]);

  // Show loading state while checking authentication (only for non-bypass routes)
  if (isLoading && !isBypassRoute) {
    return (
      <div className="flex items-center justify-center h-screen">
        <PottaLoader size="lg" />
      </div>
    );
  }

  // Allow access for bypass routes regardless of auth state
  if (isBypassRoute) {
    return <>{children}</>;
  }

  // If there's a token in URL, show loading while AuthContext processes it
  if (hasUrlToken && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <PottaLoader size="lg" />
      </div>
    );
  }

  // Don't render children if not authenticated and no URL token (will redirect)
  if (!isAuthenticated && !hasUrlToken) {
    return null;
  }

  // Render children for authenticated users
  return <>{children}</>;
};

export default AuthGuard;
