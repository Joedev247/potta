import axios from 'config/axios.config';
import { useQuery } from '@tanstack/react-query';
import { PurchaseOrderDetails } from '../types';

interface UseGetVendorPurchaseOrderProps {
  token: string;
  enabled: boolean;
}

export default function useGetVendorPurchaseOrder({
  token,
  enabled,
}: UseGetVendorPurchaseOrderProps) {
  return useQuery({
    queryKey: ['vendor-purchase-order', token],
    queryFn: async (): Promise<PurchaseOrderDetails> => {
      try {
        const response = await axios.get('/vendor-portal/purchase-order', {
          params: {
            token: token,
          },
        });

        // Debug: Log the response data to see the actual structure
        console.log('Vendor Portal API Response:', response.data);

        // Check if the response has the expected structure
        if (!response.data || typeof response.data !== 'object') {
          throw new Error('Invalid response format');
        }

        // Check if the response indicates an invalid token
        if (response.data.error || response.data.message === 'Invalid token') {
          throw new Error('Invalid or expired token');
        }

        // More flexible validation - check for different possible structures
        const hasSuccessField = response.data.success !== undefined;
        const hasPurchaseOrder =
          response.data.purchaseOrder || response.data.purchaseOrderId;
        const hasOrderNumber =
          response.data.purchaseOrder?.orderNumber || response.data.orderNumber;

        // If it has the new structure with success field
        if (hasSuccessField && hasPurchaseOrder && hasOrderNumber) {
          return response.data;
        }

        // If it has the old structure (direct fields)
        if (
          hasOrderNumber &&
          (response.data.purchaseOrderId || response.data.uuid)
        ) {
          // Transform old structure to new structure
          return {
            success: true,
            message: 'Purchase order details retrieved successfully',
            purchaseOrder: {
              uuid: response.data.uuid || response.data.purchaseOrderId,
              orderNumber: response.data.orderNumber,
              orderDate: response.data.orderDate,
              requiredDate: response.data.requiredDate,
              shipDate: response.data.shipDate,
              orderTotal: response.data.orderTotal,
              paymentTerms: response.data.paymentTerms,
              paymentMethod: response.data.paymentMethod,
              status: response.data.status,
              notes: response.data.notes,
            },
            lineItems: response.data.lineItems || [],
            vendor: response.data.vendor || response.data.salePerson,
          };
        }

        throw new Error('Invalid purchase order data structure');
      } catch (error: any) {
        // Handle specific error cases
        if (error.response?.status === 401) {
          throw new Error('Invalid or expired token');
        }
        if (error.response?.status === 404) {
          throw new Error('Purchase order not found');
        }
        if (error.message) {
          throw new Error(error.message);
        }
        throw new Error('Failed to fetch purchase order');
      }
    },
    enabled: enabled && !!token,
    retry: false, // Don't retry on failure
  });
}
