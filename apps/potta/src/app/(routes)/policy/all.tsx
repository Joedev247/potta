// components/spend-policy/components/approval-rule-form.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@potta/components/shadcn/button';
import { Input } from '@potta/components/shadcn/input';
import { Label } from '@potta/components/shadcn/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@potta/components/shadcn/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@potta/components/shadcn/popover';
import { Check, X, PlusCircle } from 'lucide-react';
import { Badge } from '@potta/components/shadcn/badge';
import { ScrollArea } from '@potta/components/shadcn/scroll-area';
import * as Yup from 'yup';

import { 
  ExtendedApprovalRule, 
  ExtendedCondition, 
  User,
  FieldType
} from './types/approval-rule';
import { generateId } from './utils/approval-rule-utils';
import { ConditionCard } from './components/condition-card';

interface ApprovalRuleFormProps {
  initialData?: ExtendedApprovalRule;
  onSubmit: (data: ExtendedApprovalRule) => void;
  onCancel: () => void;
  users?: User[];
}

// Define validation schema for the form
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Rule name must be at least 2 characters')
    .required('Rule name is required'),
  conditions: Yup.array()
    .of(
      Yup.object({
        details: Yup.array().test(
          'unique-fields',
          'Fields must be unique within a condition',
          function(details) {
            if (!details || details.length <= 1) return true;
            
            // Filter out empty fields
            const fields = details
              .map(detail => detail.field)
              .filter(field => field !== '');
            
            // Check for duplicates
            const uniqueFields = new Set(fields);
            return fields.length === uniqueFields.size;
          }
        )
      })
    )
    .required('At least one condition is required')
});

