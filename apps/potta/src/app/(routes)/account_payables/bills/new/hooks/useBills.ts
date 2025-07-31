import { useQuery } from '@tanstack/react-query';
import { fetchBills } from '../../utils/api';

export const billsQueryKey = (body?: any) => [
  'bills',

  body ? JSON.stringify(body) : '',
];

export function useBills({ body }: { body?: any }) {
  return useQuery({
    queryKey: billsQueryKey(body),
    queryFn: () => fetchBills(),
  });
}
