import axios from '@/config/axios.config';

export async function fetchBills() {
  const response = await axios.get('/bills');
  return response.data;
}

export async function createBill(data: any) {
  const response = await axios.post('/bills', data);
  return response.data;
}

export async function approveBill(id: string) {
  const response = await axios.put(`/bills/${id}/approve`);
  return response.data;
}

export async function rejectBill(id: string) {
  const response = await axios.put(`/bills/${id}/reject`);
  return response.data;
}

export async function getBill(id: string) {
  const response = await axios.get(`/bills/${id}`);
  return response.data;
}