export function ApprovalRuleForm({
  initialData,
  onSubmit,
  onCancel,
  users = [],
}: ApprovalRuleFormProps) {
  // Initialize with default values or provided initialData
  const [formData, setFormData] = useState<ExtendedApprovalRule>({
    name: initialData?.name || '',
    conditions: initialData?.conditions || [
      {
        id: generateId('c'),
        details: [
          {
            id: generateId('cd'),
            field: '',
            operator: '',
            value: '',
          },
        ],
        actions: [],
        // Requirements object
        requirements: {
          requireReceipt: false,
          requireMemo: false,
          requireScreenshots: false,
          requireNetSuiteCustomerJob: false,
          requireGpsCoordinates: false,
          businessPurpose: false,
          requireBeforeAfterScreenshots: false,
        }
      },
    ],
    approvers: initialData?.approvers || [],
  });

  // State for validation errors
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    conditions?: string | { [conditionId: string]: string };
  }>({});

  const [approverSearchOpen, setApproverSearchOpen] = useState(false);
  const [approverSearchQuery, setApproverSearchQuery] = useState('');

  // Add a new condition
  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [
        ...formData.conditions,
        {
          id: generateId('c'),
          details: [
            {
              id: generateId('cd'),
              field: '',
              operator: '',
              value: '',
            },
          ],
          actions: [],
          requirements: {
            requireReceipt: false,
            requireMemo: false,
            requireScreenshots: false,
            requireNetSuiteCustomerJob: false,
            requireGpsCoordinates: false,
            businessPurpose: false,
            requireBeforeAfterScreenshots: false,
          }
        },
      ],
    });
  };

  // Remove a condition
  const removeCondition = (conditionId: string) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter(
        (condition) => condition.id !== conditionId
      ),
    });

    // Clear validation error for this condition
    if (typeof validationErrors.conditions === 'object') {
      const newErrors = { ...validationErrors };
      delete (newErrors.conditions as any)[conditionId];
      setValidationErrors(newErrors);
    }
  };

  // Update a condition
  const updateCondition = (updatedCondition: ExtendedCondition) => {
    const newConditions = formData.conditions.map((condition) =>
      condition.id === updatedCondition.id ? updatedCondition : condition
    );
    
    setFormData({
      ...formData,
      conditions: newConditions
    });
    
    // Validate the updated condition for field uniqueness
    validateConditionFields(updatedCondition);
  };

  // Validate that fields in a condition are unique
  const validateConditionFields = (condition: ExtendedCondition) => {
    // Skip validation if there's only one detail
    if (condition.details.length <= 1) {
      // Clear any existing error
      if (typeof validationErrors.conditions === 'object') {
        const newErrors = { ...validationErrors };
        delete (newErrors.conditions as any)[condition.id];
        setValidationErrors(newErrors);
      }
      return;
    }

    // Get non-empty fields
    const fields = condition.details
      .map(detail => detail.field)
      .filter(field => field !== '');

    // Check for duplicates
    const uniqueFields = new Set(fields);
    const hasDuplicates = fields.length !== uniqueFields.size;

    // Update validation errors
    if (hasDuplicates) {
      setValidationErrors(prev => ({
        ...prev,
        conditions: {
          ...(typeof prev.conditions === 'object' ? prev.conditions : {}),
          [condition.id]: 'Fields must be unique within a condition'
        }
      }));
    } else {
      // Clear error if no duplicates
      if (typeof validationErrors.conditions === 'object') {
        const newErrors = { ...validationErrors };
        delete (newErrors.conditions as any)[condition.id];
        setValidationErrors(newErrors);
      }
    }
  };

  // Validate rule name
  const validateName = (name: string) => {
    if (!name || name.length < 2) {
      setValidationErrors(prev => ({
        ...prev,
        name: 'Rule name must be at least 2 characters'
      }));
    } else {
      // Clear error
      const newErrors = { ...validationErrors };
      delete newErrors.name;
      setValidationErrors(newErrors);
    }
  };

  // Handle name change with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData({ ...formData, name: newName });
    validateName(newName);
  };

  // Handle selecting an approver for the approvers list
  const handleSelectApprover = (userId: string) => {
    if (!formData.approvers.includes(userId)) {
      setFormData({
        ...formData,
        approvers: [...formData.approvers, userId],
      });
    }
    setApproverSearchOpen(false);
  };

  // Handle removing an approver from the approvers list
  const handleRemoveApprover = (userId: string) => {
    setFormData({
      ...formData,
      approvers: formData.approvers.filter((id) => id !== userId),
    });
  };

  // Filter users based on search query for approvers
  const filteredUsers = users.filter((user) => {
    const searchLower = approverSearchQuery.toLowerCase();
    return (
      (user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)) &&
      !formData.approvers.includes(user.id)
    );
  });

  // Validate the entire form before submission
  const validateForm = async (): Promise<boolean> => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: { [key: string]: string } = {};
        
        error.inner.forEach(err => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        
        setValidationErrors(errors);
      }
      return false;
    }
  };

  // Handle form submission with validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (isValid && isFormValid()) {
      onSubmit(formData);
    }
  };

  // Check if individual fields are valid
    // Check if individual fields are valid
    const isFormValid = () => {
      // Debugging for validation errors
      if (Object.keys(validationErrors).length > 0) {
        console.log('Validation errors exist:', validationErrors);
        return false;
      }
      
      // Check each condition separately
      let allValid = true;
      formData.conditions.forEach((condition, index) => {
        // Check details in each condition
        const detailsValid = condition.details.every(
          (detail) => 
            detail.field !== '' && 
            detail.operator !== '' && 
            (detail.value !== '' || (Array.isArray(detail.value) && detail.value.length > 0))
        );
        
        // Check actions in each condition
        const hasActions = condition.actions.length > 0;
        
        // Check that every action has users assigned
        const actionsHaveUsers = condition.actions.every(action => action.userIds.length > 0);
        
        if (!detailsValid) {
          console.log(`Condition ${index} details not valid`, condition.details);
          allValid = false;
        }
        
        if (!hasActions) {
          console.log(`Condition ${index} has no actions`);
          allValid = false;
        }
        
        if (!actionsHaveUsers) {
          console.log(`Condition ${index} has actions with no users assigned`);
          allValid = false;
        }
      });
      
      const nameValid = formData.name.trim() !== '' && formData.name.length >= 2;
      if (!nameValid) {
        console.log('Rule name not valid');
        allValid = false;
      }
  
      console.log('Form validity:', allValid);
      return allValid && formData.name.trim() !== '' && formData.name.length >= 2;
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Rule Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Enter rule name"
            className={validationErrors.name ? "border-red-500" : ""}
            required
          />
          {validationErrors.name && (
            <p className="text-sm text-red-500 mt-1">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Conditions & Actions</Label>
          </div>

          {formData.conditions.map((condition, index) => (
            <div key={condition.id}>
              <ConditionCard
                condition={condition}
                index={index}
                users={users}
                canRemove={formData.conditions.length > 1}
                onRemove={() => removeCondition(condition.id)}
                onUpdate={updateCondition}
              />
              {typeof validationErrors.conditions === 'object' && 
               (validationErrors.conditions as any)[condition.id] && (
                <p className="text-sm text-red-500 mt-1">
                  {(validationErrors.conditions as any)[condition.id]}
                </p>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCondition}
            className="flex items-center mt-4"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Condition
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isFormValid()}>
          Save Rule
        </Button>
      </div>
    </form>
  );
}