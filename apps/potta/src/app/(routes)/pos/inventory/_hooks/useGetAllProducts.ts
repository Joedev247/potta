import { useQuery } from '@tanstack/react-query';
import { productApi } from '../_utils/api';
import { IFilter } from '../_utils/types';

const useGetAllProducts = (filter: IFilter, vendor_id: string) => {
  return useQuery({
    queryKey: ['get-all-invoice'],
    queryFn: () => productApi.getAll( filter, vendor_id),
  });
};

export default useGetAllProducts;
