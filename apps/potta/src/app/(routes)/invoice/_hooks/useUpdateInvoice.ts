import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceApi } from '../_utils/api';

const useUpdateInvoice = (invoice_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['update-invoice'],
    mutationFn: (data) => invoiceApi.update(invoice_id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['get-all-invoice'] }),
  });
};

export default useUpdateInvoice;
