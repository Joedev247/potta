import { useQuery } from '@tanstack/react-query';
import { posApi } from '../utils/api';
import { Filter, ProductResponse } from '../utils/types';

const useGetAllProducts = (filter: Filter,) => {
  return useQuery<ProductResponse>({
    queryKey: ['get-all-product', filter.page, filter.limit],
    queryFn: () => posApi.getAll( filter),
    staleTime: 1000 * 60 * 5, // Optional: Data will be fresh for 5 minutes, adjust as needed
    refetchOnWindowFocus: false, // Optional: Prevents refetching when window is focused
  });
};

export default useGetAllProducts;
