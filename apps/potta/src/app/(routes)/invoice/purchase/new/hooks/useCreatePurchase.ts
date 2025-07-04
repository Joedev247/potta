import axios from '@/config/axios.config';
import { useMutation } from '@tanstack/react-query';

interface PurchaseOrderData {
  orderNumber: string;
  orderDate: string;
  requiredDate: string;
  shipDate: string;
  orderTotal: number;
  shoppingAddress: string;
  paymentTerms: string;
  paymentMethod: string;
  status: string;
  customerId: string;
  vendorId: string;
  notes: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    discountCap: number;
    discountType: string;
    unitPrice: number;
    taxRate: number;
    discountRate: number;
    productId: string;
  }>;
}

interface CreatePurchaseOrderArgs {
  data: PurchaseOrderData;
  userId: string;
  branchId: string;
}

export default function useCreatePurchaseOrder() {
  return useMutation({
    mutationFn: async ({ data, userId, branchId }: CreatePurchaseOrderArgs) => {
      const response = await axios.post('/purchase-order/create', data, {});
      return response.data;
    },
  });
}
