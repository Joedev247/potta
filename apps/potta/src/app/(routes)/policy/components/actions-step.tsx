// components/spend-policy/approval-rule-form/actions-step.tsx
import React, { useState, useMemo } from 'react'; // Added useMemo
import { cn } from '@potta/lib/utils';
import { ApproverGroup, Approver, FieldOption } from '../utils/types'; // Removed FormErrors if not needed
import {
  PlusCircle,
  X,
  ChevronsUpDown,
  Check,
  HelpCircle,
  Bell,
  CheckCircle2,
  Loader2,
} from 'lucide-react'; // Added Loader2
import {
  RadioGroup,
  RadioGroupItem,
} from '@potta/components/shadcn/radio-group';
import { Label } from '@potta/components/shadcn/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@potta/components/shadcn/select';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@potta/components/shadcn/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@potta/components/shadcn/command';
import { Badge } from '@potta/components/shadcn/badge';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@potta/components/shadcn/tooltip';
import { Button } from '@potta/components/shadcn/button';
import { useSearchEmployees } from '../hooks/policyHooks'; // Import the hook

// ** IMPORTANT: Define the structure of the employee object returned by your API **
interface Employee {
  uuid: string;
  firstName: string;
  lastName: string;
  // Add other relevant fields if needed, like 'email' or 'avatarUrl'
}
// ** End Employee Structure Definition **

const AvatarPlaceholder: React.FC<{ initial?: string; className?: string }> = ({
  initial,
  className,
}) => {
  if (!initial) return null;
  return (
    <div
      className={cn(
        'flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-medium text-muted-foreground',
        className
      )}
    >
      {initial.toUpperCase()}
    </div>
  );
};

type ActionsStepProps = {
  approverGroups: ApproverGroup[];
  setApproverGroups: (groups: ApproverGroup[]) => void;
  simplified?: boolean;
  // userOptions prop removed
  roleOptions: FieldOption[];
  departmentOptions: FieldOption[];
  managerTypeOptions: FieldOption[];
  // errors?: FormErrors; // Removed error prop as per previous request
};

const MAX_ACTIONS_PER_GROUP = 2;

// Add this outside the component or in a utils file if preferred
let searchTimeoutId: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_DELAY = 300; // milliseconds

