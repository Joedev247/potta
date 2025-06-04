import { useState } from 'react';
import { budgetsApi } from '../utils/api';
import { Budget, ApprovalRequirement, RecurrenceType } from '../utils/types';

interface CreateBudgetData {
  name: string;
  description?: string;
  totalAmount: number;
  startDate: string;
  endDate: string;
  approvalRequirement: ApprovalRequirement;
  requiredApprovals?: number;
  budgetedAccountId: string;
  recurrenceType: RecurrenceType;
  recurrenceInterval?: string;
  recurrenceEndDate?: string;
  approvers: string[];
  policies?: {
    name: string;
    documentUrl?: string;
    type?: string;
  }[];
  organizationId?: string;
  branchId?: string;
}

export const useCreateBudget = () => {
  // Default organization and branch IDs - in a real app, these would come from user context/auth
  const DEFAULT_ORGANIZATION_ID = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3c';
  const DEFAULT_BRANCH_ID = 'f7b1b3b0-0b1b-4b3b-8b1b-0b1b3b0b1b3b';

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [createdBudget, setCreatedBudget] = useState<Budget | null>(null);

  const createBudget = async (budgetData: CreateBudgetData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare the data with defaults if needed
      const data = {
        ...budgetData,
        organizationId: budgetData.organizationId || DEFAULT_ORGANIZATION_ID,
        branchId: budgetData.branchId || DEFAULT_BRANCH_ID,
        // Set required approvals based on approval requirement
        requiredApprovals: 
          budgetData.approvalRequirement === 'at_least' 
            ? budgetData.requiredApprovals || 2 
            : budgetData.approvalRequirement === 'all' 
              ? budgetData.approvers.length 
              : 1,
      };

      const result = await budgetsApi.createBudget(data, {
        organizationId: data.organizationId,
        branchId: data.branchId,
      });
      
      setCreatedBudget(result);
      return result;
    } catch (err) {
      console.error('Error creating budget:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBudget,
    loading,
    error,
    createdBudget,
  };
};