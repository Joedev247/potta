import axios from 'config/axios.config';
import { Benefit, Deduction, BenefitPayload } from './types';

export const benefitApi = {
  // Get all benefits with pagination
  getBenefits: async (params = {}) => {
    const result = await axios.post('/api/potta/benefits/filter', {
      page: 1,
      limit: 50,
      sortBy: 'createdAt:DESC',
      ...params,
    });
    return result.data;
  },

  // Get a specific benefit by ID
  getBenefit: async (benefitId: string) => {
    const result = await axios.get(`/api/potta/benefits/${benefitId}`);
    return result.data;
  },

  // Check if a benefit is expired
  isBenefitExpired: async (benefitId: string) => {
    const result = await axios.get(`/api/potta/benefits/${benefitId}/expired`);
    return result.data;
  },

  // Save employee benefits
  saveEmployeeBenefits: async (personId: string, data: BenefitPayload) => {
    const result = await axios.put(
      `/api/potta/people/${personId}/benefits`,
      data
    );
    return result.data;
  },

  // Get employee benefits
  getEmployeeBenefits: async (personId: string) => {
    const result = await axios.get(`/api/potta/people/${personId}/benefits`);
    return result.data;
  },
};
