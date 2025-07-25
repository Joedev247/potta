import axios from 'config/axios.config';
import { BudgetFilter } from '../hooks/useBudgets';

// Default organization and branch IDs - in a real app, these would come from user context/auth
const DEFAULT_ORGANIZATION_ID = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3c';
const DEFAULT_BRANCH_ID = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3b';

// Default user ID - in a real app, this would come from auth context
const DEFAULT_USER_ID = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3d';

export const budgetsApi = {
  // Get all budgets with pagination and filtering
  getBudgets: async (filter: BudgetFilter) => {
    const queryParams = new URLSearchParams();

    // Add pagination params
    if (filter.page) queryParams.append('page', filter.page.toString());
    if (filter.limit) queryParams.append('limit', filter.limit.toString());

    // Add search param
    if (filter.search) queryParams.append('search', filter.search);

    // Add sorting
    if (filter.sortBy && filter.sortOrder) {
      queryParams.append('sortBy', `${filter.sortBy}:${filter.sortOrder}`);
    }

    // Add status filter if provided
    if (filter.status) {
      queryParams.append('filter', `status:$eq:${filter.status}`);
    }

    const result = await axios.get(`/budgets?${queryParams.toString()}`, {
      headers: {
        organizationId: filter.organizationId || DEFAULT_ORGANIZATION_ID,
        BranchId: filter.branchId || DEFAULT_BRANCH_ID,
      },
    });
    return result.data;
  },

  // Get archived budgets with pagination and filtering
  getArchivedBudgets: async (filter: BudgetFilter) => {
    const queryParams = new URLSearchParams();

    // Add pagination params
    if (filter.page) queryParams.append('page', filter.page.toString());
    if (filter.limit) queryParams.append('limit', filter.limit.toString());

    // Add search param
    if (filter.search) queryParams.append('search', filter.search);

    // Add sorting
    if (filter.sortBy && filter.sortOrder) {
      queryParams.append('sortBy', `${filter.sortBy}:${filter.sortOrder}`);
    }

    const result = await axios.get(
      `/budgets/archived?${queryParams.toString()}`,
      {
        headers: {
          organizationId: filter.organizationId || DEFAULT_ORGANIZATION_ID,
          BranchId: filter.branchId || DEFAULT_BRANCH_ID,
        },
      }
    );
    return result.data;
  },

  // Get a budget by ID
  getBudget: async (budgetId: string, options = {}) => {
    const {
      organizationId = DEFAULT_ORGANIZATION_ID,
      branchId = DEFAULT_BRANCH_ID,
    } = options;
    const result = await axios.get(`/budgets/${budgetId}`);
    return result.data;
  },

  // Create a new budget
  createBudget: async (data: any, options = {}) => {
    const {
      organizationId = DEFAULT_ORGANIZATION_ID,
      branchId = DEFAULT_BRANCH_ID,
    } = options;
    const result = await axios.post('/budgets', data);
    return result.data;
  },

  // Update a budget
  updateBudget: async (budgetId: string, data: any, options = {}) => {
    const {
      organizationId = DEFAULT_ORGANIZATION_ID,
      branchId = DEFAULT_BRANCH_ID,
    } = options;
    const result = await axios.put(`/budgets/${budgetId}`, data);
    return result.data;
  },

  // Approve a budget
  approveBudget: async (budgetId: string, approverId: string, options = {}) => {
    const {
      organizationId = DEFAULT_ORGANIZATION_ID,
      branchId = DEFAULT_BRANCH_ID,
    } = options;

    const result = await axios.post(
      `/budgets/${budgetId}/approve`,
      {
        budgetId,
        approverId,
      },
      {
        headers: {
          organizationId: organizationId,
          BranchId: branchId,
        },
      }
    );
    return result.data;
  },

  // Archive a budget (soft delete)
  archiveBudget: async (budgetId: string, options = {}) => {
    const {
      organizationId = DEFAULT_ORGANIZATION_ID,
      branchId = DEFAULT_BRANCH_ID,
    } = options;
    const result = await axios.delete(`/budgets/${budgetId}`);
    return result.data;
  },

  // Fund a budget
  fundBudget: async (
    budgetId: string,
    fundingData: {
      amount: number;
      cashOrBankAccountId: string;
      budgetFundingEquityAccountId: string;
    },
    options = {}
  ) => {
    const {
      organizationId = DEFAULT_ORGANIZATION_ID,
      branchId = DEFAULT_BRANCH_ID,
    } = options;

    const result = await axios.post(
      `/budgets/${budgetId}/fund`,
      {
        budgetId,
        amount: fundingData.amount,
        cashOrBankAccountId: fundingData.cashOrBankAccountId,
        budgetFundingEquityAccountId: fundingData.budgetFundingEquityAccountId,
      },
      {
        headers: {
          organizationId: organizationId,
          BranchId: branchId,
        },
      }
    );
    return result.data;
  },

  // Get current user ID - in a real app, this would be from auth context
  getCurrentUserId: () => {
    return DEFAULT_USER_ID;
  },
};
