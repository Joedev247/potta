import axios from 'config/axios.config';
import { ICustomerFilters } from './types';

export const customerApi = {
  getAll: async (filter: ICustomerFilters) => {
    const result = await axios.post(`/customer/filter`, {}, { params: filter });
    return result?.data;
  },
};
