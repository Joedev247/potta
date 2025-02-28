import { useQuery } from '@tanstack/react-query';
import { productApi } from '../_utils/api';
import { IFilter } from '../_utils/types';

const useGetAllProducts = (filter: IFilter,) => {
  return useQuery({
    queryKey: ['get-all-product', filter.page, filter.limit],
    queryFn: () => productApi.getAll( filter),
    staleTime: 1000 * 60 * 5, // Optional: Data will be fresh for 5 minutes, adjust as needed
    refetchOnWindowFocus: false, // Optional: Prevents refetching when window is focused
  });
};

export default useGetAllProducts;
