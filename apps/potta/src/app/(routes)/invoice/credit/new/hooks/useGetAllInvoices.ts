import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


interface InvoiceParams {
  page: number;
  limit: number;
  customerId?: string;
}

export default function useGetAllInvoices(params: InvoiceParams) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: async () => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/invoice/customer`, {
        params: {
          page: params.page,
          limit: params.limit,
          customerId: params.customerId,
        },
      });
      return response.data;
    },
    enabled: !!params.customerId, // Only fetch when customerId is provided
  });
}