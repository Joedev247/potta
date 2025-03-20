// import axios from 'config/axios.config';
import axios from 'config/axios.config';
import { Filter, SalesReceiptListResponse } from './types';
import { SalesReceiptPayload } from './validation';

export const salesApi = {
  create: async (data: SalesReceiptPayload) => {
    const result = await axios.post(`/sales-receipt/create`, data);
    return result?.data;
  },
  getAll: async (filter: Filter) => {
    const result:SalesReceiptListResponse = await axios.post(`/sales-receipt/filter`, {
      params: { ...filter },
    });
    return result
  },
  getOne: async ( receipt_id: string) => {
    const result = await axios.get(`/sales-receipt/details/${receipt_id}`);
    return result;
  },

  delete: async (receipt_id: string) => {
    const result = await axios.delete(`/sales-receipt/${receipt_id}`);
    return result?.data;
  },
 
}
