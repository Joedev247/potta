import { CustomerPayload } from './validations';
// import axios from 'config/axios.config';
import axios from 'config/posconfig';
import { CustomerFilter, Customer, CustomerResponse } from './types';
import { AxiosResponse } from 'axios';


export const customerApi = {
  create: async (data: CustomerPayload) => {
    const result = await axios.post(`/customer/create`, data,{
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'orgId': 'jknjk',
        'userId': 'mkkm',
      },
    });
    return result?.data;
  },
  getAll: async (filter: Record<string, any> = {}) => {
    const queryParams = new URLSearchParams(filter).toString();

    const result:CustomerResponse = await axios.post(
      `customer/filter?${queryParams}`
    );
   return result
  },
  getOne: async (customer_id: string) => {
    const result = await axios.get<Customer>(`/customer/details/${customer_id}`);
    return result;
  },
  update: async (customer_id: string,data: unknown) => {
    const result = await axios.put(`/customer/${customer_id}`, data,{
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'orgId': 'jknjk',
        'userId': 'mkkm',
      },
    });
    return result?.data;
  },
  delete: async (customer_id: string) => {
    const result = await axios.delete(`/customer/${customer_id}`);
    return result?.data;
  },
}
