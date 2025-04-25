export type BenefitType = 'FINANCIAL' | 'SERVICE' | 'REDEEMABLE';
export type CycleType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY' | 'ONE_TIME' | 'NONE';

export interface BenefitPayload {
  name: string;
  description?: string;
  type: BenefitType;
  value?: number;
  rate?: number;
  cycle: CycleType;
  is_taxable: boolean;
  tax_cap?: number;
  expires_at?: string;
  role_based?: boolean;
  eligible_roles?: string[];
  is_default?: boolean;
  salary_cap?: number;
  max_amount?: number;
  provider?: string;
  category?: string;
  percentage_base?: string;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  type?: BenefitType;
  is_taxable?: boolean;
  is_default?: boolean;
  role_based?: boolean;
}