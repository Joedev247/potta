import { useMutation } from '@tanstack/react-query';
import axios from 'axios';


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

export default function useCreatePurchaseOrder() {
  return useMutation({
    mutationFn: async (data: PurchaseOrderData) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/purchase-orders`, data);
      return response.data;
    },
  });
}