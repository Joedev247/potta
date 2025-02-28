import { VendorPayload } from './validations';
// import axios from 'config/axios.config';
import axios from 'config/posconfig';
import { VendorFilter, Vendor, VendorResponse } from './types';


export const vendorApi = {
  create: async (data: VendorPayload) => {
    const result = await axios.post(`/vendor/create`, data,{
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

    const response = await axios.post(
      `vendor/filter?${queryParams}`
    );
    console.log(response)
   return response// Assuming backend returns { vendors: [], total: number }
  },
  getOne: async (vendor_id: string) => {
    const result = await axios.get<Vendor>(`/vendor/details/${vendor_id}`);
    return result;
  },
  update: async (vendor_id: string,data: unknown) => {
    const result = await axios.put(`/vendor/${vendor_id}`, data,{
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'orgId': 'jknjk',
        'userId': 'mkkm',
      },
    });
    return result?.data;
  },
  delete: async (vendor_id: string) => {
    const result = await axios.delete(`/vendor/${vendor_id}`);
    return result?.data;
  },
}
