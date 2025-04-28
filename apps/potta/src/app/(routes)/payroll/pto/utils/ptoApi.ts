import axios from 'config/axios.config';
import { PTOPolicyPayload } from './types';

export const ptoApi = {
  // Create a new PTO policy
  createPTOPolicy: async (payload: PTOPolicyPayload) => {
    try {
      const response = await axios.post('/api/paid-time-off', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all PTO policies with pagination and filtering
  getPTOPolicies: async (filters: any = {}) => {
    try {
      const response = await axios.post('/api/paid-time-off/filter', filters);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a specific PTO policy by ID
  getPTOPolicy: async (id: string) => {
    try {
      const response = await axios.get(`/api/paid-time-off/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Accrue leave for a PTO policy
  accrueLeave: async (id: string, amount: number) => {
    try {
      const response = await axios.put(`/api/paid-time-off/accrue/${id}`, { amount });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Request leave for a PTO policy
  requestLeave: async (id: string, days: number, startDate: string, endDate: string, reason: string) => {
    try {
      const response = await axios.put(`/api/paid-time-off/request-leave/${id}`, {
        days,
        startDate,
        endDate,
        reason
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Approve a PTO leave request
  approveLeave: async (requestId: string) => {
    try {
      const response = await axios.put(`/api/paid-time-off/approve-leave/${requestId}`, {});
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reject a PTO leave request
  rejectLeave: async (requestId: string, reason: string) => {
    try {
      const response = await axios.put(`/api/paid-time-off/reject-leave/${requestId}`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};