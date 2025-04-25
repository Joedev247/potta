import axios from 'config/axios.config';
import {
  PersonPayload,
  BaseInfoPayload,
  AddressPayload,
  CompensationPayload,
  SchedulePayload,
  DepositeAccountPayload,
  BenefitPayload,
  TaxInfoPayload,
  FilterParams,
  BankAccountPayload,
} from './types';

export const peopleApi = {
  // Create a new person
  createPerson: async (data: PersonPayload) => {
    const result = await axios.post('/api/persons', data);
    return result.data;
  },

  // Get filtered list of persons with pagination
  filterPersons: async (filter: FilterParams) => {
    const result = await axios.post('/api/persons/filter', filter);
    return result.data;
  },

  // Get a person by ID
  getPerson: async (personId: string) => {
    const result = await axios.get(`/api/persons/${personId}`);
    return result.data;
  },

  // Update a person
  updatePerson: async (personId: string, data: Partial<PersonPayload>) => {
    const result = await axios.put(`/api/persons/${personId}`, data);
    return result.data;
  },

  // Delete a person
  deletePerson: async (personId: string) => {
    const result = await axios.delete(`/api/persons/${personId}`);
    return result.data;
  },

  // Get person's pay schedule from a given date
  getPaySchedule: async (personId: string, date?: string) => {
    const params = date ? { date } : {};
    const result = await axios.get(`/api/persons/${personId}/pay-schedule`, {
      params,
    });
    return result.data;
  },

  // Check if pay schedule is due today
  isPayScheduleDueToday: async (personId: string) => {
    const result = await axios.get(
      `/api/persons/${personId}/pay-schedule/due-today`
    );
    return result.data;
  },

  // Get pay schedule description
  getPayScheduleDescription: async (personId: string) => {
    const result = await axios.get(
      `/api/persons/${personId}/pay-schedule/description`
    );
    return result.data;
  },

  // Get full name of the person
  getFullName: async (personId: string) => {
    const result = await axios.get(`/api/persons/${personId}/full-name`);
    return result.data;
  },

  // Check if the person is currently employed
  getEmploymentStatus: async (personId: string) => {
    const result = await axios.get(
      `/api/persons/${personId}/employment-status`
    );
    return result.data;
  },

  // Get compensation type of the person
  getCompensationType: async (personId: string) => {
    const result = await axios.get(
      `/api/persons/${personId}/compensation-type`
    );
    return result.data;
  },

  // Deactivate the person
  deactivatePerson: async (personId: string) => {
    const result = await axios.put(`/api/persons/${personId}/deactivate`, {});
    return result.data;
  },

  createBankAccount: async (data: BankAccountPayload) => {
    const personId = data.person_id;
    console.log(`Creating bank account for person ${personId}:`, data);
    const result = await axios.post(`/api/persons/${personId}/create-bank-account`, data);
    return result.data;
  },

  // List all bank accounts for a person
  getBankAccounts: async (personId: string) => {
    const result = await axios.post('/api/bank-accounts/filter', {
      person_id: personId,
    });
    return result.data;
  },

  // Get a bank account by ID
  getBankAccount: async (accountId: string) => {
    const result = await axios.get(`/api/bank-accounts/${accountId}`);
    return result.data;
  },

  // Set a primary bank account for a person
  setPrimaryBankAccount: async (accountId: string, personId: string) => {
    const result = await axios.patch(
      `/api/bank-accounts/${accountId}/set-primary/${personId}`
    );
    return result.data;
  },
};
