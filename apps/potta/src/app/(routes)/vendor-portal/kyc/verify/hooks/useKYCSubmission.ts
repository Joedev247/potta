import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  kycService,
  KYCSubmissionRequest,
  KYCData,
} from '../services/kycService';
import toast from 'react-hot-toast';

interface UseKYCSubmissionReturn {
  submitKYC: (request: KYCSubmissionRequest) => Promise<KYCData>;
  isSubmitting: boolean;
  error: Error | null;
}

export const useKYCSubmission = (): UseKYCSubmissionReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation<KYCData, Error, KYCSubmissionRequest>({
    mutationFn: (request) => kycService.submitKYCDocuments(request),
    onSuccess: (data) => {
      // Invalidate and refetch KYC verification data
      queryClient.invalidateQueries({
        queryKey: ['kyc-verification'],
      });

      // Update the specific KYC data in cache
      queryClient.setQueryData(
        ['kyc-verification', data.vendorId, data.id],
        data
      );

      toast.success('KYC verification submitted successfully!');
    },
    onError: (error) => {
      console.error('KYC submission error:', error);

      // Show user-friendly error message
      let errorMessage = 'Failed to submit KYC verification. Please try again.';

      if (error.message.includes('413')) {
        errorMessage =
          'File size too large. Please compress your documents and try again.';
      } else if (error.message.includes('415')) {
        errorMessage =
          'File format not supported. Please use JPG, PNG, or PDF files.';
      } else if (error.message.includes('400')) {
        errorMessage =
          'Invalid request. Please check your documents and try again.';
      } else if (error.message.includes('401')) {
        errorMessage =
          'Session expired. Please refresh the page and try again.';
      } else if (error.message.includes('429')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      }

      toast.error(errorMessage);
    },
  });

  return {
    submitKYC: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    error: mutation.error,
  };
};





