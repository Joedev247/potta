import { useQuery } from '@tanstack/react-query';
import { productApi } from '../_utils/api';

const useGetOneProduct = (vendor_id: string, product_id:string ) => {
  return useQuery({
    queryKey: ['get-one-product', product_id],
    queryFn: () => productApi.getOne(vendor_id,product_id),
  });
};

export default useGetOneProduct;
