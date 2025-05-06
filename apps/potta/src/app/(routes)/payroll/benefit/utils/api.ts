import axios from 'config/axios.config';
import { BenefitPayload, FilterParams } from './types';

export const benefitsApi = {
  // Create a new benefit
  createBenefit: async (data: BenefitPayload) => {
    const result = await axios.post('/api/potta/benefits/create', data);
    return result.data;
  },

  // Get filtered list of benefits with pagination
  filterBenefits: async (filter: FilterParams) => {
    const result = await axios.post('/api/potta/benefits/filter', filter);
    return result.data;
  },

  // Get a benefit by ID
  getBenefit: async (benefitId: string) => {
    const result = await axios.get(`/api/potta/benefits/${benefitId}`);
    return result.data;
  },

  // Update a benefit
  updateBenefit: async (benefitId: string, data: Partial<BenefitPayload>) => {
    const result = await axios.put(`/api/potta/benefits/${benefitId}`, data);
    return result.data;
  },

  // Check if a benefit is expired
  isBenefitExpired: async (benefitId: string) => {
    const result = await axios.get(`/api/potta/benefits/${benefitId}/expired`);
    return result.data;
  },
};
