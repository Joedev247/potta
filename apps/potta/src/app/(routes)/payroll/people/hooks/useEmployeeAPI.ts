import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { peopleApi } from '../utils/api';
import { FilterParams, PersonPayload } from '../utils/types';
import { Employee } from '../components/EmployeeTable';

export const useEmployeeAPI = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isFetching, setIsFetching] = useState(true); // Start with loading state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchEmployees = useCallback(async () => {
    setIsFetching(true);
    try {
      const filterParams: FilterParams = {
        page: currentPage,
        pageSize: pageSize,
        isActive: true,
        sortBy: 'firstName',
        sortDirection: 'asc',
      };

      const response = await peopleApi.filterPersons(filterParams);

      if (response && response.data) {
        setEmployees(response.data);

        if (response.meta) {
          setTotalPages(response.meta.totalPages);
          setCurrentPage(response.meta.currentPage);
        }
      } else {
        console.error('Unexpected response format:', response);
        toast.error('Failed to parse employee data');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setIsFetching(false);
    }
  }, [currentPage, pageSize]);

  const deleteEmployee = useCallback(
    async (id: string) => {
      try {
        await peopleApi.deletePerson(id);
        toast.success('Employee deleted successfully');
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
      }
    },
    [fetchEmployees]
  );

  const createPerson = useCallback(async (payload: PersonPayload) => {
    const loadingToastId = toast.loading('Creating employee...');
    try {
      console.log('Sending payload to create person:', payload);
      const result = await peopleApi.createPerson(payload);
      console.log('Person created successfully:', result);
      toast.success('Employee created successfully!');
      return result.uuid;
    } catch (error) {
      console.error('Error creating person:', error);
      toast.error('Failed to create employee. Please try again.');
      return null;
    } finally {
      toast.dismiss(loadingToastId);
    }
  }, []);

  const updatePerson = useCallback(
    async (personId: string, payload: PersonPayload) => {
      const loadingToastId = toast.loading('Updating employee...');
      try {
        console.log('Sending payload to update person:', payload);
        await peopleApi.updatePerson(personId, payload);
        toast.success('Employee updated successfully!');
        return true;
      } catch (error) {
        console.error('Error updating person:', error);
        toast.error('Failed to update employee. Please try again.');
        return false;
      } finally {
        toast.dismiss(loadingToastId);
      }
    },
    []
  );

  const getPersonData = useCallback(async (personId: string) => {
    if (!personId) return null;

    try {
      const data = await peopleApi.getPerson(personId);
      console.log('Fetched person data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching person data:', error);
      toast.error('Failed to load employee data');
      return null;
    }
  }, []);

  const getBankAccounts = useCallback(async (personId: string) => {
    try {
      console.log('Fetching bank accounts for person:', personId);
      const bankAccountsResponse = await peopleApi.getBankAccounts(personId);
      console.log('Fetched bank accounts:', bankAccountsResponse);
      return bankAccountsResponse.data || bankAccountsResponse;
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      throw error;
    }
  }, []);

  // Bank account creation is now handled within the main employee payload
  // No separate API call needed

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    employees,
    isFetching,
    currentPage,
    totalPages,
    pageSize,
    fetchEmployees,
    deleteEmployee,
    createPerson,
    updatePerson,
    getPersonData,
    getBankAccounts,
    handlePageChange,
    setPageSize,
  };
};
