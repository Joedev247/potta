'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleRetry = () => {
    // Clear any cached tokens and reload
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-500">
            <svg
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Unauthorized Access
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this resource. This could be due to:
          </p>
          <ul className="mt-2 text-sm text-gray-600 text-left list-disc list-inside">
            <li>Invalid or expired authentication token</li>
            <li>Missing authentication credentials</li>
            <li>Insufficient permissions for this resource</li>
          </ul>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={handleRetry}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium  text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Retry Authentication
          </button>
          <button
    
            onClick={handleGoHome}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium  text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Home
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            If this problem persists, please contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
} 