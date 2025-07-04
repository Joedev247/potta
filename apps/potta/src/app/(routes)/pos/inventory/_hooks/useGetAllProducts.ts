import { useQuery } from '@tanstack/react-query';
import { productApi } from '../_utils/api';
import { Filter, ProductResponse } from '../_utils/types';
import { productCategoryApi } from '../_utils/api';

const useGetAllProducts = (filter: Filter) => {
  return useQuery<ProductResponse>({
    queryKey: ['get-all-product', filter.page, filter.limit],
    queryFn: () => productApi.getAll(filter),
    staleTime: 1000 * 60 * 5, // Optional: Data will be fresh for 5 minutes, adjust as needed
    refetchOnWindowFocus: false, // Optional: Prevents refetching when window is focused
  });
};

const useGetAllProductCategories = (
  orgId: string,
  branchId: string,
  params = {}
) => {
  return useQuery({
    queryKey: ['get-all-product-category', orgId, branchId, params],
    queryFn: () => productCategoryApi.getAll(orgId, branchId, params),
  });
};

export default useGetAllProducts;