export function ActionsStep({
  approverGroups,
  setApproverGroups,
  simplified = false,
  roleOptions,
  departmentOptions,
  managerTypeOptions,
}: // errors = {}, // Removed
ActionsStepProps) {
  // State for employee search term
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // To trigger the query

  // Use the employee search hook
  const {
    data: searchedEmployees,
    isLoading: isSearchingEmployees,
    // error: searchError, // Optionally handle search errors
  } = useSearchEmployees(debouncedSearchTerm); // Use debounced term

  // Debounce logic
  const handleSearchChange = (value: string) => {
    setEmployeeSearchTerm(value); // Update input immediately
    if (searchTimeoutId) {
      clearTimeout(searchTimeoutId);
    }
    searchTimeoutId = setTimeout(() => {
      setDebouncedSearchTerm(value); // Update debounced term to trigger query
    }, DEBOUNCE_DELAY);
  };

  // Convert searched employees to the FieldOption format
  const employeeOptions: FieldOption[] = useMemo(() => {
    if (!searchedEmployees || !Array.isArray(searchedEmployees)) return [];

    return searchedEmployees.map((emp: Employee) => ({
      value: emp.uuid,
      label: `${emp.firstName} ${emp.lastName}`,
      avatar: emp.firstName?.[0] ?? '?', // Use first letter or '?' as fallback
    }));
  }, [searchedEmployees]);

  // --- Functions (createDefaultApprover, etc.) remain the same ---
  // --- Ensure they are copied from the previous complete response ---
  const createDefaultApprover = (): Approver => ({
    id: `approver-${Date.now()}`,
    actionType: 'approval',
    approverType: 'user',
    selectedUserIds: [],
    approvalMode: 'all',
  });
  React.useEffect(() => {
    if (approverGroups.length === 0 && !simplified) {
      addApproverGroup();
    } else if (approverGroups.length === 0 && simplified) {
      setApproverGroups([
        {
          id: `action-group-${Date.now()}`,
          type: 'AND',
          approvers: [createDefaultApprover()],
        },
      ]);
    } /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);
  const addApproverGroup = () =>
    setApproverGroups([
      ...approverGroups,
      {
        id: `agroup-${Date.now()}`,
        type: 'AND',
        approvers: [createDefaultApprover()],
      },
    ]);
  const removeApproverGroup = (groupId: string) => {
    if (approverGroups.length > 1)
      setApproverGroups(approverGroups.filter((g) => g.id !== groupId));
  };
  const addActionToGroup = (groupId: string) =>
    setApproverGroups(
      approverGroups.map((g) =>
        g.id === groupId && g.approvers.length < MAX_ACTIONS_PER_GROUP
          ? { ...g, approvers: [...g.approvers, createDefaultApprover()] }
          : g
      )
    );
  const updateActionInGroup = (
    groupId: string,
    actionId: string,
    field: keyof Approver,
    value: any
  ) => {
    setApproverGroups(
      approverGroups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              approvers: g.approvers.map((a) => {
                if (a.id === actionId) {
                  const updatedAction = { ...a, [field]: value };
                  if (field === 'approverType') {
                    updatedAction.selectedUserIds =
                      value === 'user' ? [] : undefined;
                    updatedAction.approverValue =
                      value !== 'user' ? '' : undefined;
                    updatedAction.approvalMode =
                      value === 'user' &&
                      updatedAction.actionType === 'approval'
                        ? 'all'
                        : undefined;
                  } else if (field === 'actionType') {
                    updatedAction.approvalMode =
                      value === 'approval' &&
                      updatedAction.approverType === 'user'
                        ? updatedAction.approvalMode || 'all'
                        : undefined;
                  }
                  return updatedAction;
                }
                return a;
              }),
            }
          : g
      )
    );
  };
  const removeActionFromGroup = (groupId: string, actionId: string) => {
    setApproverGroups(
      approverGroups.map((g) => {
        if (g.id === groupId) {
          if (
            g.approvers.length <= 1 &&
            (simplified || approverGroups.length === 1)
          )
            return g;
          return {
            ...g,
            approvers: g.approvers.filter((a) => a.id !== actionId),
          };
        }
        return g;
      })
    );
  };
  const toggleUserSelection = (
    groupId: string,
    actionId: string,
    userId: string
  ) => {
    setApproverGroups(
      approverGroups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              approvers: g.approvers.map((a) =>
                a.id === actionId
                  ? {
                      ...a,
                      selectedUserIds: a.selectedUserIds?.includes(userId)
                        ? a.selectedUserIds.filter((id) => id !== userId)
                        : [...(a.selectedUserIds || []), userId],
                    }
                  : a
              ),
            }
          : g
      )
    );
  };

  // Updated getUserData: prioritize found users, fallback for selected but not found
  const getUserData = (userId: string): FieldOption | undefined => {
    // Check currently loaded options first
    const foundUser = employeeOptions.find((u) => u.value === userId);
    if (foundUser) {
      return foundUser;
    }
    // If a user is selected but not in the current search results (e.g., search term changed)
    // we might only have the ID. Return a basic object for display.
    // A more robust solution might involve caching previously fetched users.
    return {
      value: userId,
      label: `User (${userId.substring(0, 6)}...)`, // Display partial ID as label
      avatar: '?',
    };
  };

  const getUserLabel = (userId: string) => getUserData(userId)?.label || userId;

  const approverTypeSelectOptions: Array<{
    value: Approver['approverType'];
    label: string;
  }> = [
    { value: 'user', label: 'Specific User(s)' },
    { value: 'role', label: 'Role' },
    { value: 'department', label: 'Department' },
    { value: 'manager_type', label: 'Manager Type' },
  ];
  const actionTypeOptions = [
    {
      value: 'approval',
      label: 'Request Approval',
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    {
      value: 'notification',
      label: 'Send Notification',
      icon: <Bell className="h-4 w-4" />,
    },
  ];
  const approvalModeOptions = [
    { value: 'all', label: 'All of selected' },
    { value: 'any', label: 'Any of selected' },
  ];
  const getOptionsForApproverType = (
    type: Approver['approverType']
  ): FieldOption[] => {
    switch (type) {
      case 'user':
        return employeeOptions;
      case 'role':
        return roleOptions;
      case 'department':
        return departmentOptions;
      case 'manager_type':
        return managerTypeOptions;
      default:
        return [];
    }
  };

  if (approverGroups.length === 0 && simplified) return null;

  return (
    <div
      className={cn(
        'space-y-4',
        !simplified && 'border border-muted rounded-md p-4'
      )}
    >
      {/* ... (Non-simplified header) ... */}
      {!simplified && (
        <div>
          {' '}
          <h3 className="text-sm font-medium mb-1">
            Actions to Take (THEN...)
          </h3>{' '}
          <p className="text-xs text-muted-foreground mb-4">
            {' '}
            Define approval steps or notifications. Multiple groups are OR-ed.
            Actions within a group are AND-ed.{' '}
          </p>{' '}
        </div>
      )}

      {approverGroups.map((group, groupIndex) => {
        const isFirstSimplifiedGroup = simplified && groupIndex === 0;
        return (
          <React.Fragment key={group.id}>
            {/* ... (OR Separator) ... */}
            {!simplified && groupIndex > 0 && (
              <div className="my-6 flex items-center">
                {' '}
                <div className="flex-grow border-t border-dashed border-muted"></div>{' '}
                <span className="mx-4 text-xs font-semibold text-muted-foreground tracking-wider">
                  OR
                </span>{' '}
                <div className="flex-grow border-t border-dashed border-muted"></div>{' '}
              </div>
            )}

            <div
              className={cn(
                'space-y-4',
                isFirstSimplifiedGroup
                  ? 'p-0'
                  : 'border border-muted rounded-md p-4'
              )}
            >
              {/* ... (Group Header/Remove for non-simplified) ... */}
              {!simplified && (
                <div className="flex items-center justify-between mb-3">
                  {' '}
                  <h4 className="text-sm font-medium text-foreground">
                    Action Group {groupIndex + 1}
                  </h4>{' '}
                  {approverGroups.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeApproverGroup(group.id)}
                      className="h-7 w-7 p-0"
                    >
                      {' '}
                      <X className="h-4 w-4" />{' '}
                    </Button>
                  )}{' '}
                </div>
              )}

              {group.approvers.map((action, actionIndex) => {
                return (
                  <div
                    key={action.id}
                    className="space-y-2 border border-muted/70 rounded-md p-3"
                  >
                    {/* ... (Action Header/Remove) ... */}
                    <div className="flex items-center justify-between">
                      {' '}
                      <h5 className="text-sm font-medium">
                        {' '}
                        {actionIndex > 0
                          ? `AND Action Step ${actionIndex + 1}`
                          : `Action Step ${actionIndex + 1}`}{' '}
                      </h5>{' '}
                      {(group.approvers.length > 1 ||
                        (!simplified && approverGroups.length > 1)) &&
                        (!simplified || group.approvers.length > 1) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeActionFromGroup(group.id, action.id)
                            }
                            className="h-7 w-7 p-0"
                          >
                            {' '}
                            <X className="h-4 w-4" />{' '}
                          </Button>
                        )}{' '}
                    </div>

                    {/* ... (Action Type RadioGroup) ... */}
                    <div>
                      {' '}
                      <RadioGroup
                        value={action.actionType}
                        onValueChange={(val) =>
                          updateActionInGroup(
                            group.id,
                            action.id,
                            'actionType',
                            val as 'approval' | 'notification'
                          )
                        }
                        className="flex space-x-4 mb-1"
                      >
                        {' '}
                        {actionTypeOptions.map((opt) => (
                          <div
                            key={opt.value}
                            className="flex items-center space-x-2"
                          >
                            {' '}
                            <RadioGroupItem
                              value={opt.value}
                              id={`action-${action.id}-${opt.value}`}
                            />{' '}
                            <Label
                              htmlFor={`action-${action.id}-${opt.value}`}
                              className="flex items-center space-x-1 cursor-pointer"
                            >
                              {' '}
                              {opt.icon} <span>{opt.label}</span>{' '}
                            </Label>{' '}
                          </div>
                        ))}{' '}
                      </RadioGroup>{' '}
                    </div>

                    {/* ... (Approver Type Select) ... */}
                    <div>
                      {' '}
                      <Label className="text-xs font-medium text-muted-foreground">
                        Who performs this action?
                      </Label>{' '}
                      <Select
                        value={action.approverType}
                        onValueChange={(val) =>
                          updateActionInGroup(
                            group.id,
                            action.id,
                            'approverType',
                            val as Approver['approverType']
                          )
                        }
                      >
                        {' '}
                        <SelectTrigger className="w-full mt-1">
                          {' '}
                          <SelectValue placeholder="Select type" />{' '}
                        </SelectTrigger>{' '}
                        <SelectContent>
                          {' '}
                          {approverTypeSelectOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}{' '}
                        </SelectContent>{' '}
                      </Select>{' '}
                    </div>

                    {action.approverType === 'user' && (
                      <>
                        {/* ... (Approval Mode Select) ... */}
                        {action.actionType === 'approval' && (
                          <div className="mt-2">
                            {' '}
                            <Label className="text-xs font-medium text-muted-foreground">
                              Approval Mode
                            </Label>{' '}
                            <Select
                              value={action.approvalMode || 'all'}
                              onValueChange={(val) =>
                                updateActionInGroup(
                                  group.id,
                                  action.id,
                                  'approvalMode',
                                  val as 'all' | 'any'
                                )
                              }
                            >
                              {' '}
                              <SelectTrigger className="w-[180px] mt-1">
                                {' '}
                                <SelectValue />{' '}
                              </SelectTrigger>{' '}
                              <SelectContent>
                                {' '}
                                {approvalModeOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}{' '}
                              </SelectContent>{' '}
                            </Select>{' '}
                          </div>
                        )}

                        {/* User Selection Popover with Dynamic Search */}
                        <div className="mt-2">
                          <Label className="text-xs font-medium text-muted-foreground">
                            Select Users
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-between h-10 mt-1"
                              >
                                {/* Badge display remains the same */}
                                {action.selectedUserIds &&
                                action.selectedUserIds.length > 0 ? (
                                  <div className="flex flex-wrap items-center gap-1 max-w-[calc(100%-20px)] overflow-hidden">
                                    {' '}
                                    {action.selectedUserIds
                                      .slice(0, 2)
                                      .map((uid) => {
                                        const user = getUserData(uid);
                                        return (
                                          <Badge
                                            key={uid}
                                            variant="secondary"
                                            className="mr-1 truncate flex items-center gap-1.5 py-0.5 pr-1.5"
                                          >
                                            {' '}
                                            <AvatarPlaceholder
                                              initial={user?.avatar}
                                              className="h-4 w-4 text-xxs"
                                            />{' '}
                                            {user?.label || uid}{' '}
                                          </Badge>
                                        );
                                      })}{' '}
                                    {action.selectedUserIds.length > 2 && (
                                      <Badge variant="secondary">
                                        +{action.selectedUserIds.length - 2}
                                      </Badge>
                                    )}{' '}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">
                                    Select users...
                                  </span>
                                )}{' '}
                                <ChevronsUpDown className="h-4 w-4 opacity-50 ml-auto shrink-0" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[300px] p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput
                                  placeholder="Search employees..."
                                  value={employeeSearchTerm} // Control input value
                                  onValueChange={handleSearchChange} // Use debounced handler
                                />
                                <CommandList>
                                  {isSearchingEmployees && (
                                    <div className="py-6 text-center text-sm">
                                      <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                                      Searching...
                                    </div>
                                  )}
                                  {!isSearchingEmployees &&
                                    employeeOptions.length === 0 && (
                                      <CommandEmpty>
                                        No employees found.
                                      </CommandEmpty>
                                    )}
                                  {!isSearchingEmployees &&
                                    employeeOptions.length > 0 && (
                                      <CommandGroup>
                                        {employeeOptions.map((employee) => {
                                          const isSelected =
                                            action.selectedUserIds?.includes(
                                              employee.value
                                            );
                                          return (
                                            <CommandItem
                                              key={employee.value}
                                              value={employee.label} // Use label for Command filtering
                                              onSelect={() =>
                                                toggleUserSelection(
                                                  group.id,
                                                  action.id,
                                                  employee.value
                                                )
                                              }
                                              className="flex items-center cursor-pointer"
                                            >
                                              <Check
                                                className={cn(
                                                  'mr-2 h-4 w-4',
                                                  isSelected
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                                )}
                                              />
                                              <AvatarPlaceholder
                                                initial={employee.avatar}
                                                className="mr-2"
                                              />
                                              <span>{employee.label}</span>
                                            </CommandItem>
                                          );
                                        })}
                                      </CommandGroup>
                                    )}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </>
                    )}

                    {/* ... (Role, Dept, Manager Specific Selects) ... */}
                    {action.approverType &&
                      ['role', 'department', 'manager_type'].includes(
                        action.approverType
                      ) && (
                        <div className="mt-2">
                          {' '}
                          <Label className="text-xs font-medium text-muted-foreground">
                            {' '}
                            Select{' '}
                            {approverTypeSelectOptions.find(
                              (opt) => opt.value === action.approverType
                            )?.label || 'Value'}{' '}
                          </Label>{' '}
                          <Select
                            value={action.approverValue || ''}
                            onValueChange={(val) =>
                              updateActionInGroup(
                                group.id,
                                action.id,
                                'approverValue',
                                val
                              )
                            }
                            disabled={
                              getOptionsForApproverType(action.approverType)
                                .length === 0
                            }
                          >
                            {' '}
                            <SelectTrigger className="w-full mt-1">
                              {' '}
                              <SelectValue placeholder="Select value" />
                            </SelectTrigger>{' '}
                            <SelectContent>
                              {' '}
                              {getOptionsForApproverType(
                                action.approverType
                              ).map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}{' '}
                            </SelectContent>{' '}
                          </Select>{' '}
                        </div>
                      )}
                  </div>
                );
              })}
              {/* ... (Add Action Step Button) ... */}
              {group.approvers.length < MAX_ACTIONS_PER_GROUP && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => addActionToGroup(group.id)}
                  className="text-xs p-0 h-auto mt-2"
                >
                  {' '}
                  <PlusCircle className="h-3 w-3 mr-1" /> Add Action Step (AND){' '}
                </Button>
              )}
            </div>
          </React.Fragment>
        );
      })}
      {/* ... (Add Action Group Button) ... */}
      {!simplified && (
        <Button
          variant="outline"
          size="sm"
          onClick={addApproverGroup}
          className="mt-6"
        >
          {' '}
          <PlusCircle className="h-4 w-4 mr-2" /> Add Action Group (OR){' '}
        </Button>
      )}
    </div>
  );
}

// Removed the window declaration for searchTimeoutId as we use a local variable now
