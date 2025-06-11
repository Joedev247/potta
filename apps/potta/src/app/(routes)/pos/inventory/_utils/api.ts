import axios from 'config/axios.config';
import { isAxiosError } from 'axios';
import { Filter, ProductResponse } from './types';
import { ProductPayload } from './validation';

export const productApi = {
  create: async (data: ProductPayload) => {
    const result = await axios.post(`/product`, data);
    return result?.data;
  },

  getAll: async (filter: Filter) => {
    const result = await axios.get(`/product`, {
      params: { ...filter },
    });
    console.log(result.data);
    return result.data;
  },
  getOne: async (product_id: string) => {
    const result = await axios.get(`/product/${product_id}`);
    return result.data;
  },
  update: async (product_id: string, data: unknown) => {
    const result = await axios.put(`/product/${product_id}`, data);
    return result?.data;
  },
  delete: async (product_id: string) => {
    const result = await axios.delete(`/product/${product_id}`);
    return result?.data;
  },
  restock: async (data: {
    productId: string;
    quantity: number;
    userId: string;
  }) => {
    const { productId: product_id, ...payload } = data;
    const result = await axios.put(`/product/${product_id}/restock`, payload);
    return result?.data;
  },
  uploadImage: async (file: File) => {
    try {
      // Create a simple FormData object with the file
      const formData = new FormData();
      formData.append('file', file);

      // Send the request without setting any headers
      const result = await axios.post('/files', formData);

      return result?.data;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  },
};
