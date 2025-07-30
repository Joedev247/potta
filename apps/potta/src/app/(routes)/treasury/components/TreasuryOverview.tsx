'use client';
import React from 'react';
import OverviewMetrics from './TreasuryOverviewMetrics';
import OverviewCharts from './TreasuryOverviewCharts';
import OverviewQuickActions from './TreasuryOverviewQuickActions';
import OverviewSkeleton from './TreasuryOverviewSkeleton';
import { useBills } from '../../account_payables/bills/new/hooks/useBills';

interface TreasuryOverviewProps {
  type: 'ap' | 'ar'; // 'ap' for Account Payables, 'ar' for Account Receivables
}

const TreasuryOverview: React.FC<TreasuryOverviewProps> = ({ type }) => {
  const { data: billsData, isLoading } = useBills({});
  const bills = billsData?.data || [];

  if (isLoading) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="p-3">
      <OverviewMetrics bills={bills} type={type} />
      <OverviewCharts bills={bills} type={type} />
      <OverviewQuickActions bills={bills} type={type} />
    </div>
  );
};

export default TreasuryOverview;
