'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PottaLoader from '@potta/components/pottaloader';
import toast from 'react-hot-toast';
import KYCVerificationForm from './components/KYCVerificationForm';
import { useKYCVerification } from './hooks/useKYCVerification';

interface KYCTokenData {
  token: string;
  vendorId: string;
  kycId: string;
}

const KYCVerificationPage = () => {
  const searchParams = useSearchParams();
  const [tokenData, setTokenData] = useState<KYCTokenData | null>(null);

  // Extract token data from URL on component mount
  useEffect(() => {
    const token = searchParams.get('token');
    const vendorId = searchParams.get('vendorId');
    const kycId = searchParams.get('kycId');

    if (token && vendorId && kycId) {
      setTokenData({ token, vendorId, kycId });
    } else {
      console.error('Missing required parameters: token, vendorId, or kycId');
      toast.error(
        'Invalid verification link. Please check your email for the correct link.'
      );
    }
  }, [searchParams]);

  // Fetch KYC verification details
  const {
    data: kycData,
    isLoading,
    error,
    refetch,
  } = useKYCVerification({
    token: tokenData?.token || '',
    vendorId: tokenData?.vendorId || '',
    kycId: tokenData?.kycId || '',
    enabled: !!tokenData,
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Error fetching KYC verification data:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load KYC verification details. Please check your access token.';
      toast.error(errorMessage);
    }
  }, [error]);

  if (!tokenData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Invalid Verification Link
          </h1>
          <p className="text-gray-600">
            Missing required parameters. Please check your email for the correct
            verification link.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <PottaLoader size="lg" />
      </div>
    );
  }

  if (error || !kycData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            KYC Verification Not Found
          </h1>
          <p className="text-gray-600">
            Unable to load KYC verification details. The verification link may
            be invalid or expired.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <KYCVerificationForm
        tokenData={tokenData}
        kycData={kycData}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default KYCVerificationPage;
