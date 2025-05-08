// components/spend-policy/components/action-item.tsx
import React from 'react';
import { Button } from '@potta/components/shadcn/button';
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
import { RadioGroup, RadioGroupItem } from '@potta/components/shadcn/radio-group';
import { Check, X } from 'lucide-react';
import { Badge } from '@potta/components/shadcn/badge';
import { ScrollArea } from '@potta/components/shadcn/scroll-area';

import { 
  ApproverActionType, 
  ApprovalMode, 
  ConditionAction, 
  User 
} from '../types/approval-rule';

interface ActionItemProps {
  action: ConditionAction;
  users: User[];
  onRemove: () => void;
  onUpdateMode: (mode: ApprovalMode) => void;
  onAddUser: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
  isUserSelectionOpen: boolean;
  onUserSelectionOpenChange: (isOpen: boolean) => void;
  userSearchQuery: string;
  onUserSearchQueryChange: (query: string) => void;
}

export const ActionItem: React.FC<ActionItemProps> = ({
  action,
  users,
  onRemove,
  onUpdateMode,
  onAddUser,
  onRemoveUser,
  isUserSelectionOpen,
  onUserSelectionOpenChange,
  userSearchQuery,
  onUserSearchQueryChange
}) => {
  // Get user details by ID
  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  // Filter users for selection
  const filteredUsers = users.filter(user => {
    const searchLower = userSearchQuery.toLowerCase();
    return (
      (user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)) &&
      !action.userIds.includes(user.id)
    );
  });

  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">
          {action.type === ApproverActionType.APPROVAL ? 'Approval' : 'Notification'}
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {action.type === ApproverActionType.APPROVAL && (
        <div className="mb-4">
          <Label className="mb-2 block">Approval Mode</Label>
          <RadioGroup
            value={action.mode}
            onValueChange={(value) => onUpdateMode(value as ApprovalMode)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={ApprovalMode.ALL} id={`${action.id}-all`} />
              <Label htmlFor={`${action.id}-all`}>All approvers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={ApprovalMode.ANY} id={`${action.id}-any`} />
              <Label htmlFor={`${action.id}-any`}>Any approver</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      <div>
        <Label className="mb-2 block">
          {action.type === ApproverActionType.APPROVAL ? 'Approvers' : 'Recipients'}
        </Label>
        <Popover 
          open={isUserSelectionOpen}
          onOpenChange={onUserSelectionOpenChange}
        >
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              type="button"
            >
              {action.userIds.length > 0 
                ? `${action.userIds.length} user${action.userIds.length > 1 ? 's' : ''} selected` 
                : `Select ${action.type === ApproverActionType.APPROVAL ? 'approvers' : 'recipients'}`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput 
                placeholder="Search users..." 
                value={userSearchQuery}
                onValueChange={onUserSearchQueryChange}
              />
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-[200px]">
                  {filteredUsers.map(user => (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      onSelect={() => onAddUser(user.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div>{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                        <Check 
                          className={`h-4 w-4 ${action.userIds.includes(user.id) ? 'opacity-100' : 'opacity-0'}`} 
                        />
                      </div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {action.userIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {action.userIds.map(userId => {
              const user = getUserById(userId);
              return user ? (
                <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                  {user.name}
                  <button
                    type="button"
                    onClick={() => onRemoveUser(userId)}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
