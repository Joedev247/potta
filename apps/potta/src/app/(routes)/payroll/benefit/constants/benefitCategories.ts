export interface BenefitCategoryConfig {
  rateType: 'Percentage' | 'Flat Rate';
  cycle: string;
  isTaxable: boolean;
  minPercentage?: number;
  maxPercentage?: number;
  minFlatRate?: number;
  maxFlatRate?: number;
  helpText: string;
}

export const BENEFIT_CATEGORIES: Record<string, BenefitCategoryConfig> = {
  'Seniority Bonus': {
    rateType: 'Percentage',
    cycle: 'MONTHLY',
    isTaxable: true,
    minPercentage: 1,
    maxPercentage: 10,
    helpText: '1% - 10% of base salary. Increases with years of service',
  },
  'Housing Allowance': {
    rateType: 'Flat Rate',
    cycle: 'MONTHLY',
    isTaxable: true,
    minFlatRate: 50000,
    maxFlatRate: 200000,
    helpText: 'XAF 50,000 - 200,000 per month. Varies by location and position',
  },
  'Meal Allowance': {
    rateType: 'Flat Rate',
    cycle: 'DAILY',
    isTaxable: false,
    minFlatRate: 1500,
    maxFlatRate: 5000,
    helpText: 'XAF 1,500 - 5,000 per day. Tax-free up to legal limit',
  },
  'Transport Allowance': {
    rateType: 'Flat Rate',
    cycle: 'MONTHLY',
    isTaxable: false,
    minFlatRate: 20000,
    maxFlatRate: 50000,
    helpText: 'XAF 20,000 - 50,000 per month. Not taxable',
  },
  'Family Allowance': {
    rateType: 'Flat Rate',
    cycle: 'MONTHLY',
    isTaxable: false,
    minFlatRate: 2800,
    maxFlatRate: 2800,
    helpText: 'XAF 2,800 per child per month (managed by CNPS)',
  },
  'Risk Allowance': {
    rateType: 'Percentage',
    cycle: 'MONTHLY',
    isTaxable: true,
    minPercentage: 5,
    maxPercentage: 30,
    helpText:
      '5% - 30% of base salary. Applicable to healthcare workers, security staff, mining, construction, etc.',
  },
  'Overtime Pay': {
    rateType: 'Percentage',
    cycle: 'DAILY',
    isTaxable: true,
    minPercentage: 25,
    maxPercentage: 100,
    helpText:
      'Weekdays: +25%, Saturdays: +50%, Sundays & Public Holidays: +100% per hour',
  },
  'Performance Bonus': {
    rateType: 'Percentage',
    cycle: 'MONTHLY',
    isTaxable: true,
    minPercentage: 5,
    maxPercentage: 50,
    helpText:
      '5% - 50% of base salary. Based on individual or team performance',
  },
  'Sales Commission': {
    rateType: 'Percentage',
    cycle: 'MONTHLY',
    isTaxable: true,
    minPercentage: 1,
    maxPercentage: 20,
    helpText: 'Usually a percentage of sales revenue',
  },
  'Hardship Allowance': {
    rateType: 'Percentage',
    cycle: 'MONTHLY',
    isTaxable: true,
    minPercentage: 5,
    maxPercentage: 25,
    helpText:
      '5% - 25% of base salary. Paid for working in remote or harsh environments',
  },
  '13th Month Salary': {
    rateType: 'Percentage',
    cycle: 'ANNUALLY',
    isTaxable: true,
    minPercentage: 100,
    maxPercentage: 100,
    helpText:
      "Equal to one month's base salary. Usually paid at the end of the year",
  },
};

export const BENEFIT_TYPE_OPTIONS = [
  { label: 'Financial', value: 'Financial' },
  { label: 'Service', value: 'Service' },
  { label: 'Redeemable', value: 'Redeemable' },
];

export const CATEGORY_OPTIONS = Object.keys(BENEFIT_CATEGORIES).map(
  (category) => ({
    label: category,
    value: category,
  })
);

export const CYCLE_OPTIONS = [
  { label: 'Daily', value: 'DAILY' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Quarterly', value: 'QUARTERLY' },
  { label: 'Annually', value: 'ANNUALLY' },
  { label: 'One Time', value: 'ONE_TIME' },
  { label: 'None', value: 'NONE' },
];

export const SALARY_CAP_OPTIONS = [
  { label: '100,000', value: '100000' },
  { label: '200,000', value: '200000' },
  { label: '300,000', value: '300000' },
  { label: '500,000', value: '500000' },
  { label: 'Custom', value: 'Custom' },
];

export const DEFAULT_LIMITS = {
  minPercentage: 0,
  maxPercentage: 100,
  minFlatRate: 0,
  maxFlatRate: 1000000,
};
