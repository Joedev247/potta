// components/spend-policy/approval-rule-form/FieldError.tsx
import React from 'react';
import { cn } from "@potta/lib/utils"; // Assuming you have this utility

const FieldError: React.FC<{ message?: string; className?: string }> = ({ message, className }) => {
  if (!message) return null;
  return <p className={cn('text-xs text-red-500 mt-1', className)}>{message}</p>;
};

export default FieldError;