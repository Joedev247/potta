// Person payload for creating/updating a person
export interface PersonPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  employment_type: string;
  start_date: string;
  end_date?: string | null;
  hourly_rate?: number;
  salary?: number;
  payScheduleId?: string;
  marital_status: string;
  tax_payer_number: string;
  national_identification_number: string;
  roleId?: string;
  isActive: boolean;
  address: AddressPayload;
}

// Address information
export interface AddressPayload {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}

// Base information for a person
export interface BaseInfoPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  birthday: string;
  employmentType: string;
  employmentDate: string;
  maritalStatus: string;
  nationalId: string;
  roleId?: string;
  taxPayerNumber: string;
  employeeId?: string;
  jobTitle?: string;
}

// Compensation information
export interface CompensationPayload {
  hourlyRate?: number;
  salary?: number;
  paymentFrequency?: string;
  eligibleForTips?: boolean;
  eligibleForOvertime?: boolean;
  paid_time_off?: PaidTimeOffItem[];
}

// Paid Time Off (PTO) information
export interface PaidTimeOffPayload {
  person_id: string;
  type: string;
  cycle_type: string;
  accrual_rate: number;
  total_entitled_days: number;
  start_date: string;
  end_date: string;
  status: string;
}

// PTO item for selection
export interface PaidTimeOffItem {
  id: string;
  type: string;
  cycle_type: string;
  accrual_rate: number;
  total_entitled_days: number;
}

// PTO filter params
export interface PaidTimeOffFilterParams {
  page?: number;
  limit?: number;
  person_id?: string;
  type?: string;
  status?: string;
  sortBy?: string;
}

// Schedule information
export interface SchedulePayload {
  payScheduleId: string;
  effectiveDate: string;
}

// Deposit account information
export interface DepositeAccountPayload {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  depositPercentage: number;
}

// Benefit information
export interface BenefitPayload {
  benefits: Array<{
    benefitId: string;
    enrollmentDate: string;
    coverageLevel: string;
    employeeContribution: number;
    employerContribution: number;
  }>;
}

// Tax information
export interface TaxInfoPayload {
  federalFilingStatus: string;
  federalAllowances: number;
  stateFilingStatus: string;
  stateAllowances: number;
  additionalFederalWithholding: number;
  additionalStateWithholding: number;
}

// Filter parameters for querying persons
export interface FilterParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  employmentType?: string;
  isActive?: boolean;
  startDateFrom?: string;
  startDateTo?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Response structure for paginated results
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API response structure
export interface ApiResponse<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, string][];
  };
  links: {
    current: string;
  };
}

// Bank account payload
export interface BankAccountPayload {
  person_id: string;
  account_holder_name: string;
  bank_name: string;
  account_number: string;
  routing_number: string;
  currency: string;
  account_type: string;
  is_primary: boolean;
  country: string;
  verified: boolean;
}