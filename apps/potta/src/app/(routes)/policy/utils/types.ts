// components/spend-policy/utils/types.ts

// --- Frontend State Types (Keep these as they are used by the UI components) ---
export interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string | string[]; // UI state often uses strings for inputs
}
export interface ConditionGroup { id: string; conditions: Condition[]; }
export type ApproverActionType = 'approval' | 'notification';
export type ApproverEntityType = 'user' | 'role' | 'department' | 'manager_type';
export type ApprovalMode = 'all' | 'any';
export interface Approver {
  id: string;
  actionType: ApproverActionType;
  approverType: ApproverEntityType;
  selectedUserIds?: string[];
  approvalMode?: ApprovalMode;
  approverValue?: string;
}
export interface ApproverGroup { id: string; type: 'AND'; approvers: Approver[]; }
export interface SubmissionRequirements { /* ... same as before ... */ receiptsRequired: boolean; memoRequired: boolean; screenshotsRequired: boolean; requireNetSuiteCustomerJob?: boolean; }
export interface MileageRequirements { /* ... same as before ... */ odometerScreenshots: boolean; gpsTracking: boolean; businessPurpose: boolean; }
export interface ApprovalRuleData { /* ... same as before ... */ name: string; transactionType: string; conditionGroups: ConditionGroup[]; approverGroups: ApproverGroup[]; submissionRequirements?: SubmissionRequirements; mileageRequirements?: MileageRequirements; }
// --- UI Helper & Configuration Types (Keep these) ---
export type FieldType = 'numeric' | 'text' | 'boolean' | 'entity' | 'multi_entity' | 'date';
export interface FieldOption { value: string; label: string; avatar?: string; }
export interface OperatorOption { value: string; label: string; }
export interface FieldConfig { id: string; label: string; type: FieldType; operators: OperatorOption[]; valueOptions?: FieldOption[]; multiSelectValue?: boolean; }
export type FormErrors = { [key: string]: string };


// --- ======================================== ---
// --- API Payload Specific Interfaces (REVISED) ---
// --- ======================================== ---

export interface ConditionPayload {
  // id?: string; // Optional or omitted for creation payload
  field: string;
  operator: string;
  // Allow number, string, or array of strings based on field type and operator
  value: string | string[] | number;
}

export interface ConditionGroupPayload {
  // id?: string; // Optional or omitted
  conditions: ConditionPayload[];
}

export interface ApproverPayload {
  // id?: string; // Optional or omitted
  actionType: ApproverActionType;
  approverType: ApproverEntityType;
  selectedUserIds?: string[]; // Only relevant if approverType is 'user'
  approvalMode?: ApprovalMode;   // Only relevant if approverType is 'user' and actionType is 'approval'
  approverValue?: string;    // Primarily relevant if approverType is NOT 'user'
}

export interface ApproverGroupPayload {
  // id?: string; // Optional or omitted
  type: 'AND';
  approvers: ApproverPayload[];
}

export interface SubmissionRequirementsPayload {
  receiptsRequired: boolean;
  memoRequired: boolean;
  screenshotsRequired: boolean;
  requireNetSuiteCustomerJob?: boolean;
}

export interface MileageRequirementsPayload {
  odometerScreenshots: boolean;
  gpsTracking: boolean;
  businessPurpose: boolean;
}

export interface ApprovalRulePayload {
  name: string;
  transactionType: string;
  conditionGroups: ConditionGroupPayload[];
  approverGroups: ApproverGroupPayload[];
  submissionRequirements?: SubmissionRequirementsPayload;
  mileageRequirements?: MileageRequirementsPayload;
}