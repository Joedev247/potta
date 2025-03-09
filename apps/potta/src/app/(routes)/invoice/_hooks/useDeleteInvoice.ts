import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceApi } from '../_utils/api';

const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-invoice'],
    mutationFn: invoiceApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-invoice'] });
    },
  });
};

export default useDeleteInvoice;
