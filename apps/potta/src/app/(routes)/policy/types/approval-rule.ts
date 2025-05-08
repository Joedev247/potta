// types/approval-rule.ts
export enum FieldType {
  AMOUNT = 'amount',
  DEPARTMENT = 'department',
  LOCATION_BRANCH = 'location branch',
  MATCHED_TO_PURCHASE_ORDER = 'matched to purchase order',
  PAYMENT_TYPE = 'payment type',
  EXPENSE_CATEGORY = 'expense category',
  CUSTOMER = 'customer',
  INVENTORY_ITEM = 'inventory item',
  VENDOR = 'vendor',
}

export enum ApproverActionType {
  APPROVAL = 'approval',
  NOTIFICATION = 'notification',
}

export enum ApprovalMode {
  ALL = 'all', 
  ANY = 'any',
}

export interface ConditionDetail {
  id: string;
  field: FieldType | string;
  operator: string;
  value: string | string[] | number | boolean;
}

export interface ConditionAction {
  id: string;
  type: ApproverActionType;
  mode: ApprovalMode;
  userIds: string[];
}

export interface Requirements {
  requireReceipt: boolean;
  requireMemo: boolean;
  requireScreenshots: boolean;
  requireNetSuiteCustomerJob: boolean;
  requireGpsCoordinates: boolean;
  businessPurpose: boolean;
  requireBeforeAfterScreenshots: boolean;
  [key: string]: boolean; // Add index signature to allow string indexing
}

export interface ExtendedCondition {
  id: string;
  details: ConditionDetail[];
  actions: ConditionAction[];
  requirements?: Requirements; // Optional requirements property
}

export interface ExtendedApprovalRule {
  name: string;
  conditions: ExtendedCondition[];
  approvers: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SelectOption {
  id: string;
  name: string;
}