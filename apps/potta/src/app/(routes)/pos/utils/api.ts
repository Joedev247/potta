// import axios from 'config/axios.config';
import axios from 'config/axios.config';
import { Filter, ProductResponse } from './types';
import { SalesReceiptPayload } from './validation';

export const posApi = {
  create: async (data: SalesReceiptPayload) => {
    const result = await axios.post(`/sales-receipt/create`, data);
    return result;
  },
  getAll: async (filter: Filter) => {
    const result = await axios.get(`/vendor/6099ee5e-7f6d-4d5c-a804-1e186f517a09/products`, {
      params: { ...filter },
    });
    return result.data
  },
}
