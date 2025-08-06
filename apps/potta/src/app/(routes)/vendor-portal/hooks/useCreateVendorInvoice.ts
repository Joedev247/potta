import axios from 'config/axios.config';
import { useMutation } from '@tanstack/react-query';
import { VendorInvoiceData } from '../types';

interface CreateVendorInvoiceArgs {
  data: VendorInvoiceData;
  token: string;
  orgId: string;
  branchId: string;
}

export default function useCreateVendorInvoice() {
  return useMutation({
    mutationFn: async ({
      data,
      token,
      orgId,
      branchId,
    }: CreateVendorInvoiceArgs) => {
      const response = await axios.post('/vendor-portal/create-invoice', data, {
        params: {
          token: token,
        },
        headers: {
          'X-Organization-ID': orgId,
          'X-Branch-ID': branchId,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    },
  });
}
