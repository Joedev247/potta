// src/components/BudgetCard.tsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@potta/components/card';
import { Progress } from '@potta/components/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@potta/components/avatar';
import { cn } from '@potta/lib/utils'; // Standard shadcn/ui utility
import { Budget, User } from '../utils/types';
import {
  EllipsisVertical,
  CheckCircle,
  Clock,
  Archive,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@potta/components/shadcn/dropdown';
import { budgetsApi } from '../utils/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface BudgetCardProps {
  budget: Budget;
  maxAvatars?: number; // Max avatars to show before showing count
  onBudgetUpdated?: () => void; // Callback to refresh the budgets list
}

// Helper function for currency formatting
export const formatCurrency = (
  amount: string | number,
  currencyCode: string = 'XAF'
) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);
};

// Helper function to get initials from approver ID (in a real app, you'd fetch user details)
const getInitialsFromId = (id: string): string => {
  // Just use the first two characters of the ID for demo purposes
  return id.substring(0, 2).toUpperCase();
};

// Helper to get name from approver if available
const getNameFromApprover = (approver: any): string => {
  if (approver?.approver?.firstName && approver?.approver?.lastName) {
    return `${approver.approver.firstName} ${approver.approver.lastName}`;
  }
  return getInitialsFromId(approver.approverId);
};

// Helper to get initials from name
const getInitialsFromName = (name: string): string => {
  const nameParts = name.split(' ');
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Helper to convert approvers to user objects for avatar display
const approversToUsers = (budget: Budget): User[] => {
  if (!budget.approvers || !Array.isArray(budget.approvers)) {
    return [];
  }

  return budget.approvers.map((approver) => {
    const name = approver.approver
      ? `${approver.approver.firstName || ''} ${
          approver.approver.lastName || ''
        }`.trim()
      : getInitialsFromId(approver.approverId);

    return {
      id: approver.approverId,
      name: name,
      initials: getInitialsFromName(name),
      imageUrl: approver.approver?.profile_url || null,
    };
  });
};

// Helper to get status badge info
const getStatusInfo = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return {
        icon: <CheckCircle className="h-4 w-4" />,
        text: 'Approved',
        className: 'bg-green-100 text-green-700',
      };
    case 'PENDING':
      return {
        icon: <Clock className="h-4 w-4" />,
        text: 'Pending',
        className: 'bg-amber-100 text-amber-700',
      };
    case 'ARCHIVED':
      return {
        icon: <Archive className="h-4 w-4" />,
        text: 'Archived',
        className: 'bg-gray-100 text-gray-700',
      };
    case 'REJECTED':
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        text: 'Rejected',
        className: 'bg-red-100 text-red-700',
      };
    default:
      return {
        icon: <Clock className="h-4 w-4" />,
        text: status,
        className: 'bg-gray-100 text-gray-700',
      };
  }
};

