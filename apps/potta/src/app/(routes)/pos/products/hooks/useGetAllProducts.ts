import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Product {
  uuid: string;
  name: string;
  price: number;
  tax: number;
  productId: string;
}

interface GetProductsParams {
  page: number;
  limit: number;
}

const useGetAllProducts = (params: GetProductsParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await axios.get('/api/products', { params });
      return data;
    },
  });
};

export default useGetAllProducts;