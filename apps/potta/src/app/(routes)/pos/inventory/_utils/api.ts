// import axios from 'config/axios.config';
import axios from 'config/posconfig';
import { Filter, ProductResponse } from './types';
import { ProductPayload } from './validation';

export const productApi = {
  create: async (data: ProductPayload) => {
    const result = await axios.post(`/vendor/8f79d19a-5319-4783-8ddc-c863d98ecc16/product`, data);
    return result?.data;
  },
  getAll: async (filter: Filter) => {
    const result:ProductResponse = await axios.get(`/vendor/8f79d19a-5319-4783-8ddc-c863d98ecc16/products`, {
      params: { ...filter },
    });
    return result
  },
  getOne: async ( product_id: string) => {
    const result = await axios.get(`/vendor/8f79d19a-5319-4783-8ddc-c863d98ecc16/product/${product_id}`);
    return result;
  },
  update: async (product_id: string,data: unknown) => {
    const result = await axios.put(`/vendor/8f79d19a-5319-4783-8ddc-c863d98ecc16/product/${product_id}`, data);
    return result?.data;
  },
  delete: async (product_id: string) => {
    const result = await axios.delete(`/vendor/8f79d19a-5319-4783-8ddc-c863d98ecc16/product/${product_id}`);
    return result?.data;
  },
}
