// components/spend-policy/approval-rule-form/conditions-step.tsx
import React from 'react';
// ... other imports (Button, Input, Select, etc.)
import { cn } from '@potta/lib/utils';
import {
  ConditionGroup,
  Condition,
  FieldConfig,
  OperatorOption,
  FieldOption,
} from '../utils/types'; // Removed FormErrors
// import FieldError from './FieldError'; // Removed
import { Badge } from '@potta/components/shadcn/badge';
import { PlusCircle, X, ChevronsUpDown, Check, HelpCircle } from 'lucide-react';
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
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@potta/components/shadcn/tooltip';
import { Button } from '@potta/components/shadcn/button';
import { Input } from '@potta/components/shadcn/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@potta/components/shadcn/select';

type ConditionsStepProps = {
  transactionType: string;
  conditionGroups: ConditionGroup[];
  setConditionGroups: (groups: ConditionGroup[]) => void;
  simplified?: boolean;
  availableFields: FieldOption[];
  getOperatorsForField: (fieldId: string) => OperatorOption[];
  getValueOptionsForField: (
    fieldId: string,
    operatorId?: string
  ) => FieldOption[];
  getFieldDefinition: (fieldId: string) => FieldConfig | undefined;
  // errors?: FormErrors; // Removed errors prop
};

