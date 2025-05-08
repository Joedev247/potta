// components/spend-policy/components/condition-card.tsx
import React from 'react';
import { Button } from '@potta/components/shadcn/button';
import { Label } from '@potta/components/shadcn/label';
import { Checkbox } from '@potta/components/shadcn/checkbox';

import { Card, CardContent, CardHeader, CardTitle } from '@potta/components/shadcn/card';
import { X, PlusCircle } from 'lucide-react';

import { 
  ExtendedCondition, 
  ConditionDetail, 
  ConditionAction, 
  ApproverActionType, 
  ApprovalMode, 
  User 
} from '../types/approval-rule';
import { generateId } from '../utils/approval-rule-utils';
import { ConditionDetailComponent } from './condition-detail';
import { ActionItem } from './action-item';
import { Separator } from '@potta/components/shadcn/seperator';

interface ConditionCardProps {
  condition: ExtendedCondition;
  index: number;
  users: User[];
  canRemove: boolean;
  onRemove: () => void;
  onUpdate: (updatedCondition: ExtendedCondition) => void;
}

export const ConditionCard: React.FC<ConditionCardProps> = ({
  condition,
  index,
  users,
  canRemove,
  onRemove,
  onUpdate
}) => {
  // State for user selection in actions
  const [actionUserSelectionState, setActionUserSelectionState] = React.useState<{
    actionId: string;
    isOpen: boolean;
    searchQuery: string;
  }>({
    actionId: '',
    isOpen: false,
    searchQuery: '',
  });

  // Add a new condition detail
  const addConditionDetail = () => {
    const updatedCondition = {
      ...condition,
      details: [
        ...condition.details,
        {
          id: generateId('cd'),
          field: '',
          operator: '',
          value: ''
        }
      ]
    };
    onUpdate(updatedCondition);
  };

  // Remove a condition detail
  const removeConditionDetail = (detailId: string) => {
    // Don't allow removing the last detail
    if (condition.details.length <= 1) {
      return;
    }
    
    const updatedCondition = {
      ...condition,
      details: condition.details.filter(detail => detail.id !== detailId)
    };
    onUpdate(updatedCondition);
  };

  // Update a condition detail
  const updateConditionDetail = (detailId: string, field: keyof ConditionDetail, value: any) => {
    const updatedCondition = {
      ...condition,
      details: condition.details.map(detail => {
        if (detail.id === detailId) {
          return {
            ...detail,
            [field]: value
          };
        }
        return detail;
      })
    };
    onUpdate(updatedCondition);
  };

  // Add a new action
  const addAction = (actionType: ApproverActionType) => {
    const updatedCondition = {
      ...condition,
      actions: [
        ...condition.actions,
        {
          id: generateId('action'),
          type: actionType,
          mode: actionType === ApproverActionType.APPROVAL ? ApprovalMode.ALL : ApprovalMode.ALL,
          userIds: []
        }
      ]
    };
    onUpdate(updatedCondition);
  };

  // Remove an action
  const removeAction = (actionId: string) => {
    const updatedCondition = {
      ...condition,
      actions: condition.actions.filter(action => action.id !== actionId)
    };
    onUpdate(updatedCondition);
  };

  // Update action mode
  const updateActionMode = (actionId: string, mode: ApprovalMode) => {
    const updatedCondition = {
      ...condition,
      actions: condition.actions.map(action => {
        if (action.id === actionId) {
          return {
            ...action,
            mode
          };
        }
        return action;
      })
    };
    onUpdate(updatedCondition);
  };

  // Open user selection for an action
  const openActionUserSelection = (actionId: string) => {
    setActionUserSelectionState({
      actionId,
      isOpen: true,
      searchQuery: ''
    });
  };

  // Add user to action
  const addUserToAction = (actionId: string, userId: string) => {
    const updatedCondition = {
      ...condition,
      actions: condition.actions.map(action => {
        if (action.id === actionId && !action.userIds.includes(userId)) {
          return {
            ...action,
            userIds: [...action.userIds, userId]
          };
        }
        return action;
      })
    };
    onUpdate(updatedCondition);
    setActionUserSelectionState({
      ...actionUserSelectionState,
      isOpen: false
    });
  };

  // Remove user from action
  const removeUserFromAction = (actionId: string, userId: string) => {
    const updatedCondition = {
      ...condition,
      actions: condition.actions.map(action => {
        if (action.id === actionId) {
          return {
            ...action,
            userIds: action.userIds.filter(id => id !== userId)
          };
        }
        return action;
      })
    };
    onUpdate(updatedCondition);
  };

  // Update requirement checkbox
  const updateRequirement = (field: string, checked: boolean) => {
    // Create or update the requirements object
    const requirements = {
        requireReceipt: false,
        requireMemo: false,
        requireScreenshots: false,
        requireNetSuiteCustomerJob: false,
        requireGpsCoordinates: false,
        businessPurpose: false,
        requireBeforeAfterScreenshots: false,
        ...(condition.requirements || {}),
        [field]: checked
      };
      
      const updatedCondition = {
        ...condition,
        requirements
      };
      onUpdate(updatedCondition);
    };

  // Get requirement value from requirements object or direct property
  const getRequirementValue = (field: string): boolean => {
    if (condition.requirements && condition.requirements[field] !== undefined) {
      return !!condition.requirements[field];
    }
    // Fall back to direct property for backward compatibility
    return !!condition[field as keyof ExtendedCondition];
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex justify-between">
          <span>Condition {index + 1}</span>
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Condition Details Section */}
        <div className="space-y-2">          
          {condition.details.map((detail) => (
            <ConditionDetailComponent
              key={detail.id}
              detail={detail}
              canRemove={condition.details.length > 1}
              onUpdate={(field, value) => updateConditionDetail(detail.id, field, value)}
              onRemove={() => removeConditionDetail(detail.id)}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addConditionDetail}
          className="flex items-center"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Detail
        </Button>
        
        <Separator />
        
        {/* Actions Section */}
        <div className="space-y-4">
          <Label>Actions</Label>
          {condition.actions.length === 0 && (
            <div className="text-sm text-muted-foreground">No actions added yet</div>
          )}
          
          {condition.actions.map((action) => (
            <ActionItem
              key={action.id}
              action={action}
              users={users}
              onRemove={() => removeAction(action.id)}
              onUpdateMode={(mode) => updateActionMode(action.id, mode)}
              onAddUser={(userId) => addUserToAction(action.id, userId)}
              onRemoveUser={(userId) => removeUserFromAction(action.id, userId)}
              isUserSelectionOpen={
                actionUserSelectionState.isOpen && 
                actionUserSelectionState.actionId === action.id
              }
              onUserSelectionOpenChange={(isOpen) => {
                if (isOpen) {
                  openActionUserSelection(action.id);
                } else {
                  setActionUserSelectionState({
                    ...actionUserSelectionState,
                    isOpen: false
                  });
                }
              }}
              userSearchQuery={actionUserSelectionState.searchQuery}
              onUserSearchQueryChange={(query) => setActionUserSelectionState({
                ...actionUserSelectionState,
                searchQuery: query
              })}
            />
          ))}

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => addAction(ApproverActionType.APPROVAL)}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Approval
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => addAction(ApproverActionType.NOTIFICATION)}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Notification
            </Button>
          </div>
        </div>

        <Separator />
        
        {/* Requirements Section */}
        <div className="space-y-2">
          <Label>Requirements</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`requireReceipt-${condition.id}`} 
                checked={getRequirementValue('requireReceipt')}
                onCheckedChange={(checked) => updateRequirement('requireReceipt', !!checked)}
              />
              <Label htmlFor={`requireReceipt-${condition.id}`}>Require Receipt</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`requireMemo-${condition.id}`} 
                checked={getRequirementValue('requireMemo')}
                onCheckedChange={(checked) => updateRequirement('requireMemo', !!checked)}
              />
              <Label htmlFor={`requireMemo-${condition.id}`}>Require Memo</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`requireScreenshots-${condition.id}`} 
                checked={getRequirementValue('requireScreenshots')}
                onCheckedChange={(checked) => updateRequirement('requireScreenshots', !!checked)}
              />
              <Label htmlFor={`requireScreenshots-${condition.id}`}>Require Screenshots</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`requireNetSuiteCustomerJob-${condition.id}`} 
                checked={getRequirementValue('requireNetSuiteCustomerJob')}
                onCheckedChange={(checked) => updateRequirement('requireNetSuiteCustomerJob', !!checked)}
              />
              <Label htmlFor={`requireNetSuiteCustomerJob-${condition.id}`}>Require NetSuite Customer Job</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`requireGpsCoordinates-${condition.id}`} 
                checked={getRequirementValue('requireGpsCoordinates')}
                onCheckedChange={(checked) => updateRequirement('requireGpsCoordinates', !!checked)}
              />
              <Label htmlFor={`requireGpsCoordinates-${condition.id}`}>Require GPS Coordinates</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`businessPurpose-${condition.id}`} 
                checked={getRequirementValue('businessPurpose')}
                onCheckedChange={(checked) => updateRequirement('businessPurpose', !!checked)}
              />
              <Label htmlFor={`businessPurpose-${condition.id}`}>Business Purpose</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`requireBeforeAfterScreenshots-${condition.id}`} 
                checked={getRequirementValue('requireBeforeAfterScreenshots')}
                onCheckedChange={(checked) => updateRequirement('requireBeforeAfterScreenshots', !!checked)}
              />
              <Label htmlFor={`requireBeforeAfterScreenshots-${condition.id}`}>Require Before/After Screenshots</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};