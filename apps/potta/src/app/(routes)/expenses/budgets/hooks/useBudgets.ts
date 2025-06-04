import { useState, useEffect } from 'react';
import { budgetsApi } from '../utils/api';
import { Budget } from '../utils/types';

export interface BudgetFilter {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  status?: string;
  organizationId?: string;
  branchId?: string;
}

export const useBudgets = (initialFilter: BudgetFilter = {}) => {
  // Default organization and branch IDs - in a real app, these would come from user context/auth
  const DEFAULT_ORGANIZATION_ID = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3c';
  const DEFAULT_BRANCH_ID = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3b';

  // Set default filter values
  const defaultFilter: BudgetFilter = {
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    organizationId: DEFAULT_ORGANIZATION_ID,
    branchId: DEFAULT_BRANCH_ID,
    ...initialFilter,
  };

  const [filter, setFilter] = useState<BudgetFilter>(defaultFilter);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await budgetsApi.getBudgets(filter);
      setBudgets(response.data);
      setMeta(response.meta);
    } catch (err) {
      console.error('Error fetching budgets:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [filter]);

  const updateFilter = (newFilter: Partial<BudgetFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const refetch = () => {
    fetchBudgets();
  };

  return {
    budgets,
    meta,
    loading,
    error,
    filter,
    updateFilter,
    refetch,
  };
};
