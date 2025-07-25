import { useQuery } from '@tanstack/react-query';
import { fetchBills } from '../../utils/api';

export const billsQueryKey = (branchId: string, orgId: string, body?: any) => [
  'bills',
  branchId,
  orgId,
  body ? JSON.stringify(body) : '',
];

export function useBills({
  branchId,
  orgId,
  body,
}: {
  branchId: string;
  orgId: string;
  body?: any;
}) {
  return useQuery({
    queryKey: billsQueryKey(branchId, orgId, body),
    queryFn: () => fetchBills({ branchId, orgId, body }),
  });
}
