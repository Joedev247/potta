// components/spend-policy/components/condition-detail.tsx
import React, { useEffect } from 'react';
import { Button } from '@potta/components/shadcn/button';
import { Input } from '@potta/components/shadcn/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@potta/components/shadcn/select';
import { X, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { FieldType, ConditionDetail } from '../types/approval-rule';
import { formatFieldValue, getFieldDisplayName } from '../utils/approval-rule-utils';

interface ConditionDetailProps {
  detail: ConditionDetail;
  canRemove: boolean;
  onUpdate: (field: keyof ConditionDetail, value: any) => void;
  onRemove: () => void;
}

// Define all available operators
export const OPERATORS = {
  IS: 'is',
  EQUALS: 'equals',
  NOT_EQUALS: 'does not equal',
  LESS_THAN: 'less than',
  GREATER_THAN: 'greater than',
  LESS_THAN_OR_EQUAL: 'less than or equal',
  GREATER_THAN_OR_EQUAL: 'greater than or equal',
  CONTAINS: 'contains',
  IS_ONE_OF: 'is one of',
  IS_NOT_ONE_OF: 'is not one of',
  STARTS_WITH: 'starts_with',
  ENDS_WITH: 'ends with'
};

// API functions for fetching data
const fetchVendors = async (): Promise<Array<{ id: string; name: string }>> => {
  const response = await fetch('/api/vendors');
  if (!response.ok) throw new Error('Failed to fetch vendors');
  return response.json();
};

const fetchCustomers = async (): Promise<Array<{ id: string; name: string }>> => {
  const response = await fetch('/api/customers');
  if (!response.ok) throw new Error('Failed to fetch customers');
  return response.json();
};

const fetchInventoryItems = async (): Promise<Array<{ id: string; name: string }>> => {
  const response = await fetch('/api/inventory-items');
  if (!response.ok) throw new Error('Failed to fetch inventory items');
  return response.json();
};

const fetchBranches = async (): Promise<Array<{ id: string; name: string }>> => {
  const response = await fetch('/api/branches');
  if (!response.ok) throw new Error('Failed to fetch branches');
  return response.json();
};

// Define which operators are valid for each field type
const getValidOperatorsForField = (field: string): string[] => {
  switch (field) {
    case FieldType.AMOUNT:
      // Numerical fields
      return [
        OPERATORS.EQUALS,
        OPERATORS.NOT_EQUALS,
        OPERATORS.LESS_THAN,
        OPERATORS.GREATER_THAN,
        OPERATORS.LESS_THAN_OR_EQUAL,
        OPERATORS.GREATER_THAN_OR_EQUAL,
      ];
      
    case FieldType.MATCHED_TO_PURCHASE_ORDER:
      // Boolean fields
      return [
        OPERATORS.IS,
        OPERATORS.EQUALS,
        OPERATORS.NOT_EQUALS,
      ];
      
    case FieldType.VENDOR:
    case FieldType.CUSTOMER:
    case FieldType.INVENTORY_ITEM:
    case FieldType.LOCATION_BRANCH:
    case FieldType.EXPENSE_CATEGORY:
    case FieldType.DEPARTMENT:
      // Entity selection fields
      return [
        OPERATORS.IS,
        OPERATORS.EQUALS,
        OPERATORS.NOT_EQUALS,
        OPERATORS.IS_ONE_OF,
        OPERATORS.IS_NOT_ONE_OF,
      ];
      
    case FieldType.PAYMENT_TYPE:
      // Categorical fields
      return [
        OPERATORS.IS,
        OPERATORS.EQUALS,
        OPERATORS.NOT_EQUALS,
        OPERATORS.IS_ONE_OF,
        OPERATORS.IS_NOT_ONE_OF,
      ];
      
    default:
      // Default to text field operators
      return [
        OPERATORS.EQUALS,
        OPERATORS.NOT_EQUALS,
        OPERATORS.CONTAINS,
        OPERATORS.STARTS_WITH,
        OPERATORS.ENDS_WITH,
      ];
  }
};

export const ConditionDetailComponent: React.FC<ConditionDetailProps> = ({ 
  detail, 
  canRemove, 
  onUpdate, 
  onRemove 
}) => {
  // React Query hooks for fetching data
  const { data: vendors, isLoading: isLoadingVendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: fetchVendors,
    enabled: detail.field === FieldType.VENDOR
  });

  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
    enabled: detail.field === FieldType.CUSTOMER
  });

  const { data: inventoryItems, isLoading: isLoadingInventoryItems } = useQuery({
    queryKey: ['inventoryItems'],
    queryFn: fetchInventoryItems,
    enabled: detail.field === FieldType.INVENTORY_ITEM
  });

  const { data: branches, isLoading: isLoadingBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
    enabled: detail.field === FieldType.LOCATION_BRANCH
  });

  // Get valid operators for current field
  const validOperators = getValidOperatorsForField(detail.field);

  // Reset operator when field changes if the current operator isn't valid for the new field
  useEffect(() => {
    if (detail.field && detail.operator && !validOperators.includes(detail.operator)) {
      // Set to first valid operator if current is invalid
      onUpdate('operator', validOperators[0] || '');
      // Reset value as well since the type might change
      onUpdate('value', '');
    }
  }, [detail.field, validOperators, detail.operator, onUpdate]);

  // Determine if we're loading data based on the selected field
  const isLoading = 
    (detail.field === FieldType.VENDOR && isLoadingVendors) ||
    (detail.field === FieldType.CUSTOMER && isLoadingCustomers) ||
    (detail.field === FieldType.INVENTORY_ITEM && isLoadingInventoryItems) ||
    (detail.field === FieldType.LOCATION_BRANCH && isLoadingBranches);

  // Handle field change
  const handleFieldChange = (value: string) => {
    onUpdate('field', value);
  };

  // Render value input based on field type
  const renderValueInput = () => {
    switch (detail.field) {
      case FieldType.VENDOR:
        return (
          <Select
            value={String(detail.value)}
            onValueChange={(value) => onUpdate('value', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <SelectValue placeholder="Select vendor" />
              )}
            </SelectTrigger>
            <SelectContent>
              {vendors?.map(vendor => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case FieldType.CUSTOMER:
        return (
          <Select
            value={String(detail.value)}
            onValueChange={(value) => onUpdate('value', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <SelectValue placeholder="Select customer" />
              )}
            </SelectTrigger>
            <SelectContent>
              {customers?.map(customer => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case FieldType.INVENTORY_ITEM:
        return (
          <Select
            value={String(detail.value)}
            onValueChange={(value) => onUpdate('value', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <SelectValue placeholder="Select inventory item" />
              )}
            </SelectTrigger>
            <SelectContent>
              {inventoryItems?.map(item => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case FieldType.LOCATION_BRANCH:
        return (
          <Select
            value={String(detail.value)}
            onValueChange={(value) => onUpdate('value', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <SelectValue placeholder="Select branch" />
              )}
            </SelectTrigger>
            <SelectContent>
              {branches?.map(branch => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case FieldType.MATCHED_TO_PURCHASE_ORDER:
        return (
          <Select
            value={String(detail.value)}
            onValueChange={(value) => onUpdate('value', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        );
      
      default:
        // Different value input based on operator type
        if ([OPERATORS.IS_ONE_OF, OPERATORS.IS_NOT_ONE_OF].includes(detail.operator)) {
          // For multi-select operators, we should have a comma-separated input
          return (
            <Input
              placeholder="Comma separated values"
              value={formatFieldValue(detail.value)}
              onChange={(e) => {
                // Split by comma and trim whitespace
                const values = e.target.value.split(',').map(v => v.trim());
                onUpdate('value', values);
              }}
            />
          );
        } else {
          return (
            <Input
              placeholder="Value"
              value={formatFieldValue(detail.value)}
              onChange={(e) => onUpdate('value', e.target.value)}
            />
          );
        }
    }
  };

  return (
    <div className="border rounded-md p-3 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Condition Detail</span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Select
          value={detail.field}
          onValueChange={handleFieldChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Field" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(FieldType).map(field => (
              <SelectItem key={field} value={field}>
                {getFieldDisplayName(field)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={detail.operator}
          onValueChange={(value) => onUpdate('operator', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Operator" />
          </SelectTrigger>
          <SelectContent>
            {validOperators.map(operator => (
              <SelectItem key={operator} value={operator}>
                {operator.charAt(0).toUpperCase() + operator.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {renderValueInput()}
      </div>
    </div>
  );
};