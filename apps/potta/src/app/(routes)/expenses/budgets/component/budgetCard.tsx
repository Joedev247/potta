// src/components/BudgetCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@potta/components/card';
import { Progress } from '@potta/components/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@potta/components/avatar';
// Adjust path if needed
import { cn } from '@potta/lib/utils'; // Standard shadcn/ui utility
import { Budget } from '../new/types/budget';
interface BudgetCardProps {
  budget: Budget;
  maxAvatars?: number; // Max avatars to show before showing count
}

// Helper function for currency formatting (keep as before)
const formatCurrency = (amount: number, currencyCode: string = 'XAF') => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function BudgetCard({ budget, maxAvatars = 2 }: BudgetCardProps) {
  const {
    title,
    budgetGoal,
    spent,
    allocated,
    available,
    users,
    currency = 'XAF',
  } = budget;

  const visibleUsers = users.slice(0, maxAvatars);
  const hiddenUsersCount = users.length - visibleUsers.length;

  // --- Calculate percentages for the multi-segment bar ---
  // Base the percentages on the 'allocated' amount as the total (100%)
  const totalForBar = allocated; // Typically, allocated or budgetGoal is the 100% mark

  let spentPercent = 0;
  let availablePercent = 0;
  let remainingPercent = 0; // The green part

  if (totalForBar > 0) {
    spentPercent = (spent / totalForBar) * 100;
    availablePercent = (available / totalForBar) * 100;

    // Calculate the remainder (green segment)
    // Ensure it doesn't go below zero if spent + available exceeds allocated
    remainingPercent = Math.max(0, 100 - spentPercent - availablePercent);

    // Optional: Cap percentages if they somehow exceed 100% total,
    // although the Math.max above handles the remainder calculation safely.
    // You might adjust spent/available if their sum exceeds 100.
    // For simplicity here, we assume data is logical (spent+available <= allocated usually).
  }
  // --- End percentage calculation ---

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-6">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-lg font-semibold mb-1">
              {title}
            </CardTitle>
            <p className=" text-gray-500">
              Budget goal: {currency} {formatCurrency(budgetGoal)}
            </p>
          </div>
          <div className="flex items-center -space-x-2">
            {/* Avatar rendering (keep as before) */}
            {visibleUsers.map((user) => (
              <Avatar key={user.id} className="h-7 w-7 border-2 border-white">
                <AvatarImage src={user.imageUrl} alt={user.initials} />
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
        </div>
      </CardHeader>
      <CardContent>
        {/* --- Custom Multi-Segment Progress Bar --- */}
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200">
          {' '}
          {/* Container/Track */}
          {/* Spent Segment (Orange) */}
          <div
            className="h-full bg-orange-400 transition-all duration-300 ease-in-out"
            style={{ width: `${spentPercent}%` }}
            title={`Spent: ${formatCurrency(
              spent,
              currency
            )} (${spentPercent.toFixed(1)}%)`} // Optional tooltip
          ></div>
          {/* Available Segment (Red) */}
          <div
            className="h-full bg-red-500 transition-all duration-300 ease-in-out"
            style={{ width: `${availablePercent}%` }}
            title={`Available: ${formatCurrency(
              available,
              currency
            )} (${availablePercent.toFixed(1)}%)`} // Optional tooltip
          ></div>
          {/* Remaining/Allocated Segment (Green) - Represents the part of 'Allocated' not Spent or Available */}
          <div
            className="h-full bg-green-500 transition-all duration-300 ease-in-out"
            style={{ width: `${remainingPercent}%` }}
            title={`Remaining Allocated: (${remainingPercent.toFixed(1)}%)`} // Optional tooltip
          ></div>
        </div>
        {/* --- End Custom Progress Bar --- */}

        {/* Legend (keep as before) */}
        <div className="mt-6 flex justify-between  items-center text-sm">
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-1">
              <span className="h-2 w-2 bg-orange-400 rounded-full mr-1.5"></span>
              <span className="text-gray-600">Spent</span>
            </div>
            <span className="font-medium text-gray-800">
              {currency} {formatCurrency(spent)}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-1">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span>
              {/* Note: Legend says "Allocated", but the green *segment* visually represents the remainder */}
              <span className="text-gray-600">Allocated</span>
            </div>
            <span className="font-medium text-gray-800">
              {currency} {formatCurrency(allocated)}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center mb-1">
              <span className="h-2 w-2 bg-red-500 rounded-full mr-1.5"></span>
              <span className="text-gray-600">Available</span>
            </div>
            <span className="font-medium text-gray-800">
              {currency} {formatCurrency(available)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