export function BudgetCard({
  budget,
  maxAvatars = 2,
  onBudgetUpdated,
}: BudgetCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Convert API budget to the format needed for display
  const totalAmount = parseFloat(budget.totalAmount);
  const availableAmount = parseFloat(budget.availableAmount);
  const spentAmount = totalAmount - availableAmount;

  // For display purposes, we'll treat:
  // - totalAmount as budgetGoal
  // - spentAmount as spent
  // - availableAmount as available
  // - totalAmount as allocated (since that's the total allocation)

  const users = approversToUsers(budget);
  const visibleUsers = users.slice(0, maxAvatars);
  const hiddenUsersCount = Math.max(0, users.length - visibleUsers.length);

  const statusInfo = getStatusInfo(budget.status);

  // --- Calculate percentages for the multi-segment bar ---
  // Base the percentages on the totalAmount as the total (100%)
  const totalForBar = totalAmount;

  let spentPercent = 0;
  let availablePercent = 0;
  let remainingPercent = 0; // The green part

  if (totalForBar > 0) {
    spentPercent = (spentAmount / totalForBar) * 100;
    availablePercent = (availableAmount / totalForBar) * 100;

    // Calculate the remainder (green segment)
    // Ensure it doesn't go below zero if spent + available exceeds allocated
    remainingPercent = Math.max(0, 100 - spentPercent - availablePercent);
  }
  // --- End percentage calculation ---

  // Handle approve budget action
  const handleApproveBudget = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsLoading('approve');
      await budgetsApi.approveBudget(budget.uuid, {
        organizationId: budget.organizationId,
        branchId: budget.branchId,
      });

      // Success toast
      toast.success(`Budget "${budget.name}" has been approved successfully.`, {
        duration: 4000,
        position: 'top-right',
      });

      // Refresh the budgets list
      if (onBudgetUpdated) {
        onBudgetUpdated();
      }
    } catch (error) {
      console.error('Error approving budget:', error);

      // Error toast
      toast.error(
        'There was an error approving the budget. Please try again.',
        {
          duration: 4000,
          position: 'top-right',
        }
      );
    } finally {
      setIsLoading(null);
    }
  };

  // Handle archive budget action
  const handleArchiveBudget = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsLoading('archive');
      await budgetsApi.archiveBudget(budget.uuid, {
        organizationId: budget.organizationId,
        branchId: budget.branchId,
      });

      // Success toast
      toast.success(`Budget "${budget.name}" has been archived successfully.`, {
        duration: 4000,
        position: 'top-right',
      });

      // Refresh the budgets list
      if (onBudgetUpdated) {
        onBudgetUpdated();
      }
    } catch (error) {
      console.error('Error archiving budget:', error);

      // Error toast
      toast.error(
        'There was an error archiving the budget. Please try again.',
        {
          duration: 4000,
          position: 'top-right',
        }
      );
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Link href={`/expenses/budgets/${budget.uuid}`}>
      <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <CardHeader className="pb-6">
          <div className="flex justify-between items-start gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg font-semibold">
                  {budget.name}
                </CardTitle>
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${statusInfo.className}`}
                >
                  {statusInfo.icon}
                  <span>{statusInfo.text}</span>
                </div>
              </div>
              <p className="text-gray-500">
                Budget goal: XAF {formatCurrency(budget.totalAmount)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {budget.budgetedAccount?.name} ({budget.budgetedAccount?.code})
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center -space-x-2">
                {/* Avatar rendering */}
                {visibleUsers.map((user) => (
                  <Avatar
                    key={user.id}
                    className="h-7 w-7 border-2 border-white"
                  >
                    {user.imageUrl && (
                      <AvatarImage src={user.imageUrl} alt={user.initials} />
                    )}
                    <AvatarFallback className="text-xs">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {hiddenUsersCount > 0 && (
                  <div className="h-7 w-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-medium border-2 border-white ">
                    +{hiddenUsersCount}
                  </div>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="focus:outline-none"
                  onClick={(e) => e.preventDefault()}
                >
                  <EllipsisVertical className="cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/expenses/budgets/${budget.uuid}`);
                    }}
                  >
                    View Details
                  </DropdownMenuItem>
                  {budget.status === 'PENDING' && (
                    <DropdownMenuItem
                      disabled={isLoading === 'approve'}
                      onClick={handleApproveBudget}
                    >
                      {isLoading === 'approve' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        'Approve'
                      )}
                    </DropdownMenuItem>
                  )}
                  {budget.status !== 'ARCHIVED' && (
                    <DropdownMenuItem
                      disabled={isLoading === 'archive'}
                      onClick={handleArchiveBudget}
                    >
                      {isLoading === 'archive' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Archiving...
                        </>
                      ) : (
                        'Archive'
                      )}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* --- Custom Multi-Segment Progress Bar --- */}
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200">
            {/* Spent Segment (Orange) */}
            <div
              className="h-full bg-orange-400 transition-all duration-300 ease-in-out"
              style={{ width: `${spentPercent}%` }}
              title={`Spent: XAF ${formatCurrency(
                spentAmount
              )} (${spentPercent.toFixed(1)}%)`}
            ></div>
            {/* Available Segment (Red) */}
            <div
              className="h-full bg-red-500 transition-all duration-300 ease-in-out"
              style={{ width: `${availablePercent}%` }}
              title={`Available: XAF ${formatCurrency(
                availableAmount
              )} (${availablePercent.toFixed(1)}%)`}
            ></div>
            {/* Remaining/Allocated Segment (Green) */}
            <div
              className="h-full bg-green-500 transition-all duration-300 ease-in-out"
              style={{ width: `${remainingPercent}%` }}
              title={`Remaining Allocated: (${remainingPercent.toFixed(1)}%)`}
            ></div>
          </div>
          {/* --- End Custom Progress Bar --- */}

          {/* Legend */}
          <div className="mt-6 flex justify-between items-center text-sm">
            <div className="flex flex-col items-start">
              <div className="flex items-center mb-1">
                <span className="h-2 w-2 bg-orange-400 rounded-full mr-1.5"></span>
                <span className="text-gray-600">Spent</span>
              </div>
              <span className="font-medium text-gray-800">
                XAF {formatCurrency(spentAmount)}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center mb-1">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span>
                <span className="text-gray-600">Allocated</span>
              </div>
              <span className="font-medium text-gray-800">
                XAF {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center mb-1">
                <span className="h-2 w-2 bg-red-500 rounded-full mr-1.5"></span>
                <span className="text-gray-600">Available</span>
              </div>
              <span className="font-medium text-gray-800">
                XAF {formatCurrency(availableAmount)}
              </span>
            </div>
          </div>

          {/* Period display */}
          <div className="mt-4 text-xs text-gray-500">
            Period: {new Date(budget.startDate).toLocaleDateString()} -{' '}
            {new Date(budget.endDate).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
