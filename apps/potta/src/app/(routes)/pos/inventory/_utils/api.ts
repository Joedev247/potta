// import axios from 'config/axios.config';
import axios from 'config/posconfig';
import { IFilter } from './types';
import { IProductPayload } from './validation';

export const productApi = {
  create: async (data: IProductPayload,vendor_id: string) => {
    const result = await axios.post(`/vendor/${vendor_id }/product`, data);
    return result?.data;
  },
  getAll: async (filter: IFilter, vendor_id: string) => {
    const result = await axios.get(`/vendor/${vendor_id }/product`, {
      params: { ...filter },
    });
    return result?.data;
  },
  getOne: async (vendor_id: string, product_id: string) => {
    const result = await axios.get(`/vendor/${vendor_id}/product/${product_id}`);
    return result?.data;
  },
  update: async (vendor_id: string,product_id: string,data: unknown) => {
    const result = await axios.put(`/vendor/${vendor_id}/product/${product_id}`, data);
    return result?.data;
  },
  delete: async (vendor_id: string,product_id: string) => {
    const result = await axios.delete(`/vendor/${vendor_id}/product/${product_id}`);
    return result?.data;
  },
}
