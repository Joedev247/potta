// components/spend-policy/approval-rule-form.tsx

// ... (Imports, Mocks, Schemas, Component Definition, State, etc. remain the same) ...
import React, { useState, useMemo } from 'react';
import { Button } from '@potta/components/shadcn/button';
import { Input } from '@potta/components/shadcn/input';
import { Label } from '@potta/components/shadcn/label';
import { Badge } from '@potta/components/shadcn/badge';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Loader2,
  UserCircle2,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@potta/components/shadcn/select';
import { ConditionsStep } from './components/conditions-step';
import { ActionsStep } from './components/actions-step';
import { RequirementsStep } from './components/requirements-step';
import {
  ApprovalRuleData,
  ConditionGroup,
  Condition,
  ApproverGroup,
  Approver,
  SubmissionRequirements,
  MileageRequirements,
  FieldOption,
  OperatorOption,
  FieldConfig,
  ApprovalRulePayload,
  ConditionPayload,
  ApproverPayload,
} from './utils/types'; // Import Payload types
import * as Yup from 'yup';
import { cn } from '@potta/lib/utils';
import toast from 'react-hot-toast';
import { useCreatePolicy } from './hooks/policyHooks';

// --- Avatar Placeholder & Mocked Data & Yup Schemas (Ensure these are complete from previous response) ---
const SummaryAvatar: React.FC<{ initial?: string; className?: string }> = ({
  initial,
  className,
}) => {
  if (!initial)
    return (
      <UserCircle2 className={cn('h-4 w-4 text-muted-foreground', className)} />
    );
  return (
    <div
      className={cn(
        'flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-medium',
        className
      )}
    >
      {' '}
      {initial.toUpperCase()}{' '}
    </div>
  );
};
const MOCKED_USER_OPTIONS: FieldOption[] = [
  { value: 'user-1', label: 'Tebi Njeik', avatar: 'T' },
  { value: 'user-2', label: 'Jane Doe', avatar: 'J' },
  { value: 'user-3', label: 'Michael Johnson', avatar: 'M' },
];
const MOCKED_ROLE_OPTIONS: FieldOption[] = [
  { value: 'role-1', label: 'Finance Manager' },
  { value: 'role-2', label: 'Department Head' },
];
const MOCKED_DEPARTMENT_OPTIONS: FieldOption[] = [
  { value: 'dept-1', label: 'Accounting' },
  { value: 'dept-2', label: 'Marketing' },
];
const MOCKED_MANAGER_TYPE_OPTIONS: FieldOption[] = [
  { value: 'direct_manager', label: 'Direct Manager' },
  { value: 'dept_manager', label: "Submitter's Department Manager" },
];
const ALL_FIELD_CONFIGS: FieldConfig[] = [
  {
    id: 'amount',
    label: 'Amount',
    type: 'numeric',
    operators: [
      { value: 'greater_than', label: 'Greater than' },
      { value: 'less_than_equals', label: 'Less than or equals' },
    ],
  },
  {
    id: 'department',
    label: 'Department',
    type: 'entity',
    operators: [
      { value: 'equals', label: 'Is' },
      { value: 'not_equals', label: 'Is not' },
    ],
    valueOptions: MOCKED_DEPARTMENT_OPTIONS,
  },
  {
    id: 'paymentType',
    label: 'Payment Type',
    type: 'multi_entity',
    operators: [
      { value: 'is_one_of', label: 'Is one of' },
      { value: 'is_not_one_of', label: 'Is not one of' },
    ],
    valueOptions: [
      { value: 'card', label: 'Card Transaction' },
      { value: 'reimbursement', label: 'Reimbursement' },
      { value: 'mileage', label: 'Mileage Reimbursement' },
    ],
    multiSelectValue: true,
  },
];
const yupConditionSchema = Yup.object().shape({
  id: Yup.string().required(),
  field: Yup.string().required('Criterion (field) is required for condition.'),
  operator: Yup.string().required(
    'Comparison (operator) is required for condition.'
  ),
  value: Yup.mixed()
    .test('value-required', 'Value is required for condition.', (val) =>
      Array.isArray(val)
        ? val.length > 0
        : val !== null && val !== undefined && String(val).trim() !== ''
    )
    .required('Value is required for condition.'),
});
const yupApproverSchema = Yup.object().shape({
  id: Yup.string().required(),
  actionType: Yup.string().oneOf(['approval', 'notification']).required(),
  approverType: Yup.string()
    .oneOf(['user', 'role', 'department', 'manager_type'])
    .required('Approver type is required.'),
  selectedUserIds: Yup.array()
    .of(Yup.string().required())
    .when('approverType', {
      is: 'user',
      then: (schema) =>
        schema.min(1, 'At least one user must be selected.').required(),
      otherwise: (schema) => schema.nullable().optional(),
    }),
  approvalMode: Yup.string()
    .oneOf(['all', 'any'])
    .when(['actionType', 'approverType'], {
      is: (actionType: string, approverType: string) =>
        actionType === 'approval' && approverType === 'user',
      then: (schema) => schema.required('Approval mode is required.'),
      otherwise: (schema) => schema.nullable().optional(),
    }),
  approverValue: Yup.string().when('approverType', {
    is: (val: string) => val !== 'user',
    then: (schema) => schema.required('A value is required for type.'),
    otherwise: (schema) => schema.nullable().optional(),
  }),
});
const yupApprovalRuleSchema = Yup.object()
  .shape({
    name: Yup.string().trim().required('Rule name is required.'),
    transactionType: Yup.string().required('Transaction type is required.'),
    conditionGroups: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required(),
        conditions: Yup.array()
          .of(yupConditionSchema)
          .min(1, 'Condition group must have at least one condition.'),
      })
    ),
    approverGroups: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required(),
        type: Yup.string().oneOf(['AND']).required(),
        approvers: Yup.array()
          .of(yupApproverSchema)
          .min(1, 'Action group must have at least one action.'),
      })
    ),
    submissionRequirements: Yup.object().optional(),
    mileageRequirements: Yup.object().optional(),
  })
  .test('conditional-requirements', 'Error', function (value) {
    const { conditionGroups, approverGroups } = value;
    const hasConditions =
      conditionGroups &&
      conditionGroups.length > 0 &&
      conditionGroups.some((cg) => cg.conditions && cg.conditions.length > 0);
    const hasActions =
      approverGroups &&
      approverGroups.length > 0 &&
      approverGroups.some((ag) => ag.approvers && ag.approvers.length > 0);
    if (hasConditions && !hasActions) {
      return this.createError({
        path: 'approverGroups',
        message: 'If conditions are defined, at least one action is required.',
      });
    }
    if (hasActions && !hasConditions) {
      return this.createError({
        path: 'conditionGroups',
        message: 'If actions are defined, at least one condition is required.',
      });
    }
    return true;
  });

