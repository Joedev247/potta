import axios from '@/config/axios.config';
import { SpendProgram, FormQuestion, PreSpendControls } from '../utils/types';

export async function getSpendPrograms(): Promise<SpendProgram[]> {
  const res = await axios.get('/spend-programs');
  return res.data;
}

export interface CreateSpendProgramPayload {
  type: 'procurement' | 'card';
  name: string;
  description: string;
  form: FormQuestion[];
  preSpendControls: PreSpendControls;
}

export async function createSpendProgram(
  payload: CreateSpendProgramPayload
): Promise<SpendProgram> {
  const res = await axios.post('/spend-programs', payload);
  return res.data;
}
