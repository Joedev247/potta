import { useMutation, useQueryClient } from '@tanstack/react-query';
import { approveBill } from '../../utils/api';
import { billsQueryKey } from './useBills';

export default function useApproveBill(
  branchId: string,
  orgId: string,
  body?: any
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveBill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: billsQueryKey(branchId, orgId, body),
      });
    },
  });
}
