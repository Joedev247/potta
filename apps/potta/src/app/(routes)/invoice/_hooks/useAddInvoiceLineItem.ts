import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceApi } from '../_utils/api';

const useAddInvoiceLineItem = (invoice_id: string, user_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['add-invoice-line-item'],
    mutationFn: (data: unknown) =>
      invoiceApi.addLineItem(invoice_id, user_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-invoice'] });
    },
  });
};



export default useAddInvoiceLineItem;
