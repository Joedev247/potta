// import axios from 'config/axios.config';
import axios from 'config/axios.config';
import { Filter, ProductResponse } from './types';
import { ProductPayload } from './validation';

export const productApi = {
  create: async (data: ProductPayload) => {
    const result = await axios.post(`/vendor/6099ee5e-7f6d-4d5c-a804-1e186f517a09/product`, data);
    return result?.data;
  },
  getAll: async (filter: Filter) => {
    const result:ProductResponse = await axios.get(`/vendor/6099ee5e-7f6d-4d5c-a804-1e186f517a09/products`, {
      params: { ...filter },
    });
    return result
  },
  getOne: async ( product_id: string) => {
    const result = await axios.get(`/vendor/6099ee5e-7f6d-4d5c-a804-1e186f517a09/product/${product_id}`);
    return result;
  },
  update: async (product_id: string,data: unknown) => {
    const result = await axios.put(`/vendor/6099ee5e-7f6d-4d5c-a804-1e186f517a09/product/${product_id}`, data);
    return result?.data;
  },
  delete: async (product_id: string) => {
    const result = await axios.delete(`/vendor/6099ee5e-7f6d-4d5c-a804-1e186f517a09/product/${product_id}`);
    return result?.data;
  },
}