export function ConditionsStep({
  transactionType,
  conditionGroups,
  setConditionGroups,
  simplified = false,
  availableFields,
  getOperatorsForField,
  getValueOptionsForField,
  getFieldDefinition,
}: // errors = {}, // Removed
ConditionsStepProps) {
  // --- All functions (createDefaultCondition, addConditionGroup, etc.) remain the same ---
  // --- Ensure they are copied from the previous complete response ---
  const createDefaultCondition = (): Condition => ({
    id: `condition-${Date.now()}`,
    field: '',
    operator: '',
    value: '',
  });
  React.useEffect(() => {
    if (conditionGroups.length === 0 && !simplified) {
      addConditionGroup();
    } else if (conditionGroups.length === 0 && simplified) {
      setConditionGroups([
        { id: `group-${Date.now()}`, conditions: [createDefaultCondition()] },
      ]);
    } /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);
  const addConditionGroup = () => {
    setConditionGroups([
      ...conditionGroups,
      { id: `group-${Date.now()}`, conditions: [createDefaultCondition()] },
    ]);
  };
  const removeConditionGroup = (groupIdToRemove: string) => {
    if (conditionGroups.length > 1) {
      setConditionGroups(
        conditionGroups.filter((group) => group.id !== groupIdToRemove)
      );
    }
  };
  const addCondition = (groupId: string) => {
    setConditionGroups(
      conditionGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: [...group.conditions, createDefaultCondition()],
            }
          : group
      )
    );
  };
  const updateCondition = (
    groupId: string,
    conditionId: string,
    fieldProperty: keyof Condition,
    newValue: any
  ) => {
    setConditionGroups(
      conditionGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            conditions: group.conditions.map((condition) => {
              if (condition.id === conditionId) {
                const updatedCondition = {
                  ...condition,
                  [fieldProperty]: newValue,
                };
                const fieldDef = getFieldDefinition(updatedCondition.field);
                if (fieldProperty === 'field') {
                  updatedCondition.operator = '';
                  const newFieldDef = getFieldDefinition(newValue);
                  updatedCondition.value = newFieldDef?.multiSelectValue
                    ? []
                    : '';
                } else if (fieldProperty === 'operator') {
                  updatedCondition.value = fieldDef?.multiSelectValue ? [] : '';
                }
                return updatedCondition;
              }
              return condition;
            }),
          };
        }
        return group;
      })
    );
  };
  const addValueToMultiSelect = (
    groupId: string,
    conditionId: string,
    valueToAdd: string
  ) => {
    setConditionGroups(
      conditionGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map((c) =>
                c.id === conditionId
                  ? {
                      ...c,
                      value: Array.isArray(c.value)
                        ? c.value.includes(valueToAdd)
                          ? c.value
                          : [...c.value, valueToAdd]
                        : [valueToAdd],
                    }
                  : c
              ),
            }
          : group
      )
    );
  };
  const removeValueFromMultiSelect = (
    groupId: string,
    conditionId: string,
    valueToRemove: string
  ) => {
    setConditionGroups(
      conditionGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map((c) =>
                c.id === conditionId
                  ? {
                      ...c,
                      value: Array.isArray(c.value)
                        ? c.value.filter((v) => v !== valueToRemove)
                        : [],
                    }
                  : c
              ),
            }
          : group
      )
    );
  };
  const removeCondition = (groupId: string, conditionId: string) => {
    setConditionGroups(
      conditionGroups.map((group) => {
        if (group.id === groupId) {
          if (
            group.conditions.length <= 1 &&
            conditionGroups.length === 1 &&
            simplified
          )
            return group;
          if (
            group.conditions.length <= 1 &&
            !simplified &&
            conditionGroups.length === 1
          )
            return group;
          return {
            ...group,
            conditions: group.conditions.filter((c) => c.id !== conditionId),
          };
        }
        return group;
      })
    );
  };
  const getValueDisplayLabel = (fieldId: string, value: string) => {
    const fieldDef = getFieldDefinition(fieldId);
    if (fieldDef?.valueOptions) {
      return (
        fieldDef.valueOptions.find((o) => o.value === value)?.label || value
      );
    }
    return value;
  };

  if (conditionGroups.length === 0 && simplified) return null;

  return (
    <div
      className={cn(
        'space-y-4',
        !simplified && 'border border-muted rounded-md p-4'
      )}
    >
      {!simplified && (
        <div>
          <h3 className="text-sm font-medium mb-1">
            Policy Conditions (IF...)
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Define when this rule should apply. Multiple groups are OR-ed.
            Conditions within a group are AND-ed.
          </p>
          {/* <FieldError message={errors?.['generalConditionGroupsError']} /> Removed */}
        </div>
      )}

      {conditionGroups.map((group, groupIndex) => {
        const isFirstSimplifiedGroup = simplified && groupIndex === 0;
        return (
          <React.Fragment key={group.id}>
            {!simplified && groupIndex > 0 && (
              /* ... OR separator ... */ <div className="my-6 flex items-center">
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
                'space-y-3',
                isFirstSimplifiedGroup
                  ? 'p-0'
                  : 'border border-muted rounded-md p-4'
              )}
            >
              {!simplified && (
                /* ... Group title and remove button ... */ <div className="flex items-center justify-between mb-3">
                  {' '}
                  <h4 className="text-sm font-medium text-foreground">
                    Condition Group {groupIndex + 1}
                  </h4>{' '}
                  {conditionGroups.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeConditionGroup(group.id)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    >
                      {' '}
                      <X className="h-4 w-4" />{' '}
                    </Button>
                  )}{' '}
                </div>
              )}
              {/* <FieldError message={errors?.[simplified ? '' : `[${groupIndex}]`]} /> Removed */}

              {group.conditions.map((condition, condIndex) => {
                const fieldDef = getFieldDefinition(condition.field);
                const operators = condition.field
                  ? getOperatorsForField(condition.field)
                  : [];
                const valueOptions = condition.field
                  ? getValueOptionsForField(condition.field, condition.operator)
                  : [];
                const useInput =
                  fieldDef &&
                  ['numeric', 'text', 'date'].includes(fieldDef.type) &&
                  !fieldDef.valueOptions?.length;
                const useMultiSelect =
                  fieldDef?.multiSelectValue && !!fieldDef.valueOptions?.length;

                return (
                  <div
                    key={condition.id}
                    className="p-3 border border-muted/70 rounded-md bg-background/50"
                  >
                    {' '}
                    {/* Removed space-y-2 */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center space-x-0 sm:space-x-2 gap-2 sm:gap-0">
                      <div className="text-sm font-medium w-full sm:w-16 shrink-0">
                        {condIndex === 0 ? 'If' : 'AND'}
                      </div>

                      <div className="flex-1 min-w-[150px]">
                        <Select
                          value={condition.field}
                          onValueChange={(val) =>
                            updateCondition(
                              group.id,
                              condition.id,
                              'field',
                              val
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            {' '}
                            {/* Removed conditional error class */}
                            <SelectValue placeholder="Select Criterion" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableFields.map((f) => (
                              <SelectItem key={f.value} value={f.value}>
                                {f.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {condition.field && (
                        <div className="flex-1 min-w-[120px]">
                          <Select
                            value={condition.operator}
                            onValueChange={(val) =>
                              updateCondition(
                                group.id,
                                condition.id,
                                'operator',
                                val
                              )
                            }
                            disabled={operators.length === 0}
                          >
                            <SelectTrigger className="w-full">
                              {' '}
                              {/* Removed conditional error class */}
                              <SelectValue placeholder="Comparison" />
                            </SelectTrigger>
                            <SelectContent>
                              {operators.map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {condition.field && condition.operator && (
                        <div className="flex-1 min-w-[150px]">
                          {useInput ? (
                            <Input
                              type={
                                fieldDef?.type === 'numeric'
                                  ? 'number'
                                  : fieldDef?.type === 'date'
                                  ? 'date'
                                  : 'text'
                              }
                              placeholder="Enter value"
                              value={condition.value.toString()}
                              onChange={(e) =>
                                updateCondition(
                                  group.id,
                                  condition.id,
                                  'value',
                                  e.target.value
                                )
                              }
                              className="w-full" // Removed conditional error class
                            />
                          ) : useMultiSelect ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between h-10"
                                >
                                  {' '}
                                  {/* Removed conditional error class */}
                                  {/* ... Popover trigger content (Badge display) ... */}
                                  {Array.isArray(condition.value) &&
                                  condition.value.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 max-w-[calc(100%-20px)] overflow-hidden">
                                      {' '}
                                      {condition.value
                                        .slice(0, 2)
                                        .map((val) => (
                                          <Badge
                                            key={val}
                                            variant="secondary"
                                            className="mr-1 truncate"
                                          >
                                            {' '}
                                            {getValueDisplayLabel(
                                              condition.field,
                                              val
                                            )}{' '}
                                          </Badge>
                                        ))}{' '}
                                      {condition.value.length > 2 && (
                                        <Badge variant="secondary">
                                          +{condition.value.length - 2}
                                        </Badge>
                                      )}{' '}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      Select values...
                                    </span>
                                  )}{' '}
                                  <ChevronsUpDown className="h-4 w-4 opacity-50 ml-auto shrink-0" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-[280px] p-0"
                                align="start"
                              >
                                {/* ... Popover content (Command for selection) ... */}
                                <Command>
                                  {' '}
                                  <CommandInput placeholder="Search values..." />{' '}
                                  <CommandList>
                                    <CommandEmpty>No results.</CommandEmpty>{' '}
                                    <CommandGroup>
                                      {' '}
                                      {valueOptions.map((opt) => {
                                        const isSelected =
                                          Array.isArray(condition.value) &&
                                          condition.value.includes(opt.value);
                                        return (
                                          <CommandItem
                                            key={opt.value}
                                            onSelect={() =>
                                              isSelected
                                                ? removeValueFromMultiSelect(
                                                    group.id,
                                                    condition.id,
                                                    opt.value
                                                  )
                                                : addValueToMultiSelect(
                                                    group.id,
                                                    condition.id,
                                                    opt.value
                                                  )
                                            }
                                          >
                                            {' '}
                                            <Check
                                              className={cn(
                                                'mr-2 h-4 w-4',
                                                isSelected
                                                  ? 'opacity-100'
                                                  : 'opacity-0'
                                              )}
                                            />{' '}
                                            {opt.label}{' '}
                                          </CommandItem>
                                        );
                                      })}{' '}
                                    </CommandGroup>{' '}
                                  </CommandList>{' '}
                                </Command>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <Select
                              value={condition.value.toString()}
                              onValueChange={(val) =>
                                updateCondition(
                                  group.id,
                                  condition.id,
                                  'value',
                                  val
                                )
                              }
                              disabled={!valueOptions.length}
                            >
                              <SelectTrigger className="w-full">
                                {' '}
                                {/* Removed conditional error class */}
                                <SelectValue placeholder="Select Value" />
                              </SelectTrigger>
                              <SelectContent>
                                {' '}
                                {valueOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}{' '}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      )}
                      {/* ... Help and Remove buttons ... */}
                      <div className="flex items-center space-x-1 ml-auto sm:ml-0 shrink-0">
                        {' '}
                        {!simplified && (
                          <TooltipProvider>
                            {' '}
                            <Tooltip>
                              {' '}
                              <TooltipTrigger asChild>
                                {' '}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 p-0"
                                >
                                  {' '}
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />{' '}
                                </Button>{' '}
                              </TooltipTrigger>{' '}
                              <TooltipContent>
                                <p className="w-[200px] text-xs">
                                  Define conditions.
                                </p>
                              </TooltipContent>{' '}
                            </Tooltip>{' '}
                          </TooltipProvider>
                        )}{' '}
                        {(group.conditions.length > 1 ||
                          (!simplified && conditionGroups.length > 1)) &&
                          (!simplified || group.conditions.length > 1) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeCondition(group.id, condition.id)
                              }
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              {' '}
                              <X className="h-4 w-4" />{' '}
                            </Button>
                          )}{' '}
                      </div>
                    </div>
                    {/* Removed FieldError components that were here */}
                  </div>
                );
              })}
              <Button
                variant="link"
                size="sm"
                onClick={() => addCondition(group.id)}
                className="flex items-center text-xs text-primary p-0 h-auto mt-3"
              >
                <PlusCircle className="h-3 w-3 mr-1" /> Add Condition (AND)
              </Button>
            </div>
          </React.Fragment>
        );
      })}
      {!simplified && (
        <Button
          variant="outline"
          size="sm"
          onClick={addConditionGroup}
          className="flex items-center mt-6"
        >
          {' '}
          <PlusCircle className="h-4 w-4 mr-2" /> Add Condition Group (OR){' '}
        </Button>
      )}
    </div>
  );
}
