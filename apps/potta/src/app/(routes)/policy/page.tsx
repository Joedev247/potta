// pages/spend-policy/create-rule.tsx
'use client';
import React from 'react';
import { ApprovalRuleForm } from './all';
import { ExtendedApprovalRule, User } from './types/approval-rule';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Mock users data for demonstration
const mockUsers: User[] = [
  { id: 'user1', name: 'John Doe', email: 'john.doe@example.com' },
  { id: 'user2', name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: 'user3', name: 'Robert Johnson', email: 'robert.johnson@example.com' },
  { id: 'user4', name: 'Emily Davis', email: 'emily.davis@example.com' },
  { id: 'user5', name: 'Michael Wilson', email: 'michael.wilson@example.com' },
];

export default function CreateRulePage() {
  const handleSubmit = async (data: ExtendedApprovalRule) => {
    try {
      // Call API to save the rule
      console.log('Submitting rule:', data);
      // Navigate to rules list or show success message
      alert('Rule saved successfully!');
      // In a real app, you would use a router to navigate
      // router.push('/spend-policy/rules');
    } catch (error) {
      console.error('Error saving rule:', error);
      // Show error message
      alert('Error saving rule. Please try again.');
    }
  };

  const handleCancel = () => {
    // Navigate back to rules list
    // In a real app, you would use a router to navigate
    // router.push('/spend-policy/rules');
    console.log('Cancelled');
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      // Redirect or handle cancellation
      alert('Cancelled');
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Create Approval Rule</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <ApprovalRuleForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel} 
            users={mockUsers} 
          />
        </div>
      </div>
    </QueryClientProvider>
  );
}