type ApprovalRuleFormProps = {
  onCancel: () => void;
  onSuccess?: () => void;
};

export default function ApprovalRuleForm({
  onCancel,
  onSuccess,
}: ApprovalRuleFormProps) {
  // ... state variables remain the same ...
  const [ruleName, setRuleName] = useState('');
  const [transactionType, setTransactionType] = useState('expenses');
  const [conditionGroups, setConditionGroups] = useState<ConditionGroup[]>([
    {
      id: `cg-${Date.now()}`,
      conditions: [
        { id: `c-${Date.now()}`, field: '', operator: '', value: '' },
      ],
    },
  ]);
  const [approverGroups, setApproverGroups] = useState<ApproverGroup[]>([
    {
      id: `ag-${Date.now()}`,
      type: 'AND',
      approvers: [
        {
          id: `a-${Date.now()}`,
          actionType: 'approval',
          approverType: 'user',
          selectedUserIds: [],
          approvalMode: 'all',
        },
      ],
    },
  ]);
  const [submissionRequirements, setSubmissionRequirements] =
    useState<SubmissionRequirements>({
      receiptsRequired: false,
      memoRequired: false,
      screenshotsRequired: false,
      requireNetSuiteCustomerJob: false,
    });
  const [mileageRequirements, setMileageRequirements] =
    useState<MileageRequirements>({
      odometerScreenshots: false,
      gpsTracking: false,
      businessPurpose: false,
    });
  const [collectedValidationErrors, setCollectedValidationErrors] = useState<
    string[]
  >([]);

  const createPolicyMutation = useCreatePolicy();
  const transactionTypeOptions = [
    /* ... */ { value: 'expenses', label: 'Expenses (card & reimbursements)' },
    { value: 'spendRequests', label: 'Spend Requests (cards & POs)' },
    { value: 'bills', label: 'Bills (payments)' },
    { value: 'vendors', label: 'Vendors (changes)' },
  ];
  const fieldConfigProps = useMemo(() => {
    /* ... */ const availableFieldsForTxType = ALL_FIELD_CONFIGS.map((f) => ({
      value: f.id,
      label: f.label,
    }));
    const getFieldDefinition = (fieldId: string): FieldConfig | undefined =>
      ALL_FIELD_CONFIGS.find((f) => f.id === fieldId);
    const getOperatorsForField = (fieldId: string): OperatorOption[] =>
      getFieldDefinition(fieldId)?.operators || [];
    const getValueOptionsForField = (
      fieldId: string,
      operatorId?: string
    ): FieldOption[] => getFieldDefinition(fieldId)?.valueOptions || [];
    return {
      availableFields: availableFieldsForTxType,
      getFieldDefinition,
      getOperatorsForField,
      getValueOptionsForField,
    };
  }, [transactionType]);
  const isMileagePolicy = conditionGroups.some(
    (cg) =>
      cg.conditions &&
      cg.conditions.some(
        (c) =>
          c.field === 'paymentType' &&
          (Array.isArray(c.value)
            ? c.value.includes('mileage')
            : c.value === 'mileage')
      )
  );

  // --- Helper to convert UI Condition Value to Payload Value ---
  const getPayloadConditionValue = (
    condition: Condition
  ): string | string[] | number => {
    const fieldDef = fieldConfigProps.getFieldDefinition(condition.field);
    if (fieldDef?.type === 'numeric' && typeof condition.value === 'string') {
      const num = parseFloat(condition.value);
      return isNaN(num) ? condition.value : num; // Send as number if valid, else fallback to string
    }
    return condition.value; // Keep as string or string[] otherwise
  };

  // --- Helper to prepare Approver for Payload ---
  const prepareApproverPayload = (approver: Approver): ApproverPayload => {
    const payload: ApproverPayload = {
      actionType: approver.actionType,
      approverType: approver.approverType,
    };
    if (approver.approverType === 'user') {
      payload.selectedUserIds = approver.selectedUserIds || []; // Ensure it's an array
      if (approver.actionType === 'approval') {
        payload.approvalMode = approver.approvalMode || 'all';
      }
      // Omit approverValue for 'user' type to avoid confusion based on swagger example
    } else {
      payload.approverValue = approver.approverValue || '';
      // Omit user-specific fields
    }
    return payload;
  };

  const handleSubmit = async () => {
    setCollectedValidationErrors([]);

    // 1. Filter incomplete conditions/actions from the UI state
    const validConditions = (cg: ConditionGroup) =>
      (cg.conditions || []).filter(
        (c) =>
          c.field &&
          c.operator &&
          ((typeof c.value === 'string' && c.value.trim()) ||
            (Array.isArray(c.value) && c.value.length > 0))
      );
    const validApprovers = (ag: ApproverGroup) =>
      (ag.approvers || []).filter(
        (a) =>
          a.approverType &&
          ((a.approverType === 'user' &&
            a.selectedUserIds &&
            a.selectedUserIds.length > 0) ||
            (a.approverType !== 'user' && a.approverValue))
      );

    // 2. Prepare the data structure for validation (still using frontend types here)
    const dataForValidation: ApprovalRuleData = {
      name: ruleName,
      transactionType,
      conditionGroups: conditionGroups
        .map((cg) => ({ ...cg, conditions: validConditions(cg) }))
        .filter((cg) => cg.conditions.length > 0),
      approverGroups: approverGroups
        .map((ag) => ({ ...ag, approvers: validApprovers(ag) }))
        .filter((ag) => ag.approvers.length > 0),
    };
    if (transactionType === 'expenses') {
      dataForValidation.submissionRequirements = submissionRequirements;
      if (isMileagePolicy) {
        dataForValidation.mileageRequirements = mileageRequirements;
      }
    }

    // 3. Validate the prepared data
    try {
      await yupApprovalRuleSchema.validate(dataForValidation, {
        abortEarly: false,
      });

      // 4. If valid, transform into the final API Payload structure
      const finalPayload: ApprovalRulePayload = {
        name: dataForValidation.name,
        transactionType: dataForValidation.transactionType,
        conditionGroups: dataForValidation.conditionGroups.map((cg) => ({
          // id: cg.id, // Omit frontend ID for creation
          conditions: cg.conditions.map((c) => ({
            // id: c.id, // Omit frontend ID
            field: c.field,
            operator: c.operator,
            value: getPayloadConditionValue(c), // Convert value type
          })),
        })),
        approverGroups: dataForValidation.approverGroups.map((ag) => ({
          // id: ag.id, // Omit frontend ID
          type: ag.type,
          approvers: ag.approvers.map(prepareApproverPayload), // Prepare approver structure
        })),
        submissionRequirements: dataForValidation.submissionRequirements,
        mileageRequirements: dataForValidation.mileageRequirements,
      };

      // 5. Call the mutation with the final payload
      createPolicyMutation.mutate(finalPayload, {
        onSuccess: (data: any) => {
          toast.success('Approval rule created successfully!');
          onSuccess?.();
        },
        onError: (error: any) => {
          console.error('Error creating policy:', error);
          const errorMessage =
            (error as any)?.response?.data?.message ||
            'Failed to create approval rule.';
          toast.error(errorMessage);
        },
      });
    } catch (err) {
      // Yup validation failed
      if (err instanceof Yup.ValidationError) {
        const errorMessages = err.inner.map(
          (error) => `${error.path ? `${error.path}: ` : ''}${error.message}`
        );
        if (err.errors.length > err.inner.length) {
          err.errors.forEach((topLevelError) => {
            if (
              !err.inner.some(
                (innerError) => innerError.message === topLevelError
              )
            ) {
              errorMessages.unshift(topLevelError);
            }
          });
        }
        setCollectedValidationErrors(errorMessages);
        toast.error(
          `Please fix ${errorMessages.length} validation error${
            errorMessages.length > 1 ? 's' : ''
          }.`
        );
      } else {
        console.error('An unexpected error occurred during validation:', err);
        toast.error('An unexpected error occurred during validation.');
      }
    }
  };

  // ... (Other functions like hasEnabledSubmissionRequirements, getSummary... remain the same) ...
  const hasEnabledSubmissionRequirements =
    submissionRequirements.receiptsRequired ||
    submissionRequirements.memoRequired ||
    submissionRequirements.screenshotsRequired ||
    submissionRequirements.requireNetSuiteCustomerJob ||
    (isMileagePolicy &&
      (mileageRequirements.odometerScreenshots ||
        mileageRequirements.gpsTracking ||
        mileageRequirements.businessPurpose));
  const getSummaryFieldLabel = (fieldId: string) =>
    fieldConfigProps.getFieldDefinition(fieldId)?.label || fieldId;
  const getSummaryOperatorLabel = (fieldId: string, operatorId: string) =>
    fieldConfigProps
      .getOperatorsForField(fieldId)
      .find((op) => op.value === operatorId)?.label || operatorId;
  const getSummaryValueLabel = (fieldId: string, valueId: string) => {
    const fd = fieldConfigProps.getFieldDefinition(fieldId);
    return fd?.valueOptions?.find((v) => v.value === valueId)?.label || valueId;
  };
  const getSummaryApproverDisplayData = (
    approver: Approver
  ): { label: string; avatar?: string } => {
    let fo;
    switch (approver.approverType) {
      case 'user':
        if (approver.selectedUserIds && approver.selectedUserIds.length > 0) {
          fo = MOCKED_USER_OPTIONS.find(
            (u) => u.value === approver.selectedUserIds![0]
          );
          const n = approver.selectedUserIds.map(
            (id) => MOCKED_USER_OPTIONS.find((u) => u.value === id)?.label || id
          );
          return {
            label:
              n.length > 1 ? `${n[0]} +${n.length - 1} more` : n[0] || 'N/A',
            avatar: fo?.avatar,
          };
        }
        return { label: 'N/A' };
      case 'role':
        fo = MOCKED_ROLE_OPTIONS.find(
          (r) => r.value === approver.approverValue
        );
        return {
          label: fo?.label || approver.approverValue || 'N/A',
          avatar: fo?.avatar,
        };
      case 'department':
        fo = MOCKED_DEPARTMENT_OPTIONS.find(
          (d) => d.value === approver.approverValue
        );
        return {
          label: fo?.label || approver.approverValue || 'N/A',
          avatar: fo?.avatar,
        };
      case 'manager_type':
        fo = MOCKED_MANAGER_TYPE_OPTIONS.find(
          (m) => m.value === approver.approverValue
        );
        return {
          label: fo?.label || approver.approverValue || 'N/A',
          avatar: fo?.avatar,
        };
      default:
        return { label: 'Unknown' };
    }
  };

  return (
    <div className="space-y-6">
      {/* ... Header ... */}
      <div className="flex items-center">
        {' '}
        <Button variant="ghost" size="sm" className="mr-4" onClick={onCancel}>
          {' '}
          <ArrowLeft className="h-4 w-4 mr-1" /> Back{' '}
        </Button>{' '}
        <h1 className="text-xl font-semibold">Create Approval Rule</h1>{' '}
      </div>

      {/* Top Error Box */}
      {collectedValidationErrors.length > 0 && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          {' '}
          <span className="font-medium">
            Please correct the following errors:
          </span>{' '}
          <ul className="mt-1.5 list-disc list-inside">
            {' '}
            {collectedValidationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}{' '}
          </ul>{' '}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* ... Form sections (Rule Details, ConditionsStep, ActionsStep, RequirementsStep) ... */}
          {/* Rule Details */}{' '}
          <div className="space-y-4 border border-muted rounded-md p-4">
            {' '}
            <h3 className="text-sm font-medium">Rule Details</h3>{' '}
            <div>
              {' '}
              <Label htmlFor="name" className="block text-sm font-medium mb-1">
                Rule Name
              </Label>{' '}
              <Input
                id="name"
                placeholder="e.g., Expenses over $500"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                disabled={createPolicyMutation.isPending}
              />{' '}
            </div>{' '}
            <div>
              {' '}
              <Label
                htmlFor="transactionType"
                className="block text-sm font-medium mb-1"
              >
                For Transaction Type
              </Label>{' '}
              <Select
                value={transactionType}
                onValueChange={setTransactionType}
                disabled={createPolicyMutation.isPending}
              >
                {' '}
                <SelectTrigger id="transactionType">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>{' '}
                <SelectContent>
                  {transactionTypeOptions.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>{' '}
              </Select>{' '}
            </div>{' '}
          </div>
          {/* Conditions */}{' '}
          <div className="space-y-4">
            {' '}
            <h3 className="text-sm font-medium">
              Policy Triggers (IF...)
            </h3>{' '}
            <p className="text-xs text-muted-foreground">
              Define the conditions that will trigger this rule.
            </p>{' '}
            <div className="p-0">
              {' '}
              <ConditionsStep
                transactionType={transactionType}
                conditionGroups={conditionGroups}
                setConditionGroups={setConditionGroups}
                simplified={true}
                {...fieldConfigProps}
              />{' '}
            </div>{' '}
          </div>
          {/* Actions */}{' '}
          <div className="space-y-4">
            {' '}
            <h3 className="text-sm font-medium">
              Actions to Take (THEN...)
            </h3>{' '}
            <p className="text-xs text-muted-foreground">
              Define approval steps or notifications.
            </p>{' '}
            <div className="p-0">
              {' '}
              <ActionsStep
                approverGroups={approverGroups}
                setApproverGroups={setApproverGroups}
                simplified={true}
                roleOptions={MOCKED_ROLE_OPTIONS}
                departmentOptions={MOCKED_DEPARTMENT_OPTIONS}
                managerTypeOptions={MOCKED_MANAGER_TYPE_OPTIONS}
              />{' '}
            </div>{' '}
          </div>
          {/* Requirements */}{' '}
          {transactionType === 'expenses' && (
            <div className="space-y-4">
              {' '}
              <h3 className="text-sm font-medium">
                Submission Requirements
              </h3>{' '}
              <p className="text-xs text-muted-foreground">
                Specify what documentation is needed.
              </p>{' '}
              <div className="p-0">
                {' '}
                <RequirementsStep
                  submissionRequirements={submissionRequirements}
                  setSubmissionRequirements={setSubmissionRequirements}
                  mileageRequirements={mileageRequirements}
                  setMileageRequirements={setMileageRequirements}
                  showMileageRequirements={isMileagePolicy}
                  simplified={true}
                />{' '}
              </div>{' '}
            </div>
          )}
        </div>

        {/* Flow Summary (Remains the same structure) */}
        <div className="bg-muted/30 p-6 rounded-md">
          {/* ... Flow summary JSX ... */}
          <h3 className="text-sm font-medium mb-4">Policy Flow Summary</h3>{' '}
          <div className="space-y-1 relative">
            {' '}
            {(conditionGroups[0]?.conditions || [])
              .filter((c) => c.field && c.operator)
              .map((cond, cIdx, arr) => {
                const isLC = cIdx === arr.length - 1;
                const isFR =
                  transactionType === 'expenses' &&
                  hasEnabledSubmissionRequirements;
                const isFA = (approverGroups[0]?.approvers || []).some(
                  (a) =>
                    a.approverType &&
                    ((a.approverType === 'user' &&
                      a.selectedUserIds &&
                      a.selectedUserIds.length > 0) ||
                      (a.approverType !== 'user' && a.approverValue))
                );
                const sL = !isLC || isFR || isFA;
                const vS = Array.isArray(cond.value)
                  ? cond.value
                      .map((v) => getSummaryValueLabel(cond.field, v))
                      .join(', ')
                  : getSummaryValueLabel(cond.field, cond.value.toString());
                return (
                  <div
                    key={cond.id}
                    className="flex items-start mb-3 pl-8 relative"
                  >
                    {' '}
                    {sL && (
                      <div className="absolute left-3 top-1.5 w-0.5 h-[calc(100%+0.75rem)] bg-muted-foreground/20 z-0"></div>
                    )}{' '}
                    <div className="absolute left-[7px] top-[9px] w-3 h-3 rounded-full border-2 border-muted-foreground/40 bg-background z-10"></div>{' '}
                    <div className="text-sm">
                      {' '}
                      <span className="font-semibold">
                        {cIdx === 0 ? 'IF' : 'AND'}
                      </span>{' '}
                      <span className="ml-1 px-1.5 py-0.5 bg-muted/60 rounded-sm mx-1">
                        {getSummaryFieldLabel(cond.field)}
                      </span>{' '}
                      {getSummaryOperatorLabel(cond.field, cond.operator)}{' '}
                      <span className="ml-1 px-1.5 py-0.5 bg-muted/60 rounded-sm">
                        {vS || '...'}
                      </span>{' '}
                    </div>{' '}
                  </div>
                );
              })}{' '}
            {transactionType === 'expenses' &&
              hasEnabledSubmissionRequirements && (
                <div className="flex items-start mb-3 pl-8 relative">
                  {' '}
                  {(approverGroups[0]?.approvers || []).some(
                    (a) =>
                      a.approverType &&
                      ((a.approverType === 'user' &&
                        a.selectedUserIds &&
                        a.selectedUserIds.length > 0) ||
                        (a.approverType !== 'user' && a.approverValue))
                  ) && (
                    <div className="absolute left-3 top-1.5 w-0.5 h-[calc(100%+0.75rem)] bg-muted-foreground/20 z-0"></div>
                  )}{' '}
                  <div className="absolute left-[7px] top-[9px] w-3 h-3 rounded-full border-2 border-muted-foreground/40 bg-background z-10"></div>{' '}
                  <div className="text-sm">
                    {' '}
                    <span className="font-semibold">THEN REQUIRE</span>{' '}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {' '}
                      {submissionRequirements.memoRequired && (
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-800 border-amber-300"
                        >
                          Memo
                        </Badge>
                      )}{' '}
                      {submissionRequirements.receiptsRequired && (
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-800 border-amber-300"
                        >
                          Receipt
                        </Badge>
                      )}{' '}
                      {submissionRequirements.screenshotsRequired && (
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-800 border-amber-300"
                        >
                          Screenshots
                        </Badge>
                      )}{' '}
                      {submissionRequirements.requireNetSuiteCustomerJob && (
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-800 border-amber-300"
                        >
                          NetSuite C/J
                        </Badge>
                      )}{' '}
                      {isMileagePolicy &&
                        mileageRequirements.odometerScreenshots && (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 border-blue-300"
                          >
                            Odometer
                          </Badge>
                        )}{' '}
                      {isMileagePolicy && mileageRequirements.gpsTracking && (
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 border-blue-300"
                        >
                          GPS Track
                        </Badge>
                      )}{' '}
                      {isMileagePolicy &&
                        mileageRequirements.businessPurpose && (
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 border-blue-300"
                          >
                            Biz Purpose
                          </Badge>
                        )}{' '}
                    </div>{' '}
                  </div>{' '}
                </div>
              )}{' '}
            {(approverGroups[0]?.approvers || [])
              .filter(
                (a) =>
                  a.approverType &&
                  ((a.approverType === 'user' &&
                    a.selectedUserIds &&
                    a.selectedUserIds.length > 0) ||
                    (a.approverType !== 'user' && a.approverValue))
              )
              .map((action, actIdx, arr) => {
                const isLVA = actIdx === arr.length - 1;
                const appDD = getSummaryApproverDisplayData(action);
                return (
                  <div
                    key={action.id}
                    className="flex items-start mb-3 pl-8 relative"
                  >
                    {' '}
                    {!isLVA && (
                      <div className="absolute left-3 top-1.5 w-0.5 h-[calc(100%+0.75rem)] bg-muted-foreground/20 z-0"></div>
                    )}{' '}
                    <div className="absolute left-[7px] top-[9px] w-3 h-3 rounded-full border-2 border-muted-foreground/40 bg-background z-10"></div>{' '}
                    <div className="text-sm">
                      {' '}
                      <span className="font-semibold">
                        {' '}
                        {(conditionGroups[0]?.conditions || []).some(
                          (c) => c.field
                        ) ||
                        (transactionType === 'expenses' &&
                          hasEnabledSubmissionRequirements) ||
                        actIdx > 0
                          ? actIdx > 0
                            ? 'AND THEN'
                            : 'THEN'
                          : 'IF'}{' '}
                      </span>{' '}
                      {action.actionType === 'approval' ? (
                        <CheckCircle2 className="inline h-4 w-4 mx-1 text-green-600" />
                      ) : (
                        <Bell className="inline h-4 w-4 mx-1 text-amber-600" />
                      )}{' '}
                      <span>
                        {action.actionType === 'approval'
                          ? 'Request Approval'
                          : 'Send Notification'}
                      </span>{' '}
                      {action.actionType === 'approval' &&
                        action.approverType === 'user' &&
                        action.approvalMode && (
                          <span className="text-xs text-muted-foreground ml-1">
                            (
                            {action.approvalMode === 'all'
                              ? 'All must approve'
                              : 'Any can approve'}
                            )
                          </span>
                        )}{' '}
                      <span className="ml-1">from/to:</span>{' '}
                      <span className="ml-1 px-1.5 py-0.5 bg-muted/60 rounded-md text-sm flex items-center gap-1.5">
                        {' '}
                        <SummaryAvatar initial={appDD.avatar} /> {appDD.label}{' '}
                      </span>{' '}
                    </div>{' '}
                  </div>
                );
              })}{' '}
            {(conditionGroups[0]?.conditions || []).some(
              (c) =>
                c.field &&
                c.operator &&
                ((typeof c.value === 'string' && c.value.trim()) ||
                  (Array.isArray(c.value) && c.value.length > 0))
            ) &&
              !(
                transactionType === 'expenses' &&
                hasEnabledSubmissionRequirements
              ) &&
              (approverGroups[0]?.approvers || []).every(
                (a) =>
                  !a.approverType ||
                  (a.approverType === 'user' &&
                    (!a.selectedUserIds || a.selectedUserIds.length === 0)) ||
                  (a.approverType !== 'user' && !a.approverValue)
              ) && (
                <div className="flex items-start mb-3 pl-8 relative">
                  {' '}
                  <div className="absolute left-[7px] top-[9px] w-3 h-3 rounded-full border-2 border-muted-foreground/40 bg-background z-10"></div>{' '}
                  <div className="text-sm italic text-muted-foreground">
                    {' '}
                    <span className="font-semibold">THEN</span> (No requirements
                    or actions defined yet){' '}
                  </div>{' '}
                </div>
              )}{' '}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={createPolicyMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={createPolicyMutation.isPending}
        >
          {createPolicyMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Create Rule
        </Button>
      </div>
    </div>
  );
}
