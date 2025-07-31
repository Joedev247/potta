import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rejectBill } from '../../utils/api';
import { billsQueryKey } from './useBills';

export default function useRejectBill(body?: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rejectBill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billsQueryKey(body) });
    },
  });
}
