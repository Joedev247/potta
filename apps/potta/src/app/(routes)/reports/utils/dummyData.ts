import { Report, ReportCategory, ReportDataType } from './types';
import {
  FileText,
  CreditCard,
  Users,
  DollarSign,
  Briefcase,
  BarChart4,
  UserCheck,
  TrendingUp,
  User,
} from 'lucide-react';

export const reportCategories = [
  { id: 'all', label: 'All', icon: FileText },
  {
    id: 'billings',
    label: 'Billings and Collections',
    icon: CreditCard,
    submenus: [
      {
        id: 'ar_turnover',
        label: 'AR Turnover Ratio',
        chartKey: 'ar_turnover',
      },
      { id: 'ar_aging', label: 'AR Aging', chartKey: 'ar_aging' },
      {
        id: 'avg_collection',
        label: 'Average Collection Period',
        chartKey: 'avg_collection',
      },
      { id: 'bill_rate', label: 'Bill Rate', chartKey: 'bill_rate' },
      {
        id: 'billable_util',
        label: 'Billable Utilization Rate',
        chartKey: 'billable_util',
      },
      {
        id: 'collections_effectiveness',
        label: 'Collections Effectiveness Index',
        chartKey: 'collections_effectiveness',
      },
      { id: 'collections', label: 'Collections', chartKey: 'collections' },
      { id: 'dso', label: 'Days Sales Outstanding', chartKey: 'dso' },
    ],
  },
  {
    id: 'bookings',
    label: 'Bookings and Customers',
    icon: Users,
    submenus: [
      { id: 'acl', label: 'Average Contract Length (ACL)', chartKey: 'acl' },
      { id: 'asp', label: 'Average Sale Price (ASP)', chartKey: 'asp' },
      {
        id: 'cac_payback',
        label: 'CAC Payback Period',
        chartKey: 'cac_payback',
      },
      { id: 'churn_rate', label: 'Churn Rate', chartKey: 'churn_rate' },
      {
        id: 'cost_to_serve',
        label: 'Cost to Serve',
        chartKey: 'cost_to_serve',
      },
      {
        id: 'customer_count',
        label: 'Customer Count',
        chartKey: 'customer_count',
      },
      {
        id: 'customer_retention_cost',
        label: 'Customer Retention Cost',
        chartKey: 'customer_retention_cost',
      },
      {
        id: 'negative_churn',
        label: 'Negative Churn',
        chartKey: 'negative_churn',
      },
      { id: 'ltv_cac', label: 'LTV/CAC Ratio', chartKey: 'ltv_cac' },
      {
        id: 'logo_retention',
        label: 'Logo Retention',
        chartKey: 'logo_retention',
      },
      { id: 'renewal_rate', label: 'Renewal Rate', chartKey: 'renewal_rate' },
      { id: 'bookings', label: 'Bookings', chartKey: 'bookings' },
      {
        id: 'customer_attrition',
        label: 'Customer Attrition',
        chartKey: 'customer_attrition',
      },
    ],
  },
  {
    id: 'cashflow',
    label: 'Cashflow and Expenses',
    icon: DollarSign,
    submenus: [
      { id: 'ap_aging', label: 'AP Aging', chartKey: 'ap_aging' },
      {
        id: 'ap_turnover',
        label: 'AP Turnover Ratio',
        chartKey: 'ap_turnover',
      },
      {
        id: 'burn_multiple',
        label: 'Burn Multiple',
        chartKey: 'burn_multiple',
      },
      {
        id: 'capital_efficiency',
        label: 'Capital Efficiency',
        chartKey: 'capital_efficiency',
      },
      {
        id: 'cfoa',
        label: 'Cash Flow from Operating Activities',
        chartKey: 'cfoa',
      },
      { id: 'dpo', label: 'Days Payable Outstanding', chartKey: 'dpo' },
      { id: 'gross_margin', label: 'Gross Margin', chartKey: 'gross_margin' },
      {
        id: 'expense_dashboard',
        label: 'Expense Dashboard',
        chartKey: 'expense_dashboard',
      },
      { id: 'net_burn', label: 'Net Burn', chartKey: 'net_burn' },
      {
        id: 'rnd_payback',
        label: 'R&D Payback Ratio',
        chartKey: 'rnd_payback',
      },
      { id: 'ebitda', label: 'EBITDA', chartKey: 'ebitda' },
    ],
  },
  {
    id: 'headcount',
    label: 'Headcount',
    icon: UserCheck,
    submenus: [
      { id: 'headcount', label: 'Headcount', chartKey: 'headcount' },
      {
        id: 'accrued_payroll',
        label: 'Accrued Payroll Cost',
        chartKey: 'accrued_payroll',
      },
      {
        id: 'fully_burdened_labor',
        label: 'Fully Burdened Labor Rate',
        chartKey: 'fully_burdened_labor',
      },
      {
        id: 'hr_to_employee',
        label: 'HR to Employee Ratio',
        chartKey: 'hr_to_employee',
      },
      {
        id: 'headcount_metrics',
        label: 'Headcount Metrics',
        chartKey: 'headcount_metrics',
      },
      {
        id: 'cost_of_labor',
        label: 'Cost of Labor',
        chartKey: 'cost_of_labor',
      },
      {
        id: 'employee_turnover',
        label: 'Employee Turnover Metrics',
        chartKey: 'employee_turnover',
      },
      {
        id: 'workforce_planning',
        label: 'Workforce Planning Metrics',
        chartKey: 'workforce_planning',
      },
    ],
  },
  {
    id: 'revenue',
    label: 'Revenue, ARR and MRR',
    icon: TrendingUp,
    submenus: [
      {
        id: 'accrued_revenue',
        label: 'Accrued Revenue',
        chartKey: 'accrued_revenue',
      },
      { id: 'arr', label: 'Annual Recurring Revenue (ARR)', chartKey: 'arr' },
      { id: 'mrr', label: 'Monthly Recurring Revenue (MRR)', chartKey: 'mrr' },
      { id: 'gross_sales', label: 'Gross Sales', chartKey: 'gross_sales' },
      {
        id: 'deferred_revenue',
        label: 'Deferred Revenue',
        chartKey: 'deferred_revenue',
      },
      {
        id: 'pipeline_coverage',
        label: 'Pipeline Coverage Ratio',
        chartKey: 'pipeline_coverage',
      },
      {
        id: 'projected_revenue',
        label: 'Projected Revenue',
        chartKey: 'projected_revenue',
      },
      {
        id: 'revenue_backlog',
        label: 'Revenue Backlog',
        chartKey: 'revenue_backlog',
      },
      {
        id: 'revenue_per_employee',
        label: 'Revenue Per Employee',
        chartKey: 'revenue_per_employee',
      },
      { id: 'rule_of_40', label: 'Rule of 40', chartKey: 'rule_of_40' },
      { id: 'tcv', label: 'Total Contract Value (TCV)', chartKey: 'tcv' },
      {
        id: 'rpo',
        label: 'Remaining Performance Obligation (RPO)',
        chartKey: 'rpo',
      },
      {
        id: 'unearned_revenue',
        label: 'Unearned Revenue',
        chartKey: 'unearned_revenue',
      },
      {
        id: 'weighted_pipeline',
        label: 'Weighted Pipeline / Revenue',
        chartKey: 'weighted_pipeline',
      },
    ],
  },
  {
    id: 'sales',
    label: 'Sales Performance',
    icon: BarChart4,
    submenus: [
      {
        id: 'avg_deal_size',
        label: 'Average Deal Size',
        chartKey: 'avg_deal_size',
      },
      {
        id: 'avg_sales_cycle',
        label: 'Average Sales Cycle',
        chartKey: 'avg_sales_cycle',
      },
      {
        id: 'closed_won_lost',
        label: 'Closed Won/Lost Summary',
        chartKey: 'closed_won_lost',
      },
      { id: 'closing_rate', label: 'Closing Rate', chartKey: 'closing_rate' },
      {
        id: 'cost_per_lead',
        label: 'Cost Per Lead',
        chartKey: 'cost_per_lead',
      },
      {
        id: 'cost_per_opportunity',
        label: 'Cost Per Opportunity',
        chartKey: 'cost_per_opportunity',
      },
      {
        id: 'pipeline_generation',
        label: 'Pipeline Generation',
        chartKey: 'pipeline_generation',
      },
      { id: 'roas', label: 'Return on Ad Spend (ROAS)', chartKey: 'roas' },
      {
        id: 'sales_conversion_rate',
        label: 'Sales Conversion Rate',
        chartKey: 'sales_conversion_rate',
      },
      {
        id: 'sales_funnel',
        label: 'Sales Funnel Metrics',
        chartKey: 'sales_funnel',
      },
      {
        id: 'quota_attainment',
        label: 'Quota Attainment',
        chartKey: 'quota_attainment',
      },
      {
        id: 'sales_rep_ramp',
        label: 'Sales Rep Ramp',
        chartKey: 'sales_rep_ramp',
      },
      {
        id: 'sales_velocity',
        label: 'Sales Velocity',
        chartKey: 'sales_velocity',
      },
      {
        id: 'sales_funnel_conversion',
        label: 'Sales Funnel Conversion Rate',
        chartKey: 'sales_funnel_conversion',
      },
    ],
  },
];

