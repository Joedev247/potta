export interface MileageRequirements {
    requireBeforeAfterScreenshots: boolean;
    requireGpsCoordinates: boolean;
    businessPurpose: boolean;
  }
  
  export interface Condition {
    id: string;
    criterionType: string;
    comparisonOperator: string;
    value: number;
  }
  
  export interface Action {
    id: string;
    type: string;
    parameters: {
      originalActionType: string;
      approverType: string;
      selectedUserIds: string[];
      approvalMode: string;
    };
  }
  
  export interface Rule {
    id: string;
    conditionOperator: string;
    conditions: Condition[];
    actions: Action[];
  }
  
  export interface Policy {
    id: string;
    name: string;
    documentUrl: string | null;
    requireReceipt: boolean;
    requireMemo: boolean;
    requireScreenshots: boolean;
    requireNetSuiteCustomerJob: boolean;
    additionalRequirements: string | null;
    transactionType: string;
    type: string;
    mileageRequirements: MileageRequirements | null;
    branchId: string;
    rules: Rule[];
  }
  
  export interface ApiResponse {
    data: Policy[];
    meta: {
      itemsPerPage: number;
      totalItems: number;
      currentPage: number;
      totalPages: number;
    };
  }

  export type IFilter = {
    limit: number;
    page: number;
    sortOrder: string,
      sortBy: string
  };

  export type IOption = {
    value: string;
    label: string;
  };