'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  CheckCircle,
  Clock,
  Archive,
  AlertCircle,
  Loader2,
  DollarSign,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@potta/components/avatar';
import { budgetsApi } from '../../utils/api';
import { Budget } from '../../utils/types';
import { Button } from '@potta/components/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@potta/components/shadcn/dialog';
import { Input } from '@potta/components/shadcn/input';
import { Label } from '@potta/components/shadcn/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@potta/components/shadcn/select';

const SingleBudget = () => {
  const { id } = useParams();
  const router = useRouter();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [fundingAmount, setFundingAmount] = useState('');
  const [cashAccountId, setCashAccountId] = useState('');
  const [equityAccountId, setEquityAccountId] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  // Mock accounts for demo purposes - in a real app, these would be fetched from API
  const mockCashAccounts = [
    { id: 'cash-account-1', name: 'Main Cash Account' },
    { id: 'cash-account-2', name: 'Petty Cash' },
    { id: 'bank-account-1', name: 'Main Bank Account' },
  ];

  const mockEquityAccounts = [
    { id: 'equity-account-1', name: 'Budget Funding Account' },
    { id: 'equity-account-2', name: 'General Reserves' },
  ];

  useEffect(() => {
    // Get the current user ID - in a real app, this would come from auth context
    // For demo, we'll use the approver ID from the payload
    setCurrentUserId('262406e4-125c-413c-a9ed-160da4d7bf2f'); // John Doe's ID

    const fetchBudget = async () => {
      try {
        setLoading(true);
        const data = await budgetsApi.getBudget(id as string);
        setBudget(data);
      } catch (error) {
        console.error('Error fetching budget:', error);
        toast.error('Failed to load budget details. Please try again.', {
          duration: 4000,
          position: 'top-right',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBudget();
    }
  }, [id]);

  const handleApproveBudget = async () => {
    if (!budget) return;

    try {
      setActionLoading('approve');

      // Use the approver ID from the budget approvers list
      const approverId = budget.approvers?.[0]?.approverId || currentUserId;

      await budgetsApi.approveBudget(budget.uuid, approverId, {
        organizationId: budget.organizationId,
        branchId: budget.branchId,
      });

      toast.success(`Budget "${budget.name}" has been approved successfully.`, {
        duration: 4000,
        position: 'top-right',
      });

      // Refresh the budget data
      const updatedBudget = await budgetsApi.getBudget(id as string);
      setBudget(updatedBudget);
    } catch (error) {
      console.error('Error approving budget:', error);
      toast.error(
        'There was an error approving the budget. Please try again.',
        {
          duration: 4000,
          position: 'top-right',
        }
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchiveBudget = async () => {
    if (!budget) return;

    try {
      setActionLoading('archive');
      await budgetsApi.archiveBudget(budget.uuid, {
        organizationId: budget.organizationId,
        branchId: budget.branchId,
      });

      toast.success(`Budget "${budget.name}" has been archived successfully.`, {
        duration: 4000,
        position: 'top-right',
      });

      // Refresh the budget data
      const updatedBudget = await budgetsApi.getBudget(id as string);
      setBudget(updatedBudget);
    } catch (error) {
      console.error('Error archiving budget:', error);
      toast.error(
        'There was an error archiving the budget. Please try again.',
        {
          duration: 4000,
          position: 'top-right',
        }
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleFundBudget = async () => {
    if (!budget || !fundingAmount || !cashAccountId || !equityAccountId) {
      toast.error('Please fill in all required fields', {
        duration: 4000,
        position: 'top-right',
      });
      return;
    }

    const amount = parseFloat(fundingAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount greater than zero', {
        duration: 4000,
        position: 'top-right',
      });
      return;
    }

    try {
      setActionLoading('fund');
      await budgetsApi.fundBudget(
        budget.uuid,
        {
          amount,
          cashOrBankAccountId: cashAccountId,
          budgetFundingEquityAccountId: equityAccountId,
        },
        {
          organizationId: budget.organizationId,
          branchId: budget.branchId,
        }
      );

      toast.success(
        `Budget "${
          budget.name
        }" has been funded successfully with XAF ${formatCurrency(amount)}.`,
        {
          duration: 4000,
          position: 'top-right',
        }
      );

      // Close the dialog
      setFundDialogOpen(false);

      // Reset form
      setFundingAmount('');
      setCashAccountId('');
      setEquityAccountId('');

      // Refresh the budget data
      const updatedBudget = await budgetsApi.getBudget(id as string);
      setBudget(updatedBudget);
    } catch (error) {
      console.error('Error funding budget:', error);
      toast.error('There was an error funding the budget. Please try again.', {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2">Loading budget details...</span>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-red-500">Budget not found or has been deleted.</p>
      </div>
    );
  }

  // Calculate amounts and percentages
  const totalAmount = parseFloat(budget.totalAmount);
  const availableAmount = parseFloat(budget.availableAmount);
  const accountBalance = budget.budgetedAccount?.currentBalance
    ? parseFloat(budget.budgetedAccount.currentBalance.toString())
    : 0;
  const spentAmount = totalAmount - availableAmount;

  // Calculate progress percentages
  const spentPercent = totalAmount > 0 ? (spentAmount / totalAmount) * 100 : 0;
  const availablePercent =
    totalAmount > 0 ? (availableAmount / totalAmount) * 100 : 0;
  const remainingPercent = Math.max(0, 100 - spentPercent - availablePercent);

  // Get status info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          text: 'Approved',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
        };
      case 'PENDING':
        return {
          icon: <Clock className="h-5 w-5 text-amber-500" />,
          text: 'Pending',
          color: 'text-amber-500',
          bgColor: 'bg-amber-50',
        };
      case 'ARCHIVED':
        return {
          icon: <Archive className="h-5 w-5 text-gray-500" />,
          text: 'Archived',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
        };
      case 'REJECTED':
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          text: 'Rejected',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          text: 'Unknown',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
        };
    }
  };

  const statusInfo = getStatusInfo(budget.status);

  function formatCurrency(amount: number): React.ReactNode {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  function getApproverName(approver: any): string {
    if (approver.approver?.firstName && approver.approver?.lastName) {
      return `${approver.approver.firstName} ${approver.approver.lastName}`;
    }
    return getInitialsFromId(approver.approverId);
  }

  function getInitialsFromId(approverId: string): string {
    // If we have a name, get initials from it
    if (approverId.includes(' ')) {
      const parts = approverId.split(' ');
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    // Split the ID by any non-word characters and take first 2 parts
    const parts = approverId
      .split(/[^a-zA-Z]/)
      .filter((part) => part.length > 0);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    // If we can't get 2 initials, just return first 2 characters of ID
    return approverId.slice(0, 2).toUpperCase();
  }

  // Format recurrence information
  const getRecurrenceInfo = () => {
    if (!budget.recurrenceType || budget.recurrenceType === 'NONE') {
      return 'No recurrence';
    }

    const interval = budget.recurrenceInterval || 1;
    const type = budget.recurrenceType.toLowerCase();
    const endDate = budget.recurrenceEndDate
      ? new Date(budget.recurrenceEndDate).toLocaleDateString()
      : 'No end date';

    return `${type === 'monthly' ? 'Monthly' : 'Weekly'} (every ${interval} ${
      interval === 1 ? type.slice(0, -2) : type
    }) until ${endDate}`;
  };

  // Determine if this is a recurring budget instance
  const isRecurringInstance =
    budget.originalBudgetId && !budget.isRecurringParent;

  // Determine if the budget needs funding (account balance is low)
  const needsFunding = accountBalance < 5000 && budget.status === 'APPROVED';

  return (
    <>
      <div className="flex mb-5 flex-col md:flex-row justify-between gap-6">
        <div className="flex flex-col border py-4 px-4 w-full md:w-2/4">
          <div className="flex justify-between px-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-medium">{budget.name}</h1>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}
                >
                  {statusInfo.icon}
                  <span className="text-sm">{statusInfo.text}</span>
                </div>
              </div>
              {/* <p className="text-xs">
                Budget goal:{' '}
                <span className="font-medium">
                  XAF {formatCurrency(totalAmount)}
                </span>
              </p>
              <p className="text-xs text-gray-500">{budget.description}</p>
              <p className="text-xs text-gray-500">
                Account: {budget.budgetedAccount?.name} (
                {budget.budgetedAccount?.code})
              </p>
              <p className="text-xs text-gray-500">
                Account Balance: XAF {formatCurrency(accountBalance)}
              </p>
              <p className="text-xs text-gray-500">
                Period: {new Date(budget.startDate).toLocaleDateString()} -{' '}
                {new Date(budget.endDate).toLocaleDateString()}
              </p> */}

              {/* Recurrence information */}
              {/* {(budget.recurrenceType !== 'NONE' || isRecurringInstance) && (
                <p className="text-xs text-gray-500">
                  Recurrence: {getRecurrenceInfo()}
                  {isRecurringInstance && ' (recurring instance)'}
                </p>
              )} */}
            </div>
            <div className="flex flex-col gap-2">
              {needsFunding && (
                <Button
                  size="sm"
                  onClick={() => setFundDialogOpen(true)}
                  disabled={actionLoading === 'fund'}
                  className="flex items-center gap-1"
                >
                  {actionLoading === 'fund' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Funding...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4" />
                      Fund Budget
                    </>
                  )}
                </Button>
              )}
              {budget.status === 'PENDING' && (
                <Button
                  size="sm"
                  onClick={handleApproveBudget}
                  disabled={actionLoading === 'approve'}
                >
                  {actionLoading === 'approve' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    'Approve Budget'
                  )}
                </Button>
              )}
              {budget.status !== 'ARCHIVED' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleArchiveBudget}
                  disabled={actionLoading === 'archive'}
                >
                  {actionLoading === 'archive' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Archiving...
                    </>
                  ) : (
                    'Archive Budget'
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200 mt-5">
            {/* Spent Segment (Orange) */}
            <div
              className="h-full bg-orange-400 transition-all duration-300 ease-in-out"
              style={{ width: `${spentPercent}%` }}
            ></div>
            {/* Available Segment (Red) */}
            <div
              className="h-full bg-red-500 transition-all duration-300 ease-in-out"
              style={{ width: `${availablePercent}%` }}
            ></div>
            {/* Remaining/Allocated Segment (Green) */}
            <div
              className="h-full bg-green-500 transition-all duration-300 ease-in-out"
              style={{ width: `${remainingPercent}%` }}
            ></div>
          </div>

          {/* Legend */}
          <div className="flex justify-between px-3 mt-5">
            <div className="flex gap-3 w-1/3">
              <div className="flex w-3 h-3 mt-1.5 bg-orange-400 rounded-full"></div>
              <div className="flex flex-col">
                <p className="font-medium text-balse">Spent</p>
                <p className="text-sm">XAF {formatCurrency(spentAmount)}</p>
              </div>
            </div>
            <div className="flex gap-3 w-1/3">
              <div className="flex w-3 h-3 mt-1.5 bg-green-500 rounded-full"></div>
              <div className="flex flex-col">
                <p className="font-medium text-balse">Allocated</p>
                <p className="text-sm">XAF {formatCurrency(totalAmount)}</p>
              </div>
            </div>
            <div className="flex gap-3 w-1/3">
              <div className="flex w-3 h-3 mt-1.5 bg-red-500 rounded-full"></div>
              <div className="flex flex-col">
                <p className="font-medium text-balse">Available</p>
                <p className="text-sm">XAF {formatCurrency(availableAmount)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 justify-between w-full md:w-2/4">
          {/* Policies section */}
          <div className="flex border flex-col w-full h-full py-2.5 px-6">
            <div className="flex justify-between">
              <h1>Policies</h1>
            </div>
            <div className="flex grow justify-center items-center">
              {budget.policies && budget.policies.length > 0 ? (
                <div className="w-full">
                  {budget.policies.map((policy) => (
                    <div key={policy.uuid} className="py-2 border-b">
                      <p className="font-medium">{policy.name}</p>
                      <p className="text-xs text-gray-500">
                        Status: {policy.status}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No policies attached</p>
              )}
            </div>
          </div>

          {/* Approvers section */}
          <div className="flex border flex-col w-full h-full py-2.5 px-6">
            <div className="flex justify-between">
              <h1>Approvers</h1>
            </div>
            <div className="flex flex-col grow gap-2 mt-2">
              {budget.approvers && budget.approvers.length > 0 ? (
                budget.approvers.map((approver) => (
                  <div key={approver.uuid} className="flex gap-2 items-center">
                    <Avatar className="h-7 w-7">
                      {approver.approver?.profile_url ? (
                        <AvatarImage
                          src={
                            approver.approver.profile_url ||
                            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
                          }
                        />
                      ) : (
                        <AvatarFallback className="text-xs bg-gray-200">
                          {getInitialsFromId(approver.approverId)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="text-sm">{getApproverName(approver)}</p>
                      <p className="text-xs text-gray-500">
                        {approver.approved ? 'Approved' : 'Pending'}
                        {approver.approverId === currentUserId && ' (You)'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No approvers assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fund Budget Dialog */}
      <Dialog open={fundDialogOpen} onOpenChange={setFundDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Fund Budget</DialogTitle>
            <DialogDescription>
              Add funds to the budget "{budget.name}". This will increase the
              available amount.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  XAF
                </span>
                <Input
                  id="amount"
                  type="number"
                  className="pl-12"
                  value={fundingAmount}
                  onChange={(e) => setFundingAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cash-account" className="text-right">
                Cash Account
              </Label>
              <Select value={cashAccountId} onValueChange={setCashAccountId}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select cash or bank account" />
                </SelectTrigger>
                <SelectContent>
                  {mockCashAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="equity-account" className="text-right">
                Equity Account
              </Label>
              <Select
                value={equityAccountId}
                onValueChange={setEquityAccountId}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select equity account" />
                </SelectTrigger>
                <SelectContent>
                  {mockEquityAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFundDialogOpen(false)}
              disabled={actionLoading === 'fund'}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFundBudget}
              disabled={
                actionLoading === 'fund' ||
                !fundingAmount ||
                !cashAccountId ||
                !equityAccountId
              }
            >
              {actionLoading === 'fund' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Funding...
                </>
              ) : (
                'Fund Budget'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SingleBudget;
