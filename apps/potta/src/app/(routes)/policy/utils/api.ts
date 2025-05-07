import axios from 'config/axios.config';
import { ApprovalRulePayload, } from './types';

export const PoliciesApi = {
  create: async (data: ApprovalRulePayload ) => {
    const result = await axios.post(`/policies/create`, data);
    return result?.data;
  },
  getAll: async (filter: any) => {
    const data = {}
    const result = await axios.post('/policies/filter',data, {
      params: { ...filter },
    });
    return result?.data;
  },
  getOne: async (policies_id: string) => {
    const result = await axios.get(`/policies/details/${policies_id}`);
    return result?.data;
  },

  update: async (policies_id: string, data: unknown) => {
    const result = await axios.put(`/policies/${policies_id}`, data);
    return result?.data;
  },
  delete: async (policies_id: string) => {
    const result = await axios.delete(`/policies/${policies_id}`);
    return result?.data;
  },
  
  SearchAllEmployees: async (employeeName: string): Promise<unknown> => {
    const result = await axios.get(`/employees/search/?name=${employeeName}`);
    return result?.data;
  },
};