export const reportData: ReportDataType = {
  collection: [
    {
      id: 'collection1',
      title: 'Collection Summary',
      description: 'Overview of all collections',
      category: 'collection',
    },
    {
      id: 'collection2',
      title: 'Outstanding Collections',
      description: 'List of pending collections',
      category: 'collection',
    },
  ],
  customer: [
    {
      id: 'customer1',
      title: 'Customer Activity',
      description: 'Customer transaction history',
      category: 'customer',
    },
    {
      id: 'customer2',
      title: 'Customer Insights',
      description: 'Analysis of customer behavior',
      category: 'customer',
    },
  ],
  disbursement: [
    {
      id: 'disbursement1',
      title: 'Payment Summary',
      description: 'Overview of all disbursements and payments',
      category: 'disbursement',
      dataType: 'payment',
    },
    {
      id: 'disbursement2',
      title: 'Pending Disbursements',
      description: 'List of pending disbursements',
      category: 'disbursement',
    },
  ],
  expense: [
    {
      id: 'expense1',
      title: 'Budget Utilization',
      description: 'Analysis of budget allocation and spending',
      category: 'expense',
      dataType: 'budget',
    },
    {
      id: 'expense2',
      title: 'Expense Categories',
      description: 'Breakdown of expenses by category',
      category: 'expense',
    },
  ],
  financial: [
    {
      id: 'financial1',
      title: 'Balance Sheet',
      description: 'Current financial position',
      category: 'financial',
    },
    {
      id: 'financial2',
      title: 'Profit & Loss',
      description: 'Revenue and expense summary',
      category: 'financial',
    },
    {
      id: 'financial3',
      title: 'Cash Flow Statement',
      description: 'Cash inflow and outflow analysis',
      category: 'financial',
    },
  ],
  inventory: [
    {
      id: 'inventory1',
      title: 'Inventory Status',
      description: 'Current inventory levels',
      category: 'inventory',
    },
    {
      id: 'inventory2',
      title: 'Stock Movement',
      description: 'Inventory movement analysis',
      category: 'inventory',
    },
  ],
  tax: [
    {
      id: 'tax1',
      title: 'Tax Summary',
      description: 'Overview of tax obligations',
      category: 'tax',
    },
    {
      id: 'tax2',
      title: 'VAT Report',
      description: 'Value-added tax analysis',
      category: 'tax',
    },
  ],
  vendor: [
    {
      id: 'vendor1',
      title: 'Vendor Performance',
      description: 'Analysis of vendor reliability',
      category: 'vendor',
    },
    {
      id: 'vendor2',
      title: 'Vendor Payments',
      description: 'Summary of payments to vendors',
      category: 'vendor',
    },
  ],
};

export const frequentReports: Report[] = [
  {
    id: 'financial1',
    title: 'Balance Sheet',
    description: 'Current financial position',
    category: 'financial',
  },
  {
    id: 'disbursement1',
    title: 'Payment Summary',
    description: 'Overview of all disbursements and payments',
    category: 'disbursement',
    dataType: 'payment',
  },
  {
    id: 'expense1',
    title: 'Budget Utilization',
    description: 'Analysis of budget allocation and spending',
    category: 'expense',
    dataType: 'budget',
  },
];
