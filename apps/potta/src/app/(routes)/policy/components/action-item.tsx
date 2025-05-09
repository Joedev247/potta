import React from 'react';
import { Button } from '@potta/components/shadcn/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@potta/components/shadcn/select';
import { Check, X, PlusCircle, UserPlus } from 'lucide-react';
import { Badge } from '@potta/components/shadcn/badge';
import { ScrollArea } from '@potta/components/shadcn/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@potta/components/avatar';

import { 
  ConditionAction, 
  ApproverActionType, 
  ApprovalMode, 
  User 
} from '../types/approval-rule';

interface ActionItemProps {
  action: ConditionAction;
  users: User[];
  onRemove: () => void;
  onUpdateMode: (mode: ApprovalMode) => void;
  // Modified to accept full user object instead of just ID
  onAddUser: (user: User) => void;
  onRemoveUser: (user: User) => void;
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
  // Get action type display name
  const getActionTypeDisplay = () => {
    return action.type === ApproverActionType.APPROVAL ? 'Approval' : 'Notification';
  };

  // Get selected users
  const selectedUsers = users.filter(user => action.userIds.includes(user.id));

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <div className="border rounded-md p-3 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{getActionTypeDisplay()}</span>
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
        <div className="grid grid-cols-1 gap-2">
          <Select
            value={action.mode}
            onValueChange={(value) => onUpdateMode(value as ApprovalMode)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Approval Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ApprovalMode.ALL}>All must approve</SelectItem>
              <SelectItem value={ApprovalMode.ANY}>Anyone can approve</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {selectedUsers.map(user => (
            <Badge
              key={user.id}
              className="flex items-center gap-1 pl-1 pr-1.5"
              variant="secondary"
            >
              {/* Add avatar with profile picture or initials */}
              <Avatar className="h-5 w-5">
                {user.profilePicture ? (
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                ) : (
                  <AvatarFallback>{user.initials || user.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <span>{user.name}</span>
              <Button
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1"
                onClick={() => onRemoveUser(user)} // Pass the full user object
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}

          <Popover
            open={isUserSelectionOpen}
            onOpenChange={onUserSelectionOpenChange}
          >
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-6"
              >
                <UserPlus className="h-3.5 w-3.5 mr-1" />
                Add User
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
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
                        onSelect={() => onAddUser(user)} // Pass the full user object
                        disabled={action.userIds.includes(user.id)}
                        className="flex items-center gap-2"
                      >
                        {/* Add avatar with profile picture or initials */}
                        <Avatar className="h-6 w-6">
                          {user.profilePicture ? (
                            <AvatarImage src={user.profilePicture} alt={user.name} />
                          ) : (
                            <AvatarFallback>{user.initials || user.name.charAt(0)}</AvatarFallback>
                          )}
                        </Avatar>
                        {user.name}
                        {action.userIds.includes(user.id) && (
                          <Check className="h-4 w-4 ml-auto opacity-70" />
                        )}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        {action.userIds.length === 0 && (
          <p className="text-xs text-muted-foreground">No users added yet</p>
        )}
      </div>
    </div>
  );
};
