'use client';
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Input from '../../../../components/input';
import Select from '../../../../components/select';
import CurrencyInput from '../../../../components/currencyInput';
import Button from '../../../../components/button';
import SearchableSelect, {
  Option,
} from '../../../../components/searchableSelect';
import { CalendarIcon, Info } from 'lucide-react';
import { DateInput } from '../../../../components/customDatePicker';
import { CalendarDate } from '@internationalized/date';
import { useCreateBudget } from '../../expenses/budgets/hooks/useCreateBudget';
import { useAccountingAccounts } from '../../expenses/budgets/hooks/useAccountingAccounts';
import axios from '@/config/axios.config';

interface Role {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role?: {
    id: string;
    name: string;
  };
}

interface CreateBudgetModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSave: (budgetData: {
    name: string;
    description?: string;
    goal: string;
    recurrence: string;
    approvalRequirement: string;
    atLeastCount?: number;
    startDate?: string;
    endDate?: string;
    approvers: string[];
    budgetedAccountId?: string;
  }) => void;
}

const CreateBudgetModal: React.FC<CreateBudgetModalProps> = ({
  open,
  setOpen,
  onSave,
}) => {
  const [budgetName, setBudgetName] = useState('');
  const [budgetDescription, setBudgetDescription] = useState('');
  const [budgetGoal, setBudgetGoal] = useState('');
  const [budgetRecurrence, setBudgetRecurrence] = useState('MONTHLY');
  const [approvalRequirement, setApprovalRequirement] = useState('ONE');
  const [atLeastCount, setAtLeastCount] = useState<number>(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Control actual visibility
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedApprovers, setSelectedApprovers] = useState<string>('');
  const [selectedApproversList, setSelectedApproversList] = useState<string[]>(
    []
  );
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  );
  const [budgetedAccountId, setBudgetedAccountId] = useState<string>('');

  // Form errors
  const [errors, setErrors] = useState<{
    name?: string;
    goal?: string;
    atLeastCount?: string;
    approvers?: string;
    startDate?: string;
    endDate?: string;
    budgetedAccountId?: string;
  }>({});

  // Use our custom hooks
  const {
    createBudget,
    loading: createBudgetLoading,
    error: createBudgetError,
  } = useCreateBudget();
  const {
    accounts,
    loading: accountsLoading,
    error: accountsError,
    updateFilter: updateAccountFilter,
  } = useAccountingAccounts({
    type: 'Expense', // Default to expense accounts for budgeting
    limit: 100,
  });

  // Fetch roles
  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await axios.post('/roles/filter', {
        page: 1,
        limit: 100,
        sortBy: ['name:ASC'],
      });
      return response.data.data || [];
    },
  });

  // Fetch employees based on selected role
  const {
    data: employeesData,
    isLoading: employeesLoading,
    error: employeesError,
  } = useQuery({
    queryKey: ['employees', selectedRoleId],
    queryFn: async () => {
      const params: any = {
        limit: 100,
        sortBy: ['firstName:ASC'],
      };

      // Add role filter if a role is selected
      if (selectedRoleId) {
        params.filters = {
          roleId: selectedRoleId,
        };
      }

      const response = await axios.post('/employees/filter', params);
      return response.data.data || [];
    },
    enabled: isVisible, // Only fetch when modal is visible
  });

  // Handle animation when modal opens or closes
  useEffect(() => {
    if (open) {
      // First make the component visible
      setIsVisible(true);
      // Then trigger the animation after a small delay to ensure the initial state is rendered
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Start the closing animation
      setIsAnimating(false);
      // Delay the actual hiding to allow animation to complete
      setTimeout(() => {
        setIsVisible(false);
      }, 300); // Match this with the CSS transition duration
      // Allow body to scroll when modal is closed
      document.body.style.overflow = 'auto';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  // Update selectedApproversList when an approver is selected
  useEffect(() => {
    if (selectedApprovers) {
      // If it's not already in the list, add it
      if (!selectedApproversList.includes(selectedApprovers)) {
        setSelectedApproversList([...selectedApproversList, selectedApprovers]);
        // Clear the selection after adding to list
        setSelectedApprovers('');
      }
    }
  }, [selectedApprovers]);

  // Validate approvers count when approval requirement changes
  useEffect(() => {
    if (
      approvalRequirement === 'AT_LEAST' &&
      selectedApproversList.length < atLeastCount
    ) {
      setErrors((prev) => ({
        ...prev,
        approvers: `At least ${atLeastCount} approvers required`,
      }));
    } else {
      // Clear approvers error if requirement is met
      if (errors.approvers) {
        setErrors((prev) => ({
          ...prev,
          approvers: undefined,
        }));
      }
    }
  }, [approvalRequirement, atLeastCount, selectedApproversList.length]);

  const handleClose = () => {
    // Just set open to false, the useEffect will handle the animation
    setOpen(false);
  };

  const validateForm = () => {
    const newErrors: {
      name?: string;
      goal?: string;
      atLeastCount?: string;
      approvers?: string;
      startDate?: string;
      endDate?: string;
      budgetedAccountId?: string;
    } = {};

    // Validate budget name
    if (!budgetName.trim()) {
      newErrors.name = 'Budget name is required';
    }

    // Validate budget goal
    if (!budgetGoal) {
      newErrors.goal = 'Budget goal is required';
    }

    // Validate approvers based on approval requirement
    if (selectedApproversList.length === 0) {
      newErrors.approvers = 'At least one approver is required';
    } else if (
      approvalRequirement === 'AT_LEAST' &&
      selectedApproversList.length < atLeastCount
    ) {
      newErrors.approvers = `At least ${atLeastCount} approvers required`;
    }

    // Validate at least count if applicable
    if (approvalRequirement === 'AT_LEAST') {
      if (!atLeastCount || atLeastCount < 1) {
        newErrors.atLeastCount = 'Please enter a valid number of approvers';
      }
    }

    // Validate that end date is after start date
    if (endDate <= startDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    // Validate budgeted account ID
    if (!budgetedAccountId) {
      newErrors.budgetedAccountId = 'Budgeted account is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Format the budget goal as a number
    const numericGoal = parseFloat(budgetGoal.replace(/[^0-9.]/g, ''));

    try {
      // Use the createBudget hook to create the budget
      await createBudget({
        name: budgetName,
        description: budgetDescription,
        totalAmount: numericGoal,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        approvalRequirement: approvalRequirement.toLowerCase() as any,
        requiredApprovals:
          approvalRequirement === 'AT_LEAST' ? atLeastCount : undefined,
        budgetedAccountId: budgetedAccountId,
        recurrenceType: budgetRecurrence,
        approvers: selectedApproversList,
      });

      // Call the onSave callback for backward compatibility
      onSave({
        name: budgetName,
        description: budgetDescription,
        goal: numericGoal.toString(),
        recurrence: budgetRecurrence,
        approvalRequirement,
        ...(approvalRequirement === 'AT_LEAST' && { atLeastCount }),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        approvers: selectedApproversList,
        budgetedAccountId,
      });

      // Reset form
      setBudgetName('');
      setBudgetDescription('');
      setBudgetGoal('');
      setBudgetRecurrence('MONTHLY');
      setApprovalRequirement('ONE');
      setAtLeastCount(2);
      setSelectedRoleId('');
      setSelectedApprovers('');
      setSelectedApproversList([]);
      setBudgetedAccountId('');
      setErrors({});

      // Close modal with animation
      handleClose();
    } catch (err) {
      console.error('Error creating budget:', err);
      // Handle error - you could set a form-level error here if needed
    }
  };

  // Function to remove an approver from the list
  const removeApprover = (approverId: string) => {
    setSelectedApproversList(
      selectedApproversList.filter((id) => id !== approverId)
    );
  };

  // Prepare role options for the select component
  const roleOptions = React.useMemo(() => {
    if (!rolesData) return [];

    return [
      { value: '', label: 'All Roles' },
      ...rolesData.map((role: Role) => ({
        value: role.id,
        label: role.name,
      })),
    ];
  }, [rolesData]);

  // Prepare employee options for the searchable select component
  const employeeOptions = React.useMemo(() => {
    if (!employeesData) return [];

    return employeesData.map((employee: Employee) => ({
      value: employee.id,
      label: `${employee.firstName} ${employee.lastName}${
        employee.role ? ` (${employee.role.name})` : ''
      }`,
    }));
  }, [employeesData]);

  // Prepare account options for the searchable select component
  const accountOptions = React.useMemo(() => {
    if (!accounts) return [];

    return accounts.map((account) => ({
      value: account.uuid,
      label: `${account.name} (${account.code})`,
    }));
  }, [accounts]);

  // Function to search accounts
  const handleAccountSearch = (searchTerm: string) => {
    if (searchTerm.length > 2) {
      updateAccountFilter({ search: searchTerm });
    }
  };

  // Get employee names for the selected approvers
  const getEmployeeName = (id: string) => {
    const employee = employeesData?.find((emp: Employee) => emp.id === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : id;
  };

  // Get approval requirement help text
  const getApprovalHelpText = () => {
    switch (approvalRequirement) {
      case 'ONE':
        return 'Any one of the selected approvers can approve this budget';
      case 'AT_LEAST':
        return `At least ${atLeastCount} of the selected approvers must approve this budget`;
      case 'ALL':
        return 'All selected approvers must approve this budget';
      default:
        return '';
    }
  };

  const recurrenceOptions = [
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'QUARTERLY', label: 'Quarterly' },
    { value: 'ANNUALLY', label: 'Yearly' },
  ];

  const approvalOptions = [
    { value: 'ONE', label: 'One Approver' },
    { value: 'AT_LEAST', label: 'At Least' },
    { value: 'ALL', label: 'All Approvers' },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      ></div>

      {/* Modal Container */}
      <div
        className={`fixed inset-0 bg-white transition-transform duration-300 ease-in-out transform ${
          isAnimating ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            Create New Budget
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div
          className="p-6 space-y-6 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 140px)' }}
        >
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="w-full">
              <label className="mb-3 text-gray-900 font-medium block">
                Budget Name
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="budgetName"
                placeholder="Enter budget name"
                value={budgetName}
                onchange={(e) => {
                  setBudgetName(e.target.value);
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
                required
                errors={errors.name ? { message: errors.name } : undefined}
              />
            </div>

            <div className="w-full">
              <label className="mb-3 text-gray-900 font-medium block">
                Description
              </label>
              <Input
                type="text"
                name="budgetDescription"
                placeholder="Enter budget description"
                value={budgetDescription}
                onchange={(e) => setBudgetDescription(e.target.value)}
              />
            </div>

            <div className="w-full">
              <label className="mb-3 text-gray-900 font-medium block">
                Budget Goal
                <span className="text-red-500">*</span>
              </label>
              <CurrencyInput
                value={budgetGoal}
                onChange={(e) => {
                  setBudgetGoal(e.target.value);
                  if (errors.goal) {
                    setErrors({ ...errors, goal: undefined });
                  }
                }}
                placeholder="Enter budget amount"
                required
                error={errors.goal || null}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full">
                <label className="mb-3 text-gray-900 font-medium block">
                  Start Date
                  <span className="text-red-500">*</span>
                </label>
                <DateInput
                  name="start-date"
                  placeholder="Select start date"
                  value={startDate}
                  onChange={(date) => {
                    if (date) {
                      setStartDate(date);
                      if (errors.startDate || errors.endDate) {
                        setErrors({
                          ...errors,
                          startDate: undefined,
                          endDate: undefined,
                        });
                      }
                    }
                  }}
                  required
                  className="w-full"
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="mb-3 text-gray-900 font-medium block">
                  End Date
                  <span className="text-red-500">*</span>
                </label>
                <DateInput
                  name="end-date"
                  placeholder="Select end date"
                  value={endDate}
                  onChange={(date) => {
                    if (date) {
                      setEndDate(date);
                      if (errors.endDate) {
                        setErrors({ ...errors, endDate: undefined });
                      }
                    }
                  }}
                  required
                  className="w-full"
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="w-full">
              <label className="mb-3 text-gray-900 font-medium block">
                Recurrence
                <span className="text-red-500">*</span>
              </label>
              <Select
                options={recurrenceOptions}
                selectedValue={budgetRecurrence}
                onChange={(value: string) => setBudgetRecurrence(value)}
                bg="bg-white border border-gray-200"
                name="Select recurrence"
              />
            </div>

            <div className="w-full">
              <label className="mb-3 text-gray-900 font-medium block">
                Approval Requirement
                <span className="text-red-500">*</span>
              </label>
              <Select
                options={approvalOptions}
                selectedValue={approvalRequirement}
                onChange={(value: string) => {
                  setApprovalRequirement(value);
                  // Clear at least count error if we're not using at least anymore
                  if (value !== 'AT_LEAST' && errors.atLeastCount) {
                    setErrors({ ...errors, atLeastCount: undefined });
                  }
                }}
                bg="bg-white border border-gray-200"
                name="Select approval requirement"
              />
              <p className="mt-1 text-sm text-gray-500 flex items-center">
                <Info className="w-4 h-4 mr-1" />
                {getApprovalHelpText()}
              </p>
            </div>

            {approvalRequirement === 'AT_LEAST' && (
              <div className="w-full">
                <label className="mb-3 text-gray-900 font-medium block">
                  Minimum Approvers
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="atLeastCount"
                  placeholder="Enter minimum number of approvers"
                  value={atLeastCount.toString()}
                  onchange={(e) => {
                    const newValue = parseInt(e.target.value) || 0;
                    setAtLeastCount(newValue);

                    // Update approvers error based on new value
                    if (newValue > selectedApproversList.length) {
                      setErrors({
                        ...errors,
                        atLeastCount: undefined,
                        approvers: `At least ${newValue} approvers required`,
                      });
                    } else {
                      setErrors({
                        ...errors,
                        atLeastCount: undefined,
                        approvers: undefined,
                      });
                    }
                  }}
                  min={1}
                  required
                  errors={
                    errors.atLeastCount
                      ? { message: errors.atLeastCount }
                      : undefined
                  }
                />
              </div>
            )}

            <div className="w-full">
              <label className="mb-3 text-gray-900 font-medium block">
                Filter by Role
              </label>
              <SearchableSelect
                options={roleOptions}
                selectedValue={selectedRoleId}
                onChange={(value: string) => setSelectedRoleId(value)}
                // bg="bg-white border border-gray-200"
                name="Select role"
                isLoading={rolesLoading}
              />
            </div>

            <div className="w-full">
              <label className="mb-3 text-gray-900 font-medium block">
                Add Approvers
                <span className="text-red-500">*</span>
                {approvalRequirement === 'AT_LEAST' && (
                  <span className="text-sm font-normal ml-2 text-gray-500">
                    (Minimum {atLeastCount} required)
                  </span>
                )}
              </label>
              <SearchableSelect
                options={employeeOptions}
                selectedValue={selectedApprovers}
                onChange={(value: string) => {
                  setSelectedApprovers(value);
                }}
                placeholder="Select an approver"
                isLoading={employeesLoading}
                className="w-full"
                error={errors.approvers}
              />

              {/* Display selected approvers */}
              <div className="mt-4">
                <label className="mb-2 text-gray-900 font-medium block">
                  Selected Approvers:
                  <span className="text-sm font-normal ml-2 text-gray-500">
                    {selectedApproversList.length} selected
                  </span>
                </label>
                {selectedApproversList.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedApproversList.map((approverId) => (
                      <div
                        key={approverId}
                        className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-2"
                      >
                        <span>{getEmployeeName(approverId)}</span>
                        <button
                          type="button"
                          onClick={() => removeApprover(approverId)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No approvers selected</p>
                )}
              </div>
            </div>

            <div className="w-full">
              <label className="mb-3 text-gray-900 font-medium block">
                Budgeted Account
                <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={accountOptions}
                selectedValue={budgetedAccountId}
                onChange={(value: string) => {
                  setBudgetedAccountId(value);
                  if (errors.budgetedAccountId) {
                    setErrors({ ...errors, budgetedAccountId: undefined });
                  }
                }}
                onSearch={handleAccountSearch}
                placeholder="Search for an account"
                isLoading={accountsLoading}
                className="w-full"
                error={errors.budgetedAccountId}
              />
              {accountsError && (
                <p className="mt-1 text-sm text-red-500">
                  Error loading accounts. Please try again.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200 flex justify-end space-x-3">
          <Button
            height={true}
            text={createBudgetLoading ? 'Saving...' : 'Save'}
            type="button"
            onClick={handleSave}
            disabled={createBudgetLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateBudgetModal;
